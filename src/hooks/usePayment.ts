'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import { PAYMENT_CONTRACT_ABI, ERC20_ABI, getContracts } from '@/lib/contracts';

export type PaymentStatus = 'idle' | 'checking-approval' | 'needs-approval' | 'approving' | 'approved' | 'pending' | 'confirming' | 'success' | 'error';

interface UsePaymentProps {
    productId: string;
    amount: string;
    decimals?: number;
}

interface UsePaymentReturn {
    status: PaymentStatus;
    purchase: () => void;
    approve: () => void;
    txHash: `0x${string}` | undefined;
    approvalTxHash: `0x${string}` | undefined;
    error: string | null;
    reset: () => void;
    isApproved: boolean;
    needsApproval: boolean;
}

export function usePayment({
    productId,
    amount,
    decimals = 6,
}: UsePaymentProps): UsePaymentReturn {
    const { address, chainId } = useAccount();
    const [status, setStatus] = useState<PaymentStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    const amountBigInt = parseUnits(amount || '0', decimals);
    const contracts = getContracts(chainId || 137);

    // ============================================
    // ERC20 Approval Check (Security Fix #2)
    // ============================================

    // Read current allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: contracts.paymentToken as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: address && contracts.payment
            ? [address, contracts.payment as `0x${string}`]
            : undefined,
    });

    // Approval transaction
    const {
        writeContract: writeApproval,
        data: approvalTxHash,
        isPending: isApprovalPending,
        isError: isApprovalError,
        error: approvalError
    } = useWriteContract();

    const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed } = useWaitForTransactionReceipt({
        hash: approvalTxHash,
    });

    // Purchase transaction
    const {
        writeContract,
        data: txHash,
        isPending,
        isError,
        error: writeError
    } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    // Check if approved
    const isApproved = allowance !== undefined && allowance >= amountBigInt;
    const needsApproval = !isApproved && amountBigInt > 0n;

    // Update status based on allowance
    useEffect(() => {
        if (status === 'idle' || status === 'checking-approval') {
            if (allowance !== undefined) {
                if (isApproved) {
                    setStatus('approved');
                } else {
                    setStatus('needs-approval');
                }
            }
        }
    }, [allowance, isApproved, status]);

    // Handle approval states
    useEffect(() => {
        if (isApprovalPending && status !== 'approving') {
            setStatus('approving');
        }
        if (isApprovalConfirming && status === 'approving') {
            // Still approving, waiting for confirmation
        }
        if (isApprovalConfirmed) {
            setStatus('approved');
            refetchAllowance();
        }
        if (isApprovalError && approvalError) {
            setStatus('error');
            setError(approvalError.message);
        }
    }, [isApprovalPending, isApprovalConfirming, isApprovalConfirmed, isApprovalError, approvalError, refetchAllowance, status]);

    // Handle purchase states
    useEffect(() => {
        if (isPending && status !== 'pending') {
            setStatus('pending');
        }
        if (isConfirming && status !== 'confirming') {
            setStatus('confirming');
        }
        if (isConfirmed && status !== 'success') {
            setStatus('success');
        }
        if (isError && writeError && status !== 'error') {
            setStatus('error');
            setError(writeError.message);
        }
    }, [isPending, isConfirming, isConfirmed, isError, writeError, status]);

    // Approve function
    const approve = useCallback(() => {
        if (!address || !contracts.payment || !contracts.paymentToken) {
            setError('Contracts not configured');
            return;
        }

        setError(null);
        setStatus('approving');

        // Approve max uint256 for better UX (one-time approval)
        const maxApproval = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

        writeApproval({
            address: contracts.paymentToken as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [contracts.payment as `0x${string}`, maxApproval],
        });
    }, [address, contracts.payment, contracts.paymentToken, writeApproval]);

    // Purchase function
    const purchase = useCallback(() => {
        if (!address || !contracts.payment) {
            setError('Payment contract not configured');
            return;
        }

        // Check approval first
        if (!isApproved) {
            setError('Please approve token spending first');
            setStatus('needs-approval');
            return;
        }

        setError(null);
        setStatus('pending');

        writeContract({
            address: contracts.payment as `0x${string}`,
            abi: PAYMENT_CONTRACT_ABI,
            functionName: 'buyProduct',
            args: [productId, amountBigInt],
        });
    }, [address, contracts.payment, productId, amountBigInt, writeContract, isApproved]);

    const reset = useCallback(() => {
        setStatus('idle');
        setError(null);
        refetchAllowance();
    }, [refetchAllowance]);

    return {
        status,
        purchase,
        approve,
        txHash,
        approvalTxHash,
        error,
        reset,
        isApproved,
        needsApproval,
    };
}
