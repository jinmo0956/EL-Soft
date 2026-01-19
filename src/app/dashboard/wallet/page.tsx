'use client';

import { useAccount, useBalance } from 'wagmi';
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, Copy, Users, Check } from 'lucide-react';

export default function WalletPage() {
    const { address, isConnected } = useAccount();
    const { data: balance, refetch } = useBalance({ address });

    const formattedBalance = balance
        ? parseFloat(balance.formatted).toFixed(4)
        : '0.0000';

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address);
        }
    };

    // Mock partner data
    const isPartner = false;
    const partnerStats = {
        referralCount: 24,
        totalEarnings: 1250,
        withdrawable: 450,
        partnerCode: 'ELSOFT-ABC123'
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="header-left">
                    <h1 className="header-title">내 지갑</h1>
                </div>
                <div className="header-right">
                    <button className="btn btn-secondary btn-sm" onClick={() => refetch()}>
                        <RefreshCw size={16} />
                        새로고침
                    </button>
                </div>
            </header>

            <div className="page-content">
                <p className="page-description">연결된 지갑의 자산을 확인하세요</p>

                {/* Main Wallet Card */}
                <div className="wallet-main-card">
                    <div className="wallet-header">
                        <div className="wallet-icon">
                            <Wallet size={24} />
                        </div>
                        <div className="wallet-info">
                            <div className="wallet-label">지갑 주소</div>
                            <div className="wallet-address">
                                {isConnected ? address : '연결되지 않음'}
                            </div>
                        </div>
                        <button className="btn btn-ghost" onClick={copyAddress} title="주소 복사">
                            <Copy size={18} />
                        </button>
                    </div>

                    <div className="balance-section">
                        <div className="balance-label">총 잔액</div>
                        <div className="balance-value">
                            {formattedBalance} <span>{balance?.symbol || 'ETH'}</span>
                        </div>
                    </div>

                    <button className="btn btn-secondary btn-sm" onClick={() => refetch()}>
                        <RefreshCw size={16} />
                        새로고침
                    </button>
                </div>

                {/* Action Cards */}
                <div className="wallet-actions">
                    <div className="action-card disabled">
                        <div className="action-icon">
                            <ArrowUpRight size={20} />
                        </div>
                        <div className="action-title">보내기</div>
                        <div className="action-subtitle">곧 지원 예정</div>
                    </div>
                    <div className="action-card disabled">
                        <div className="action-icon">
                            <ArrowDownLeft size={20} />
                        </div>
                        <div className="action-title">받기</div>
                        <div className="action-subtitle">곧 지원 예정</div>
                    </div>
                </div>

                {/* Partner Section */}
                {isPartner ? (
                    <div className="partner-section">
                        <div className="partner-header">
                            <h3 className="section-title">파트너스</h3>
                            <span className="partner-badge">
                                <Check size={12} />
                                승인됨
                            </span>
                        </div>

                        <div className="partner-stats">
                            <div className="partner-stat">
                                <div className="stat-label">추천 가입자 수</div>
                                <div className="stat-value accent">{partnerStats.referralCount}명</div>
                            </div>
                            <div className="partner-stat">
                                <div className="stat-label">총 추천 수익</div>
                                <div className="stat-value success">${partnerStats.totalEarnings}</div>
                            </div>
                            <div className="partner-stat">
                                <div className="stat-label">출금 가능</div>
                                <div className="stat-value">${partnerStats.withdrawable}</div>
                            </div>
                        </div>

                        <div className="referral-code-section">
                            <div>
                                <div className="referral-label">내 추천 코드</div>
                                <div className="referral-code">{partnerStats.partnerCode}</div>
                            </div>
                            <button className="btn btn-secondary">
                                <Copy size={16} />
                                복사
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="partner-section">
                        <div className="empty-state">
                            <div className="empty-icon">
                                <Users size={32} />
                            </div>
                            <h3 className="empty-title">파트너스 프로그램</h3>
                            <p className="empty-description">
                                파트너가 되어 추천 코드로 가입한 사용자의 구매에서 수수료를 받으세요.
                            </p>
                            <button className="btn btn-primary">파트너 신청하기</button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .page-container {
                    min-height: 100vh;
                    background: #0a0a0b;
                    color: #f5f5f5;
                }
                .page-header {
                    position: sticky;
                    top: 0;
                    height: 60px;
                    background: rgba(10, 10, 11, 0.9);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid #1f1f22;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 2rem;
                    z-index: 50;
                }
                .header-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .page-content {
                    padding: 2rem;
                    max-width: 900px;
                }
                .page-description {
                    color: #9ca3af;
                    margin-bottom: 1.5rem;
                }
                .wallet-main-card {
                    background: #1a1a1d;
                    border: 1px solid #1f1f22;
                    border-radius: 20px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .wallet-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                .wallet-icon {
                    width: 48px;
                    height: 48px;
                    background: rgba(16, 185, 129, 0.12);
                    color: #10b981;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .wallet-info {
                    flex: 1;
                }
                .wallet-label {
                    font-size: 0.875rem;
                    color: #9ca3af;
                    margin-bottom: 0.25rem;
                }
                .wallet-address {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.9rem;
                    word-break: break-all;
                }
                .balance-section {
                    text-align: center;
                    padding: 1.5rem 0;
                    border-top: 1px solid #1f1f22;
                    border-bottom: 1px solid #1f1f22;
                    margin-bottom: 1rem;
                }
                .balance-label {
                    font-size: 0.875rem;
                    color: #9ca3af;
                    margin-bottom: 0.5rem;
                }
                .balance-value {
                    font-size: 2.5rem;
                    font-weight: 700;
                    font-family: 'JetBrains Mono', monospace;
                }
                .balance-value span {
                    font-size: 1.25rem;
                    color: #9ca3af;
                }
                .wallet-actions {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                .action-card {
                    background: #161618;
                    border: 1px solid #1f1f22;
                    border-radius: 16px;
                    padding: 1.5rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .action-card:hover:not(.disabled) {
                    border-color: #10b981;
                    transform: translateY(-2px);
                }
                .action-card.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .action-icon {
                    width: 44px;
                    height: 44px;
                    margin: 0 auto 0.75rem;
                    background: rgba(16, 185, 129, 0.12);
                    color: #10b981;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .action-title {
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }
                .action-subtitle {
                    font-size: 0.8rem;
                    color: #6b7280;
                }
                .partner-section {
                    background: #1a1a1d;
                    border: 1px solid #1f1f22;
                    border-radius: 20px;
                    padding: 1.5rem;
                }
                .partner-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.25rem;
                }
                .section-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                }
                .partner-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.375rem;
                    padding: 0.25rem 0.75rem;
                    background: rgba(16, 185, 129, 0.12);
                    color: #10b981;
                    border-radius: 9999px;
                    font-size: 0.8rem;
                    font-weight: 500;
                }
                .partner-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    margin-bottom: 1.25rem;
                }
                .partner-stat {
                    text-align: center;
                    padding: 1rem;
                    background: #161618;
                    border-radius: 12px;
                }
                .stat-label {
                    font-size: 0.8rem;
                    color: #6b7280;
                    margin-bottom: 0.5rem;
                }
                .stat-value {
                    font-size: 1.25rem;
                    font-weight: 700;
                }
                .stat-value.accent {
                    color: #10b981;
                }
                .stat-value.success {
                    color: #10b981;
                }
                .referral-code-section {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem;
                    background: #161618;
                    border-radius: 12px;
                    margin-bottom: 1rem;
                }
                .referral-label {
                    font-size: 0.875rem;
                    color: #9ca3af;
                    margin-bottom: 0.25rem;
                }
                .referral-code {
                    font-size: 1.125rem;
                    font-weight: 600;
                    font-family: 'JetBrains Mono', monospace;
                    color: #10b981;
                }
                .empty-state {
                    text-align: center;
                    padding: 2rem;
                }
                .empty-icon {
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 1rem;
                    background: #222225;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6b7280;
                }
                .empty-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                .empty-description {
                    color: #9ca3af;
                    max-width: 400px;
                    margin: 0 auto 1.5rem;
                    line-height: 1.6;
                }
            `}</style>

            <style jsx global>{`
                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.625rem 1.25rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    border-radius: 12px;
                    transition: all 0.15s ease;
                    border: none;
                    cursor: pointer;
                }
                .btn-primary {
                    background: #10b981;
                    color: white;
                }
                .btn-secondary {
                    background: #222225;
                    color: #f5f5f5;
                    border: 1px solid #1f1f22;
                }
                .btn-ghost {
                    background: transparent;
                    color: #9ca3af;
                }
                .btn-ghost:hover {
                    background: #222225;
                    color: #f5f5f5;
                }
                .btn-sm {
                    padding: 0.5rem 0.875rem;
                    font-size: 0.8125rem;
                }
            `}</style>
        </div>
    );
}
