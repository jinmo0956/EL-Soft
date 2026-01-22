'use client';

import { useState } from 'react';
import { Search, UserX, UserCheck, Shield, User as UserIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import { usersData, User } from '../services/mockData';
import '../components/Table.css';

export default function Users() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>(usersData);

    const filteredUsers = users.filter(user =>
        user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.wallet_address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleBan = (walletAddress: string) => {
        setUsers(users.map(user =>
            user.wallet_address === walletAddress
                ? { ...user, is_banned: !user.is_banned }
                : user
        ));
    };

    return (
        <div className="page-container">
            <Navbar title="유저 관리" />

            <div className="page-content">
                <div className="action-bar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="유저 검색 (닉네임, 이메일, 지갑주소)..."
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
                                    <th>닉네임</th>
                                    <th>지갑 주소</th>
                                    <th>이메일</th>
                                    <th>역할</th>
                                    <th>상태</th>
                                    <th>최근 로그인</th>
                                    <th>액션</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.wallet_address}>
                                        <td className="name-cell">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '10px',
                                                    background: user.role === 'admin' ? 'var(--gradient-primary)' : 'var(--bg-input)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: user.role === 'admin' ? 'white' : 'var(--text-secondary)'
                                                }}>
                                                    {user.role === 'admin' ? <Shield size={14} /> : <UserIcon size={14} />}
                                                </div>
                                                {user.nickname}
                                            </div>
                                        </td>
                                        <td className="mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            {user.wallet_address}
                                        </td>
                                        <td style={{ color: 'var(--text-tertiary)' }}>{user.email}</td>
                                        <td>
                                            <span className={`status-badge ${user.role === 'admin' ? 'approved' : 'pending'}`}>
                                                {user.role === 'admin' ? '관리자' : '일반'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${user.is_banned ? 'disable' : 'approved'}`}>
                                                {user.is_banned ? '차단됨' : '활성'}
                                            </span>
                                        </td>
                                        <td className="date-cell">
                                            {new Date(user.last_login).toLocaleDateString('ko-KR')}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => toggleBan(user.wallet_address)}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    background: user.is_banned ? 'rgba(1, 181, 116, 0.1)' : 'rgba(227, 26, 26, 0.1)',
                                                    color: user.is_banned ? 'var(--accent-cyan)' : 'var(--accent-red)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    border: 'none'
                                                }}
                                            >
                                                {user.is_banned ? <UserCheck size={14} /> : <UserX size={14} />}
                                                {user.is_banned ? '차단 해제' : '차단'}
                                            </button>
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
