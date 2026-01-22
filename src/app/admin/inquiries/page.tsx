'use client';

import { useState } from 'react';
import { Search, MessageSquare, AlertTriangle, CheckCircle, Ban } from 'lucide-react';
import Navbar from '../components/Navbar';
import { inquiriesData } from '../services/mockData';
import '../components/Table.css';

export default function Inquiries() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredInquiries = inquiriesData.filter(inquiry =>
        inquiry.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.user_wallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.contact_info.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved': return 'approved';
            case 'pending': return 'warning';
            case 'spam': return 'disable';
            default: return 'disable';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'resolved': return '해결됨';
            case 'pending': return '대기중';
            case 'spam': return '스팸';
            default: return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'resolved': return <CheckCircle size={14} />;
            case 'pending': return <AlertTriangle size={14} />;
            case 'spam': return <Ban size={14} />;
            default: return <MessageSquare size={14} />;
        }
    };

    return (
        <div className="page-container">
            <Navbar title="상담 관리" />

            <div className="page-content">
                <div className="action-bar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="상담 검색 (메시지, 지갑주소, 연락처)..."
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
                                    <th>상담 ID</th>
                                    <th>사용자 지갑</th>
                                    <th>연락처</th>
                                    <th>메시지</th>
                                    <th>상태</th>
                                    <th>접수일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInquiries.map(inquiry => (
                                    <tr key={inquiry.id}>
                                        <td className="id-cell">#{inquiry.id}</td>
                                        <td className="mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            {inquiry.user_wallet}
                                        </td>
                                        <td style={{ color: 'var(--text-tertiary)' }}>{inquiry.contact_info}</td>
                                        <td className="name-cell" style={{ maxWidth: '300px' }}>
                                            {inquiry.message}
                                        </td>
                                        <td>
                                            <span
                                                className={`status-badge ${getStatusColor(inquiry.status)}`}
                                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                            >
                                                {getStatusIcon(inquiry.status)}
                                                {getStatusText(inquiry.status)}
                                            </span>
                                        </td>
                                        <td className="date-cell">
                                            {new Date(inquiry.created_at).toLocaleDateString('ko-KR')}
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
