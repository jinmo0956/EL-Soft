'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UploadCloud, DollarSign, Type, FileText, Image as ImageIcon, Check, Tag } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function UploadPage() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        id: '',
        name: '',
        price: '',
        desc: '',
        version: '1.0.0',
        license_type: 'single'
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [softwareFile, setSoftwareFile] = useState<File | null>(null);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) return alert("Supabase 클라이언트 오류");

        if (!form.id || !form.name || !form.price) return alert("필수 정보를 모두 입력해주세요.");
        if (!imageFile || !softwareFile) return alert("이미지와 설치 파일을 모두 선택해주세요.");

        setLoading(true);

        try {
            // 1. Upload Image
            const imgExt = imageFile.name.split('.').pop();
            const imgName = `${form.id}_${Date.now()}.${imgExt}`;
            const { error: imgErr } = await supabase.storage
                .from('product-images')
                .upload(imgName, imageFile);

            if (imgErr) throw new Error(`이미지 업로드 실패: ${imgErr.message}`);

            const { data: { publicUrl: imageUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(imgName);

            // 2. Upload Software
            const softExt = softwareFile.name.split('.').pop();
            const softName = `${form.id}_${form.version}_${Date.now()}.${softExt}`;
            const { error: softErr } = await supabase.storage
                .from('software-files')
                .upload(softName, softwareFile);

            if (softErr) throw new Error(`파일 업로드 실패: ${softErr.message}`);

            // 3. Insert into Database
            const { error: dbErr } = await supabase.from('products').insert({
                id: form.id,
                name: form.name,
                price: parseFloat(form.price),
                description: form.desc,
                version: form.version,
                license_type: form.license_type,
                image_url: imageUrl,
                file_path: softName,
                is_active: true
            });

            if (dbErr) throw new Error(`DB 저장 실패: ${dbErr.message}`);

            alert("✅ 상품이 성공적으로 등록되었습니다!\n스마트 컨트랙트에도 상품을 등록해야 실제 구매가 가능합니다.");

            // Reset form
            setForm({ id: '', name: '', price: '', desc: '', version: '1.0.0', license_type: 'single' });
            setImageFile(null);
            setSoftwareFile(null);

        } catch (error: any) {
            console.error(error);
            alert(error.message || "알 수 없는 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Navbar title="상품 등록" />

            <div className="page-content">
                <form onSubmit={handleUpload}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '24px'
                    }}>
                        {/* 왼쪽: 정보 입력 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Product ID */}
                            <div className="card">
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '14px',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '12px'
                                }}>
                                    <Tag size={16} style={{ color: 'var(--primary)' }} /> 상품 ID (고유값)
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="ex: architecture-pro-v1"
                                    value={form.id}
                                    onChange={e => setForm({ ...form, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                    style={{ fontFamily: 'monospace' }}
                                />
                            </div>

                            {/* Product Name */}
                            <div className="card">
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '14px',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '12px'
                                }}>
                                    <Type size={16} style={{ color: 'var(--accent-cyan)' }} /> 상품명
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="예: Architecture Pro 2026"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            {/* Price */}
                            <div className="card">
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '14px',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '12px'
                                }}>
                                    <DollarSign size={16} style={{ color: 'var(--accent-cyan)' }} /> 가격 (USDT)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input"
                                    placeholder="0.00"
                                    value={form.price}
                                    onChange={e => setForm({ ...form, price: e.target.value })}
                                    style={{ fontFamily: 'monospace', fontSize: '20px' }}
                                />
                            </div>

                            {/* Description */}
                            <div className="card">
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '14px',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '12px'
                                }}>
                                    <FileText size={16} style={{ color: 'var(--primary)' }} /> 상품 설명
                                </label>
                                <textarea
                                    className="input"
                                    placeholder="제품의 상세 스펙을 입력하세요..."
                                    value={form.desc}
                                    onChange={e => setForm({ ...form, desc: e.target.value })}
                                    style={{ minHeight: '120px', resize: 'vertical' }}
                                />
                            </div>
                        </div>

                        {/* 오른쪽: 파일 업로드 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* 썸네일 */}
                            <div
                                className="card"
                                style={{
                                    padding: '40px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '16px',
                                    border: imageFile ? '2px solid var(--accent-cyan)' : '2px dashed var(--text-secondary)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        opacity: 0,
                                        cursor: 'pointer'
                                    }}
                                    onChange={e => setImageFile(e.target.files?.[0] || null)}
                                />
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: imageFile ? 'rgba(1, 181, 116, 0.1)' : 'var(--bg-input)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <ImageIcon size={32} style={{ color: imageFile ? 'var(--accent-cyan)' : 'var(--text-secondary)' }} />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                        {imageFile ? imageFile.name : '썸네일 이미지 업로드'}
                                    </p>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        {imageFile ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : 'PNG, JPG (최대 5MB)'}
                                    </p>
                                </div>
                            </div>

                            {/* 소프트웨어 파일 */}
                            <div
                                className="card"
                                style={{
                                    padding: '40px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '16px',
                                    border: softwareFile ? '2px solid var(--accent-orange)' : '2px dashed var(--text-secondary)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <input
                                    type="file"
                                    accept=".zip,.exe,.dmg,.pkg"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        opacity: 0,
                                        cursor: 'pointer'
                                    }}
                                    onChange={e => setSoftwareFile(e.target.files?.[0] || null)}
                                />
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    background: softwareFile ? 'rgba(255, 181, 71, 0.1)' : 'var(--bg-input)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <UploadCloud size={32} style={{ color: softwareFile ? 'var(--accent-orange)' : 'var(--text-secondary)' }} />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                        {softwareFile ? softwareFile.name : '설치 파일 업로드 (.zip)'}
                                    </p>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        {softwareFile ? `${(softwareFile.size / 1024 / 1024).toFixed(2)} MB` : '암호화된 프라이빗 스토리지에 저장'}
                                    </p>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    fontSize: '16px',
                                    opacity: loading ? 0.5 : 1
                                }}
                            >
                                {loading ? (
                                    <>
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            borderTopColor: 'white',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }} />
                                        업로드 중...
                                    </>
                                ) : (
                                    <>
                                        <Check size={20} />
                                        마켓에 배포하기
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
