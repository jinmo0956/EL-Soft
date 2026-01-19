'use client';

import { Plus, Eye, EyeOff, Play, Pause, TrendingUp } from 'lucide-react';

export default function SalesPage() {
    // Mock data
    const salesSummary = {
        totalProducts: 3,
        activeProducts: 2,
        totalSales: 156,
        thisMonthSales: 24,
        totalRevenue: 12450,
        thisMonthRevenue: 1890,
    };

    const salesProducts = [
        {
            id: 1,
            name: 'Auto Trading Bot Pro',
            price: 299,
            currency: 'USDT',
            status: 'active',
            totalSales: 89,
            revenue: 26611,
            views: 1234,
            createdAt: '2023-12-01',
        },
        {
            id: 2,
            name: 'Data Analysis Toolkit',
            price: 149,
            currency: 'USDT',
            status: 'active',
            totalSales: 45,
            revenue: 6705,
            views: 892,
            createdAt: '2024-01-05',
        },
        {
            id: 3,
            name: 'Web Scraper Suite',
            price: 99,
            currency: 'USDT',
            status: 'stopped',
            totalSales: 22,
            revenue: 2178,
            views: 456,
            createdAt: '2024-01-15',
        },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <span className="badge badge-success">판매 중</span>;
            case 'stopped':
                return <span className="badge badge-danger">중단됨</span>;
            case 'hidden':
                return <span className="badge badge-warning">숨김</span>;
            default:
                return <span className="badge">{status}</span>;
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="header-left">
                    <h1 className="header-title">판매 내역</h1>
                </div>
            </header>

            <div className="page-content">
                <p className="page-description">판매 중인 프로그램을 관리하세요</p>

                {/* Sales Summary */}
                <div className="summary-grid">
                    <div className="summary-card">
                        <div className="summary-title">총 상품 수</div>
                        <div className="summary-value">{salesSummary.totalProducts}</div>
                        <div className="summary-sub">활성: {salesSummary.activeProducts}개</div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-title">총 판매량</div>
                        <div className="summary-value">{salesSummary.totalSales}</div>
                        <div className="summary-change positive">+{salesSummary.thisMonthSales} 이번 달</div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-title">총 수익</div>
                        <div className="summary-value">${salesSummary.totalRevenue.toLocaleString()}</div>
                        <div className="summary-change positive">+${salesSummary.thisMonthRevenue.toLocaleString()} 이번 달</div>
                    </div>
                </div>

                {/* Section Header */}
                <div className="section-header">
                    <h3 className="section-title">내 상품</h3>
                    <button className="btn btn-primary btn-sm">
                        <Plus size={16} />
                        상품 등록
                    </button>
                </div>

                {/* Sales List */}
                <div className="sales-list">
                    {salesProducts.map((product) => (
                        <div key={product.id} className="sales-item">
                            <div className="sales-image">
                                <TrendingUp size={24} />
                            </div>
                            <div className="sales-info">
                                <div className="sales-name">{product.name}</div>
                                <div className="sales-meta">
                                    <span>${product.price} {product.currency}</span>
                                    <span>•</span>
                                    <span>등록일: {product.createdAt}</span>
                                    <span>•</span>
                                    {getStatusBadge(product.status)}
                                </div>
                            </div>
                            <div className="sales-stats">
                                <div className="sales-stat">
                                    <div className="stat-value">{product.totalSales}</div>
                                    <div className="stat-label">판매</div>
                                </div>
                                <div className="sales-stat">
                                    <div className="stat-value">${product.revenue.toLocaleString()}</div>
                                    <div className="stat-label">수익</div>
                                </div>
                                <div className="sales-stat">
                                    <div className="stat-value">{product.views.toLocaleString()}</div>
                                    <div className="stat-label">조회</div>
                                </div>
                            </div>
                            <div className="sales-actions">
                                <button className="btn btn-secondary btn-sm">
                                    <EyeOff size={14} />
                                    숨기기
                                </button>
                                <button className={`btn btn-sm ${product.status === 'active' ? 'btn-danger' : 'btn-success'}`}>
                                    {product.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                                    {product.status === 'active' ? '중단' : '재개'}
                                </button>
                            </div>
                        </div>
                    ))}
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
                    padding: 0 2rem;
                    z-index: 50;
                }
                .header-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                .page-content {
                    padding: 2rem;
                    max-width: 1400px;
                }
                .page-description {
                    color: #9ca3af;
                    margin-bottom: 1.5rem;
                }
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                @media (max-width: 768px) {
                    .summary-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .summary-card {
                    background: #1a1a1d;
                    border: 1px solid #1f1f22;
                    border-radius: 16px;
                    padding: 1.5rem;
                }
                .summary-title {
                    font-size: 0.875rem;
                    color: #9ca3af;
                    margin-bottom: 0.5rem;
                }
                .summary-value {
                    font-size: 2rem;
                    font-weight: 700;
                }
                .summary-sub {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin-top: 0.25rem;
                }
                .summary-change {
                    display: inline-flex;
                    font-size: 0.8rem;
                    font-weight: 500;
                    padding: 0.2rem 0.5rem;
                    border-radius: 8px;
                    margin-top: 0.5rem;
                }
                .summary-change.positive {
                    color: #10b981;
                    background: rgba(16, 185, 129, 0.12);
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
                .sales-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .sales-item {
                    background: #1a1a1d;
                    border: 1px solid #1f1f22;
                    border-radius: 16px;
                    padding: 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                .sales-image {
                    width: 56px;
                    height: 56px;
                    background: linear-gradient(135deg, #059669 0%, #047857 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                }
                .sales-info {
                    flex: 1;
                    min-width: 200px;
                }
                .sales-name {
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }
                .sales-meta {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: #9ca3af;
                    flex-wrap: wrap;
                }
                .sales-stats {
                    display: flex;
                    gap: 2rem;
                }
                .sales-stat {
                    text-align: center;
                }
                .stat-value {
                    font-size: 1.125rem;
                    font-weight: 700;
                }
                .stat-label {
                    font-size: 0.75rem;
                    color: #6b7280;
                }
                .sales-actions {
                    display: flex;
                    gap: 0.5rem;
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
                .btn-success {
                    background: #10b981;
                    color: white;
                }
                .btn-danger {
                    background: #ef4444;
                    color: white;
                }
                .btn-sm {
                    padding: 0.5rem 0.875rem;
                    font-size: 0.8125rem;
                }
                .badge {
                    display: inline-flex;
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
                .badge-danger {
                    background: rgba(239, 68, 68, 0.12);
                    color: #ef4444;
                }
            `}</style>
        </div>
    );
}
