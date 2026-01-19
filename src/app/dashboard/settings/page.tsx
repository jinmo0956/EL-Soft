'use client';

import { useAccount } from 'wagmi';
import { User, Bell, Shield, Palette, Copy } from 'lucide-react';

export default function SettingsPage() {
    const { address } = useAccount();

    const shortAddress = address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : '연결되지 않음';

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address);
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="header-left">
                    <h1 className="header-title">설정</h1>
                </div>
            </header>

            <div className="page-content">
                <p className="page-description">계정 및 앱 설정을 관리하세요</p>

                {/* Profile Settings */}
                <div className="settings-section">
                    <div className="settings-header">
                        <div className="settings-icon">
                            <User size={20} />
                        </div>
                        <div>
                            <div className="settings-title">프로필</div>
                            <div className="settings-description">기본 프로필 정보를 관리합니다</div>
                        </div>
                    </div>
                    <div className="settings-content">
                        <div className="setting-item">
                            <div>
                                <div className="setting-label">표시 이름</div>
                                <div className="setting-sublabel">사용자</div>
                            </div>
                            <button className="btn btn-secondary btn-sm">수정</button>
                        </div>
                        <div className="setting-item">
                            <div>
                                <div className="setting-label">지갑 주소</div>
                                <div className="setting-sublabel mono">{shortAddress}</div>
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={copyAddress}>
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Appearance Settings */}
                <div className="settings-section">
                    <div className="settings-header">
                        <div className="settings-icon">
                            <Palette size={20} />
                        </div>
                        <div>
                            <div className="settings-title">외관</div>
                            <div className="settings-description">앱의 외관을 사용자화합니다</div>
                        </div>
                    </div>
                    <div className="settings-content">
                        <div className="setting-item">
                            <div>
                                <div className="setting-label">테마</div>
                                <div className="setting-sublabel">현재: 다크 모드</div>
                            </div>
                            <button className="theme-toggle">
                                <span className="toggle-text">다크</span>
                            </button>
                        </div>
                        <div className="setting-item">
                            <div>
                                <div className="setting-label">언어</div>
                                <div className="setting-sublabel">한국어</div>
                            </div>
                            <select className="filter-select" disabled>
                                <option value="ko">한국어</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="settings-section">
                    <div className="settings-header">
                        <div className="settings-icon">
                            <Shield size={20} />
                        </div>
                        <div>
                            <div className="settings-title">보안</div>
                            <div className="settings-description">계정 보안 설정을 관리합니다</div>
                        </div>
                    </div>
                    <div className="settings-content">
                        <div className="setting-item">
                            <div>
                                <div className="setting-label">2단계 인증</div>
                                <div className="setting-sublabel">추가 보안을 위한 2FA 설정</div>
                            </div>
                            <button className="btn btn-secondary btn-sm">설정</button>
                        </div>
                        <div className="setting-item">
                            <div>
                                <div className="setting-label">세션 관리</div>
                                <div className="setting-sublabel">다른 기기에서 로그아웃</div>
                            </div>
                            <button className="btn btn-danger btn-sm">모두 로그아웃</button>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="settings-section">
                    <div className="settings-header">
                        <div className="settings-icon">
                            <Bell size={20} />
                        </div>
                        <div>
                            <div className="settings-title">알림</div>
                            <div className="settings-description">알림 수신 설정을 관리합니다</div>
                        </div>
                    </div>
                    <div className="settings-content">
                        <div className="setting-item">
                            <div>
                                <div className="setting-label">이메일 알림</div>
                                <div className="setting-sublabel">구매 및 판매 알림 수신</div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" defaultChecked />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <div>
                                <div className="setting-label">마케팅 알림</div>
                                <div className="setting-sublabel">프로모션 및 이벤트 정보 수신</div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .page-container {
                    min-height: 100vh;
                    background: #0a0a0b;
                    color: #f5f5f5;
                }
                .page-header {
                    position: sticky;
                    top: 0;
                    height: 60px;
                    background: rgba(10, 10, 11, 0.9);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid #1f1f22;
                    display: flex;
                    align-items: center;
                    padding: 0 2rem;
                    z-index: 50;
                }
                .header-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                .page-content {
                    padding: 2rem;
                    max-width: 800px;
                }
                .page-description {
                    color: #9ca3af;
                    margin-bottom: 2rem;
                }
                .settings-section {
                    background: #1a1a1d;
                    border: 1px solid #1f1f22;
                    border-radius: 16px;
                    margin-bottom: 1.5rem;
                    overflow: hidden;
                }
                .settings-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid #1f1f22;
                    background: #161618;
                }
                .settings-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(16, 185, 129, 0.12);
                    color: #10b981;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .settings-title {
                    font-weight: 600;
                    margin-bottom: 0.125rem;
                }
                .settings-description {
                    font-size: 0.875rem;
                    color: #6b7280;
                }
                .settings-content {
                    padding: 0.5rem 0;
                }
                .setting-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 1.5rem;
                    transition: background 0.15s ease;
                }
                .setting-item:hover {
                    background: rgba(255, 255, 255, 0.02);
                }
                .setting-label {
                    font-weight: 500;
                    margin-bottom: 0.125rem;
                }
                .setting-sublabel {
                    font-size: 0.875rem;
                    color: #6b7280;
                }
                .setting-sublabel.mono {
                    font-family: 'JetBrains Mono', monospace;
                }
                .filter-select {
                    padding: 0.5rem 1rem;
                    background: #222225;
                    border: 1px solid #1f1f22;
                    border-radius: 8px;
                    color: #f5f5f5;
                    font-size: 0.875rem;
                    cursor: pointer;
                }
                .filter-select:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .theme-toggle {
                    padding: 0.5rem 1rem;
                    background: #222225;
                    border: 1px solid #1f1f22;
                    border-radius: 8px;
                    color: #f5f5f5;
                    font-size: 0.875rem;
                    cursor: pointer;
                }
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 48px;
                    height: 26px;
                }
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: #3f3f46;
                    border-radius: 26px;
                    transition: 0.3s;
                }
                .toggle-slider::before {
                    content: '';
                    position: absolute;
                    height: 20px;
                    width: 20px;
                    left: 3px;
                    bottom: 3px;
                    background: white;
                    border-radius: 50%;
                    transition: 0.3s;
                }
                .toggle-switch input:checked + .toggle-slider {
                    background: #10b981;
                }
                .toggle-switch input:checked + .toggle-slider::before {
                    transform: translateX(22px);
                }
            `}</style>

            <style jsx global>{`
                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.625rem 1.25rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    border-radius: 12px;
                    transition: all 0.15s ease;
                    border: none;
                    cursor: pointer;
                }
                .btn-secondary {
                    background: #222225;
                    color: #f5f5f5;
                    border: 1px solid #1f1f22;
                }
                .btn-ghost {
                    background: transparent;
                    color: #9ca3af;
                }
                .btn-ghost:hover {
                    background: #222225;
                    color: #f5f5f5;
                }
                .btn-danger {
                    background: #ef4444;
                    color: white;
                }
                .btn-sm {
                    padding: 0.5rem 0.875rem;
                    font-size: 0.8125rem;
                }
            `}</style>
        </div>
    );
}
