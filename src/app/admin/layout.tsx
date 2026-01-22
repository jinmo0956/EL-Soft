'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAccount } from 'wagmi';
import Sidebar from './components/Sidebar';
import { ToastProvider } from './components/Toast';
import './admin-styles.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { address, isConnected } = useAccount();
    const router = useRouter();
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
            <div className="admin-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>권한 확인 중...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="admin-container">
            <ToastProvider>
                <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                        {children}
                    </main>
                </div>
            </ToastProvider>
        </div>
    );
}
