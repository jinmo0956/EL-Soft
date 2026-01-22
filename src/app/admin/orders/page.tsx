'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, User } from 'lucide-react';

interface Order {
    id: string;
    wallet_address: string;
    product_name: string;
    amount: number;
    status: string;
    created_at: string;
    tx_hash?: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    const fetchOrders = async () => {
        setLoading(true);
        if (!supabase) return;

        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) {
            console.error('Error fetching orders:', error);
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();

        const channel = supabase?.channel('orders_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
            .subscribe();

        return () => {
            supabase?.removeChannel(channel!);
        };
    }, []);

    const markAsPaid = async (orderId: string) => {
        if (!confirm("⚠️ 정말 이 주문을 '결제 완료' 상태로 변경하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) return;
        if (!supabase) return;

        const { error } = await supabase
            .from('orders')
            .update({
                status: 'paid',
                paid_at: new Date().toISOString(),
                tx_hash: 'MANUAL_ADMIN_OVERRIDE',
                error_message: null
            })
            .eq('id', orderId);

        if (error) {
            alert("처리 실패: " + error.message);
        } else {
            alert("✅ 결제가 승인되었습니다.");
            fetchOrders();
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
            case 'delivered':
                return (
                    <span className="flex items-center gap-1.5 text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full text-xs font-bold">
                        <CheckCircle size={12} /> 결제 완료
                    </span>
                );
            case 'pending':
                return (
                    <span className="flex items-center gap-1.5 text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full text-xs font-bold">
                        <Clock size={12} /> 대기 중
                    </span>
                );
            case 'failed':
                return (
                    <span className="flex items-center gap-1.5 text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full text-xs font-bold">
                        <XCircle size={12} /> 실패
                    </span>
                );
            default:
                return (
                    <span className="text-gray-400 bg-white/5 px-3 py-1.5 rounded-full text-xs font-bold">
                        {status.toUpperCase()}
                    </span>
                );
        }
    };

    const filteredOrders = orders.filter(order =>
        order.wallet_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.includes(searchTerm)
    );

    return (
        <div className="space-y-8">
            {/* 헤더 */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                        주문 관리
                    </h1>
                    <p className="text-gray-400">
                        전체 트랜잭션 흐름을 모니터링하고 결제 상태를 관리합니다.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={fetchOrders}
                        className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                        title="새로고침"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </motion.button>
                    <div className="relative group w-full md:w-80">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-100 transition duration-500 blur"></div>
                        <div className="relative flex items-center bg-black rounded-xl border border-white/10">
                            <Search className="absolute left-4 text-gray-600 group-hover:text-cyan-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="지갑 주소, 상품명, 주문 ID 검색..."
                                className="w-full bg-transparent py-3 pl-12 pr-4 text-white placeholder-gray-700 focus:outline-none font-mono text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 주문 테이블 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/50 border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider font-mono">
                                <th className="p-5">주문 정보</th>
                                <th className="p-5">고객 지갑</th>
                                <th className="p-5">상품</th>
                                <th className="p-5">결제 금액</th>
                                <th className="p-5 text-center">상태</th>
                                <th className="p-5 text-right">관리</th>
                            </tr>
                        </thead>
                        <motion.tbody
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="divide-y divide-white/5"
                        >
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <div className="flex justify-center flex-col items-center gap-4">
                                            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-gray-600 font-mono text-sm">주문 내역 불러오는 중...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-700 font-mono">
                                        // 주문 내역이 없습니다
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence>
                                    {filteredOrders.map((order) => (
                                        <motion.tr
                                            key={order.id}
                                            variants={rowVariants}
                                            className="group hover:bg-white/[0.02] transition-colors duration-200"
                                        >
                                            <td className="p-5">
                                                <div className="flex flex-col">
                                                    <span className="text-cyan-400 font-mono text-sm">{order.id.slice(0, 8)}...</span>
                                                    <span className="text-gray-600 text-xs font-mono mt-1">
                                                        {new Date(order.created_at).toLocaleString('ko-KR')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:border-cyan-500/20 transition-colors">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    <span className="font-mono text-xs text-gray-300">
                                                        {order.wallet_address.slice(0, 6)}...{order.wallet_address.slice(-4)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className="text-white font-medium">{order.product_name}</span>
                                            </td>
                                            <td className="p-5">
                                                <span className="text-xl font-bold text-white font-mono">
                                                    {order.amount} <span className="text-xs font-normal text-gray-500">USDT</span>
                                                </span>
                                            </td>
                                            <td className="p-5 text-center">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="p-5 text-right">
                                                {order.status !== 'paid' && order.status !== 'delivered' && (
                                                    <motion.button
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => markAsPaid(order.id)}
                                                        className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 border border-red-500/20 hover:border-red-500"
                                                    >
                                                        <AlertTriangle size={14} />
                                                        강제 승인
                                                    </motion.button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </motion.tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
