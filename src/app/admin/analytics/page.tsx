'use client';

import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import { TrafficChart, WeeklyRevenueChart, DailyTrafficChart } from '../components/Chart';
import { ordersData, usersData } from '../services/mockData';

export default function Analytics() {
    const totalRevenue = ordersData
        .filter(order => order.status === 'paid')
        .reduce((sum, order) => sum + order.amount, 0);

    const totalOrders = ordersData.length;
    const paidOrders = ordersData.filter(order => order.status === 'paid').length;
    const conversionRate = ((paidOrders / totalOrders) * 100).toFixed(1);

    const statsData = [
        {
            icon: DollarSign,
            label: '총 매출',
            value: `$${totalRevenue.toLocaleString()}`,
            trend: 'up' as const,
            trendValue: '+23.5%',
            iconColor: '#4318FF',
            bgColor: '#F4F7FE',
        },
        {
            icon: ShoppingBag,
            label: '총 주문',
            value: totalOrders.toString(),
            trend: 'up' as const,
            trendValue: '+12',
            iconColor: '#01B574',
            bgColor: 'rgba(1, 181, 116, 0.1)',
        },
        {
            icon: Users,
            label: '총 유저',
            value: usersData.length.toString(),
            trend: 'up' as const,
            trendValue: '+5',
            iconColor: '#FFB547',
            bgColor: 'rgba(255, 181, 71, 0.1)',
        },
        {
            icon: Eye,
            label: '전환율',
            value: `${conversionRate}%`,
            trend: 'up' as const,
            trendValue: '+2.3%',
            iconColor: '#4318FF',
            bgColor: '#F4F7FE',
        },
    ];

    return (
        <div className="page-container">
            <Navbar title="통계/리포트" />

            <div className="page-content">
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

                <div className="charts-grid" style={{ marginTop: '20px' }}>
                    <TrafficChart />
                    <WeeklyRevenueChart />
                </div>

                <div style={{ marginTop: '20px' }}>
                    <DailyTrafficChart />
                </div>
            </div>
        </div>
    );
}
