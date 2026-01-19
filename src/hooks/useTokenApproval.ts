'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { ERC20_ABI, getContracts } from '@/lib/contracts';

export type ApprovalStatus = 'idle' | 'checking' | 'needs-approval' | 'approving' | 'approved' | 'error';

interface UseTokenApprovalProps {
    tokenAddress: `0x${string}`;
    spenderAddress: `0x${string}`;
    amount: string;
    decimals?: number;
}

interface UseTokenApprovalReturn {
    status: ApprovalStatus;
    allowance: bigint;
    approve: () => void;
    isApproved: boolean;
    error: string | null;
    txHash: `0x${string}` | undefined;
}

export function useTokenApproval({
    tokenAddress,
    spenderAddress,
    amount,
    decimals = 6, // USDT has 6 decimals
}: UseTokenApprovalProps): UseTokenApprovalReturn {
    const { address } = useAccount();
    const [status, setStatus] = useState<ApprovalStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    const amountBigInt = parseUnits(amount || '0', decimals);

    // Read current allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: address && spenderAddress ? [address, spenderAddress] : undefined,
    });

    // Write contract for approval
    const { writeContract, data: txHash, isPending, isError, error: writeError } = useWriteContract();

    // Wait for transaction
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    // Check if already approved
    useEffect(() => {
        if (!address || !spenderAddress) {
            setStatus('idle');
            return;
        }

        setStatus('checking');

        if (allowance !== undefined) {
            if (allowance >= amountBigInt) {
                setStatus('approved');
            } else {
                setStatus('needs-approval');
            }
        }
    }, [address, spenderAddress, allowance, amountBigInt]);

    // Handle approval states
    useEffect(() => {
        if (isPending) {
            setStatus('approving');
        }
        if (isError && writeError) {
            setStatus('error');
            setError(writeError.message);
        }
    }, [isPending, isError, writeError]);

    // Handle confirmation
    useEffect(() => {
        if (isConfirmed) {
            setStatus('approved');
            refetchAllowance();
        }
    }, [isConfirmed, refetchAllowance]);

    const approve = useCallback(() => {
        if (!address || !spenderAddress) return;

        setError(null);
        writeContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [spenderAddress, amountBigInt],
        });
    }, [address, spenderAddress, tokenAddress, amountBigInt, writeContract]);

    return {
        status,
        allowance: allowance ?? BigInt(0),
        approve,
        isApproved: status === 'approved',
        error,
        txHash,
    };
}
