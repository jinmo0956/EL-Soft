'use client';

import { RefreshCw } from 'lucide-react';

const chartData = [
    { month: 'Jan', value: 2800 },
    { month: 'Feb', value: 3200 },
    { month: 'Mar', value: 4000 },
    { month: 'Apr', value: 3500 },
    { month: 'May', value: 2800 },
    { month: 'Jun', value: 3800 },
    { month: 'Jul', value: 4200 },
];

export default function PortfolioChart() {
    const maxValue = Math.max(...chartData.map(d => d.value));
    const minValue = Math.min(...chartData.map(d => d.value));
    const range = maxValue - minValue;

    // SVG path 생성
    const width = 100;
    const height = 60;
    const points = chartData.map((d, i) => ({
        x: (i / (chartData.length - 1)) * width,
        y: height - ((d.value - minValue) / range) * height * 0.8 - 5,
    }));

    const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

    return (
        <div className="portfolio-chart">
            <div className="chart-header">
                <div>
                    <h3>자산 포트폴리오</h3>
                    <p>Real-time Asset Valuation</p>
                </div>
                <button className="refresh-btn">
                    <RefreshCw size={18} />
                </button>
            </div>

            <div className="chart-container">
                <div className="y-axis">
                    <span>4000</span>
                    <span>3000</span>
                    <span>2000</span>
                    <span>1000</span>
                    <span>0</span>
                </div>
                <div className="chart-area">
                    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)" />
                                <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                            </linearGradient>
                        </defs>
                        <path d={areaPath} fill="url(#areaGradient)" />
                        <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="0.5" />
                    </svg>
                </div>
            </div>

            <div className="x-axis">
                {chartData.map((d) => (
                    <span key={d.month}>{d.month}</span>
                ))}
            </div>

            <style jsx>{`
        .portfolio-chart {
          background: linear-gradient(135deg, rgba(30, 30, 40, 0.8), rgba(25, 25, 35, 0.9));
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 1.25rem;
          flex: 1;
        }
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        .chart-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.25rem;
        }
        .chart-header p {
          font-size: 0.8rem;
          color: #64748b;
          margin: 0;
        }
        .refresh-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 0.5rem;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s;
        }
        .refresh-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .chart-container {
          display: flex;
          height: 200px;
          gap: 0.75rem;
        }
        .y-axis {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 0.7rem;
          color: #64748b;
          padding: 0.25rem 0;
        }
        .chart-area {
          flex: 1;
          position: relative;
        }
        .chart-area svg {
          width: 100%;
          height: 100%;
        }
        .x-axis {
          display: flex;
          justify-content: space-between;
          margin-top: 0.75rem;
          padding-left: 2.5rem;
          font-size: 0.75rem;
          color: #64748b;
        }
      `}</style>
        </div>
    );
}
