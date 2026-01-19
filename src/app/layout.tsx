import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import { config } from '@/lib/wagmi';
import { Web3Provider } from '@/providers/Web3Provider';
import { Header, Footer } from '@/components';
import './globals.css';

export const metadata: Metadata = {
    title: 'EL SOFT · 정품 소프트웨어 스토어',
    description:
        'EL SOFT — 개발자와 기업을 위한 정품 소프트웨어 스토어. 라이선스 즉시 발급, 안전 결제, 신속 지원.',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const initialState = cookieToInitialState(config, (await headers()).get('cookie'));

    return (
        <html lang="ko">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;700;900&family=Roboto+Mono:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <Web3Provider initialState={initialState}>
                    <Header />
                    {children}
                    <Footer />
                </Web3Provider>
            </body>
        </html>
    );
}
