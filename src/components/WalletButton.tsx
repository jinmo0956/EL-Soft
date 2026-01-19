'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { createOrUpdateUser } from '@/lib/supabase';

export function WalletButton() {
    const { address, isConnected } = useAccount();

    // When wallet connects, create/update user in Supabase
    useEffect(() => {
        if (isConnected && address) {
            createOrUpdateUser(address);
        }
    }, [isConnected, address]);

    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
            }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            style: {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button onClick={openConnectModal} className="btn login">
                                        지갑 연결
                                    </button>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <button onClick={openChainModal} className="btn signup">
                                        잘못된 네트워크
                                    </button>
                                );
                            }

                            return (
                                <div className="wallet-connected">
                                    <button
                                        onClick={openChainModal}
                                        className="chain-button"
                                        title={chain.name}
                                    >
                                        {chain.hasIcon && chain.iconUrl && (
                                            <img
                                                alt={chain.name ?? 'Chain icon'}
                                                src={chain.iconUrl}
                                                className="chain-icon"
                                            />
                                        )}
                                    </button>
                                    <button onClick={openAccountModal} className="btn login">
                                        {account.displayName}
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
}
