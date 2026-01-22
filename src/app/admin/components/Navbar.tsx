'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun, Menu, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import './Navbar.css';

interface Notification {
    id: number;
    title: string;
    time: string;
    type: 'success' | 'info' | 'warning';
    icon: typeof CheckCircle;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 1,
        title: '새로운 주문이 도착했습니다',
        time: '5분 전',
        type: 'success',
        icon: CheckCircle
    },
    {
        id: 2,
        title: '신규 회원가입: DevLee',
        time: '1시간 전',
        type: 'info',
        icon: Info
    },
    {
        id: 3,
        title: '시스템 점검 예정 안내',
        time: '2시간 전',
        type: 'warning',
        icon: AlertTriangle
    }
];

interface NavbarProps {
    title?: string;
}

export default function Navbar({ title = 'Main Dashboard' }: NavbarProps) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    // Initialize theme from localStorage
    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem('admin-theme');
            if (savedTheme === 'dark') {
                setIsDarkMode(true);
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        } catch (e) {
            console.error('Error reading theme from localStorage:', e);
        }
    }, []);

    // Dark Mode Effect
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('admin-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('admin-theme', 'light');
        }
    }, [isDarkMode]);

    const toggleNotification = () => {
        setIsNotifOpen(!isNotifOpen);
    };

    const clearNotifications = () => {
        setNotifications([]);
        setIsNotifOpen(false);
    };

    return (
        <header className="navbar">
            <div className="navbar-left">
                <div className="breadcrumb">
                    <span className="breadcrumb-item">Pages</span>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{title}</span>
                </div>
                <h1 className="page-title">{title}</h1>
            </div>

            <div className="navbar-right">
                <div className="navbar-card">
                    <div className="navbar-search-box">
                        <Search size={18} className="navbar-search-icon" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="navbar-search-input"
                        />
                    </div>

                    <button
                        className="icon-btn"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        aria-label="Toggle theme"
                        title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <div className="notification-wrapper">
                        <button
                            className="icon-btn notification-btn"
                            aria-label="Notifications"
                            onClick={toggleNotification}
                        >
                            <Bell size={18} />
                            {notifications.length > 0 && <span className="notification-dot"></span>}
                        </button>

                        {isNotifOpen && (
                            <div className="notification-dropdown">
                                <div className="notification-header">
                                    <h3>알림 ({notifications.length})</h3>
                                    <button className="clear-btn" onClick={clearNotifications}>모두 읽음</button>
                                </div>
                                <div className="notification-list">
                                    {notifications.length > 0 ? (
                                        notifications.map(notif => (
                                            <div key={notif.id} className="notification-item">
                                                <div className="notif-icon-box">
                                                    <notif.icon size={20} />
                                                </div>
                                                <div className="notif-content">
                                                    <h4 className="notif-title">{notif.title}</h4>
                                                    <span className="notif-time">{notif.time}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="notification-item">
                                            <div className="notif-content" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                                새로운 알림이 없습니다.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="icon-btn menu-btn" aria-label="Menu">
                        <Menu size={18} />
                    </button>

                    <div className="user-avatar">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                            alt="User avatar"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
