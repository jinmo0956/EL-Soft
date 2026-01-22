'use client';

import { LucideIcon } from 'lucide-react';
import './StatsCard.css';

interface StatsCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    trend?: 'up' | 'down';
    trendValue?: string;
    iconColor?: string;
    bgColor?: string;
}

export default function StatsCard({
    icon: Icon,
    label,
    value,
    trend,
    trendValue,
    iconColor = '#4318FF',
    bgColor = '#F4F7FE',
}: StatsCardProps) {
    return (
        <div className="stats-card">
            <div
                className="stats-icon-box"
                style={{ backgroundColor: bgColor }}
            >
                <Icon size={28} style={{ color: iconColor }} />
            </div>
            <div className="stats-info">
                <p className="stats-label">{label}</p>
                <h3 className="stats-value">{value}</h3>
            </div>
            {trend && trendValue && (
                <span className={`stats-trend ${trend}`}>
                    {trendValue}
                </span>
            )}
        </div>
    );
}
