'use client';

import { MoreHorizontal, Check } from 'lucide-react';
import './Table.css';

const projectData = [
    {
        name: 'JetBrains All Products Pack',
        progress: 85,
        status: 'Approved',
        date: '2024-01-15',
    },
    {
        name: 'Microsoft 365 Personal',
        progress: 75,
        status: 'Approved',
        date: '2024-01-14',
    },
    {
        name: 'Adobe Creative Cloud',
        progress: 25,
        status: 'Pending',
        date: '2024-01-13',
    },
    {
        name: 'NordVPN 1년 이용권',
        progress: 100,
        status: 'Approved',
        date: '2024-01-12',
    },
];

export function ProjectTable() {
    return (
        <div className="table-card">
            <div className="table-header">
                <h3 className="table-title">최근 상품 현황</h3>
                <button className="table-menu-btn">
                    <MoreHorizontal size={20} />
                </button>
            </div>
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>상품명</th>
                            <th>상태</th>
                            <th>날짜</th>
                            <th>진행률</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projectData.map((project, index) => (
                            <tr key={index}>
                                <td className="name-cell">{project.name}</td>
                                <td>
                                    <span className={`status-badge ${project.status.toLowerCase()}`}>
                                        {project.status === 'Approved' ? '승인됨' :
                                            project.status === 'Pending' ? '대기중' : project.status}
                                    </span>
                                </td>
                                <td className="date-cell">{project.date}</td>
                                <td>
                                    <div className="progress-cell">
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${project.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const checklistData = [
    { id: 1, text: '신규 상품 등록', checked: true },
    { id: 2, text: '주문 승인 처리', checked: false },
    { id: 3, text: '고객 상담 답변', checked: true },
    { id: 4, text: '재고 현황 확인', checked: true },
    { id: 5, text: '프로모션 배너 업데이트', checked: false },
];

export function ChecklistCard() {
    return (
        <div className="checklist-card">
            <div className="checklist-header">
                <h3 className="checklist-title">할 일</h3>
                <button className="table-menu-btn">
                    <MoreHorizontal size={20} />
                </button>
            </div>
            <ul className="checklist-items">
                {checklistData.map((item) => (
                    <li key={item.id} className={`checklist-item ${item.checked ? 'checked' : ''}`}>
                        <div className={`checkbox ${item.checked ? 'checked' : ''}`}>
                            {item.checked && <Check size={12} />}
                        </div>
                        <span className="checklist-text">{item.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
