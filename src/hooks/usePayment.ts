'use client';

import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { PAYMENT_CONTRACT_ABI, getContracts } from '@/lib/contracts';

export type PaymentStatus = 'idle' | 'pending' | 'confirming' | 'success' | 'error';

interface UsePaymentProps {
    productId: string;
    amount: string;
    decimals?: number;
}

interface UsePaymentReturn {
    status: PaymentStatus;
    purchase: () => void;
    txHash: `0x${string}` | undefined;
    error: string | null;
    reset: () => void;
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

    const { writeContract, data: txHash, isPending, isError, error: writeError } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    // Update status based on transaction state
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

    const purchase = useCallback(() => {
        if (!address || !contracts.payment) {
            setError('Payment contract not configured');
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
    }, [address, contracts.payment, productId, amountBigInt, writeContract]);

    const reset = useCallback(() => {
        setStatus('idle');
        setError(null);
    }, []);

    return {
        status,
        purchase,
        txHash,
        error,
        reset,
    };
}
