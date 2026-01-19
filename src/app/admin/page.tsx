'use client';

import Link from 'next/link';
import { Upload, ShoppingCart, TrendingUp, Users, ShieldCheck } from 'lucide-react';

export default function AdminPage() {
    const stats = [
        { name: '총 매출', value: 'Coming Soon', icon: TrendingUp, color: 'text-emerald-500' },
        { name: '총 주문', value: 'Coming Soon', icon: ShoppingCart, color: 'text-blue-500' },
        { name: '활성 사용자', value: 'Coming Soon', icon: Users, color: 'text-purple-500' },
    ];

    return (
        <div className="space-y-12 animate-fade-in">
            {/* 1. Welcome Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 to-cyan-900/40 border border-emerald-500/20 p-10">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <ShieldCheck size={200} className="text-emerald-500" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                        관리자 대시보드
                    </h1>
                    <p className="text-emerald-100/70 text-lg max-w-2xl">
                        EL SOFT 스토어의 현황을 실시간으로 모니터링하고 관리하세요.
                        <br />오늘도 성공적인 비즈니스를 응원합니다.
                    </p>
                </div>
            </div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="group relative bg-[#111] border border-[#222] p-6 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/20">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-gray-400 font-medium mb-1">{stat.name}</p>
                                <h3 className="text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                    {stat.value}
                                </h3>
                            </div>
                            <div className={`p-3 rounded-xl bg-[#1a1a1a] group-hover:bg-white/5 transition-colors ${stat.color}`}>
                                <stat.icon size={26} />
                            </div>
                        </div>
                        <div className="w-full bg-[#222] h-1 rounded-full overflow-hidden">
                            <div className={`h-full w-2/3 rounded-full bg-gradient-to-r ${stat.name === '총 매출' ? 'from-emerald-600 to-emerald-400' : stat.name === '총 주문' ? 'from-blue-600 to-blue-400' : 'from-purple-600 to-purple-400'}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Action */}
                <Link
                    href="/admin/upload"
                    className="group relative h-64 overflow-hidden rounded-3xl bg-[#111] border border-[#222] hover:border-emerald-500/50 transition-all duration-500"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700">
                        <Upload size={180} className="text-emerald-500" />
                    </div>

                    <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-emerald-900/20">
                            <Upload size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">상품 등록</h3>
                            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                새로운 소프트웨어를 업로드하고 판매를 시작하세요.
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Orders Action */}
                <Link
                    href="/admin/orders"
                    className="group relative h-64 overflow-hidden rounded-3xl bg-[#111] border border-[#222] hover:border-blue-500/50 transition-all duration-500"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700">
                        <ShoppingCart size={180} className="text-blue-500" />
                    </div>

                    <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-blue-900/20">
                            <ShoppingCart size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">주문 관리</h3>
                            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                실시간 주문 내역을 확인하고 결제를 승인하세요.
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
