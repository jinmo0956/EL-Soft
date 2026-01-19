'use client';

import { PaymentStatus } from '@/hooks/usePayment';

interface PurchaseButtonProps {
    status: PaymentStatus;
    onPurchase: () => void;
    disabled?: boolean;
    isApproved: boolean;
}

const statusConfig = {
    idle: { text: '구매 확정', icon: '💳', className: '' },
    pending: { text: '서명 대기...', icon: '✍️', className: 'pending' },
    confirming: { text: '처리 중...', icon: '⏳', className: 'confirming' },
    success: { text: '구매 완료!', icon: '✓', className: 'success' },
    error: { text: '구매 실패', icon: '✕', className: 'error' },
};

export function PurchaseButton({
    status,
    onPurchase,
    disabled = false,
    isApproved,
}: PurchaseButtonProps) {
    const config = statusConfig[status] || statusConfig.idle;
    const isClickable = status === 'idle' && isApproved && !disabled;

    return (
        <>
            <button
                className={`purchase-btn purchase-btn--${config.className} ${!isApproved ? 'purchase-btn--locked' : ''}`}
                onClick={isClickable ? onPurchase : undefined}
                disabled={!isClickable}
            >
                <span className="purchase-step">2</span>
                <span className="purchase-icon">{config.icon}</span>
                <span className="purchase-text">
                    {!isApproved ? '먼저 승인 필요' : config.text}
                </span>
            </button>
            <style jsx>{`
        .purchase-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.2rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
          color: #e5e7eb;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
        }
        .purchase-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        .purchase-btn--locked {
          opacity: 0.4;
          border-style: dashed;
        }
        .purchase-btn:not(:disabled):not(.purchase-btn--locked):hover {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-color: #10b981;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }
        .purchase-btn--pending,
        .purchase-btn--confirming {
          background: rgba(251, 191, 36, 0.1);
          border-color: rgba(251, 191, 36, 0.3);
          color: #fbbf24;
        }
        .purchase-btn--success {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.4);
          color: #10b981;
        }
        .purchase-btn--error {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }
        .purchase-step {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          font-size: 0.75rem;
          font-weight: 700;
        }
        .purchase-btn--success .purchase-step {
          background: #10b981;
          color: white;
        }
        .purchase-icon {
          font-size: 1rem;
        }
        .purchase-text {
          flex: 1;
          text-align: left;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .purchase-btn--pending .purchase-icon,
        .purchase-btn--confirming .purchase-icon {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
        </>
    );
}
