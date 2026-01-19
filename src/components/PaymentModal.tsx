'use client';

import { useState, useEffect } from 'react';
import { useAccount, useBalance, useReadContract, useSwitchChain } from 'wagmi';
import { formatUnits } from 'viem';
import { useRouter } from 'next/navigation';
import { GasFeeTracker } from './GasFeeTracker';
import { ApproveButton } from './ApproveButton';
import { PurchaseButton } from './PurchaseButton';
import { useTokenApproval, usePayment } from '@/hooks';
import {
  ERC20_ABI,
  NETWORKS,
  TOKENS,
  NetworkType,
  TokenType,
  isPaymentAvailable,
  getTokenAddress,
} from '@/lib/contracts';
import type { Product } from '@/lib/products';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface PaymentModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (txHash: string) => void;
}

// Helper function to convert English error messages to Korean
function translateError(error: string | null): string | null {
  if (!error) return null;

  if (error.includes('User rejected') || error.includes('user rejected') || error.includes('User denied')) {
    return '사용자가 요청을 거부했습니다.';
  }
  if (error.includes('insufficient funds') || error.includes('Insufficient funds')) {
    return '잔액이 부족합니다.';
  }
  if (error.includes('network') || error.includes('Network')) {
    return '네트워크 오류가 발생했습니다. 다시 시도해 주세요.';
  }
  if (error.includes('timeout') || error.includes('Timeout')) {
    return '요청 시간이 초과되었습니다. 다시 시도해 주세요.';
  }
  if (error.includes('gas') || error.includes('Gas')) {
    return '가스비 계산 중 오류가 발생했습니다.';
  }

  return '오류가 발생했습니다. 다시 시도해 주세요.';
}

const NETWORK_OPTIONS: NetworkType[] = ['polygon', 'ethereum', 'arbitrum'];
const TOKEN_OPTIONS: TokenType[] = ['usdc', 'usdt'];

