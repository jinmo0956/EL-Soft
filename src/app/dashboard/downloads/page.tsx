'use client';

import { Download, CheckCircle, Package } from 'lucide-react';

// Mock data
const downloads = [
    { id: '1', name: 'JetBrains All Products Pack', version: '2026.1', size: '2.3 GB', status: 'ready' },
];

export default function DownloadsPage() {
    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                    다운로드
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>
                    구매한 소프트웨어를 다운로드하세요
                </p>
            </div>

            {downloads.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <Package size={48} color="rgba(255,255,255,0.3)" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>다운로드 가능한 항목이 없습니다</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {downloads.map((item) => (
                        <div key={item.id} className="glass-card" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <CheckCircle size={24} color="#fff" />
                                </div>
                                <div>
                                    <p style={{ color: '#fff', fontWeight: 600 }}>{item.name}</p>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
                                        버전 {item.version} · {item.size}
                                    </p>
                                </div>
                            </div>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#fff',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}>
                                <Download size={18} />
                                다운로드
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
