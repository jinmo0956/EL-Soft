'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingCart,
    Table2,
    BarChart3,
    User,
    Kanban,
    Settings,
    Gift,
    Receipt,
    House,
} from 'lucide-react';
import './Sidebar.css';

const menuItems = [
    {
        title: '대시보드',
        icon: House,
        path: '/admin',
    },
    {
        title: '통계/리포트',
        icon: BarChart3,
        path: '/admin/analytics',
    },
    {
        title: '상품 관리',
        icon: ShoppingCart,
        path: '/admin/products',
    },
    {
        title: '주문 관리',
        icon: Receipt,
        path: '/admin/orders',
    },
    {
        title: '상담 관리',
        icon: Table2,
        path: '/admin/inquiries',
    },
    {
        title: '유저 관리',
        icon: User,
        path: '/admin/users',
    },
    {
        title: '칸반 보드',
        icon: Kanban,
        path: '/admin/kanban',
    },
    {
        title: '쿠폰 관리',
        icon: Gift,
        path: '/admin/coupons',
    },
    {
        title: '설정',
        icon: Settings,
        path: '/admin/settings',
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Link href="/admin" className="logo">
                    <span className="logo-text">
                        ELSOFT <span className="logo-highlight">ADMIN</span>
                    </span>
                </Link>
                <div className="divider"></div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <div className="nav-item-content">
                                <Icon size={20} className="nav-icon" />
                                <span className="nav-text">{item.title}</span>
                            </div>
                            {isActive && <div className="active-indicator"></div>}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
