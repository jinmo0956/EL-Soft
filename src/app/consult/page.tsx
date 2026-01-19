'use client';

import { useState, FormEvent } from 'react';

export default function ConsultPage() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ channel: '', chatId: '', walletAddress: '', note: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Dynamic placeholder based on selected channel
    const getContactPlaceholder = () => {
        switch (formData.channel) {
            case 'kakao':
                return '연락받을 카카오톡 ID';
            case 'telegram':
                return '연락받을 텔레그램 ID (예: @username)';
            case 'discord':
                return '연락받을 디스코드 ID (예: username#1234)';
            default:
                return '연락받을 ID';
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.channel) newErrors.channel = '채널을 선택하세요.';
        if (!formData.chatId) newErrors.chatId = '연락처 ID를 입력하세요.';
        if (!formData.walletAddress) newErrors.walletAddress = '지갑 주소를 입력하세요.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (validate()) setSubmitted(true);
    };

    const handleReset = () => {
        setFormData({ channel: '', chatId: '', walletAddress: '', note: '' });
        setErrors({});
        setSubmitted(false);
    };

    return (
        <main className="page" style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem', paddingTop: 'calc(64px + 1.5rem)' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '.5rem 0 1rem' }}>간편 상담/견적 요청</h1>
            <p className="hint">채널을 선택하고 <b>ID</b>를 남겨주세요. 담당자가 해당 채널로 바로 연락드립니다.</p>

            <form className="form-grid" onSubmit={handleSubmit} noValidate style={{ marginTop: '1rem' }}>
                {/* 상담 채널 - 건들지 않음 */}
                <div className="field third">
                    <label htmlFor="channel">상담 채널</label>
                    <select
                        id="channel"
                        value={formData.channel}
                        onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                        className={errors.channel ? 'error' : ''}
                    >
                        <option value="" disabled>채널을 선택하세요</option>
                        <option value="kakao">카카오톡</option>
                        <option value="telegram">텔레그램</option>
                        <option value="discord">디스코드</option>
                    </select>
                    {errors.channel && <div className="errmsg">{errors.channel}</div>}
                </div>

                {/* 연락처 ID - 동적 placeholder */}
                <div className="field third">
                    <label htmlFor="chatId">연락처 ID *</label>
                    <input
                        id="chatId"
                        type="text"
                        value={formData.chatId}
                        onChange={(e) => setFormData({ ...formData, chatId: e.target.value })}
                        placeholder={getContactPlaceholder()}
                        className={errors.chatId ? 'error' : ''}
                    />
                    {errors.chatId && <div className="errmsg">{errors.chatId}</div>}
                </div>

                {/* 이름 → 지갑 주소 (필수) */}
                <div className="field third">
                    <label htmlFor="walletAddress">지갑 주소 (필수)</label>
                    <input
                        id="walletAddress"
                        type="text"
                        value={formData.walletAddress}
                        onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                        placeholder="0x..."
                        className={errors.walletAddress ? 'error' : ''}
                    />
                    {errors.walletAddress && <div className="errmsg">{errors.walletAddress}</div>}
                </div>

                {/* 요청사항 - 건들지 않음 */}
                <div className="field full">
                    <label htmlFor="note">요청 사항(선택)</label>
                    <textarea
                        id="note"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        placeholder="수량, 기간, 특이사항 등"
                    />
                </div>

                {/* 버튼 - 가로 배치: 초기화 | 보내기 */}
                <div
                    className="actions full"
                    style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '0.75rem' }}
                >
                    <button
                        type="button"
                        className="b-reset"
                        onClick={handleReset}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        초기화
                    </button>
                    <button
                        type="submit"
                        className="b-submit"
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        보내기
                    </button>
                </div>
            </form>

            {submitted && (
                <div className="success" style={{ marginTop: '1rem' }}>
                    <b>상담 요청이 완료되었습니다!</b> 담당자가 곧 연락드리겠습니다.
                </div>
            )}
        </main>
    );
}
