'use client';

import { useState } from 'react';
import { Search, Download, Package } from 'lucide-react';

export default function OrdersPage() {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data
    const allPurchases = [
        {
            id: 1,
            name: 'JetBrains All Products Pack',
            price: 649,
            currency: 'USDT',
            date: '2024-01-15',
            status: 'downloadable',
            description: 'IntelliJ IDEA, PyCharm, WebStorm 등 모든 IDE 포함',
        },
        {
            id: 2,
            name: 'Microsoft Office 365',
            price: 149,
            currency: 'USDT',
            date: '2024-01-10',
            status: 'preparing',
            description: 'Word, Excel, PowerPoint, Outlook 포함',
        },
        {
            id: 3,
            name: 'Adobe Creative Cloud',
            price: 599,
            currency: 'USDT',
            date: '2024-01-05',
            status: 'downloadable',
            description: 'Photoshop, Illustrator, Premiere Pro 등',
        },
        {
            id: 4,
            name: 'Notion Team Plan',
            price: 96,
            currency: 'USDT',
            date: '2023-12-20',
            status: 'pending',
            description: '연간 팀 플랜 (10석)',
        },
    ];

    const getStatusText = (status: string) => {
        switch (status) {
            case 'downloadable':
                return '다운로드 가능';
            case 'preparing':
                return '준비 중';
            case 'pending':
                return '결제 확인 중';
            default:
                return status;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'downloadable':
                return 'badge-success';
            case 'preparing':
                return 'badge-warning';
            case 'pending':
                return 'badge-info';
            default:
                return '';
        }
    };

    const filteredPurchases = allPurchases.filter((purchase) => {
        const matchesFilter = filter === 'all' || purchase.status === filter;
        const matchesSearch =
            searchQuery === '' ||
            purchase.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (purchase.description && purchase.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="header-left">
                    <h1 className="header-title">구매 내역</h1>
                </div>
            </header>

            <div className="page-content">
                <p className="page-description">구매한 프로그램을 확인하고 다운로드하세요</p>

                {/* Filters */}
                <div className="filters-bar">
                    <div className="search-input">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="프로그램 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="filter-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">전체 상태</option>
                        <option value="downloadable">다운로드 가능</option>
                        <option value="preparing">준비 중</option>
                        <option value="pending">결제 확인 중</option>
                    </select>
                </div>

                {/* Purchase List */}
                <div className="purchase-list">
                    {filteredPurchases.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <Package size={32} />
                            </div>
                            <div className="empty-title">구매 내역이 없습니다</div>
                            <div className="empty-description">마켓플레이스에서 프로그램을 구매해보세요</div>
                        </div>
                    ) : (
                        filteredPurchases.map((purchase) => (
                            <div key={purchase.id} className="purchase-item">
                                <div className="purchase-image">
                                    <Package size={24} />
                                </div>
                                <div className="purchase-info">
                                    <div className="purchase-name">{purchase.name}</div>
                                    <div className="purchase-details">
                                        <span>${purchase.price} {purchase.currency}</span>
                                        <span>•</span>
                                        <span>{purchase.date}</span>
                                        <span>•</span>
                                        <span className={`badge ${getStatusClass(purchase.status)}`}>
                                            {getStatusText(purchase.status)}
                                        </span>
                                    </div>
                                    {purchase.description && (
                                        <div className="purchase-description">{purchase.description}</div>
                                    )}
                                </div>
                                <div className="purchase-actions">
                                    {purchase.status === 'downloadable' ? (
                                        <button className="btn btn-primary">
                                            <Download size={16} />
                                            다운로드
                                        </button>
                                    ) : (
                                        <button className="btn btn-secondary" disabled>
                                            대기 중
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
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
                .filters-bar {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                }
                .search-input {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    background: #1a1a1d;
                    border: 1px solid #1f1f22;
                    border-radius: 12px;
                    flex: 1;
                    min-width: 200px;
                    color: #6b7280;
                }
                .search-input input {
                    flex: 1;
                    background: none;
                    border: none;
                    color: #f5f5f5;
                    font-size: 0.875rem;
                    outline: none;
                }
                .search-input input::placeholder {
                    color: #6b7280;
                }
                .filter-select {
                    padding: 0.75rem 1rem;
                    background: #1a1a1d;
                    border: 1px solid #1f1f22;
                    border-radius: 12px;
                    color: #f5f5f5;
                    font-size: 0.875rem;
                    cursor: pointer;
                    outline: none;
                }
                .purchase-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .purchase-item {
                    background: #1a1a1d;
                    border: 1px solid #1f1f22;
                    border-radius: 16px;
                    padding: 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                .purchase-image {
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
                .purchase-info {
                    flex: 1;
                    min-width: 200px;
                }
                .purchase-name {
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }
                .purchase-details {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: #9ca3af;
                    flex-wrap: wrap;
                }
                .purchase-description {
                    font-size: 0.8125rem;
                    color: #6b7280;
                    margin-top: 0.5rem;
                }
                .purchase-actions {
                    flex-shrink: 0;
                }
                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    background: #1a1a1d;
                    border: 1px solid #1f1f22;
                    border-radius: 16px;
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
                .btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
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
                .badge-info {
                    background: rgba(59, 130, 246, 0.12);
                    color: #3b82f6;
                }
            `}</style>
        </div>
    );
}
