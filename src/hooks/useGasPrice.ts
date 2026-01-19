'use client';

import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { formatGwei } from 'viem';

interface GasPriceData {
    gasPrice: bigint | null;
    gasPriceGwei: string;
    estimatedCostMatic: string;
    estimatedCostUsd: string;
    loading: boolean;
    error: string | null;
}

// Simple gas estimation (approx 100k gas for ERC20 transfer)
const ESTIMATED_GAS_UNITS = BigInt(100000);
const MATIC_USD_PRICE = 0.5; // Approximate, should fetch from API in production

export function useGasPrice(): GasPriceData {
    const publicClient = usePublicClient();
    const [data, setData] = useState<GasPriceData>({
        gasPrice: null,
        gasPriceGwei: '0',
        estimatedCostMatic: '0',
        estimatedCostUsd: '0',
        loading: true,
        error: null,
    });

    useEffect(() => {
        let mounted = true;

        const fetchGasPrice = async () => {
            if (!publicClient) {
                setData((prev) => ({ ...prev, loading: false, error: 'No client' }));
                return;
            }

            try {
                const gasPrice = await publicClient.getGasPrice();

                if (!mounted) return;

                const gasPriceGwei = formatGwei(gasPrice);
                const estimatedCostWei = gasPrice * ESTIMATED_GAS_UNITS;
                const estimatedCostMatic = Number(estimatedCostWei) / 1e18;
                const estimatedCostUsd = estimatedCostMatic * MATIC_USD_PRICE;

                setData({
                    gasPrice,
                    gasPriceGwei: parseFloat(gasPriceGwei).toFixed(2),
                    estimatedCostMatic: estimatedCostMatic.toFixed(6),
                    estimatedCostUsd: estimatedCostUsd.toFixed(4),
                    loading: false,
                    error: null,
                });
            } catch (err) {
                if (mounted) {
                    setData((prev) => ({
                        ...prev,
                        loading: false,
                        error: err instanceof Error ? err.message : 'Failed to fetch gas price',
                    }));
                }
            }
        };

        fetchGasPrice();

        // Refresh every 15 seconds
        const interval = setInterval(fetchGasPrice, 15000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [publicClient]);

    return data;
}
