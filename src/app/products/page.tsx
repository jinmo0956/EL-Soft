'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { products, getProductsByCategory, searchProducts, type Product } from '@/lib/products';
import { PaymentModal, GasFeeTracker } from '@/components';

const categories = ['전체', '개발', '오피스', '디자인', '보안'];

interface ProductCardProps {
    product: Product;
    onBuyClick: (product: Product) => void;
}

function ProductCard({ product, onBuyClick }: ProductCardProps) {
    return (
        <div className="card" style={{ '--h': product.hue } as React.CSSProperties}>
            <div className="thumb" />
            <div className="name">{product.name}</div>
            <div className="desc">{product.desc}</div>
            <div className="badges">
                {product.badges.map((badge) => (
                    <span key={badge} className="badge">
                        {badge}
                    </span>
                ))}
            </div>
            <div className="price">{product.price}</div>
            <div className="cta">
                <button className="b-buy" onClick={() => onBuyClick(product)}>
                    구매하기
                </button>
                <Link href={`/products/${product.id}`}>
                    <button className="b-more">상세보기</button>
                </Link>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    const [activeCategory, setActiveCategory] = useState('전체');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const filteredProducts = useMemo(() => {
        let result = getProductsByCategory(activeCategory);
        if (searchQuery.trim()) {
            const searched = searchProducts(searchQuery);
            result = result.filter((p) => searched.some((s) => s.id === p.id));
        }
        return result;
    }, [activeCategory, searchQuery]);

    const handleBuyClick = (product: Product) => {
        setSelectedProduct(product);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = (txHash: string) => {
        console.log('Payment successful:', txHash);
        // Here you would typically:
        // 1. Save to database
        // 2. Show success message
        // 3. Redirect to order confirmation
    };

    return (
        <main className="page">
            <div className="page-head">
                <div className="tools">
                    <div className="title" style={{ fontWeight: 900, fontSize: '1.5rem' }}>
                        제품
                    </div>
                    <div className="spacer" />
                    <GasFeeTracker />
                    <input
                        id="searchInput"
                        className="search"
                        type="search"
                        placeholder="제품 검색 (예: 개발, 오피스, 디자인)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div id="chipbar" className="chipbar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`chip ${activeCategory === cat ? 'is-active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                            data-filter={cat}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
            <div id="productsGrid" className="grid">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onBuyClick={handleBuyClick}
                    />
                ))}
            </div>

            {/* Payment Modal */}
            {selectedProduct && (
                <PaymentModal
                    product={selectedProduct}
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </main>
    );
}
