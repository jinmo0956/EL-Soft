'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { WalletButton } from './WalletButton';
import { LayoutDashboard } from 'lucide-react';

const navItems = [
    { href: '/', label: '홈', id: 'navHome' },
    { href: '/products', label: '제품', id: 'navProducts' },
    { href: '/custom', label: '맞춤 프로그램', id: 'navCustom' },
    { href: '/consult', label: '상담', id: 'navConsult' },
    { href: '/support', label: '지원', id: 'navSupport' },
];

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { isConnected } = useAccount();

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    return (
        <header>
            <div className="nav">
                <Link href="/" className="logo">
                    EL SOFT
                </Link>
                <nav>
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <Link
                                    href={item.href}
                                    id={item.id}
                                    className={isActive(item.href) ? 'active' : ''}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="auth">
                    <WalletButton />
                    {isConnected && (
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="dashboard-link-btn"
                            title="대시보드"
                        >
                            <LayoutDashboard size={18} />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
