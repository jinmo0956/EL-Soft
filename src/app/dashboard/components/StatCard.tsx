'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    change?: number;
    prefix?: string;
}

export default function StatCard({ icon: Icon, label, value, change, prefix }: StatCardProps) {
    const isPositive = change && change > 0;
    const isNegative = change && change < 0;

    return (
        <div className="stat-card">
            <div className="stat-header">
                <div className="stat-icon">
                    <Icon size={22} />
                </div>
                {change !== undefined && (
                    <div className={`stat-change ${isPositive ? 'positive' : ''} ${isNegative ? 'negative' : ''}`}>
                        {isPositive ? <TrendingUp size={14} /> : isNegative ? <TrendingDown size={14} /> : null}
                        {isPositive ? '+' : ''}{change}%
                    </div>
                )}
            </div>
            <div className="stat-label">{label}</div>
            <div className="stat-value">
                {prefix && <span className="prefix">{prefix}</span>}
                {value}
            </div>

            <style jsx>{`
        .stat-card {
          background: linear-gradient(135deg, rgba(30, 30, 40, 0.8), rgba(25, 25, 35, 0.9));
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 1.25rem;
          min-width: 200px;
        }
        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a5b4fc;
        }
        .stat-change {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          color: #94a3b8;
        }
        .stat-change.positive {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }
        .stat-change.negative {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        }
        .stat-label {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }
        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
        }
        .prefix {
          font-size: 1.25rem;
          margin-right: 0.1rem;
        }
      `}</style>
        </div>
    );
}
