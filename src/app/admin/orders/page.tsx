'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import { ordersData } from '../services/mockData';
import '../components/Table.css';

export default function Orders() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = ordersData.filter(order =>
        order.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.wallet_address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'paid';
            case 'pending': return 'pending';
            case 'failed': return 'failed';
            default: return 'failed';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'paid': return '결제완료';
            case 'pending': return '대기중';
            case 'failed': return '실패';
            default: return status;
        }
    };

    return (
        <div className="page-container">
            <Navbar title="주문 관리" />

            <div className="page-content">
                <div className="action-bar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="주문 검색 (지갑주소, 상품명)..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-card">
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>주문 ID</th>
                                    <th>상품명</th>
                                    <th>구매자 지갑</th>
                                    <th>금액</th>
                                    <th>상태</th>
                                    <th>주문 일시</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className="id-cell">#{order.id}</td>
                                        <td className="name-cell">{order.product_name}</td>
                                        <td className="text-secondary mono">{order.wallet_address}</td>
                                        <td className="price-cell">${order.amount}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusColor(order.status)}`}>
                                                {getStatusText(order.status)}
                                            </span>
                                        </td>
                                        <td className="date-cell">
                                            {new Date(order.created_at).toLocaleDateString('ko-KR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
