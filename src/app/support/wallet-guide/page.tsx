'use client';

import Link from 'next/link';

export default function WalletGuidePage() {
    return (
        <>
            <div className="guide-container">
                <div className="guide-content">
                    <Link href="/" className="back-link">
                        ← 홈으로 돌아가기
                    </Link>

                    <h1 className="guide-title">Web3 지갑 가이드</h1>
                    <p className="guide-subtitle">
                        암호화폐 지갑을 처음 사용하시나요? 걱정하지 마세요!<br />
                        아래 가이드를 따라 쉽게 시작할 수 있습니다.
                    </p>

                    {/* What is Web3 Wallet */}
                    <section className="guide-section">
                        <h2 className="section-title">🔐 Web3 지갑이란?</h2>
                        <p className="section-text">
                            Web3 지갑은 디지털 자산(암호화폐, NFT 등)을 안전하게 보관하고
                            블록체인 기반 서비스와 상호작용할 수 있게 해주는 도구입니다.
                        </p>
                        <div className="info-box">
                            <h4>💡 일반 은행 계좌와의 차이점</h4>
                            <ul>
                                <li>중앙 기관 없이 본인이 직접 자산을 관리합니다</li>
                                <li>비밀번호 대신 &quot;시드 문구(복구 문구)&quot;로 접근합니다</li>
                                <li>전 세계 어디서나 24시간 사용 가능합니다</li>
                            </ul>
                        </div>
                    </section>

                    {/* MetaMask Guide */}
                    <section className="guide-section">
                        <h2 className="section-title">🦊 MetaMask 설치하기</h2>
                        <p className="section-text">
                            MetaMask는 가장 널리 사용되는 Web3 지갑입니다.
                            Chrome, Firefox, Brave 등 주요 브라우저에서 확장 프로그램으로 설치할 수 있습니다.
                        </p>

                        <div className="steps-container">
                            <div className="step">
                                <span className="step-number">1</span>
                                <div className="step-content">
                                    <h4>확장 프로그램 설치</h4>
                                    <p>
                                        <a
                                            href="https://metamask.io/download/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="external-link"
                                        >
                                            MetaMask 공식 사이트
                                        </a>
                                        에서 브라우저에 맞는 확장 프로그램을 설치하세요.
                                    </p>
                                </div>
                            </div>

                            <div className="step">
                                <span className="step-number">2</span>
                                <div className="step-content">
                                    <h4>지갑 생성</h4>
                                    <p>
                                        &quot;새 지갑 만들기&quot;를 선택하고 비밀번호를 설정하세요.
                                    </p>
                                </div>
                            </div>

                            <div className="step">
                                <span className="step-number">3</span>
                                <div className="step-content">
                                    <h4>시드 문구 백업</h4>
                                    <p>
                                        12개의 영어 단어로 된 시드 문구를 안전한 곳에 적어두세요.
                                        <strong> 이 문구는 절대 온라인에 저장하거나 다른 사람에게 공유하지 마세요!</strong>
                                    </p>
                                </div>
                            </div>

                            <div className="step">
                                <span className="step-number">4</span>
                                <div className="step-content">
                                    <h4>완료!</h4>
                                    <p>
                                        이제 EL SOFT에서 &quot;지갑 연결&quot; 버튼을 클릭해 시작하세요.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Security Tips */}
                    <section className="guide-section">
                        <h2 className="section-title">🛡️ 보안 주의사항</h2>
                        <div className="warning-box">
                            <h4>⚠️ 절대 하지 말아야 할 것</h4>
                            <ul>
                                <li>시드 문구(복구 문구)를 누구에게도 알려주지 마세요</li>
                                <li>시드 문구를 온라인(이메일, 클라우드, 메모앱 등)에 저장하지 마세요</li>
                                <li>의심스러운 사이트에서 지갑을 연결하지 마세요</li>
                                <li>모르는 토큰이나 NFT를 클릭하거나 승인하지 마세요</li>
                            </ul>
                        </div>

                        <div className="tip-box">
                            <h4>✅ 안전한 사용 팁</h4>
                            <ul>
                                <li>시드 문구는 종이에 적어 안전한 곳에 보관하세요</li>
                                <li>큰 금액은 하드웨어 지갑(Ledger, Trezor 등)에 보관하세요</li>
                                <li>공식 사이트 URL을 항상 확인하세요</li>
                                <li>거래 승인 전 내용을 꼼꼼히 확인하세요</li>
                            </ul>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section className="guide-section">
                        <h2 className="section-title">❓ 자주 묻는 질문</h2>

                        <div className="faq-item">
                            <h4>가스비(Gas Fee)란 무엇인가요?</h4>
                            <p>
                                블록체인 네트워크에서 거래를 처리하는 데 필요한 수수료입니다.
                                네트워크 혼잡도에 따라 변동되며, 거래 시 자동으로 계산됩니다.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>USDC란 무엇인가요?</h4>
                            <p>
                                미국 달러와 1:1로 연동된 스테이블코인입니다.
                                1 USDC = 1 USD의 가치를 유지하도록 설계되어 있어 가격 변동이 거의 없습니다.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>거래가 실패하면 어떻게 되나요?</h4>
                            <p>
                                거래가 실패해도 가스비 외에 다른 자산은 손실되지 않습니다.
                                잔액이 부족하거나 네트워크 문제로 실패할 수 있으니 다시 시도해 보세요.
                            </p>
                        </div>
                    </section>

                    <div className="guide-footer">
                        <p>더 궁금한 점이 있으시면 고객지원으로 문의해 주세요.</p>
                        <Link href="/support" className="support-link">
                            고객지원 바로가기 →
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .guide-container {
                    min-height: 100vh;
                    background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
                    padding: 2rem 1rem 4rem;
                }
                .guide-content {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .back-link {
                    display: inline-block;
                    color: #64748b;
                    text-decoration: none;
                    margin-bottom: 2rem;
                    transition: color 0.2s;
                }
                .back-link:hover {
                    color: #94a3b8;
                }
                .guide-title {
                    font-size: 2.5rem;
                    font-weight: 900;
                    color: #fff;
                    margin-bottom: 1rem;
                }
                .guide-subtitle {
                    font-size: 1.1rem;
                    color: #94a3b8;
                    line-height: 1.8;
                    margin-bottom: 3rem;
                }
                .guide-section {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 16px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                }
                .section-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 1rem;
                }
                .section-text {
                    color: #cbd5e1;
                    line-height: 1.8;
                    margin-bottom: 1.5rem;
                }
                .info-box, .tip-box {
                    background: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-top: 1rem;
                }
                .info-box h4, .tip-box h4 {
                    color: #60a5fa;
                    margin-bottom: 0.75rem;
                }
                .warning-box {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                }
                .warning-box h4 {
                    color: #f87171;
                    margin-bottom: 0.75rem;
                }
                .info-box ul, .warning-box ul, .tip-box ul {
                    color: #e2e8f0;
                    padding-left: 1.5rem;
                    margin: 0;
                }
                .info-box li, .warning-box li, .tip-box li {
                    margin-bottom: 0.5rem;
                    line-height: 1.6;
                }
                .steps-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                .step {
                    display: flex;
                    gap: 1rem;
                    align-items: flex-start;
                }
                .step-number {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #1d4ed8, #3b82f6);
                    border-radius: 50%;
                    color: #fff;
                    font-weight: 700;
                    flex-shrink: 0;
                }
                .step-content h4 {
                    color: #fff;
                    margin-bottom: 0.25rem;
                }
                .step-content p {
                    color: #94a3b8;
                    margin: 0;
                    line-height: 1.6;
                }
                .external-link {
                    color: #60a5fa;
                    text-decoration: underline;
                }
                .external-link:hover {
                    color: #93c5fd;
                }
                .faq-item {
                    padding: 1.25rem 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                }
                .faq-item:last-child {
                    border-bottom: none;
                    padding-bottom: 0;
                }
                .faq-item h4 {
                    color: #f1f5f9;
                    margin-bottom: 0.5rem;
                }
                .faq-item p {
                    color: #94a3b8;
                    margin: 0;
                    line-height: 1.7;
                }
                .guide-footer {
                    text-align: center;
                    padding-top: 2rem;
                    color: #64748b;
                }
                .support-link {
                    display: inline-block;
                    margin-top: 1rem;
                    padding: 0.75rem 1.5rem;
                    background: rgba(59, 130, 246, 0.15);
                    border: 1px solid rgba(59, 130, 246, 0.3);
                    border-radius: 10px;
                    color: #60a5fa;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .support-link:hover {
                    background: rgba(59, 130, 246, 0.25);
                    transform: translateY(-1px);
                }
                @media (max-width: 640px) {
                    .guide-title {
                        font-size: 1.75rem;
                    }
                    .guide-section {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </>
    );
}
