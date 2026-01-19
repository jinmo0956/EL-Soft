// Contract addresses for different networks
// Note: Payment contracts are only deployed on Polygon currently.
// Other networks show "Coming Soon" in the UI.

export type TokenType = 'usdc' | 'usdt';
export type NetworkType = 'ethereum' | 'polygon' | 'arbitrum';

export interface NetworkConfig {
    chainId: number;
    name: string;
    nativeCurrency: string;
    payment: string; // Payment contract address (empty if not deployed)
    usdc: string;
    usdt: string;
    isDeployed: boolean; // Whether payment contract is deployed
}

export const NETWORKS: Record<NetworkType, NetworkConfig> = {
    polygon: {
        chainId: 137,
        name: 'Polygon',
        nativeCurrency: 'MATIC',
        payment: '0x76C74eBdEc2D90eFFaA21a4f9CB3dc24e9F74d75', // ELSoftPayment (USDC only currently)
        usdc: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // Native USDC (Polygon PoS)
        usdt: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT on Polygon
        isDeployed: true,
    },
    ethereum: {
        chainId: 1,
        name: 'Ethereum',
        nativeCurrency: 'ETH',
        payment: '', // Not deployed yet
        usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on Ethereum
        usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT on Ethereum
        isDeployed: false,
    },
    arbitrum: {
        chainId: 42161,
        name: 'Arbitrum',
        nativeCurrency: 'ETH',
        payment: '', // Not deployed yet
        usdc: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
        usdt: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT on Arbitrum
        isDeployed: false,
    },
};

// Token configurations
export const TOKENS: Record<TokenType, { symbol: string; name: string; decimals: number }> = {
    usdc: { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
    usdt: { symbol: 'USDT', name: 'Tether USD', decimals: 6 },
};

// Legacy: Polygon Amoy Testnet
export const CONTRACTS = {
    polygon: NETWORKS.polygon,
    amoy: {
        chainId: 80002,
        payment: '',
        usdt: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582',
        usdc: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582',
    },
} as const;

// ERC20 Token ABI (minimal for approve and balanceOf)
export const ERC20_ABI = [
    {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
    },
    {
        name: 'allowance',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
    {
        name: 'decimals',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint8' }],
    },
    {
        name: 'symbol',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'string' }],
    },
] as const;

// ELSoftPayment Contract ABI
export const PAYMENT_CONTRACT_ABI = [
    {
        name: 'buyProduct',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'productId', type: 'string' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [],
    },
    {
        name: 'ProductPurchased',
        type: 'event',
        inputs: [
            { name: 'buyer', type: 'address', indexed: true },
            { name: 'productId', type: 'string', indexed: false },
            { name: 'amount', type: 'uint256', indexed: false },
            { name: 'timestamp', type: 'uint256', indexed: false },
        ],
    },
] as const;

// Helper to get network config by chain ID
export function getNetworkByChainId(chainId: number): NetworkConfig | null {
    for (const network of Object.values(NETWORKS)) {
        if (network.chainId === chainId) {
            return network;
        }
    }
    return null;
}

// Helper to get token address for a network
export function getTokenAddress(network: NetworkType, token: TokenType): string {
    return NETWORKS[network][token];
}

// Check if a network+token combination is available for payment
export function isPaymentAvailable(network: NetworkType, token: TokenType): boolean {
    const config = NETWORKS[network];
    // Currently only Polygon + USDC is deployed
    if (network === 'polygon' && token === 'usdc') {
        return config.isDeployed;
    }
    // Other combinations are coming soon
    return false;
}

// Legacy helper (for backward compatibility)
export function getContracts(chainId: number) {
    if (chainId === 137) return CONTRACTS.polygon;
    if (chainId === 80002) return CONTRACTS.amoy;
    return CONTRACTS.polygon; // Default to Polygon
}
