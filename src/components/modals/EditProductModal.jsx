import React, { useState } from 'react';
import { Edit, X, Save } from 'lucide-react';

export default function EditProductModal({ product, onClose, onSave }) {
    const [formData, setFormData] = useState({ ...product });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'price' || name === 'shelfLife' ? Number(value) : value });
    };
    const handleSave = () => { onSave(formData); onClose(); };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl w-[500px] shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-amber-100 bg-amber-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2"><Edit size={20} /> Cập nhật thông tin bánh</h2>
                    <button onClick={onClose} className="p-1 hover:bg-amber-200 rounded-full text-amber-800"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Tên sản phẩm</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-2 border-amber-100 rounded-xl p-2.5 focus:border-amber-500 outline-none text-sm font-medium" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Danh mục</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full border-2 border-amber-100 rounded-xl p-2.5 focus:border-amber-500 outline-none text-sm font-medium">
                                <option>Bánh Lạnh</option><option>Bánh Mì</option><option>Bánh Ngọt</option><option>Bánh Kem</option><option>Đồ Uống</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Giá cơ bản (VNĐ)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border-2 border-amber-100 rounded-xl p-2.5 focus:border-amber-500 outline-none text-sm font-bold text-amber-700" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Thời gian chuẩn bị</label>
                            <input type="text" name="prepTime" value={formData.prepTime} onChange={handleChange} className="w-full border-2 border-amber-100 rounded-xl p-2.5 focus:border-amber-500 outline-none text-sm font-medium" placeholder="VD: 30 phút" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Hạn bảo quản (Ngày)</label>
                            <input type="number" name="shelfLife" value={formData.shelfLife} onChange={handleChange} className="w-full border-2 border-amber-100 rounded-xl p-2.5 focus:border-amber-500 outline-none text-sm font-medium" />
                        </div>
                    </div>
                </div>
                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl">Hủy</button>
                    <button onClick={handleSave} className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm"><Save size={18} /> Lưu thay đổi</button>
                </div>
            </div>
        </div>
    );
}
