import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';

const TransactionModal = ({ onClose, onSave, loaithuchi }) => {
    const [formData, setFormData] = useState({
        type: 'Thu',
        categoryId: '',
        amount: '',
        description: '',
    });

    // Lọc danh sách danh mục theo loại (Thu/Chi) và KHÔNG bị xóa (deletedAt === null)
    const filteredCategories = useMemo(() => {
        return loaithuchi.filter(
            (cat) => cat.type === formData.type && cat.deletedAt === null
        );
    }, [formData.type, loaithuchi]);

    const handleTypeChange = (type) => {
        setFormData({
            ...formData,
            type,
            categoryId: '' // Reset danh mục khi đổi loại Thu/Chi
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            type: formData.type,
            categoryId: formData.categoryId,
            amount: Number(formData.amount),
            description: formData.description
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Lập Phiếu Mới</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Loại thu/chi (Radio Buttons) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Loại Phiếu</label>
                        <div className="flex gap-4">
                            <label className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                formData.type === 'Thu' 
                                    ? 'border-green-500 bg-green-50 text-green-700 font-medium' 
                                    : 'border-gray-200 hover:border-green-200'
                            }`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="Thu"
                                    checked={formData.type === 'Thu'}
                                    onChange={() => handleTypeChange('Thu')}
                                    className="hidden"
                                />
                                Thu Tiền
                            </label>

                            <label className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                formData.type === 'Chi' 
                                    ? 'border-red-500 bg-red-50 text-red-700 font-medium' 
                                    : 'border-gray-200 hover:border-red-200'
                            }`}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="Chi"
                                    checked={formData.type === 'Chi'}
                                    onChange={() => handleTypeChange('Chi')}
                                    className="hidden"
                                />
                                Chi Tiền
                            </label>
                        </div>
                    </div>

                    {/* Danh mục (Select box) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nhóm Danh Mục
                        </label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 bg-white"
                        >
                            <option value="" disabled>-- Chọn danh mục {formData.type.toLowerCase()} --</option>
                            {filteredCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            * Chỉ hiển thị các danh mục đang hoạt động của loại {formData.type}
                        </p>
                    </div>

                    {/* Số tiền */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số Tiền (VNĐ)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="Nhập số tiền..."
                                className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium pb-0.5">
                                đ
                            </span>
                        </div>
                    </div>

                    {/* Mô tả */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô Tả / Ghi Chú
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Mô tả lý do thu chi..."
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex gap-3 justify-end mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-sm"
                        >
                            Xác Nhận Lập
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
