'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Shield, User, Mail, Lock, Save } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useToast } from '../components/Toast';

export default function Settings() {
    const { addToast } = useToast();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem('admin-theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (newMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('admin-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('admin-theme', 'light');
        }
    };

    const handleSave = () => {
        addToast({
            type: 'success',
            title: '설정 저장됨',
            message: '변경사항이 성공적으로 저장되었습니다.'
        });
    };

    const SettingCard = ({
        icon: Icon,
        title,
        description,
        children
    }: {
        icon: typeof Moon;
        title: string;
        description: string;
        children: React.ReactNode;
    }) => (
        <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--bg-input)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                }}>
                    <Icon size={24} />
                </div>
                <div>
                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '4px'
                    }}>{title}</h3>
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--text-secondary)'
                    }}>{description}</p>
                </div>
            </div>
            {children}
        </div>
    );

    const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
        <button
            onClick={onChange}
            style={{
                width: '52px',
                height: '28px',
                borderRadius: '14px',
                background: enabled ? 'var(--primary)' : 'var(--bg-input)',
                position: 'relative',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
            }}
        >
            <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '11px',
                background: 'white',
                position: 'absolute',
                top: '3px',
                left: enabled ? '27px' : '3px',
                transition: 'left 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}></div>
        </button>
    );

    return (
        <div className="page-container">
            <Navbar title="설정" />

            <div className="page-content" style={{ maxWidth: '800px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* 외관 설정 */}
                    <h2 style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '8px'
                    }}>외관</h2>

                    <SettingCard
                        icon={isDarkMode ? Moon : Sun}
                        title="다크 모드"
                        description="어두운 테마를 사용하여 눈의 피로를 줄입니다"
                    >
                        <Toggle enabled={isDarkMode} onChange={toggleDarkMode} />
                    </SettingCard>

                    {/* 알림 설정 */}
                    <h2 style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginTop: '24px',
                        marginBottom: '8px'
                    }}>알림</h2>

                    <SettingCard
                        icon={Mail}
                        title="이메일 알림"
                        description="중요한 업데이트를 이메일로 받습니다"
                    >
                        <Toggle enabled={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
                    </SettingCard>

                    <SettingCard
                        icon={Bell}
                        title="푸시 알림"
                        description="실시간 알림을 받습니다"
                    >
                        <Toggle enabled={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
                    </SettingCard>

                    {/* 보안 설정 */}
                    <h2 style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginTop: '24px',
                        marginBottom: '8px'
                    }}>보안</h2>

                    <SettingCard
                        icon={Shield}
                        title="2단계 인증"
                        description="계정 보안을 강화합니다"
                    >
                        <button style={{
                            padding: '10px 20px',
                            borderRadius: '10px',
                            background: 'var(--bg-input)',
                            color: 'var(--text-primary)',
                            fontSize: '14px',
                            fontWeight: 500,
                            border: 'none',
                            cursor: 'pointer'
                        }}>
                            설정
                        </button>
                    </SettingCard>

                    <SettingCard
                        icon={Lock}
                        title="비밀번호 변경"
                        description="계정 비밀번호를 업데이트합니다"
                    >
                        <button style={{
                            padding: '10px 20px',
                            borderRadius: '10px',
                            background: 'var(--bg-input)',
                            color: 'var(--text-primary)',
                            fontSize: '14px',
                            fontWeight: 500,
                            border: 'none',
                            cursor: 'pointer'
                        }}>
                            변경
                        </button>
                    </SettingCard>

                    {/* 저장 버튼 */}
                    <div style={{ marginTop: '24px' }}>
                        <button
                            onClick={handleSave}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            <Save size={18} />
                            변경사항 저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
