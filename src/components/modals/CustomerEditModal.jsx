import React, { useState } from 'react';
import { Edit, X, Save, CheckCircle2, LockKeyhole } from 'lucide-react';

export default function CustomerEditModal({ customer, onClose, onSave }) {
    const [formData, setFormData] = useState(customer || {});

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-[500px] shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-amber-100 bg-amber-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2"><Edit size={20} /> Cập nhật Khách Hàng</h2>
                    <button onClick={onClose} className="p-1 hover:bg-amber-200 rounded-full text-amber-800"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Họ và Tên (*)</label>
                            <input type="text" value={formData?.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border-2 border-amber-100 rounded-xl p-2.5 outline-none focus:border-amber-500 text-sm font-medium" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại (*)</label>
                            <input type="text" value={formData?.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full border-2 border-amber-100 rounded-xl p-2.5 outline-none focus:border-amber-500 text-sm font-medium" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Địa chỉ giao hàng</label>
                        <input type="text" value={formData?.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full border-2 border-amber-100 rounded-xl p-2.5 outline-none focus:border-amber-500 text-sm font-medium" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Điểm tích lũy</label>
                            <input type="number" disabled value={formData?.points || 0} className="w-full border-2 border-gray-200 rounded-xl p-2.5 bg-gray-50 text-sm font-bold text-blue-700" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Hạng thẻ hiện tại</label>
                            <input type="text" disabled value={`${formData?.tier || 'Đồng'} (Giảm ${formData?.discount || 0}%)`} className="w-full border-2 border-gray-200 rounded-xl p-2.5 bg-gray-50 text-sm font-bold text-amber-700" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl mt-2">
                        <input type="checkbox" id="cust-status" checked={formData?.status === 1} onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 1 : 0 })} className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500 cursor-pointer" />
                        <label htmlFor="cust-status" className="text-sm font-bold text-gray-700 cursor-pointer select-none flex-1">Hồ sơ hợp lệ (Bỏ tick để khóa thẻ)</label>
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl">Hủy</button>
                    <button onClick={() => onSave(formData)} className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm"><Save size={18} /> Lưu cập nhật</button>
                </div>
            </div>
        </div>
    );
}
