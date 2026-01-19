'use client';

import { AvatarComponent } from '@rainbow-me/rainbowkit';

// Emoji pool for random avatars
const AVATAR_EMOJIS = [
    '🦊', '🐺', '🦁', '🐯', '🐻', '🐨', '🐼', '🦋', '🦄', '🐉',
    '🌟', '💎', '🚀', '⚡', '🔮', '🎮', '🎯', '🎪', '🌈', '🔥',
    '👾', '🤖', '👽', '🎭', '🦸', '🧙', '🥷', '🦹', '🧛', '🧚',
];

// Generate deterministic index from wallet address
function getEmojiFromAddress(address: string): string {
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
        const char = address.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const index = Math.abs(hash) % AVATAR_EMOJIS.length;
    return AVATAR_EMOJIS[index];
}

// Generate background color from address
function getColorFromAddress(address: string): string {
    const colors = [
        '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444',
        '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#84cc16',
    ];
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
        hash = address.charCodeAt(i) + ((hash << 6) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

export const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
    // Use ENS image if available
    if (ensImage) {
        return (
            <img
                src={ensImage}
                width={size}
                height={size}
                style={{ borderRadius: '50%' }}
                alt="ENS Avatar"
            />
        );
    }

    const emoji = getEmojiFromAddress(address || '0x0');
    const bgColor = getColorFromAddress(address || '0x0');
    const fontSize = size * 0.55;

    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: fontSize,
                cursor: 'pointer',
            }}
        >
            {emoji}
        </div>
    );
};
