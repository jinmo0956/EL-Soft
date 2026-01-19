'use client';

import { ApprovalStatus } from '@/hooks/useTokenApproval';

interface ApproveButtonProps {
    status: ApprovalStatus;
    onApprove: () => void;
    tokenSymbol?: string;
    disabled?: boolean;
}

const statusConfig = {
    idle: { text: '승인 준비', icon: '🔒', className: '' },
    checking: { text: '확인 중...', icon: '⏳', className: 'checking' },
    'needs-approval': { text: 'USDT 승인', icon: '🔓', className: 'needs-approval' },
    approving: { text: '승인 대기...', icon: '⏳', className: 'approving' },
    approved: { text: '승인 완료', icon: '✓', className: 'approved' },
    error: { text: '승인 실패', icon: '✕', className: 'error' },
};

export function ApproveButton({
    status,
    onApprove,
    tokenSymbol = 'USDT',
    disabled = false,
}: ApproveButtonProps) {
    const config = statusConfig[status] || statusConfig.idle;
    const isClickable = status === 'needs-approval' && !disabled;

    return (
        <>
            <button
                className={`approve-btn approve-btn--${config.className}`}
                onClick={isClickable ? onApprove : undefined}
                disabled={!isClickable}
            >
                <span className="approve-step">1</span>
                <span className="approve-icon">{config.icon}</span>
                <span className="approve-text">
                    {status === 'needs-approval' ? `${tokenSymbol} 승인` : config.text}
                </span>
            </button>
            <style jsx>{`
        .approve-btn {
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
        .approve-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        .approve-btn--needs-approval {
          background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
          border-color: #3b82f6;
          color: white;
        }
        .approve-btn--needs-approval:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        .approve-btn--approving {
          background: rgba(251, 191, 36, 0.1);
          border-color: rgba(251, 191, 36, 0.3);
          color: #fbbf24;
        }
        .approve-btn--approved {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.3);
          color: #10b981;
        }
        .approve-btn--error {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }
        .approve-step {
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
        .approve-btn--approved .approve-step {
          background: #10b981;
          color: white;
        }
        .approve-icon {
          font-size: 1rem;
        }
        .approve-text {
          flex: 1;
          text-align: left;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .approve-btn--approving .approve-icon,
        .approve-btn--checking .approve-icon {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
        </>
    );
}
