'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { productsData, Product } from '../services/mockData';
import './Products.css';

export default function Products() {
    const [products, setProducts] = useState<Product[]>(productsData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        name_ko: '',
        price: '',
        category: 'software',
        description_ko: '',
    });

    const handleOpenModal = (product: Product | null = null) => {
        if (product) {
            setEditingId(product.id);
            setFormData({
                id: product.id,
                name: product.name,
                name_ko: product.name_ko,
                price: product.price.toString(),
                category: product.category,
                description_ko: product.description_ko,
            });
        } else {
            setEditingId(null);
            setFormData({
                id: '',
                name: '',
                name_ko: '',
                price: '',
                category: 'software',
                description_ko: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setProducts(products.map(p => p.id === editingId ? {
                ...p,
                ...formData,
                price: Number(formData.price)
            } : p));
        } else {
            const newProduct: Product = {
                ...formData,
                price: Number(formData.price),
                is_active: true,
                created_at: new Date().toISOString()
            };
            setProducts([...products, newProduct]);
        }
        setIsModalOpen(false);
    };

    const filteredProducts = products.filter(product =>
        product.name_ko.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-container">
            <Navbar title="상품 관리" />

            <div className="page-content">
                <div className="action-bar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="상품 검색..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        <Plus size={18} /> 상품 등록
                    </button>
                </div>

                <div className="products-grid">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="product-header">
                                <span className={`category-badge ${product.category}`}>{product.category}</span>
                                <div className="product-actions">
                                    <button className="action-btn edit" onClick={() => handleOpenModal(product)}>
                                        <Edit size={16} />
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDelete(product.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="product-title">{product.name_ko}</h3>
                            <p className="product-subtitle">{product.name}</p>
                            <p className="product-desc">{product.description_ko}</p>
                            <div className="product-footer">
                                <span className="product-price">${product.price}</span>
                                <span className="product-status active">판매중</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingId ? '상품 수정' : '새 상품 등록'}</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="product-form">
                            <div className="form-group">
                                <label>상품 ID</label>
                                <input
                                    type="text"
                                    value={formData.id}
                                    onChange={e => setFormData({ ...formData, id: e.target.value })}
                                    disabled={!!editingId}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>상품명 (한글)</label>
                                    <input
                                        type="text"
                                        value={formData.name_ko}
                                        onChange={e => setFormData({ ...formData, name_ko: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>상품명 (영문)</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>가격 (USDT)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>카테고리</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="software">Software</option>
                                        <option value="ide">IDE</option>
                                        <option value="office">Office</option>
                                        <option value="design">Design</option>
                                        <option value="security">Security</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>설명 (한글)</label>
                                <textarea
                                    rows={3}
                                    value={formData.description_ko}
                                    onChange={e => setFormData({ ...formData, description_ko: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>취소</button>
                                <button type="submit" className="btn btn-primary">저장</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
