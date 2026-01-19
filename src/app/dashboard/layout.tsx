'use client';

import { Sidebar } from './components';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                {children}
            </main>

            <style jsx>{`
                .dashboard-layout {
                    display: flex;
                    min-height: 100vh;
                    background: #0a0a0b;
                }
                .dashboard-main {
                    flex: 1;
                    margin-left: 240px;
                    min-height: 100vh;
                    padding: 0;
                }
                @media (max-width: 768px) {
                    .dashboard-main {
                        margin-left: 0;
                    }
                }
            `}</style>
        </div>
    );
}
