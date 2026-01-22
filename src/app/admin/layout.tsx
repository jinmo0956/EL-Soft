'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PackagePlus, ShoppingCart, MessageSquare, LogOut, ShieldCheck, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { address, isConnected } = useAccount();
    const router = useRouter();
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAdmin() {
            if (!isConnected || !address) {
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

            const { data: isAdminUser, error } = await supabase.rpc('check_is_admin', {
                p_wallet_address: address
            });

            if (error) {
                console.error("Admin check error:", error);
                alert("권한 확인 중 오류가 발생했습니다: " + error.message);
                router.push('/');
                return;
            }

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
            <div className="flex h-screen items-center justify-center bg-[#030303] text-cyan-500 font-mono">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="relative">
                        <div className="h-12 w-12 rounded-full border-2 border-cyan-500/30"></div>
                        <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
                    </div>
                    <p className="text-cyan-400 animate-pulse text-sm tracking-widest uppercase">권한 확인 중...</p>
                </motion.div>
            </div>
        );
    }

    if (!isAdmin) return null;

    const menu = [
        { name: '대시보드', href: '/admin', icon: LayoutDashboard },
        { name: '상품 등록', href: '/admin/upload', icon: PackagePlus },
        { name: '주문 관리', href: '/admin/orders', icon: ShoppingCart },
        { name: '상담 관리', href: '/admin/inquiries', icon: MessageSquare },
    ];

    return (
        <div className="flex min-h-screen bg-[#030303] text-gray-200">
            {/* 고퀄리티 배경 글로우 */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            {/* 사이드바 */}
            <aside className="w-80 border-r border-white/5 bg-black/40 backdrop-blur-3xl fixed h-full z-50 flex flex-col">
                <div className="p-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-[1px]">
                        <div className="w-full h-full rounded-[11px] bg-black flex items-center justify-center font-black text-xl text-cyan-400">E</div>
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white">EL SOFT</span>
                </div>

                <nav className="flex-1 px-6 space-y-2">
                    {menu.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} className={`
                                flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                                ${active
                                    ? 'bg-white/[0.05] text-cyan-400 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)]'
                                    : 'text-gray-500 hover:text-white hover:bg-white/[0.02]'}
                            `}>
                                <item.icon size={20} className={active ? 'text-cyan-400' : 'group-hover:scale-110 transition-transform'} />
                                <span className="font-bold text-sm tracking-tight">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-8 border-t border-white/5 mt-auto">
                    <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5 mb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">시스템 정상</span>
                        </div>
                        <div className="px-1">
                            <p className="text-[10px] text-gray-600 uppercase font-semibold mb-1">접속 지갑</p>
                            <p className="text-xs font-mono text-cyan-400 truncate" title={address}>
                                {address?.slice(0, 8)}...{address?.slice(-6)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-3 text-gray-500 hover:text-red-400 px-4 py-2 transition-colors text-sm font-bold w-full"
                    >
                        <LogOut size={16} /> 콘솔 나가기
                    </button>
                </div>
            </aside>

            {/* 메인 콘텐츠 */}
            <main className="flex-1 ml-80 p-16 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-6xl mx-auto"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
