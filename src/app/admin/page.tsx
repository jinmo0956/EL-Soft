'use client';

import { useEffect } from 'react';
import {
    Wallet,
    Users,
    MessageSquare,
    ShoppingBag,
} from 'lucide-react';
import Navbar from './components/Navbar';
import StatsCard from './components/StatsCard';
import { TrafficChart, DailyTrafficChart, WeeklyRevenueChart } from './components/Chart';
import { ProjectTable } from './components/Table';
import { useToast } from './components/Toast';
import { ordersData, usersData, inquiriesData } from './services/mockData';
import './Dashboard.css';

const DEMO_ORDERS = [
    { product: 'JetBrains 전체 제품 팩', amount: 249, user: 'CryptoKing' },
    { product: 'Microsoft 365 개인용', amount: 99, user: 'InvestorKim' },
    { product: 'Adobe Creative Cloud', amount: 599, user: 'DevLee' },
    { product: 'NordVPN 1년 이용권', amount: 59.99, user: 'NewbieTrader' },
];

export default function AdminDashboard() {
    const { addToast } = useToast();

    // Simulate real-time order notifications
    useEffect(() => {
        const interval = setInterval(() => {
            const randomOrder = DEMO_ORDERS[Math.floor(Math.random() * DEMO_ORDERS.length)];
            addToast({
                type: 'success',
                title: '🎉 새로운 주문이 들어왔습니다!',
                message: `${randomOrder.user}님이 ${randomOrder.product}을(를) 구매했습니다. ($${randomOrder.amount})`
            });
        }, 15000); // Every 15 seconds

        return () => clearInterval(interval);
    }, [addToast]);

    // Calculate Stats
    const totalRevenue = ordersData
        .filter(order => order.status === 'paid')
        .reduce((sum, order) => sum + order.amount, 0);

    const totalUsers = usersData.length;
    const newInquiries = inquiriesData.filter(inq => inq.status === 'pending').length;
    const totalOrders = ordersData.length;

    const statsData = [
        {
            icon: Wallet,
            label: '총 매출',
            value: `$${totalRevenue.toLocaleString()}`,
            trend: 'up' as const,
            trendValue: '+12.5%',
            iconColor: '#4318FF',
            bgColor: '#F4F7FE',
        },
        {
            icon: Users,
            label: '총 유저 수',
            value: totalUsers.toString(),
            trend: 'up' as const,
            trendValue: '+5',
            iconColor: '#01B574',
            bgColor: 'rgba(1, 181, 116, 0.1)',
        },
        {
            icon: MessageSquare,
            label: '대기 상담',
            value: newInquiries.toString(),
            iconColor: '#FFB547',
            bgColor: 'rgba(255, 181, 71, 0.1)',
        },
        {
            icon: ShoppingBag,
            label: '총 주문',
            value: totalOrders.toString(),
            iconColor: '#4318FF',
            bgColor: '#F4F7FE',
        },
    ];

    return (
        <div className="dashboard">
            <Navbar title="메인 대시보드" />

            <div className="dashboard-content">
                {/* Stats Row */}
                <div className="stats-grid">
                    {statsData.map((stat, index) => (
                        <StatsCard
                            key={index}
                            icon={stat.icon}
                            label={stat.label}
                            value={stat.value}
                            trend={stat.trend}
                            trendValue={stat.trendValue}
                            iconColor={stat.iconColor}
                            bgColor={stat.bgColor}
                        />
                    ))}
                </div>

                {/* Charts Row */}
                <div className="charts-grid">
                    <TrafficChart />
                    <WeeklyRevenueChart />
                </div>

                {/* Bottom Section */}
                <div className="charts-grid-secondary">
                    <ProjectTable />
                    <div className="side-widgets">
                        <DailyTrafficChart />
                    </div>
                </div>
            </div>
        </div>
    );
}
