import React, { useState, useEffect } from 'react';
import { X, Save, Layers } from 'lucide-react';

export default function ProductCategoryModal({ isOpen, onClose, onSave, category }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'Hoạt động'
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                description: category.description || '',
                status: category.status || 'Hoạt động'
            });
        } else {
            setFormData({
                name: '',
                description: '',
                status: 'Hoạt động'
            });
        }
    }, [category, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.name.trim()) {
            return alert('Vui lòng nhập Tên danh mục!');
        }
        
        onSave({ 
            ...category, 
            ...formData 
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-amber-100 flex justify-between items-center bg-amber-50">
                    <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                        <Layers size={22} className="text-amber-700" />
                        {category ? 'Cập nhật Danh mục' : 'Thêm Danh mục Mới'}
                    </h2>
                    <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-amber-100 text-amber-700 shadow-sm border border-amber-200">
                        <X size={18} />
                    </button>
                </div>
                
                <div className="p-6 bg-white space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Tên Danh Mục (*)</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="VD: Bánh Kem, Nước Ép..." className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả danh mục</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Mô tả các sản phẩm thuộc danh mục này..." className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200 resize-none"></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Trạng Thái</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200 bg-white">
                            <option value="Hoạt động">Đang hoạt động</option>
                            <option value="Khóa">Tạm khóa</option>
                        </select>
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors border border-gray-300 bg-white">
                        Hủy
                    </button>
                    <button onClick={handleSave} className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-sm transition-colors border border-amber-700">
                        <Save size={18} /> Lưu Danh Mục
                    </button>
                </div>
            </div>
        </div>
    );
}
