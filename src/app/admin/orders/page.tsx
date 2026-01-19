'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, Search, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

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

    const fetchOrders = async () => {
        setLoading(true);
        if (!supabase) return;

        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100); // Performance safeguard

        if (error) {
            console.error('Error fetching orders:', error);
            alert('주문 목록을 불러오지 못했습니다.');
        } else {
            setOrders(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();

        // Realtime subscription could go here
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

        // Use specific admin override value for tx_hash to track manual updates
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
            alert("✅ 성공적으로 처리되었습니다.");
            fetchOrders();
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
            case 'delivered':
                return <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded text-xs"><CheckCircle size={12} /> 결제 완료</span>;
            case 'pending':
                return <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded text-xs"><Clock size={12} /> 대기 중</span>;
            case 'failed':
                return <span className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-1 rounded text-xs"><XCircle size={12} /> 실패</span>;
            default:
                return <span className="text-gray-400 bg-gray-800 px-2 py-1 rounded text-xs">{status}</span>;
        }
    };

    // Filter orders
    const filteredOrders = orders.filter(order =>
        order.wallet_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.includes(searchTerm)
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                        주문 관리
                    </h1>
                    <p className="text-gray-400 text-lg">
                        전체 주문 흐름을 제어하고 결제 상태를 관리합니다.
                    </p>
                </div>

                <div className="relative group w-full md:w-96">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl opacity-30 group-hover:opacity-100 transition duration-500 blur"></div>
                    <div className="relative flex items-center bg-[#0a0a0a] rounded-xl">
                        <Search className="absolute left-4 text-gray-500 group-hover:text-emerald-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="지갑 주소, 상품명, 주문 ID 검색..."
                            className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:ring-0"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Orders Table Card */}
            <div className="bg-[#111] border border-[#222] rounded-2xl shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#151515] border-b border-[#222] text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-6 font-semibold">주문 정보 / 시간</th>
                                <th className="p-6 font-semibold">고객 (Wallet)</th>
                                <th className="p-6 font-semibold">상품</th>
                                <th className="p-6 font-semibold">결제 금액</th>
                                <th className="p-6 font-semibold text-center">상태</th>
                                <th className="p-6 font-semibold text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#222]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <div className="flex justify-center flex-col items-center gap-4">
                                            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-gray-500">주문 내역 불러오는 중...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-600">
                                        검색 결과가 없거나 주문 내역이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-[#1a1a1a] transition-colors duration-200">
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="text-white font-mono text-sm mb-1">{order.id.slice(0, 8)}...</span>
                                                <span className="text-gray-500 text-xs flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a0a0a] border border-[#333] group-hover:border-emerald-500/30 transition-colors">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                <span className="font-mono text-sm text-gray-300 group-hover:text-emerald-400 transition-colors">
                                                    {order.wallet_address.slice(0, 6)}...{order.wallet_address.slice(-4)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-white font-medium block">{order.product_name}</span>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-xl font-bold text-white tracking-tight">{order.amount} <span className="text-sm font-normal text-gray-500">USDT</span></span>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex justify-center">
                                                {getStatusBadge(order.status)}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            {order.status !== 'paid' && order.status !== 'delivered' && (
                                                <button
                                                    onClick={() => markAsPaid(order.id)}
                                                    className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-red-500/20 hover:border-red-500 hover:shadow-lg hover:shadow-red-900/20"
                                                    title="입금 확인됨으로 강제 처리"
                                                >
                                                    <AlertTriangle size={14} />
                                                    <span>강제 승인</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
