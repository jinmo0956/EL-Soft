'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, X, Check, Image as ImageIcon, FileBox } from 'lucide-react';
import { useAccount } from 'wagmi';

export default function UploadPage() {
    const { address } = useAccount();
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

        // Validation
        if (!form.id || !form.name || !form.price) return alert("필수 정보를 모두 입력해주세요.");
        if (!imageFile || !softwareFile) return alert("이미지와 설치 파일을 모두 선택해주세요.");

        setLoading(true);

        try {
            // 1. Upload Image (Public Bucket)
            const imgExt = imageFile.name.split('.').pop();
            const imgName = `${form.id}_${Date.now()}.${imgExt}`;
            const { error: imgErr } = await supabase.storage
                .from('product-images')
                .upload(imgName, imageFile);

            if (imgErr) throw new Error(`이미지 업로드 실패: ${imgErr.message}`);

            const { data: { publicUrl: imageUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(imgName);

            // 2. Upload Software (Private Bucket)
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
                price: parseFloat(form.price), // This is purely informational for now, contract price is separate
                description: form.desc,
                version: form.version,
                license_type: form.license_type,
                image_url: imageUrl,
                file_path: softName,
                is_active: true
            });

            if (dbErr) throw new Error(`DB 저장 실패: ${dbErr.message}`);

            alert("상품이 성공적으로 등록되었습니다! 🎉\n스마트 컨트랙트에도 상품을 등록해야 실제 구매가 가능합니다.");

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
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header Section */}
            <div>
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                    새 소프트웨어 등록
                </h1>
                <p className="text-gray-400 text-lg">
                    고객에게 제공할 새로운 소프트웨어 패키지를 스토어에 업로드합니다.
                </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-8">
                {/* 1. Basic Info Section */}
                <section className="bg-[#111] border border-[#222] rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#222]">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <FileBox className="text-emerald-500 w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white">기본 정보</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">상품 ID (고유 식별자)</label>
                            <input
                                type="text"
                                placeholder="ex) elsoft-pro-v1"
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
                                value={form.id}
                                onChange={e => setForm({ ...form, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            />
                            <p className="text-xs text-gray-600 ml-1">* URL에 사용되는 영문 ID입니다.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">상품명</label>
                            <input
                                type="text"
                                placeholder="예: EL Studio 2024"
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">가격 (USDT)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    step="0.01"
                                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl pl-8 pr-4 py-3.5 text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all font-mono"
                                    value={form.price}
                                    onChange={e => setForm({ ...form, price: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">초기 버전</label>
                            <input
                                type="text"
                                placeholder="1.0.0"
                                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all font-mono"
                                value={form.version}
                                onChange={e => setForm({ ...form, version: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">상품 설명</label>
                            <textarea
                                placeholder="상품에 대한 상세 설명을 입력하세요."
                                className="w-full h-32 bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none transition-all"
                                value={form.desc}
                                onChange={e => setForm({ ...form, desc: e.target.value })}
                            />
                        </div>
                    </div>
                </section>

                {/* 2. File Upload Section */}
                <section className="bg-[#111] border border-[#222] rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#222]">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Upload className="text-blue-500 w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-white">파일 업로드</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image Upload Zone */}
                        <div className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${imageFile ? 'border-emerald-500 bg-emerald-500/5' : 'border-[#333] hover:border-gray-500 hover:bg-[#151515]'}`}>
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={e => setImageFile(e.target.files?.[0] || null)}
                            />
                            <div className="flex flex-col items-center justify-center text-center space-y-3">
                                <div className={`p-4 rounded-full ${imageFile ? 'bg-emerald-500/20 text-emerald-500' : 'bg-[#1a1a1a] text-gray-400 group-hover:text-white'}`}>
                                    <ImageIcon size={32} />
                                </div>
                                <div>
                                    <p className="font-bold text-white mb-1">
                                        {imageFile ? imageFile.name : '메인 이미지'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {imageFile ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : 'JPG, PNG (최대 5MB)'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* File Upload Zone */}
                        <div className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${softwareFile ? 'border-blue-500 bg-blue-500/5' : 'border-[#333] hover:border-gray-500 hover:bg-[#151515]'}`}>
                            <input
                                type="file"
                                accept=".zip,.exe,.dmg,.pkg"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={e => setSoftwareFile(e.target.files?.[0] || null)}
                            />
                            <div className="flex flex-col items-center justify-center text-center space-y-3">
                                <div className={`p-4 rounded-full ${softwareFile ? 'bg-blue-500/20 text-blue-500' : 'bg-[#1a1a1a] text-gray-400 group-hover:text-white'}`}>
                                    <FileBox size={32} />
                                </div>
                                <div>
                                    <p className="font-bold text-white mb-1">
                                        {softwareFile ? softwareFile.name : '설치 파일'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {softwareFile ? `${(softwareFile.size / 1024 / 1024).toFixed(2)} MB` : '.ZIP, .EXE (최대 500MB)'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Submit Action */}
                <div className="flex justify-end pt-4">
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full md:w-auto px-8 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                업로드 및 등록 중...
                            </>
                        ) : (
                            <>
                                <Check size={20} />
                                소프트웨어 등록 완료
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
