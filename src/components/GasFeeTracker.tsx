'use client';

import { useGasPrice } from '@/hooks';

interface GasFeeTrackerProps {
    className?: string;
}

export function GasFeeTracker({ className = '' }: GasFeeTrackerProps) {
    const { gasPriceGwei, estimatedCostMatic, estimatedCostUsd, loading, error } = useGasPrice();

    if (error) {
        return (
            <div className={`gas-tracker gas-tracker--error ${className}`}>
                <span className="gas-icon">⛽</span>
                <span className="gas-text">가스비 조회 실패</span>
            </div>
        );
    }

    return (
        <div className={`gas-tracker ${className}`}>
            <span className="gas-icon">⛽</span>
            {loading ? (
                <span className="gas-text gas-text--loading">조회 중...</span>
            ) : (
                <>
                    <span className="gas-text">
                        ~{estimatedCostMatic} MATIC
                    </span>
                    <span className="gas-usd">(${estimatedCostUsd})</span>
                </>
            )}
            <style jsx>{`
        .gas-tracker {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.7rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          font-size: 0.75rem;
          color: #94a3b8;
        }
        .gas-tracker--error {
          border-color: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }
        .gas-icon {
          font-size: 0.85rem;
        }
        .gas-text {
          color: #e5e7eb;
        }
        .gas-text--loading {
          color: #94a3b8;
        }
        .gas-usd {
          color: #64748b;
        }
      `}</style>
        </div>
    );
}
