'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PackagePlus, ShoppingCart, TrendingUp, Users, Activity, Zap, MessageSquare, DollarSign } from 'lucide-react';

export default function AdminPage() {
    const stats = [
        { name: '총 매출', value: '—', subtext: 'USDT', icon: DollarSign, color: 'text-green-400', border: 'border-green-500/20', glow: 'from-green-500/10' },
        { name: '총 주문', value: '—', subtext: '건', icon: ShoppingCart, color: 'text-cyan-400', border: 'border-cyan-500/20', glow: 'from-cyan-500/10' },
        { name: '활성 유저', value: '—', subtext: '명', icon: Users, color: 'text-purple-400', border: 'border-purple-500/20', glow: 'from-purple-500/10' },
        { name: '신규 상담', value: '—', subtext: '건', icon: MessageSquare, color: 'text-yellow-400', border: 'border-yellow-500/20', glow: 'from-yellow-500/10' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    return (
        <div className="space-y-10">
            {/* 웰컴 헤더 */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900/30 via-blue-900/20 to-transparent border border-cyan-500/10 p-10"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Zap size={200} className="text-cyan-400" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
                        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">시스템 정상 가동</span>
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                        관리자 대시보드
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl">
                        EL SOFT 마켓플레이스의 모든 활동을 실시간으로 모니터링하고 관리합니다.
                    </p>
                </div>
            </motion.div>

            {/* 통계 그리드 */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className={`group relative overflow-hidden bg-[#0A0A0A] border ${stat.border} rounded-2xl p-6 transition-all duration-500`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">{stat.name}</p>
                                    <h3 className={`text-3xl font-black ${stat.color} font-mono`}>
                                        {stat.value}
                                    </h3>
                                    <p className="text-xs text-gray-600 mt-1">{stat.subtext}</p>
                                </div>
                                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                    <stat.icon size={22} />
                                </div>
                            </div>
                            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '60%' }}
                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                    className={`h-full rounded-full bg-gradient-to-r ${stat.color.replace('text-', 'from-')} to-transparent`}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* 퀵 액션 */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* 상품 등록 */}
                <motion.div variants={itemVariants}>
                    <Link
                        href="/admin/upload"
                        className="group relative h-56 overflow-hidden rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-cyan-500/30 transition-all duration-500 block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700">
                            <PackagePlus size={160} className="text-cyan-500" />
                        </div>
                        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                                <PackagePlus size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">상품 등록</h3>
                                <p className="text-gray-500 text-sm">새 소프트웨어를 마켓에 배포</p>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* 주문 관리 */}
                <motion.div variants={itemVariants}>
                    <Link
                        href="/admin/orders"
                        className="group relative h-56 overflow-hidden rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-yellow-500/30 transition-all duration-500 block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700">
                            <ShoppingCart size={160} className="text-yellow-500" />
                        </div>
                        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
                                <ShoppingCart size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">주문 관리</h3>
                                <p className="text-gray-500 text-sm">결제 내역 확인 및 승인</p>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* 상담 관리 */}
                <motion.div variants={itemVariants}>
                    <Link
                        href="/admin/inquiries"
                        className="group relative h-56 overflow-hidden rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-purple-500/30 transition-all duration-500 block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700">
                            <MessageSquare size={160} className="text-purple-500" />
                        </div>
                        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">상담 관리</h3>
                                <p className="text-gray-500 text-sm">고객 문의 및 악성 유저 차단</p>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </motion.div>

            {/* 최근 활동 (플레이스홀더) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8"
            >
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="text-cyan-400" size={20} />
                    <h3 className="text-lg font-bold text-white">최근 활동</h3>
                </div>
                <div className="text-center py-10 text-gray-600">
                    <p className="font-mono text-sm">// 실시간 활동 피드 준비 중...</p>
                </div>
            </motion.div>
        </div>
    );
}
