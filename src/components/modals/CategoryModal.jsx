import React, { useState, useEffect } from 'react';
import { X, Save, FolderOpen } from 'lucide-react';

export default function CategoryModal({ isOpen, onClose, onSave, category }) {
    const [name, setName] = useState('');
    const [type, setType] = useState('Thu');

    useEffect(() => {
        if (category) {
            setName(category.name || '');
            setType(category.type || 'Thu');
        } else {
            setName('');
            setType('Thu');
        }
    }, [category, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name.trim()) return alert("Vui lòng nhập tên danh mục!");
        onSave({ id: category?.id, name, type, deletedAt: category ? category.deletedAt : null });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                    <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                        <FolderOpen size={20} className="text-blue-600" />
                        {category ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}
                    </h2>
                    <button onClick={onClose} className="p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tên Danh Mục (*)</label>
                        <input 
                            type="text" 
                            className="w-full border-2 border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500 font-medium text-gray-800 transition-colors"
                            placeholder="Vd: Tiền điện, Bán ve chai..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Phân Loại</label>
                        <div className="flex gap-4">
                            <label className={`flex-1 flex flex-col items-center justify-center cursor-pointer p-4 border-2 rounded-xl transition-colors ${type === 'Thu' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                <input type="radio" checked={type === 'Thu'} onChange={() => setType('Thu')} className="hidden" />
                                <span className={`font-bold ${type === 'Thu' ? 'text-green-700' : 'text-gray-500'}`}>Khoản THU</span>
                            </label>
                            <label className={`flex-1 flex flex-col items-center justify-center cursor-pointer p-4 border-2 rounded-xl transition-colors ${type === 'Chi' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                <input type="radio" checked={type === 'Chi'} onChange={() => setType('Chi')} className="hidden" />
                                <span className={`font-bold ${type === 'Chi' ? 'text-red-700' : 'text-gray-500'}`}>Khoản CHI</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="p-5 border-t border-gray-100 flex gap-3 bg-white">
                    <button onClick={onClose} className="flex-1 py-3 font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Hủy bỏ</button>
                    <button onClick={handleSave} className="flex-1 py-3 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 flex justify-center items-center gap-2 shadow-md transition-colors">
                        <Save size={18} /> Lưu Lại
                    </button>
                </div>
            </div>
        </div>
    );
}
