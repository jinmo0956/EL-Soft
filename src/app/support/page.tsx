'use client';

import { useState, FormEvent } from 'react';
import { MessageCircle, ChevronDown, ChevronUp, Send } from 'lucide-react';

// FAQ 데이터 - 나중에 더 추가 가능
const faqData = [
    {
        q: '라이선스는 이메일로 즉시 발급되나요?',
        a: '예, 결제 승인 즉시 이메일로 라이선스 키가 발급됩니다. 스팸 폴더도 확인해주세요.',
    },
    {
        q: '기업 대량 구매 할인이 있나요?',
        a: '네, 10개 이상 구매 시 수량/기간에 따라 별도 견적을 드립니다. 상담 페이지에서 문의해주세요.',
    },
    {
        q: '환불 규정은 어떻게 되나요?',
        a: '미사용 라이선스는 구매 후 7일 이내 전액 환불 가능합니다. 사용된 라이선스는 환불이 불가합니다.',
    },
    {
        q: 'Web3 지갑 결제는 어떻게 하나요?',
        a: '지갑 연결 버튼을 클릭하여 MetaMask, Coinbase 등의 지갑을 연결한 후 USDT로 결제하시면 됩니다.',
    },
    {
        q: '맞춤 프로그램 제작 기간은 얼마나 걸리나요?',
        a: '프로젝트 규모에 따라 다르지만, 일반적으로 2주~2개월 정도 소요됩니다. 상세 일정은 상담 후 안내드립니다.',
    },
];

// 커뮤니티 Q&A 타입
interface QnAItem {
    id: number;
    question: string;
    answer: string | null;
    walletAddress: string;
    createdAt: string;
}

// 초기 샘플 데이터
const initialQnA: QnAItem[] = [
    {
        id: 1,
        question: 'JetBrains 라이선스가 여러 PC에서 사용 가능한가요?',
        answer: '네, JetBrains All Products Pack은 사용자 기반 라이선스로 동일 사용자가 여러 PC에서 사용 가능합니다.',
        walletAddress: '0x1234...5678',
        createdAt: '2026-01-07',
    },
    {
        id: 2,
        question: 'Polygon 네트워크 외에 다른 체인도 지원하나요?',
        answer: '현재는 Polygon 메인넷을 지원하며, 추후 Arbitrum, Optimism 등 추가 예정입니다.',
        walletAddress: '0xabcd...efgh',
        createdAt: '2026-01-08',
    },
];

export default function SupportPage() {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [qnaList, setQnaList] = useState<QnAItem[]>(initialQnA);
    const [newQuestion, setNewQuestion] = useState('');

    const handleQuestionSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!newQuestion.trim()) return;

        const newItem: QnAItem = {
            id: Date.now(),
            question: newQuestion,
            answer: null, // 아직 답변 없음
            walletAddress: '0xCe...39D5', // 실제로는 연결된 지갑 주소 사용
            createdAt: new Date().toLocaleDateString('ko-KR'),
        };

        setQnaList([newItem, ...qnaList]);
        setNewQuestion('');
    };

    const openTelegram = () => {
        // 사용자의 텔레그램 링크로 변경하세요
        window.open('https://t.me/your_telegram_username', '_blank');
    };

    return (
        <main className="page" style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem', paddingTop: 'calc(64px + 2rem)' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '.5rem 0 1.5rem' }}>지원</h1>

            {/* 빠른 문의 - 텔레그램 버튼 */}
            <div className="support-card telegram-card">
                <div className="card-title">💬 빠른 문의</div>
                <p className="card-desc">실시간 상담을 원하시면 텔레그램으로 연락주세요.</p>
                <button className="telegram-btn" onClick={openTelegram}>
                    <MessageCircle size={20} />
                    텔레그램으로 문의하기
                </button>
            </div>

            {/* FAQ 섹션 */}
            <div className="support-card">
                <div className="card-title">❓ 자주 묻는 질문 (FAQ)</div>
                <div className="faq-list">
                    {faqData.map((item, idx) => (
                        <div key={idx} className="faq-item">
                            <button
                                className="faq-question"
                                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                            >
                                <span>{item.q}</span>
                                {expandedFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {expandedFaq === idx && (
                                <div className="faq-answer">{item.a}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 커뮤니티 Q&A */}
            <div className="support-card">
                <div className="card-title">🗣️ 커뮤니티 Q&A</div>
                <p className="card-desc">궁금한 점을 남기면 다른 사용자들도 함께 볼 수 있어요.</p>

                {/* 질문 작성 */}
                <form onSubmit={handleQuestionSubmit} className="qna-form">
                    <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="질문을 입력하세요..."
                        className="qna-input"
                    />
                    <button type="submit" className="qna-submit">
                        <Send size={18} />
                    </button>
                </form>

                {/* Q&A 목록 */}
                <div className="qna-list">
                    {qnaList.map((item) => (
                        <div key={item.id} className="qna-item">
                            <div className="qna-header">
                                <span className="qna-wallet">{item.walletAddress}</span>
                                <span className="qna-date">{item.createdAt}</span>
                            </div>
                            <div className="qna-question">Q: {item.question}</div>
                            {item.answer ? (
                                <div className="qna-answer">
                                    <span className="admin-badge">관리자</span>
                                    A: {item.answer}
                                </div>
                            ) : (
                                <div className="qna-pending">답변 대기 중...</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .support-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.25rem;
          margin-bottom: 1rem;
        }
        .card-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.75rem;
        }
        .card-desc {
          color: #94a3b8;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        .telegram-card {
          background: linear-gradient(135deg, rgba(0, 136, 204, 0.1), rgba(0, 136, 204, 0.05));
          border-color: rgba(0, 136, 204, 0.2);
        }
        .telegram-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, #0088cc, #00aced);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .telegram-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 136, 204, 0.3);
        }
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .faq-item {
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          overflow: hidden;
        }
        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.875rem 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: none;
          color: #e5e7eb;
          font-size: 0.9rem;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s;
        }
        .faq-question:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .faq-answer {
          padding: 0.875rem 1rem;
          background: rgba(29, 78, 216, 0.08);
          color: #94a3b8;
          font-size: 0.85rem;
          line-height: 1.6;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .qna-form {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .qna-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          color: #fff;
          font-size: 0.9rem;
          outline: none;
        }
        .qna-input::placeholder {
          color: #64748b;
        }
        .qna-input:focus {
          border-color: rgba(29, 78, 216, 0.5);
        }
        .qna-submit {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: none;
          background: var(--brand);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        .qna-submit:hover {
          transform: scale(1.05);
        }
        .qna-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .qna-item {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .qna-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .qna-wallet {
          font-size: 0.75rem;
          color: #8b5cf6;
          font-family: monospace;
        }
        .qna-date {
          font-size: 0.75rem;
          color: #64748b;
        }
        .qna-question {
          color: #e5e7eb;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        .qna-answer {
          color: #10b981;
          font-size: 0.85rem;
          padding: 0.75rem;
          background: rgba(16, 185, 129, 0.08);
          border-radius: 8px;
        }
        .admin-badge {
          display: inline-block;
          background: #10b981;
          color: #fff;
          font-size: 0.65rem;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          margin-right: 0.5rem;
          font-weight: 600;
        }
        .qna-pending {
          color: #94a3b8;
          font-size: 0.8rem;
          font-style: italic;
        }
      `}</style>
        </main>
    );
}
