import { notFound } from 'next/navigation';
import { getProductById, products, type Product } from '@/lib/products';
import Link from 'next/link';
import { ArrowLeft, Star, Play } from 'lucide-react';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return products.map((product) => ({
        id: product.id,
    }));
}

// 샘플 리뷰 데이터 (나중에 Supabase로 연동)
const sampleReviews = [
    {
        id: 1,
        walletAddress: '0x1234...5678',
        rating: 5,
        comment: '정품 키가 빠르게 발급되어서 좋았습니다. 설치도 문제없이 잘 되네요!',
        date: '2026-01-05',
    },
    {
        id: 2,
        walletAddress: '0xabcd...efgh',
        rating: 4,
        comment: '가격 대비 훌륭합니다. 기업용으로 여러 개 구매했는데 만족스러워요.',
        date: '2026-01-03',
    },
    {
        id: 3,
        walletAddress: '0x9876...4321',
        rating: 5,
        comment: 'Web3 결제가 편리하네요. 다음에도 여기서 구매할 예정입니다.',
        date: '2026-01-01',
    },
];

function StarRating({ rating }: { rating: number }) {
    return (
        <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={14}
                    fill={star <= rating ? '#fbbf24' : 'transparent'}
                    color={star <= rating ? '#fbbf24' : '#64748b'}
                />
            ))}
        </div>
    );
}

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params;
    const product = getProductById(id);

    if (!product) {
        notFound();
    }

    return (
        <main className="page" style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem', paddingTop: 'calc(64px + 1.5rem)' }}>
            {/* 뒤로가기 버튼 */}
            <Link
                href="/products"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#60a5fa',
                    marginBottom: '1.5rem',
                    fontSize: '0.95rem',
                    transition: 'color 0.2s',
                }}
            >
                <ArrowLeft size={18} />
                제품 목록으로 돌아가기
            </Link>

            {/* 제품 이미지/썸네일 */}
            <div
                style={{
                    '--h': product.hue,
                    height: 280,
                    borderRadius: 16,
                    background: `radial-gradient(200px 100px at 30% 30%, hsla(var(--h, 210), 70%, 60%, 0.55), transparent 65%), 
                       linear-gradient(135deg, hsla(var(--h, 210), 60%, 50%, 0.3), hsla(calc(var(--h, 210) + 30), 70%, 60%, 0.2))`,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '1.5rem',
                } as React.CSSProperties}
            />

            {/* 제품명 + 카테고리 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                    {product.name}
                </h1>
                <span style={{
                    padding: '0.25rem 0.75rem',
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    borderRadius: 20,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#fff',
                }}>
                    {product.cat}
                </span>
            </div>

            {/* 배지들 */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {product.badges.map((badge) => (
                    <span
                        key={badge}
                        style={{
                            fontSize: '0.72rem',
                            border: '1px solid rgba(255, 255, 255, 0.16)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 999,
                            color: '#e5e7eb',
                            background: 'rgba(255, 255, 255, 0.05)',
                        }}
                    >
                        {badge}
                    </span>
                ))}
            </div>

            {/* 제품 설명 */}
            <div style={{
                padding: '1.25rem',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.06)',
                marginBottom: '1.5rem',
            }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
                    📝 제품 설명
                </h2>
                <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {product.desc}
                </p>
                <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '0.95rem', marginTop: '0.75rem' }}>
                    정품 라이선스로 제공되며, 결제 완료 즉시 이메일로 라이선스 키가 발급됩니다.
                    기업 대량 구매 시 별도 할인이 적용되며, 기술 지원이 포함되어 있습니다.
                </p>
            </div>

            {/* 구동 영상 섹션 */}
            <div style={{
                padding: '1.25rem',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.06)',
                marginBottom: '1.5rem',
            }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
                    🎬 구동 영상
                </h2>
                {/* 비디오 플레이스홀더 - 실제 비디오 파일로 교체 가능 */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16/9',
                    background: 'linear-gradient(135deg, rgba(30,30,50,0.8), rgba(20,20,40,0.9))',
                    borderRadius: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                }}>
                    <Play size={48} color="#64748b" />
                    <p style={{ color: '#64748b', marginTop: '0.75rem', fontSize: '0.85rem' }}>
                        구동 영상 준비 중...
                    </p>
                    <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        /public/videos/{product.id}.mp4 파일을 추가하세요
                    </p>
                </div>
                {/* 실제 비디오가 있을 때 사용할 코드:
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          style={{ width: '100%', borderRadius: 12 }}
        >
          <source src={`/videos/${product.id}.mp4`} type="video/mp4" />
        </video>
        */}
            </div>

            {/* 구매자 리뷰 */}
            <div style={{
                padding: '1.25rem',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
                    ⭐ 구매자 리뷰
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {sampleReviews.map((review) => (
                        <div
                            key={review.id}
                            style={{
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: 10,
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: '#8b5cf6',
                                        fontFamily: 'monospace',
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: 6,
                                    }}>
                                        {review.walletAddress}
                                    </span>
                                    <StarRating rating={review.rating} />
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{review.date}</span>
                            </div>
                            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                {review.comment}
                            </p>
                        </div>
                    ))}
                </div>
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem', marginTop: '1rem' }}>
                    이 제품을 구매한 고객만 리뷰를 작성할 수 있습니다.
                </p>
            </div>
        </main>
    );
}
