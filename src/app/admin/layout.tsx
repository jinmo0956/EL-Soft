'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAccount } from 'wagmi';
import { LayoutDashboard, Upload, ShoppingCart, LogOut, ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { address, isConnected } = useAccount();
    const router = useRouter();
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAdmin() {
            // Wallet not connected
            if (!isConnected || !address) {
                // Wait a bit to ensure it's not just loading
                await new Promise(resolve => setTimeout(resolve, 1000));
                if (!isConnected) {
                    alert("지갑 연결이 필요합니다.");
                    router.push('/');
                    return;
                }
            }

            if (!supabase) {
                console.error("Supabase client not initialized");
                return;
            }

            console.log("Checking admin status for:", address);

            // Use RPC function to check admin status (bypasses RLS)
            const { data: isAdminUser, error } = await supabase.rpc('check_is_admin', {
                p_wallet_address: address
            });

            if (error) {
                console.error("Admin check error:", error);
                alert("권한 확인 중 오류가 발생했습니다: " + error.message);
                router.push('/');
                return;
            }

            console.log("Is Admin:", isAdminUser);

            if (isAdminUser) {
                setIsAdmin(true);
            } else {
                alert("관리자 권한이 없습니다.");
                router.push('/');
            }
            setLoading(false);
        }

        if (address) {
            checkAdmin();
        } else if (!isConnected) {
            // If not connected initially, stop loading after a timeout to show access denied
            const timer = setTimeout(() => {
                if (!address) {
                    router.push('/');
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [address, isConnected, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#111] text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                    <p className="text-gray-400">관리자 권한 확인 중...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) return null;

    const menuItems = [
        { name: '대시보드', href: '/admin', icon: LayoutDashboard },
        { name: '상품 등록', href: '/admin/upload', icon: Upload },
        { name: '주문 관리', href: '/admin/orders', icon: ShoppingCart },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            {/* Fixed Sidebar */}
            <aside className="fixed top-0 left-0 w-64 h-full bg-[#111] border-r border-[#222] z-50 flex flex-col shadow-2xl">
                {/* Header */}
                <div className="h-16 flex items-center px-6 border-b border-[#222]">
                    <ShieldCheck className="w-6 h-6 text-emerald-500 mr-2" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                        EL ADMIN
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-white'} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-[#222]">
                    <div className="px-4 py-3 bg-[#1a1a1a] rounded-lg mb-4">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Logged in as</p>
                        <p className="text-sm font-mono text-emerald-500 truncate" title={address}>
                            {address?.slice(0, 6)}...{address?.slice(-4)}
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">나가기</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="ml-64 min-h-screen transition-all duration-300">
                <div className="max-w-7xl mx-auto p-8 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
