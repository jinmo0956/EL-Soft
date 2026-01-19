'use client';

import { Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Purchase {
    id: string;
    initial: string;
    name: string;
    category: string;
    date: string;
    status: 'active' | 'pending' | 'expired';
}

const purchases: Purchase[] = [
    { id: '1', initial: 'N', name: '네이버 블로그 키워드 분석기', category: '분석', date: '2023-10-24', status: 'active' },
    { id: '2', initial: 'I', name: '인스타그램 자동 좋아요 프로', category: '자동화', date: '2023-10-22', status: 'pending' },
    { id: '3', initial: 'C', name: '쿠팡 가격 모니터링', category: '이커머스', date: '2023-10-20', status: 'active' },
    { id: '4', initial: 'K', name: '카카오톡 대량 발송기', category: '마케팅', date: '2023-10-18', status: 'expired' },
    { id: '5', initial: 'M', name: '범용 매크로 v2', category: '유틸리티', date: '2023-10-15', status: 'active' },
];

const statusLabels = {
    active: '사용중',
    pending: '대기중',
    expired: '만료됨',
};

export default function PurchaseTable() {
    return (
        <div className="purchase-table">
            <div className="table-header">
                <h3>최근 구매 목록</h3>
                <Link href="/dashboard/orders" className="view-all">
                    전체 보기
                </Link>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>프로그램</th>
                        <th>카테고리</th>
                        <th>날짜</th>
                        <th>상태</th>
                        <th>작업</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.map((item) => (
                        <tr key={item.id}>
                            <td className="program-cell">
                                <div className="program-initial">{item.initial}</div>
                                <span>{item.name}</span>
                            </td>
                            <td>
                                <span className="category-badge">{item.category}</span>
                            </td>
                            <td className="date-cell">{item.date}</td>
                            <td>
                                <span className={`status-badge ${item.status}`}>
                                    <span className="status-dot" />
                                    {statusLabels[item.status]}
                                </span>
                            </td>
                            <td className="actions-cell">
                                <button className="action-btn" title="다운로드">
                                    <Download size={16} />
                                </button>
                                <button className="action-btn" title="열기">
                                    <ExternalLink size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
        .purchase-table {
          background: linear-gradient(135deg, rgba(30, 30, 40, 0.8), rgba(25, 25, 35, 0.9));
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 1.25rem;
        }
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .table-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }
        .view-all {
          font-size: 0.8rem;
          color: #6366f1;
          text-decoration: none;
        }
        .view-all:hover {
          text-decoration: underline;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          text-align: left;
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
          padding: 0.75rem 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        td {
          padding: 0.875rem 0.5rem;
          font-size: 0.875rem;
          color: #e5e7eb;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }
        tr:last-child td {
          border-bottom: none;
        }
        .program-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .program-initial {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.8rem;
        }
        .category-badge {
          background: rgba(255, 255, 255, 0.05);
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          font-size: 0.75rem;
          color: #94a3b8;
        }
        .date-cell {
          color: #94a3b8;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .status-badge.active {
          color: #22c55e;
        }
        .status-badge.active .status-dot {
          background: #22c55e;
        }
        .status-badge.pending {
          color: #f59e0b;
        }
        .status-badge.pending .status-dot {
          background: #f59e0b;
        }
        .status-badge.expired {
          color: #64748b;
        }
        .status-badge.expired .status-dot {
          background: #64748b;
        }
        .actions-cell {
          display: flex;
          gap: 0.5rem;
        }
        .action-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .action-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
        </div>
    );
}
