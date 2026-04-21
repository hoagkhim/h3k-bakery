import React, { useState } from 'react';
import { UserCircle, X, Save } from 'lucide-react';
import { ROLES } from '../../constants';

export default function HREmployeeModal({ user, onClose, onSave }) {
    const isNew = !user;
    const [formData, setFormData] = useState(user || { username: '', password: '', name: '', phone: '', dob: '', role: ROLES.CASHIER, status: 1 });

    const handleSave = () => {
        if (!formData.username || !formData.name || !formData.role) return alert('Vui lòng điền các trường bắt buộc!');
        if (isNew && !formData.password) return alert('Cấp mật khẩu ban đầu!');
        onSave(formData, isNew);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-[500px] shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-amber-100 bg-amber-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2"><UserCircle size={20} /> {isNew ? 'Thêm nhân sự mới' : 'Cập nhật hồ sơ'}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-amber-200 rounded-full text-amber-800"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                        <div><label className="block text-xs font-bold text-gray-700 mb-1">Username (*)</label><input type="text" value={formData?.username || ''} onChange={e => setFormData({ ...formData, username: e.target.value })} disabled={!isNew} className="w-full border-2 border-gray-200 rounded-xl p-2.5 outline-none focus:border-amber-500 text-sm font-bold bg-gray-50" /></div>
                        {isNew && <div><label className="block text-xs font-bold text-gray-700 mb-1">Mật khẩu (*)</label><input type="text" value={formData?.password || ''} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full border-2 border-amber-200 rounded-xl p-2.5 outline-none focus:border-amber-500 text-sm font-bold" /></div>}
                    </div>
                    <div><label className="block text-xs font-bold text-gray-700 mb-1">Họ Tên (*)</label><input type="text" value={formData?.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border-2 border-amber-100 rounded-xl p-2.5 outline-none focus:border-amber-500 text-sm font-medium" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-700 mb-1">SĐT</label><input type="text" value={formData?.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full border-2 border-amber-100 rounded-xl p-2.5 outline-none focus:border-amber-500 text-sm font-medium" /></div>
                        <div><label className="block text-xs font-bold text-gray-700 mb-1">Ngày sinh</label><input type="date" value={formData?.dob || ''} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="w-full border-2 border-amber-100 rounded-xl p-2.5 outline-none focus:border-amber-500 text-sm font-medium" /></div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Vai trò (*)</label>
                        <select value={formData?.role || ROLES.CASHIER} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full border-2 border-amber-200 bg-amber-50 rounded-xl p-2.5 outline-none focus:border-amber-500 text-sm font-bold text-amber-900">
                            {Object.values(ROLES).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                        <input type="checkbox" id="status-toggle-hr" checked={formData?.status === 1} onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 1 : 0 })} className="w-5 h-5 text-amber-600 bg-white border-gray-300 rounded focus:ring-amber-500 cursor-pointer" />
                        <label htmlFor="status-toggle-hr" className="text-sm font-bold text-gray-700 cursor-pointer select-none flex-1">Tài khoản hợp lệ (Bỏ tick để khóa tài khoản)</label>
                    </div>
                </div>
                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl">Hủy</button>
                    <button onClick={handleSave} className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm"><Save size={18} /> Lưu</button>
                </div>
            </div>
        </div>
    );
}
