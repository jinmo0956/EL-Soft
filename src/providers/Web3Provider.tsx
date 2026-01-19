'use client';

import {
    RainbowKitProvider,
    darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, State } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomAvatar } from '@/components/CustomAvatar';
import { config } from '@/lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

export function Web3Provider({
    children,
    initialState
}: {
    children: React.ReactNode;
    initialState?: State;
}) {
    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    avatar={CustomAvatar}
                    theme={darkTheme({
                        accentColor: '#1d4ed8',
                        accentColorForeground: 'white',
                        borderRadius: 'medium',
                        fontStack: 'system',
                    })}
                    locale="ko"
                    appInfo={{
                        appName: 'EL SOFT',
                        learnMoreUrl: '/support/wallet-guide',
                    }}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
