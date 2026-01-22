'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, User, ShieldAlert, Zap, CheckCircle, Clock, Search, RefreshCw } from 'lucide-react';

interface Inquiry {
    id: string;
    user_wallet: string;
    contact_info: string;
    message: string;
    status: string;
    created_at: string;
    users?: { is_banned: boolean };
}

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // 애니메이션 변수
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.12 }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0, scale: 0.95 },
        show: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { type: "spring" as const, stiffness: 300, damping: 24 }
        },
        exit: {
            x: -100,
            opacity: 0,
            filter: "blur(10px)",
            transition: { duration: 0.3 }
        }
    };

    const fetchInquiries = async () => {
        setLoading(true);
        if (!supabase) return;

        const { data, error } = await supabase
            .from('inquiries')
            .select('*, users:users(is_banned)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching inquiries:', error);
        } else {
            setInquiries(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    // 🚨 악성 유저 벤 (차단) 로직
    const handleBan = async (wallet: string) => {
        if (!confirm(`⚠️ 정말 이 지갑(${wallet.slice(0, 8)}...)을 블랙리스트에 등록하시겠습니까?\n이 유저는 더 이상 상담을 등록할 수 없습니다.`)) return;
        if (!supabase) return;

        const { error } = await supabase
            .from('users')
            .update({ is_banned: true })
            .eq('wallet_address', wallet);

        if (!error) {
            alert("🚫 해당 지갑이 영구 차단되었습니다.");
            fetchInquiries();
        } else {
            alert("차단 실패: " + error.message);
        }
    };

    // 상담 해결 처리
    const handleResolve = async (id: string) => {
        if (!supabase) return;

        const { error } = await supabase
            .from('inquiries')
            .update({ status: 'resolved' })
            .eq('id', id);

        if (!error) {
            fetchInquiries();
        }
    };

    // 필터링
    const filteredInquiries = inquiries.filter(item =>
        item.user_wallet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contact_info?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative">
            {/* 배경 스캔라인 효과 */}
            <div className="fixed inset-0 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 /%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.03%22/%3E%3C/svg%3E')] opacity-50" />

            {/* 헤더 */}
            <header className="mb-12 relative">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-4 mb-4"
                >
                    <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                        <Zap className="text-cyan-400 fill-cyan-400" size={24} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white">커뮤니케이션 센터</h1>
                </motion.div>
                <p className="text-gray-500 font-mono tracking-widest text-xs uppercase">// 실시간 상담 내역 모니터링 및 악성 유저 관리</p>
            </header>

            {/* 검색 & 새로고침 */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={fetchInquiries}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                    title="새로고침"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
                <div className="relative group flex-1 max-w-md">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-100 transition duration-500 blur"></div>
                    <div className="relative flex items-center bg-black rounded-xl border border-white/10">
                        <Search className="absolute left-4 text-gray-600 group-hover:text-cyan-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="지갑 주소, 연락처, 내용 검색..."
                            className="w-full bg-transparent py-3 pl-12 pr-4 text-white placeholder-gray-700 focus:outline-none font-mono text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* 상담 목록 */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid gap-6"
            >
                <AnimatePresence mode='popLayout'>
                    {filteredInquiries.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={itemVariants}
                            layout
                            whileHover={{ scale: 1.005, rotateX: 0.5, rotateY: -0.5 }}
                            className="relative group"
                        >
                            {/* 네온 글로우 테두리 */}
                            <div className={`absolute -inset-[1px] bg-gradient-to-r rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition duration-500 ${item.users?.is_banned ? 'from-red-500/50 to-red-600/50' : 'from-cyan-500/50 to-purple-600/50'}`} />

                            <div className={`relative bg-[#080808]/90 backdrop-blur-2xl border p-8 rounded-3xl overflow-hidden transition-colors ${item.users?.is_banned ? 'border-red-500/20' : 'border-white/10 group-hover:border-white/20'}`}>
                                {/* 배경 장식 번호 */}
                                <span className="absolute -right-4 -bottom-10 text-[120px] font-black text-white/[0.02] pointer-events-none select-none">
                                    {item.id.slice(0, 2)}
                                </span>

                                <div className="flex flex-col lg:flex-row justify-between gap-6 relative z-10">
                                    <div className="flex gap-6">
                                        {/* 아바타 */}
                                        <div className="relative h-16 w-16 shrink-0">
                                            <div className={`absolute inset-0 blur-lg opacity-20 animate-pulse ${item.users?.is_banned ? 'bg-red-500' : 'bg-cyan-500'}`} />
                                            <div className={`relative h-full w-full bg-black border rounded-2xl flex items-center justify-center ${item.users?.is_banned ? 'border-red-500/40 text-red-400' : 'border-cyan-500/40 text-cyan-400'}`}>
                                                <User size={32} />
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="text-white font-mono font-bold text-lg">{item.contact_info || '연락처 미입력'}</h3>
                                                {item.users?.is_banned && (
                                                    <span className="bg-red-500/20 text-red-500 text-[10px] px-2 py-0.5 rounded-full border border-red-500/40 font-black tracking-tighter uppercase">차단됨</span>
                                                )}
                                                {item.status === 'resolved' && (
                                                    <span className="bg-green-500/20 text-green-500 text-[10px] px-2 py-0.5 rounded-full border border-green-500/40 font-black tracking-tighter uppercase">해결됨</span>
                                                )}
                                            </div>
                                            <p className="text-gray-500 font-mono text-xs mb-2 truncate hover:text-cyan-400 transition-colors cursor-pointer" title={item.user_wallet}>
                                                💳 {item.user_wallet?.slice(0, 10)}...{item.user_wallet?.slice(-6)}
                                            </p>
                                            <p className="text-gray-600 text-xs flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(item.created_at).toLocaleString('ko-KR')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 액션 버튼 */}
                                    <div className="flex items-center gap-3">
                                        {!item.users?.is_banned && (
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleBan(item.user_wallet)}
                                                className="group/btn relative px-5 py-3 rounded-xl overflow-hidden border border-red-500/20 hover:border-red-500 transition-colors"
                                            >
                                                <div className="absolute inset-0 bg-red-600/10 group-hover/btn:bg-red-600 transition-colors" />
                                                <div className="relative flex items-center gap-2 text-red-500 group-hover/btn:text-white font-bold text-xs">
                                                    <ShieldAlert size={16} /> 차단하기
                                                </div>
                                            </motion.button>
                                        )}
                                        {item.status !== 'resolved' && (
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleResolve(item.id)}
                                                className="group/btn relative px-5 py-3 rounded-xl overflow-hidden border border-green-500/20 hover:border-green-500 transition-colors"
                                            >
                                                <div className="absolute inset-0 bg-green-600/10 group-hover/btn:bg-green-600 transition-colors" />
                                                <div className="relative flex items-center gap-2 text-green-500 group-hover/btn:text-white font-bold text-xs">
                                                    <CheckCircle size={16} /> 해결 완료
                                                </div>
                                            </motion.button>
                                        )}
                                    </div>
                                </div>

                                {/* 상담 내용 본문 */}
                                <div className="mt-6 p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-gray-400 text-sm leading-relaxed">
                                    {item.message}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* 빈 상태 */}
                {filteredInquiries.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl"
                    >
                        <MessageSquare className="text-gray-700 mb-4" size={48} />
                        <p className="text-gray-600 font-medium">접수된 상담 내역이 없습니다.</p>
                        <p className="text-gray-700 text-sm mt-1">고객 문의가 들어오면 여기에 표시됩니다.</p>
                    </motion.div>
                )}

                {/* 로딩 상태 */}
                {loading && (
                    <div className="h-64 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600 font-mono text-sm">상담 내역 불러오는 중...</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
