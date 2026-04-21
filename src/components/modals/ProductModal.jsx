import React, { useState, useEffect } from 'react';
import { X, Save, Edit } from 'lucide-react';

export default function ProductModal({ isOpen, onClose, onSave, product, categories }) {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        image: '🎂',
        categoryId: categories?.[0]?.id || '',
        status: 'Hoạt động',
        prepTime: '30 phút',
        shelfLife: 3,
        stock: 0,
        recipe: []
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                price: product.price || 0,
                image: product.image || '🎂',
                categoryId: product.categoryId || (categories?.[0]?.id || ''),
                status: product.status || 'Hoạt động',
                prepTime: product.prepTime || '30 phút',
                shelfLife: product.shelfLife || 3,
                stock: product.stock || 0,
                recipe: product.recipe || []
            });
        } else {
            setFormData({
                name: '',
                price: 0,
                image: '🎂',
                categoryId: categories?.[0]?.id || '',
                status: 'Hoạt động',
                prepTime: '30 phút',
                shelfLife: 3,
                stock: 0,
                recipe: []
            });
        }
    }, [product, isOpen, categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'price' || name === 'shelfLife' ? Number(value) : value 
        }));
    };

    const handleSave = () => {
        if (!formData.name.trim()) {
            return alert('Vui lòng nhập Tên sản phẩm!');
        }
        if (formData.price < 0) {
            return alert('Giá bán không được âm!');
        }
        
        onSave({ 
            ...product, 
            ...formData 
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-[500px] shadow-2xl overflow-hidden flex flex-col">
                <div className="p-5 border-b border-amber-100 bg-amber-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                        <Edit size={20} /> 
                        {product ? 'Cập nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-amber-200 rounded-full text-amber-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Tên sản phẩm (*)</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="VD: Bánh Kem Tiramisu..." className="w-full border-2 border-amber-100 rounded-xl p-2.5 focus:border-amber-500 outline-none text-sm font-medium transition-colors" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Danh mục</label>
                            <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full border-2 border-amber-100 rounded-xl p-2.5 focus:border-amber-500 outline-none text-sm font-medium transition-colors bg-white">
                                {(categories || []).map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Giá bán (VNĐ)</label>
                            <input type="number" min="0" step="1000" name="price" value={formData.price} onChange={handleChange} className="w-full border-2 border-amber-100 rounded-xl p-2.5 focus:border-amber-500 outline-none text-sm font-bold text-amber-700 transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Icon/Hình ảnh (Emoji/URL)</label>
                            <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="VD: 🎂, 🍰" className="w-full border-2 border-amber-100 rounded-xl p-2.5 focus:border-amber-500 outline-none text-sm font-medium transition-colors text-center text-xl" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Trạng thái</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full border-2 border-amber-100 rounded-xl p-2.5 focus:border-amber-500 outline-none text-sm font-medium transition-colors bg-white">
                                <option value="Hoạt động">Đang kinh doanh</option>
                                <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Thời gian chuẩn bị</label>
                            <input type="text" name="prepTime" value={formData.prepTime} onChange={handleChange} className="w-full border-2 border-amber-100 rounded-xl p-2.5 focus:border-amber-500 outline-none text-sm font-medium transition-colors" placeholder="VD: 30 phút" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Thời hạn tính bằng (Ngày)</label>
                            <input type="number" min="1" name="shelfLife" value={formData.shelfLife} onChange={handleChange} className="w-full border-2 border-amber-100 rounded-xl p-2.5 focus:border-amber-500 outline-none text-sm font-medium transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">
                        Hủy
                    </button>
                    <button onClick={handleSave} className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors">
                        <Save size={18} /> Lưu Thông Tin
                    </button>
                </div>
            </div>
        </div>
    );
}
