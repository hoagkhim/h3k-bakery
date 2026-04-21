import React, { useState, useEffect } from 'react';
import { X, Save, Leaf } from 'lucide-react';

export default function IngredientModal({ isOpen, onClose, onSave, ingredient }) {
    const [formData, setFormData] = useState({
        name: '',
        unit: 'Kg',
        minStock: 0,
        status: 'Hoạt động'
    });

    useEffect(() => {
        if (ingredient) {
            setFormData({
                name: ingredient.name || '',
                unit: ingredient.unit || 'Kg',
                minStock: ingredient.minStock || 0,
                status: ingredient.status || 'Hoạt động'
            });
        } else {
            setFormData({
                name: '',
                unit: 'Kg',
                minStock: 0,
                status: 'Hoạt động'
            });
        }
    }, [ingredient, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.name.trim()) {
            return alert('Vui lòng nhập Tên nguyên liệu!');
        }
        if (formData.minStock < 0) {
            return alert('Tồn tối thiểu không được âm!');
        }
        
        onSave({ 
            ...ingredient, 
            ...formData, 
            minStock: Number(formData.minStock) 
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Leaf size={22} className="text-emerald-600" />
                        {ingredient ? 'Cập nhật Nguyên Liệu' : 'Thêm Nguyên Liệu Mới'}
                    </h2>
                    <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-500 shadow-sm border border-gray-200">
                        <X size={18} />
                    </button>
                </div>
                
                <div className="p-6 bg-white space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Tên Nguyên Liệu (*)</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="VD: Bột mì đa dụng..." className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Đơn vị tính</label>
                            <select name="unit" value={formData.unit} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200 bg-white">
                                <option value="Kg">Kg</option>
                                <option value="Gram">Gram</option>
                                <option value="Lít">Lít</option>
                                <option value="ml">ml</option>
                                <option value="Quả">Quả</option>
                                <option value="Cái">Cái</option>
                                <option value="Hộp">Hộp</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Tồn tối thiểu (Cảnh báo)</label>
                            <input type="number" min="0" name="minStock" value={formData.minStock} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Trạng Thái</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-200 bg-white">
                            <option value="Hoạt động">Đang sử dụng</option>
                            <option value="Ngừng kinh doanh">Ngừng sử dụng</option>
                        </select>
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors border border-gray-300 bg-white">
                        Hủy
                    </button>
                    <button onClick={handleSave} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-sm transition-colors border border-emerald-700">
                        <Save size={18} /> Lưu Thông Tin
                    </button>
                </div>
            </div>
        </div>
    );
}
