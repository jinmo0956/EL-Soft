'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { UploadCloud, DollarSign, Type, FileText, Image as ImageIcon, Check, AlertTriangle, Tag } from 'lucide-react';

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

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <header className="mb-10">
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">상품 등록</h2>
                <p className="text-gray-400">새로운 소프트웨어 패키지를 마켓에 배포합니다.</p>
            </header>

            <form onSubmit={handleUpload}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    {/* 왼쪽: 정보 입력 */}
                    <div className="space-y-6">
                        {/* Product ID */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-colors duration-300"
                        >
                            <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                                <Tag size={16} className="text-purple-500" /> 상품 ID (고유값)
                            </label>
                            <input
                                type="text"
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-700 font-mono"
                                placeholder="ex: architecture-pro-v1"
                                value={form.id}
                                onChange={e => setForm({ ...form, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            />
                        </motion.div>

                        {/* Product Name */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors duration-300"
                        >
                            <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                                <Type size={16} className="text-cyan-500" /> 상품명
                            </label>
                            <input
                                type="text"
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-gray-700"
                                placeholder="예: Architecture Pro 2026"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </motion.div>

                        {/* Price */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-colors duration-300"
                        >
                            <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                                <DollarSign size={16} className="text-green-500" /> 가격 (USDT)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-mono text-xl"
                                placeholder="0.00"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                            />
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6"
                        >
                            <label className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                                <FileText size={16} className="text-blue-500" /> 상품 설명
                            </label>
                            <textarea
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white h-32 resize-none focus:outline-none focus:border-blue-500 transition-all text-sm leading-relaxed"
                                placeholder="제품의 상세 스펙을 입력하세요..."
                                value={form.desc}
                                onChange={e => setForm({ ...form, desc: e.target.value })}
                            />
                        </motion.div>
                    </div>

                    {/* 오른쪽: 파일 업로드 */}
                    <div className="space-y-6">
                        {/* 썸네일 */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            className={`group relative border border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer overflow-hidden ${imageFile ? 'bg-cyan-500/5 border-cyan-500/50' : 'bg-[#0A0A0A] border-white/10 hover:bg-white/5 hover:border-cyan-500/50'}`}
                        >
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${imageFile ? 'bg-cyan-500/20' : 'bg-cyan-500/10'}`}>
                                <ImageIcon className="text-cyan-400" size={32} />
                            </div>
                            <div className="text-center">
                                <p className="text-white font-medium mb-1">{imageFile ? imageFile.name : '썸네일 이미지 업로드'}</p>
                                <p className="text-xs text-gray-500">{imageFile ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : 'PNG, JPG (최대 5MB)'}</p>
                            </div>
                        </motion.div>

                        {/* 소프트웨어 파일 */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            className={`group relative border border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer overflow-hidden ${softwareFile ? 'bg-yellow-500/5 border-yellow-500/50' : 'bg-[#0A0A0A] border-white/10 hover:bg-white/5 hover:border-yellow-500/50'}`}
                        >
                            <input type="file" accept=".zip,.exe,.dmg,.pkg" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => setSoftwareFile(e.target.files?.[0] || null)} />
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${softwareFile ? 'bg-yellow-500/20' : 'bg-yellow-500/10'}`}>
                                <UploadCloud className="text-yellow-400" size={32} />
                            </div>
                            <div className="text-center">
                                <p className="text-white font-medium mb-1">{softwareFile ? softwareFile.name : '설치 파일 업로드 (.zip)'}</p>
                                <p className="text-xs text-gray-500">{softwareFile ? `${(softwareFile.size / 1024 / 1024).toFixed(2)} MB` : '암호화된 프라이빗 스토리지에 저장'}</p>
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    업로드 중...
                                </>
                            ) : (
                                <>
                                    <Check size={20} />
                                    마켓에 배포하기
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </form>
        </motion.div>
    );
}