export function PaymentModal({ product, isOpen, onClose, onSuccess }: PaymentModalProps) {
  const router = useRouter();
  const { address, chainId } = useAccount();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();

  // Network and token selection
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('polygon');
  const [selectedToken, setSelectedToken] = useState<TokenType>('usdc');

  // Contact info state
  const [contactType, setContactType] = useState<'email' | 'kakao' | 'telegram'>('email');
  const [contactValue, setContactValue] = useState('');
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  // Get current network config
  const networkConfig = NETWORKS[selectedNetwork];
  const tokenConfig = TOKENS[selectedToken];
  const tokenAddress = getTokenAddress(selectedNetwork, selectedToken) as `0x${string}`;
  const paymentAvailable = isPaymentAvailable(selectedNetwork, selectedToken);
  const isCorrectNetwork = chainId === networkConfig.chainId;

  // Price
  const priceAmount = product.priceUSD.toString();

  // Get native balance
  const { data: nativeBalance } = useBalance({ address });

  // Get selected token balance
  const { data: tokenBalance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: isCorrectNetwork && !!address,
    },
  });

  // Token approval hook
  const approval = useTokenApproval({
    tokenAddress: tokenAddress,
    spenderAddress: (networkConfig.payment || '0x0000000000000000000000000000000000000000') as `0x${string}`,
    amount: priceAmount,
    decimals: tokenConfig.decimals,
  });

  // Payment hook
  const payment = usePayment({
    productId: product.id,
    amount: priceAmount,
    decimals: tokenConfig.decimals,
  });

  // Check if user cancelled
  useEffect(() => {
    const errorMsg = approval.error || payment.error;
    if (errorMsg && (errorMsg.includes('User rejected') || errorMsg.includes('user rejected') || errorMsg.includes('User denied'))) {
      setIsCancelled(true);
    }
  }, [approval.error, payment.error]);

  // Handle success
  useEffect(() => {
    if (payment.status === 'success' && payment.txHash && onSuccess) {
      onSuccess(payment.txHash);
    }
  }, [payment.status, payment.txHash, onSuccess]);

  if (!isOpen) return null;

  const formattedTokenBalance = tokenBalance
    ? parseFloat(formatUnits(tokenBalance as bigint, tokenConfig.decimals)).toFixed(2)
    : '0.00';

  const formattedNativeBalance = nativeBalance
    ? parseFloat(nativeBalance.formatted).toFixed(4)
    : '0.0000';

  const isPurchaseComplete = payment.status === 'success';
  const showContactForm = isPurchaseComplete && !isContactSubmitted;

  const handleContactSubmit = () => {
    console.log('Contact submitted:', { type: contactType, value: contactValue, txHash: payment.txHash });
    setIsContactSubmitted(true);
  };

  const handleGoToProducts = () => {
    onClose();
    router.push('/products');
  };

  const handleSwitchNetwork = () => {
    switchChain({ chainId: networkConfig.chainId });
  };

  // Cancelled state
  if (isCancelled) {
    return (
      <>
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">결제 취소됨</h2>
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>

            <div className="cancelled-content">
              <div className="cancelled-icon">✕</div>
              <h3>상품 결제가 취소되었습니다</h3>
              <p>결제를 다시 진행하시려면 상품 페이지에서 다시 시도해 주세요.</p>
              <button className="go-products-btn" onClick={handleGoToProducts}>
                상품 페이지로 이동
              </button>
            </div>
          </div>
        </div>
        <style jsx>{cancelledStyles}</style>
      </>
    );
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="modal-header">
            <h2 className="modal-title">{isPurchaseComplete ? '구매 완료' : '결제 확인'}</h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-thumb" style={{ '--h': product.hue } as React.CSSProperties} />
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-desc">{product.desc}</p>
            </div>
          </div>

          {/* Contact Form after success */}
          {showContactForm ? (
            <div className="contact-form">
              <h3 className="contact-title">🎉 구매가 완료되었습니다!</h3>
              <p className="contact-desc">프로그램을 받을 연락처를 입력해 주세요.</p>

              <div className="contact-type-tabs">
                <button
                  className={`tab-btn ${contactType === 'email' ? 'active' : ''}`}
                  onClick={() => setContactType('email')}
                >
                  📧 이메일
                </button>
                <button
                  className={`tab-btn ${contactType === 'kakao' ? 'active' : ''}`}
                  onClick={() => setContactType('kakao')}
                >
                  💬 카카오톡
                </button>
                <button
                  className={`tab-btn ${contactType === 'telegram' ? 'active' : ''}`}
                  onClick={() => setContactType('telegram')}
                >
                  ✈️ 텔레그램
                </button>
              </div>

              <input
                type={contactType === 'email' ? 'email' : 'text'}
                className="contact-input"
                placeholder={
                  contactType === 'email'
                    ? 'example@email.com'
                    : contactType === 'kakao'
                      ? '카카오톡 아이디'
                      : '@텔레그램아이디'
                }
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
              />

              <button
                className="submit-contact-btn"
                onClick={handleContactSubmit}
                disabled={!contactValue.trim()}
              >
                연락처 제출하기
              </button>
            </div>
          ) : isContactSubmitted ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>연락처가 성공적으로 제출되었습니다!</h3>
              <p>빠른 시일 내에 프로그램을 전달해 드리겠습니다.</p>
              <button className="go-products-btn" onClick={handleGoToProducts}>
                다른 상품 둘러보기
              </button>
            </div>
          ) : (
            <>
              {/* Network Selection */}
              <div className="selection-section">
                <label className="section-label">결제 네트워크</label>
                <div className="network-tabs">
                  {NETWORK_OPTIONS.map((network) => {
                    const config = NETWORKS[network];
                    const isAvailable = isPaymentAvailable(network, selectedToken);
                    return (
                      <button
                        key={network}
                        className={`network-tab ${selectedNetwork === network ? 'active' : ''} ${!isAvailable ? 'coming-soon' : ''}`}
                        onClick={() => setSelectedNetwork(network)}
                      >
                        <span className="network-name">{config.name}</span>
                        {!isAvailable && <span className="coming-soon-badge">준비중</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Token Selection */}
              <div className="selection-section">
                <label className="section-label">결제 토큰</label>
                <div className="token-tabs">
                  {TOKEN_OPTIONS.map((token) => {
                    const config = TOKENS[token];
                    const isAvailable = isPaymentAvailable(selectedNetwork, token);
                    return (
                      <button
                        key={token}
                        className={`token-tab ${selectedToken === token ? 'active' : ''} ${!isAvailable ? 'coming-soon' : ''}`}
                        onClick={() => setSelectedToken(token)}
                      >
                        <span className="token-symbol">{config.symbol}</span>
                        {!isAvailable && <span className="coming-soon-badge">준비중</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Network Switch Warning */}
              {address && !isCorrectNetwork && (
                <div className="network-warning">
                  <p>현재 연결된 네트워크가 {networkConfig.name}이(가) 아닙니다.</p>
                  <button
                    className="switch-network-btn"
                    onClick={handleSwitchNetwork}
                    disabled={isSwitchingChain}
                  >
                    {isSwitchingChain ? '전환 중...' : `${networkConfig.name}으로 전환`}
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span>상품 가격</span>
                  <span className="price-value">{priceAmount} {tokenConfig.symbol}</span>
                </div>
                <div className="price-row">
                  <span>가스비 (예상)</span>
                  <GasFeeTracker />
                </div>
                <div className="price-row price-row--total">
                  <span>총 결제 금액</span>
                  <span className="price-value price-value--total">{priceAmount} {tokenConfig.symbol} + Gas</span>
                </div>
              </div>

              {/* Wallet Balance */}
              <div className="wallet-balance">
                <div className="balance-item">
                  <span className="balance-label">{tokenConfig.symbol} 잔액</span>
                  <span className="balance-value">
                    {isCorrectNetwork ? `${formattedTokenBalance} ${tokenConfig.symbol}` : '-'}
                  </span>
                </div>
                <div className="balance-item">
                  <span className="balance-label">{networkConfig.nativeCurrency} 잔액</span>
                  <span className="balance-value">
                    {isCorrectNetwork ? `${formattedNativeBalance} ${networkConfig.nativeCurrency}` : '-'}
                  </span>
                </div>
              </div>

              {/* Payment Actions */}
              {address ? (
                paymentAvailable ? (
                  isCorrectNetwork ? (
                    <div className="payment-actions">
                      <ApproveButton
                        status={approval.status}
                        onApprove={approval.approve}
                        tokenSymbol={tokenConfig.symbol}
                      />
                      <PurchaseButton
                        status={payment.status}
                        onPurchase={payment.purchase}
                        isApproved={approval.isApproved}
                      />
                    </div>
                  ) : (
                    <div className="connect-prompt">
                      <p>결제를 진행하려면 네트워크를 전환해 주세요.</p>
                    </div>
                  )
                ) : (
                  <div className="coming-soon-message">
                    <p>🚧 {networkConfig.name} + {tokenConfig.symbol} 결제는 준비 중입니다.</p>
                    <p className="sub-text">현재 Polygon + USDC로 결제 가능합니다.</p>
                  </div>
                )
              ) : (
                <div className="connect-prompt">
                  <p style={{ marginBottom: '1rem' }}>결제를 진행하려면 먼저 지갑을 연결하세요.</p>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ConnectButton />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Transaction Hash */}
          {payment.txHash && (
            <div className="tx-hash">
              <span>Tx: </span>
              <a
                href={`https://polygonscan.com/tx/${payment.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {payment.txHash.slice(0, 10)}...{payment.txHash.slice(-8)}
              </a>
            </div>
          )}

          {/* Error Display */}
          {(approval.error || payment.error) && !isCancelled && (
            <div className="error-message">
              {translateError(approval.error || payment.error)}
            </div>
          )}
        </div>
      </div>

      <style jsx>{mainStyles}</style>
    </>
  );
}

const cancelledStyles = `
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 1rem;
  }
  .modal-content {
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    width: 100%;
    max-width: 480px;
    padding: 1.5rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
  }
  .modal-title {
    font-size: 1.25rem;
    font-weight: 900;
    color: #fff;
  }
  .modal-close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
  }
  .modal-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
  .cancelled-content {
    text-align: center;
    padding: 2rem 1rem;
  }
  .cancelled-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1.5rem;
    background: rgba(239, 68, 68, 0.15);
    border: 2px solid rgba(239, 68, 68, 0.4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #ef4444;
  }
  .cancelled-content h3 {
    color: #fff;
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
  .cancelled-content p {
    color: #94a3b8;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  .go-products-btn {
    padding: 0.875rem 2rem;
    background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .go-products-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  }
`;

const mainStyles = `
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 1rem;
  }
  .modal-content {
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    width: 100%;
    max-width: 520px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 1.5rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
  }
  .modal-title {
    font-size: 1.25rem;
    font-weight: 900;
    color: #fff;
  }
  .modal-close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
  }
  .modal-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
  .product-info {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    margin-bottom: 1rem;
  }
  .product-thumb {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    flex-shrink: 0;
    background: radial-gradient(
      60px 30px at 20% 20%,
      hsla(var(--h, 210), 70%, 60%, 0.55),
      transparent 65%
    ),
    linear-gradient(
      135deg,
      hsla(var(--h, 210), 60%, 50%, 0.3),
      hsla(calc(var(--h, 210) + 30), 70%, 60%, 0.2)
    );
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .product-details {
    flex: 1;
    min-width: 0;
  }
  .product-name {
    font-size: 1rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .product-desc {
    font-size: 0.8rem;
    color: #94a3b8;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Network/Token Selection */
  .selection-section {
    margin-bottom: 1rem;
  }
  .section-label {
    display: block;
    font-size: 0.8rem;
    color: #64748b;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  .network-tabs, .token-tabs {
    display: flex;
    gap: 0.5rem;
  }
  .network-tab, .token-tab {
    flex: 1;
    padding: 0.75rem 0.5rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: #94a3b8;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    position: relative;
  }
  .network-tab:hover, .token-tab:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #e5e7eb;
  }
  .network-tab.active, .token-tab.active {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.4);
    color: #60a5fa;
  }
  .network-tab.coming-soon, .token-tab.coming-soon {
    opacity: 0.6;
  }
  .coming-soon-badge {
    font-size: 0.6rem;
    background: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    font-weight: 600;
  }
  .network-name, .token-symbol {
    font-weight: 600;
  }

  /* Network Warning */
  .network-warning {
    background: rgba(251, 191, 36, 0.1);
    border: 1px solid rgba(251, 191, 36, 0.3);
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1rem;
    text-align: center;
  }
  .network-warning p {
    color: #fbbf24;
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
  }
  .switch-network-btn {
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .switch-network-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
  }
  .switch-network-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Coming Soon Message */
  .coming-soon-message {
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
  }
  .coming-soon-message p {
    color: #a5b4fc;
    font-size: 0.95rem;
    margin: 0;
  }
  .coming-soon-message .sub-text {
    color: #64748b;
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }

  .price-breakdown {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    font-size: 0.9rem;
    color: #94a3b8;
  }
  .price-row--total {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: 0.5rem;
    padding-top: 0.75rem;
  }
  .price-value {
    color: #e5e7eb;
    font-weight: 600;
  }
  .price-value--total {
    color: #fff;
    font-size: 1.1rem;
    font-weight: 900;
  }
  .wallet-balance {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }
  .balance-item {
    flex: 1;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    padding: 0.75rem;
    text-align: center;
  }
  .balance-label {
    display: block;
    font-size: 0.75rem;
    color: #64748b;
    margin-bottom: 0.25rem;
  }
  .balance-value {
    font-size: 0.9rem;
    font-weight: 700;
    color: #e5e7eb;
  }
  .payment-actions {
    display: flex;
    gap: 0.75rem;
  }
  .connect-prompt {
    text-align: center;
    padding: 1rem;
    color: #94a3b8;
    font-size: 0.9rem;
  }
  .tx-hash {
    margin-top: 1rem;
    padding: 0.75rem;
    background: rgba(16, 185, 129, 0.1);
    border-radius: 8px;
    font-size: 0.8rem;
    color: #10b981;
    text-align: center;
  }
  .tx-hash a {
    color: #34d399;
    text-decoration: underline;
  }
  .error-message {
    margin-top: 1rem;
    padding: 0.75rem;
    background: rgba(239, 68, 68, 0.1);
    border-radius: 8px;
    font-size: 0.8rem;
    color: #ef4444;
    text-align: center;
  }

  /* Contact Form */
  .contact-form {
    text-align: center;
    padding: 1rem 0;
  }
  .contact-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #10b981;
    margin-bottom: 0.5rem;
  }
  .contact-desc {
    color: #94a3b8;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  .contact-type-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .tab-btn {
    flex: 1;
    padding: 0.75rem 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: #94a3b8;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .tab-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #e5e7eb;
  }
  .tab-btn.active {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.4);
    color: #60a5fa;
  }
  .contact-input {
    width: 100%;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    color: #fff;
    font-size: 1rem;
    margin-bottom: 1rem;
    outline: none;
    transition: border-color 0.2s;
  }
  .contact-input:focus {
    border-color: rgba(59, 130, 246, 0.5);
  }
  .contact-input::placeholder {
    color: #64748b;
  }
  .submit-contact-btn {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .submit-contact-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
  }
  .submit-contact-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Success Message */
  .success-message {
    text-align: center;
    padding: 2rem 1rem;
  }
  .success-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1.5rem;
    background: rgba(16, 185, 129, 0.15);
    border: 2px solid rgba(16, 185, 129, 0.4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #10b981;
  }
  .success-message h3 {
    color: #fff;
    font-size: 1.15rem;
    margin-bottom: 0.75rem;
  }
  .success-message p {
    color: #94a3b8;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  .go-products-btn {
    padding: 0.875rem 2rem;
    background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .go-products-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  }
`;
