
import { http, createConfig, cookieStorage, createStorage } from 'wagmi';
import { mainnet, polygon, arbitrum, polygonAmoy } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
    metaMaskWallet,
    coinbaseWallet,
    okxWallet,
    phantomWallet,
} from '@rainbow-me/rainbowkit/wallets';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

const connectors = typeof window !== 'undefined' ? connectorsForWallets(
    [
        {
            groupName: '지갑 선택',
            wallets: [
                metaMaskWallet,
                coinbaseWallet,
                okxWallet,
                phantomWallet,
            ],
        },
    ],
    {
        appName: 'EL SOFT',
        projectId,
    }
) : [];

export const config = createConfig({
    chains: [mainnet, polygon, arbitrum, polygonAmoy],
    transports: {
        [mainnet.id]: http(),
        [polygon.id]: http(),
        [arbitrum.id]: http(),
        [polygonAmoy.id]: http(),
    },
    connectors,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
});
