'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDisconnect } from 'wagmi';
import {
  LayoutDashboard,
  Wallet,
  ShoppingCart,
  BadgeCheck,
  Settings,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: '대시보드', href: '/dashboard' },
  { icon: Wallet, label: '내 지갑', href: '/dashboard/wallet' },
  { icon: ShoppingCart, label: '구매 내역', href: '/dashboard/orders' },
  { icon: BadgeCheck, label: '판매 내역', href: '/dashboard/sales' },
  { icon: Settings, label: '설정', href: '/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { disconnect } = useDisconnect();

  const handleLogout = () => {
    disconnect();
    router.push('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/" className="logo">
          <div className="logo-icon">E</div>
          <span className="logo-text">EL SOFT</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">메뉴</div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>로그아웃</span>
        </button>
      </div>

      <style jsx>{`
                .sidebar {
                    position: fixed;
                    left: 0;
                    top: 0;
                    width: 240px;
                    height: 100vh;
                    background: #111113;
                    border-right: 1px solid #1f1f22;
                    display: flex;
                    flex-direction: column;
                    z-index: 100;
                }
                .sidebar-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #1f1f22;
                }
                .sidebar-nav {
                    flex: 1;
                    padding: 1rem 0.75rem;
                    overflow-y: auto;
                }
                .nav-section {
                    margin-bottom: 1.5rem;
                }
                .nav-section-title {
                    padding: 0.5rem 0.75rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #4b5563;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .sidebar-footer {
                    padding: 1rem 0.75rem;
                    border-top: 1px solid #1f1f22;
                }
            `}</style>

      <style jsx global>{`
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.625rem;
                    text-decoration: none;
                }
                .logo:hover {
                    opacity: 0.8;
                }
                .logo-icon {
                    width: 32px;
                    height: 32px;
                    background: #f5f5f5;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 0.875rem;
                    color: #0a0a0b;
                }
                .logo-text {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #f5f5f5;
                }
                .nav-item {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.625rem 0.875rem;
                    border-radius: 8px;
                    color: #6b7280;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: all 0.15s ease;
                    margin-bottom: 0.125rem;
                    cursor: pointer;
                    text-decoration: none;
                    border: none;
                    background: none;
                    width: 100%;
                    text-align: left;
                }
                .nav-item:hover {
                    background: #1a1a1d;
                    color: #f5f5f5;
                }
                .nav-item.active {
                    background: #1a1a1d;
                    color: #f5f5f5;
                }
                .nav-item.active::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 3px;
                    height: 20px;
                    background: #10b981;
                    border-radius: 0 2px 2px 0;
                }
                .nav-item.logout {
                    color: #ef4444;
                }
                .nav-item.logout:hover {
                    background: rgba(239, 68, 68, 0.12);
                }
            `}</style>
    </aside>
  );
}
