import React, { useState } from 'react';
import {
    LockKeyhole, UnlockKeyhole, Lock, Eye, EyeOff,
    AlertCircle, CheckCircle2, Save
} from 'lucide-react';

export default function AccountView({ currentUser, setCurrentUser, usersDb, setUsersDb }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const togglePasswordVisibility = (field) => setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });

    const handleChangePassword = (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        if (!currentPassword || !newPassword || !confirmPassword) return setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ tất cả các trường!' });
        if (currentPassword !== currentUser.password) return setMessage({ type: 'error', text: 'Mật khẩu hiện tại không chính xác!' });
        if (newPassword !== confirmPassword) return setMessage({ type: 'error', text: 'Mật khẩu mới nhập lại không khớp!' });
        if (newPassword === currentPassword) return setMessage({ type: 'error', text: 'Mật khẩu mới phải khác mật khẩu hiện tại!' });

        const updatedUsers = usersDb.map(u => u.username === currentUser.username ? { ...u, password: newPassword } : u);
        setUsersDb(updatedUsers);
        setMessage({ type: 'success', text: 'Đổi mật khẩu thành công! Hệ thống đang tự động đăng xuất...' });
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        setTimeout(() => setCurrentUser(null), 2000);
    };

    return (
        <div className="h-full flex flex-col gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-sm border border-amber-100 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shrink-0">
                <div className="w-32 h-32 bg-amber-800 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg border-4 border-amber-50 shrink-0">{currentUser.name.charAt(0)}</div>
                <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                        <div><h2 className="text-3xl font-bold text-amber-950 leading-tight">{currentUser.name}</h2><p className="text-amber-800 font-bold bg-amber-50 px-4 py-1.5 rounded-full mt-2 text-sm border border-amber-200 inline-block">Vai trò: {currentUser.role}</p></div>
                        <span className="font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm h-max"><UnlockKeyhole size={16} /> Đang làm việc</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm mb-6">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className="text-gray-500 font-bold">Tên đăng nhập</span><span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded font-mono">{currentUser.username}</span></div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className="text-gray-500 font-bold">Số điện thoại</span><span className="font-bold text-gray-900">{currentUser.phone || 'Chưa cập nhật'}</span></div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2"><span className="text-gray-500 font-bold">Ngày sinh</span><span className="font-bold text-gray-900">{currentUser.dob ? new Date(currentUser.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</span></div>
                    </div>
                    <button onClick={() => setShowPasswordForm(!showPasswordForm)} className={`px-5 py-2.5 font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm text-sm w-max ${showPasswordForm ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200' : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'}`}>
                        <LockKeyhole size={16} /> {showPasswordForm ? 'Hủy và Đóng form' : 'Đổi mật khẩu cá nhân'}
                    </button>
                </div>
            </div>
            {showPasswordForm && (
                <div className="bg-white rounded-3xl shadow-sm border border-amber-100 p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-xl font-bold text-amber-950 mb-6 border-b border-amber-100 pb-4 flex items-center gap-2"><LockKeyhole size={20} className="text-amber-600" /> Thay đổi mật khẩu</h3>
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 font-bold text-sm animate-in fade-in slide-in-from-top-2 ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                            {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}{message.text}
                        </div>
                    )}
                    <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-amber-900 mb-2">Mật khẩu hiện tại</label>
                            <div className="relative max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div>
                                <input type={showPasswords.current ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-colors" placeholder="Nhập mật khẩu đang sử dụng" autoFocus />
                                <button type="button" onClick={() => togglePasswordVisibility('current')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-amber-600 transition-colors">{showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-amber-900 mb-2">Mật khẩu mới</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><LockKeyhole size={18} /></div>
                                <input type={showPasswords.new ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-colors" placeholder="Nhập mật khẩu mới" />
                                <button type="button" onClick={() => togglePasswordVisibility('new')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-amber-600 transition-colors">{showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-amber-900 mb-2">Nhập lại mật khẩu mới</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><CheckCircle2 size={18} /></div>
                                <input type={showPasswords.confirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-colors" placeholder="Xác nhận lại mật khẩu mới" />
                                <button type="button" onClick={() => togglePasswordVisibility('confirm')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-amber-600 transition-colors">{showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                            </div>
                        </div>
                        <div className="md:col-span-2 pt-2">
                            <button type="submit" className="w-max px-8 py-3.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"><Save size={18} /> Lưu Mật Khẩu Mới</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
