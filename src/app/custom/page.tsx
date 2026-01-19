'use client';

import { useState, FormEvent, useRef } from 'react';
import { Upload, CheckCircle, X, FileText, Link as LinkIcon } from 'lucide-react';

export default function CustomPage() {
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        clientType: 'company', // 'company' or 'individual'
        company: '',
        email: '',
        phone: '',
        projectName: '', // 프로젝트명
        supportType: '', // 지원사업
        os: [] as string[],
        userCount: '', // 예상 사용자 수
        budget: '', // 예상 예산
        timeline: '즉시', // 희망 시작
        features: '',
        otherNotes: '', // 기타 제안
        referenceUrl: '',
        agree: false,
    });
    const [referenceFile, setReferenceFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (formData.clientType === 'company' && !formData.company) {
            newErrors.company = '회사/기관명을 입력하세요.';
        }
        if (!formData.email) newErrors.email = '이메일을 입력하세요.';
        if (formData.os.length === 0) newErrors.os = '하나 이상의 OS를 선택하세요.';
        if (!formData.userCount) newErrors.userCount = '예상 사용자 수를 입력하세요.';
        if (!formData.features) newErrors.features = '필수 기능을 입력하세요.';
        if (!formData.agree) newErrors.agree = '개인정보 수집에 동의해주세요.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const sendToWebhook = async (data: typeof formData) => {
        const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || '';
        const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || '';

        const message = `
🆕 새로운 맞춤 프로그램 신청!

👤 유형: ${data.clientType === 'individual' ? '개인' : '기업/기관'}
🏢 ${data.clientType === 'individual' ? '이름' : '회사명'}: ${data.company || '미입력'}
📧 이메일: ${data.email}
📞 연락처: ${data.phone || '미입력'}
📁 프로젝트명: ${data.projectName || '미입력'}
🏛️ 지원사업: ${data.supportType || '선택 안함'}
💻 대상 OS: ${data.os.join(', ')}
👥 예상 사용자: ${data.userCount}명
💰 예상 예산: ${data.budget || '미정'}원
📅 희망 시작: ${data.timeline}
🔗 참고자료: ${data.referenceUrl || '없음'}
📎 첨부파일: ${referenceFile ? referenceFile.name : '없음'}

📝 요구사항:
${data.features}

💬 기타 제안:
${data.otherNotes || '없음'}
    `.trim();

        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
            try {
                await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: message,
                        parse_mode: 'HTML',
                    }),
                });
            } catch (error) {
                console.error('Telegram notification failed:', error);
            }
        }

        const DISCORD_WEBHOOK = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK || '';
        if (DISCORD_WEBHOOK) {
            try {
                await fetch(DISCORD_WEBHOOK, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: message }),
                });
            } catch (error) {
                console.error('Discord notification failed:', error);
            }
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await sendToWebhook(formData);
            setSubmitted(true);
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOsChange = (value: string, checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            os: checked ? [...prev.os, value] : prev.os.filter((v) => v !== value),
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('파일 크기는 10MB를 초과할 수 없습니다.');
                return;
            }
            setReferenceFile(file);
        }
    };

    const handleReset = () => {
        setFormData({
            clientType: 'company',
            company: '',
            email: '',
            phone: '',
            projectName: '',
            supportType: '',
            os: [],
            userCount: '',
            budget: '',
            timeline: '즉시',
            features: '',
            otherNotes: '',
            referenceUrl: '',
            agree: false,
        });
        setReferenceFile(null);
        setErrors({});
        setSubmitted(false);
    };

    // Success Modal
    if (submitted) {
        return (
            <main className="page">
                <div className="success-modal-overlay">
                    <div className="success-modal">
                        <div className="success-icon">
                            <CheckCircle size={64} />
                        </div>
                        <h2>제출 완료!</h2>
                        <p>신청서가 성공적으로 제출되었습니다.</p>
                        <p className="sub-text">검토 후 연락 드리겠습니다.</p>
                        <button className="b-submit" onClick={handleReset}>
                            새 신청서 작성
                        </button>
                    </div>
                </div>
                <style jsx>{`
          .success-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            padding: 1rem;
          }
          .success-modal {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 24px;
            padding: 3rem 2rem;
            text-align: center;
            max-width: 400px;
            width: 100%;
            animation: fadeIn 0.3s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .success-icon {
            color: #10b981;
            margin-bottom: 1.5rem;
          }
          .success-modal h2 {
            font-size: 1.75rem;
            font-weight: 900;
            color: #fff;
            margin-bottom: 0.5rem;
          }
          .success-modal p {
            color: #94a3b8;
            font-size: 1rem;
            margin-bottom: 0.25rem;
          }
          .success-modal .sub-text {
            color: #10b981;
            font-weight: 600;
            margin-bottom: 2rem;
          }
        `}</style>
            </main>
        );
    }

    return (
        <main className="page" style={{ paddingTop: 'calc(64px + 1.5rem)' }}>
            <section className="form">
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '.5rem 0 1.5rem' }}>
                    맞춤 프로그램 신청서
                </h1>

                <form className="form-grid" onSubmit={handleSubmit} noValidate>
                    {/* 고객 유형 */}
                    <div className="field full">
                        <label>고객 유형 *</label>
                        <div className="client-type-toggle">
                            <button
                                type="button"
                                className={`toggle-btn ${formData.clientType === 'company' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, clientType: 'company' })}
                            >
                                🏢 기업/기관
                            </button>
                            <button
                                type="button"
                                className={`toggle-btn ${formData.clientType === 'individual' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, clientType: 'individual' })}
                            >
                                👤 개인
                            </button>
                        </div>
                    </div>

                    {/* 회사명 + 이메일 + 연락처 */}
                    <div className="field third">
                        <label htmlFor="company">
                            {formData.clientType === 'individual' ? '성함' : '회사/기관명'}
                            {formData.clientType === 'company' && ' *'}
                        </label>
                        <input
                            id="company"
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            placeholder={formData.clientType === 'individual' ? '홍길동' : '예) EL 소프트 주식회사'}
                            className={errors.company ? 'error' : ''}
                        />
                        {errors.company && <div className="errmsg">{errors.company}</div>}
                    </div>

                    <div className="field third">
                        <label htmlFor="email">이메일 *</label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="name@company.com"
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <div className="errmsg">{errors.email}</div>}
                    </div>

                    <div className="field third">
                        <label htmlFor="phone">연락처</label>
                        <input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="010-0000-0000"
                        />
                    </div>

                    {/* 프로젝트명 + 지원사업 */}
                    <div className="field half">
                        <label htmlFor="projectName">프로젝트명</label>
                        <input
                            id="projectName"
                            type="text"
                            value={formData.projectName}
                            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                            placeholder="예) 사내 ERP 시스템 구축"
                        />
                    </div>

                    <div className="field half">
                        <label htmlFor="supportType">지원사업</label>
                        <select
                            id="supportType"
                            value={formData.supportType}
                            onChange={(e) => setFormData({ ...formData, supportType: e.target.value })}
                        >
                            <option value="">선택 없음</option>
                            <option value="바우처">데이터 바우처</option>
                            <option value="스마트공장">스마트공장</option>
                            <option value="창업지원">창업지원사업</option>
                            <option value="RnD">R&D 지원</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>

                    {/* OS/플랫폼 */}
                    <div className="field full">
                        <label>대상 OS/플랫폼 *(하나 이상)</label>
                        <div className="checkgrid">
                            {['Windows', 'macOS', 'Linux', 'iOS', 'Android', 'Web'].map((os) => (
                                <label key={os} className="os-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={formData.os.includes(os)}
                                        onChange={(e) => handleOsChange(os, e.target.checked)}
                                    />
                                    {os}
                                </label>
                            ))}
                        </div>
                        {errors.os && <div className="errmsg">{errors.os}</div>}
                    </div>

                    {/* 예상 사용자 수 + 예상 예산 + 희망 시작 */}
                    <div className="field third">
                        <label htmlFor="userCount">예상 사용자 수 *</label>
                        <input
                            id="userCount"
                            type="number"
                            min="1"
                            value={formData.userCount}
                            onChange={(e) => setFormData({ ...formData, userCount: e.target.value })}
                            placeholder="예) 25"
                            className={errors.userCount ? 'error' : ''}
                        />
                        {errors.userCount && <div className="errmsg">{errors.userCount}</div>}
                    </div>

                    <div className="field third">
                        <label htmlFor="budget">예상 예산(원)</label>
                        <input
                            id="budget"
                            type="text"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            placeholder="예) 3000000"
                        />
                    </div>

                    <div className="field third">
                        <label htmlFor="timeline">희망 시작</label>
                        <select
                            id="timeline"
                            value={formData.timeline}
                            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        >
                            <option value="즉시">즉시</option>
                            <option value="1개월 이내">1개월 이내</option>
                            <option value="3개월 이내">3개월 이내</option>
                            <option value="6개월 이내">6개월 이내</option>
                            <option value="미정">미정</option>
                        </select>
                    </div>

                    {/* 필수 기능/요구사항 */}
                    <div className="field full">
                        <label htmlFor="features">필수 기능/요구사항 *</label>
                        <textarea
                            id="features"
                            value={formData.features}
                            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                            placeholder="핵심 기능, 필수 정책/규정, 성능/보안 요구 등"
                            className={errors.features ? 'error' : ''}
                            rows={4}
                        />
                        {errors.features && <div className="errmsg">{errors.features}</div>}
                    </div>

                    {/* 기타 제안 */}
                    <div className="field full">
                        <label htmlFor="otherNotes">기타 제안(선택)</label>
                        <textarea
                            id="otherNotes"
                            value={formData.otherNotes}
                            onChange={(e) => setFormData({ ...formData, otherNotes: e.target.value })}
                            placeholder="기타 언급하실 내용이 있다면 적어주세요"
                            rows={3}
                        />
                    </div>

                    {/* 참고 URL */}
                    <div className="field full">
                        <label htmlFor="referenceUrl">
                            <LinkIcon size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            참고 사이트 URL
                        </label>
                        <input
                            id="referenceUrl"
                            type="url"
                            value={formData.referenceUrl}
                            onChange={(e) => setFormData({ ...formData, referenceUrl: e.target.value })}
                            placeholder="https://example.com (참고할 사이트나 예시 링크)"
                        />
                    </div>

                    {/* 파일 업로드 */}
                    <div className="field full">
                        <label>
                            <FileText size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            참고 파일 첨부(선택)
                        </label>
                        <div className="file-upload-area" onClick={() => fileInputRef.current?.click()}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.png,.jpg,.jpeg"
                                style={{ display: 'none' }}
                            />
                            {referenceFile ? (
                                <div className="file-selected">
                                    <FileText size={20} />
                                    <span>{referenceFile.name}</span>
                                    <button
                                        type="button"
                                        className="remove-file"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setReferenceFile(null);
                                        }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="file-placeholder">
                                    <Upload size={24} />
                                    <span>클릭하여 파일 업로드</span>
                                    <span className="file-hint">PDF, DOC, PPT, 이미지 등 (최대 10MB)</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 동의 */}
                    <div className="field full">
                        <label className="agree">
                            <input
                                type="checkbox"
                                checked={formData.agree}
                                onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                            />
                            개인정보 수집·이용에 동의합니다. <a href="#" style={{ color: '#60a5fa' }}>자세히</a>
                        </label>
                        {errors.agree && <div className="errmsg">{errors.agree}</div>}
                    </div>

                    {/* 버튼 */}
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
                            disabled={isSubmitting}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            {isSubmitting ? '제출 중...' : '신청서 제출'}
                        </button>
                    </div>
                </form>
            </section>

            <style jsx>{`
        .client-type-toggle {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .toggle-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.95rem;
        }
        .toggle-btn:hover {
          background: rgba(255, 255, 255, 0.06);
        }
        .toggle-btn.active {
          background: linear-gradient(135deg, #1d4ed8, #7c3aed);
          border-color: transparent;
          color: #fff;
          font-weight: 600;
        }
        .file-upload-area {
          border: 2px dashed rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: rgba(255, 255, 255, 0.02);
        }
        .file-upload-area:hover {
          border-color: rgba(29, 78, 216, 0.5);
          background: rgba(29, 78, 216, 0.05);
        }
        .file-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
        }
        .file-hint {
          font-size: 0.75rem;
          color: #475569;
        }
        .file-selected {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          color: #10b981;
        }
        .remove-file {
          background: rgba(239, 68, 68, 0.1);
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ef4444;
          cursor: pointer;
        }
        .remove-file:hover {
          background: rgba(239, 68, 68, 0.2);
        }
        .b-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        #referenceUrl {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #fff;
        }
        #referenceUrl::placeholder {
          color: #64748b;
        }
        .field.half {
          grid-column: span 6;
        }
        @media (max-width: 768px) {
          .field.half {
            grid-column: 1 / -1;
          }
        }
      `}</style>
        </main>
    );
}
