'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Search, X, Gift, Calendar, Percent } from 'lucide-react';
import Navbar from '../components/Navbar';
import '../components/Table.css';

interface Coupon {
    id: string;
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
    validFrom: string;
    validTo: string;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
}

const initialCoupons: Coupon[] = [
    {
        id: '1',
        code: 'WELCOME10',
        discount: 10,
        type: 'percentage',
        validFrom: '2024-01-01',
        validTo: '2024-12-31',
        usageLimit: 100,
        usedCount: 45,
        isActive: true
    },
    {
        id: '2',
        code: 'SAVE20',
        discount: 20,
        type: 'fixed',
        validFrom: '2024-01-15',
        validTo: '2024-03-31',
        usageLimit: 50,
        usedCount: 23,
        isActive: true
    },
    {
        id: '3',
        code: 'VIP30',
        discount: 30,
        type: 'percentage',
        validFrom: '2024-02-01',
        validTo: '2024-02-29',
        usageLimit: 20,
        usedCount: 20,
        isActive: false
    },
];

export default function Coupons() {
    const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredCoupons = coupons.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleCoupon = (id: string) => {
        setCoupons(coupons.map(coupon =>
            coupon.id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
        ));
    };

    const deleteCoupon = (id: string) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            setCoupons(coupons.filter(coupon => coupon.id !== id));
        }
    };

    return (
        <div className="page-container">
            <Navbar title="쿠폰 관리" />

            <div className="page-content">
                <div className="action-bar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="쿠폰 코드 검색..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} /> 쿠폰 생성
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '20px'
                }}>
                    {filteredCoupons.map(coupon => (
                        <div
                            key={coupon.id}
                            style={{
                                background: 'var(--bg-card)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '24px',
                                boxShadow: 'var(--shadow-card)',
                                border: coupon.isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                                opacity: coupon.isActive ? 1 : 0.7
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '16px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: 'var(--gradient-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <Gift size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{
                                            fontSize: '18px',
                                            fontWeight: 700,
                                            color: 'var(--text-primary)',
                                            fontFamily: 'monospace'
                                        }}>{coupon.code}</h3>
                                        <span style={{
                                            fontSize: '24px',
                                            fontWeight: 700,
                                            color: 'var(--primary)'
                                        }}>
                                            {coupon.type === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => deleteCoupon(coupon.id)}
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '8px',
                                            background: 'var(--bg-input)',
                                            color: 'var(--text-secondary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '16px',
                                marginBottom: '16px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)'
                            }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={14} />
                                    {coupon.validFrom} ~ {coupon.validTo}
                                </span>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '16px',
                                borderTop: '1px solid var(--bg-input)'
                            }}>
                                <div>
                                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        사용: {coupon.usedCount} / {coupon.usageLimit}
                                    </span>
                                    <div style={{
                                        width: '120px',
                                        height: '6px',
                                        background: 'var(--bg-input)',
                                        borderRadius: '3px',
                                        marginTop: '6px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${(coupon.usedCount / coupon.usageLimit) * 100}%`,
                                            height: '100%',
                                            background: 'var(--primary)',
                                            borderRadius: '3px'
                                        }}></div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleCoupon(coupon.id)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        background: coupon.isActive ? 'rgba(1, 181, 116, 0.1)' : 'var(--bg-input)',
                                        color: coupon.isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {coupon.isActive ? '활성' : '비활성'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
