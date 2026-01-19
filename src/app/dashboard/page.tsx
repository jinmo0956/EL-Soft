'use client';

import { useAccount, useBalance } from 'wagmi';
import Link from 'next/link';
import {
  Wallet,
  TrendingUp,
  Package,
  Download,
  ChevronRight,
  Copy,
  RefreshCw
} from 'lucide-react';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  const formattedBalance = balance
    ? parseFloat(balance.formatted).toFixed(4)
    : '0.0000';

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  // Mock data for demonstration
  const stats = {
    totalAssets: 2450,
    purchasedProducts: 12,
    downloadable: 8,
    monthlyChange: 320,
  };

  const recentPurchases = [
    { id: 1, name: 'JetBrains All Products', price: 249, date: '2024-01-15', status: 'downloadable' },
    { id: 2, name: 'Microsoft 365', price: 99, date: '2024-01-10', status: 'downloadable' },
    { id: 3, name: 'Adobe Creative Cloud', price: 599, date: '2024-01-05', status: 'processing' },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <h1 className="header-title">대시보드</h1>
        </div>
        <div className="header-right">
          <button className="btn btn-secondary btn-sm">
            <RefreshCw size={16} />
            새로고침
          </button>
        </div>
      </header>

      <div className="page-content">
        {/* User Info Card */}
        {isConnected && (
          <div className="user-info-card">
            <div className="user-avatar">
              {address ? address.slice(2, 4).toUpperCase() : 'U'}
            </div>
            <div className="user-details">
              <div className="user-name">사용자</div>
              <div className="wallet-address">
                <span>{shortAddress}</span>
                <button onClick={copyAddress} title="주소 복사">
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">
              <Wallet size={20} />
            </div>
            <div className="card-title">
              <Wallet size={16} />
              지갑 잔액
            </div>
            <div className="card-value">
              {formattedBalance} <span>{balance?.symbol || 'ETH'}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <TrendingUp size={20} />
            </div>
            <div className="card-title">
              <TrendingUp size={16} />
              총 소프트웨어 자산
            </div>
            <div className="card-value">${stats.totalAssets.toLocaleString()}</div>
            <div className="card-change positive">
              +${stats.monthlyChange} 이번 달
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              <Package size={20} />
            </div>
            <div className="card-title">
              <Package size={16} />
              구매한 제품
            </div>
            <div className="card-value">{stats.purchasedProducts}</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Download size={20} />
            </div>
            <div className="card-title">
              <Download size={16} />
              다운로드 가능
            </div>
            <div className="card-value">{stats.downloadable}</div>
          </div>
        </div>

        {/* Recent Purchases Section */}
        <div className="section">
          <div className="section-header">
            <h3 className="section-title">최근 구매</h3>
            <Link href="/dashboard/orders" className="btn btn-ghost btn-sm">
              전체 보기
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="products-grid">
            {recentPurchases.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <div className="product-status">
                    <span className={`badge ${product.status === 'downloadable' ? 'badge-success' : 'badge-warning'}`}>
                      {product.status === 'downloadable' ? '다운로드 가능' : '처리 중'}
                    </span>
                  </div>
                  <div className="product-icon">
                    <Package size={24} />
                  </div>
                </div>
                <div className="product-content">
                  <div className="product-name">{product.name}</div>
                  <div className="product-meta">
                    <div className="product-price">
                      ${product.price} <span>USDC</span>
                    </div>
                    <div className="product-date">{product.date}</div>
                  </div>
                  {product.status === 'downloadable' && (
                    <button className="btn btn-primary w-full">
                      <Download size={16} />
                      다운로드
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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
                    max-width: 1400px;
                }
                .user-info-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.5rem;
                    background: #1a1a1d;
                    border: 1px solid #1f1f22;
                    border-radius: 16px;
                    margin-bottom: 1.5rem;
                }
                .user-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #10b981, #059669);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1.25rem;
                    color: white;
                }
                .user-name {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }
                .wallet-address {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.875rem;
                    color: #6b7280;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .wallet-address button {
                    background: none;
                    border: none;
                    color: #4b5563;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                }
                .wallet-address button:hover {
                    color: #10b981;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                @media (max-width: 1200px) {
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 600px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .stat-card {
                    background: #1a1a1d;
                    border: 1px solid #1f1f22;
                    border-radius: 16px;
                    padding: 1.25rem;
                    position: relative;
                }
                .stat-icon {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .stat-icon.purple {
                    background: rgba(16, 185, 129, 0.12);
                    color: #10b981;
                }
                .stat-icon.green {
                    background: rgba(16, 185, 129, 0.12);
                    color: #10b981;
                }
                .stat-icon.blue {
                    background: rgba(59, 130, 246, 0.12);
                    color: #3b82f6;
                }
                .stat-icon.orange {
                    background: rgba(245, 158, 11, 0.12);
                    color: #f59e0b;
                }
                .card-title {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #9ca3af;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                .card-value {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #f5f5f5;
                }
                .card-value span {
                    font-size: 1rem;
                    color: #9ca3af;
                }
                .card-change {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.8rem;
                    font-weight: 500;
                    padding: 0.2rem 0.5rem;
                    border-radius: 8px;
                    margin-top: 0.5rem;
                }
                .card-change.positive {
                    color: #10b981;
                    background: rgba(16, 185, 129, 0.12);
                }
                .section {
                    margin-top: 1.5rem;
                }
                .section-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                }
                .section-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                }
                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1rem;
                }
                .product-card {
                    background: #1a1a1d;
                    border: 1px solid #1f1f22;
                    border-radius: 16px;
                    overflow: hidden;
                    transition: all 0.2s ease;
                }
                .product-card:hover {
                    border-color: #2d2d30;
                    transform: translateY(-3px);
                }
                .product-image {
                    height: 140px;
                    background: linear-gradient(135deg, #059669 0%, #047857 100%);
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .product-status {
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                }
                .product-icon {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(8px);
                    color: white;
                }
                .product-content {
                    padding: 1rem;
                }
                .product-name {
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                .product-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                }
                .product-price {
                    font-weight: 700;
                }
                .product-price span {
                    font-weight: 400;
                    color: #9ca3af;
                }
                .product-date {
                    font-size: 0.8rem;
                    color: #6b7280;
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
                    text-decoration: none;
                }
                .btn-primary {
                    background: #10b981;
                    color: white;
                }
                .btn-primary:hover {
                    background: #059669;
                }
                .btn-secondary {
                    background: #222225;
                    color: #f5f5f5;
                    border: 1px solid #1f1f22;
                }
                .btn-secondary:hover {
                    background: #1f1f22;
                    border-color: #2d2d30;
                }
                .btn-ghost {
                    background: transparent;
                    color: #9ca3af;
                }
                .btn-ghost:hover {
                    background: #1a1a1d;
                    color: #f5f5f5;
                }
                .btn-sm {
                    padding: 0.5rem 0.875rem;
                    font-size: 0.8125rem;
                }
                .w-full {
                    width: 100%;
                }
                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.375rem;
                    padding: 0.25rem 0.625rem;
                    font-size: 0.75rem;
                    font-weight: 500;
                    border-radius: 9999px;
                }
                .badge-success {
                    background: rgba(16, 185, 129, 0.12);
                    color: #10b981;
                }
                .badge-warning {
                    background: rgba(245, 158, 11, 0.12);
                    color: #f59e0b;
                }
            `}</style>
    </div>
  );
}
