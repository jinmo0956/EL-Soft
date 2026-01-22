'use client';

import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import './Chart.css';

const lineData = [
    { name: 'SEP', value: 20, value2: 10 },
    { name: 'OCT', value: 35, value2: 25 },
    { name: 'NOV', value: 25, value2: 40 },
    { name: 'DEC', value: 60, value2: 35 },
    { name: 'JAN', value: 45, value2: 55 },
    { name: 'FEB', value: 75, value2: 45 },
];

const barData = [
    { name: '00', value: 40 },
    { name: '04', value: 65 },
    { name: '08', value: 30 },
    { name: '12', value: 85 },
    { name: '14', value: 50 },
    { name: '16', value: 70 },
    { name: '18', value: 45 },
];

export function TrafficChart() {
    return (
        <div className="chart-card traffic-chart">
            <div className="chart-header">
                <div className="chart-info">
                    <h3 className="chart-title">이번 달</h3>
                    <div className="chart-value-row">
                        <span className="chart-value">$37.5K</span>
                        <span className="chart-trend up">+2.45%</span>
                    </div>
                    <p className="chart-subtitle">총 매출</p>
                </div>
                <div className="chart-legend">
                    <span className="legend-item">
                        <span className="legend-dot primary"></span>
                        매출
                    </span>
                    <span className="legend-item">
                        <span className="legend-dot secondary"></span>
                        수익
                    </span>
                </div>
            </div>
            <div className="chart-body">
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={lineData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4318FF" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#4318FF" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#01B574" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#01B574" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E0E5F2" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#A3AED0', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#A3AED0', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: 'none',
                                borderRadius: '16px',
                                boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#4318FF"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                        <Area
                            type="monotone"
                            dataKey="value2"
                            stroke="#01B574"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorProfit)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function DailyTrafficChart() {
    return (
        <div className="chart-card daily-traffic-chart">
            <div className="chart-header">
                <div className="chart-info">
                    <h3 className="chart-title">일일 트래픽</h3>
                    <div className="chart-value-row">
                        <span className="chart-value big">2,579</span>
                        <span className="chart-unit">방문자</span>
                    </div>
                </div>
                <span className="chart-trend up">+2.45%</span>
            </div>
            <div className="chart-body">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barData} barSize={12}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#A3AED0', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#fff',
                                border: 'none',
                                borderRadius: '16px',
                                boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)'
                            }}
                        />
                        <Bar
                            dataKey="value"
                            fill="#4318FF"
                            radius={[10, 10, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function WeeklyRevenueChart() {
    const weeklyData = [
        { name: '17', uv: 30, pv: 20 },
        { name: '18', uv: 45, pv: 38 },
        { name: '19', uv: 25, pv: 20 },
        { name: '20', uv: 35, pv: 28 },
        { name: '21', uv: 60, pv: 48 },
        { name: '22', uv: 40, pv: 30 },
        { name: '23', uv: 50, pv: 35 },
    ];

    return (
        <div className="chart-card weekly-revenue-chart gradient-bg">
            <div className="chart-header light">
                <div className="chart-info">
                    <span className="chart-label">주간 매출</span>
                </div>
                <button className="chart-btn">
                    <span>•••</span>
                </button>
            </div>
            <div className="chart-body">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weeklyData} barSize={16} barGap={4}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                        />
                        <Bar
                            dataKey="uv"
                            fill="rgba(255,255,255,0.9)"
                            radius={[6, 6, 6, 6]}
                        />
                        <Bar
                            dataKey="pv"
                            fill="rgba(255,255,255,0.3)"
                            radius={[6, 6, 6, 6]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
