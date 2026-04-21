import React, { useState, useEffect } from 'react';
import { X, Save, Building2 } from 'lucide-react';

export default function SupplierModal({ isOpen, onClose, onSave, supplier }) {
    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        products: '',
        status: 'Hoạt động'
    });

    useEffect(() => {
        if (supplier) {
            setFormData(supplier);
        } else {
            setFormData({
                name: '',
                contactPerson: '',
                phone: '',
                email: '',
                address: '',
                products: '',
                status: 'Hoạt động'
            });
        }
    }, [supplier, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.name.trim() || !formData.phone.trim()) {
            return alert('Vui lòng nhập Tên nhà cung cấp và Số điện thoại!');
        }
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Building2 size={22} className="text-blue-600" />
                        {supplier ? 'Cập nhật Nhà Cung Cấp' : 'Thêm Nhà Cung Cấp Mới'}
                    </h2>
                    <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-500 shadow-sm border border-gray-200">
                        <X size={18} />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[70vh] bg-white">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Tên Nhà Cung Cấp (*)</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="VD: Công ty TNHH Bột Mì ABC" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Người Liên Hệ</label>
                                <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="Họ và tên..." className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Số Điện Thoại (*)</label>
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="09xxxx..." className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@domain.com" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Trạng Thái</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 bg-white">
                                    <option value="Hoạt động">Hoạt động</option>
                                    <option value="Ngừng hợp tác">Ngừng hợp tác</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Địa chỉ</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Số nhà, đường, quận/huyện..." className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Mặt hàng cung cấp</label>
                            <textarea name="products" value={formData.products} onChange={handleChange} placeholder="VD: Bột mì, Đường, Sữa..." rows="2" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 resize-none"></textarea>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition-colors border border-gray-300 bg-white">
                        Hủy
                    </button>
                    <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 shadow-sm transition-colors border border-blue-700">
                        <Save size={18} /> Lưu Thông Tin
                    </button>
                </div>
            </div>
        </div>
    );
}
