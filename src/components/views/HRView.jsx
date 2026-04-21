import React, { useState, useEffect } from 'react';
import { Search, Plus, UnlockKeyhole, LockKeyhole, Edit } from 'lucide-react';
import { ROLES } from '../../constants';
import Pagination from '../common/Pagination';
import HREmployeeModal from '../modals/HREmployeeModal';

export default function HRView({ usersDb, setUsersDb }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

    const filteredUsers = usersDb.filter(u => {
        let isMatch = (u?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (u?.username || '').toLowerCase().includes(searchQuery.toLowerCase());
        if (statusFilter === 'active') isMatch = isMatch && u.status === 1;
        if (statusFilter === 'inactive') isMatch = isMatch && u.status === 0;
        return isMatch;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleStatus = (username) => {
        if (window.confirm('Xác nhận thay đổi trạng thái tài khoản này?')) {
            setUsersDb(usersDb.map(u => u.username === username ? { ...u, status: u.status === 1 ? 0 : 1 } : u));
        }
    };

    const handleSaveUser = (userFormData, isNew) => {
        if (isNew) {
            if (usersDb.some(u => u.username === userFormData.username)) return alert('Username đã tồn tại!');
            setUsersDb([...usersDb, userFormData]);
        } else {
            setUsersDb(usersDb.map(u => u.username === userFormData.username ? { ...u, ...userFormData } : u));
        }
        setShowModal(false);
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-amber-100 overflow-hidden h-full flex flex-col relative">
            <div className="p-5 border-b border-amber-100 bg-amber-50/50 flex justify-between items-center shrink-0">
                <h3 className="font-bold text-xl text-amber-950">Quản lý Nhân Sự & Phân Quyền</h3>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
                        <input type="text" placeholder="Tìm tên NV, username..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-48 pl-9 pr-4 py-2 border border-amber-200 rounded-lg text-sm outline-none focus:border-amber-500 bg-white" />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-amber-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-amber-500 text-amber-900 font-medium">
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang làm (Mở)</option>
                        <option value="inactive">Đã nghỉ (Khóa)</option>
                    </select>
                    <button onClick={() => { setEditingUser(null); setShowModal(true); }} className="px-4 py-2 bg-amber-800 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-amber-900 shadow-sm"><Plus size={16} /> Thêm nhân sự</button>
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm border-b sticky top-0 z-10">
                        <tr><th className="p-4">Username</th><th className="p-4">Họ Tên</th><th className="p-4">Liên hệ</th><th className="p-4">Vai trò</th><th className="p-4 text-center">Trạng thái</th><th className="p-4 text-right">Thao tác</th></tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map(u => (
                            <tr key={u.username} className={`border-b text-sm transition-colors ${u.status === 0 ? 'bg-gray-50' : 'hover:bg-amber-50/30'}`}>
                                <td className="p-4 font-bold text-amber-900 font-mono">{u.username}</td>
                                <td className="p-4 font-bold text-gray-900">{u.name}</td>
                                <td className="p-4"><p className="text-gray-800">SĐT: {u.phone || 'Chưa cập nhật'}</p><p className="text-xs text-gray-500">NS: {u.dob || 'Chưa cập nhật'}</p></td>
                                <td className="p-4"><span className="bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1 rounded-md font-bold text-xs">{u.role}</span></td>
                                <td className="p-4 text-center">
                                    {u.status === 1
                                        ? <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-md font-bold text-xs"><UnlockKeyhole size={12} /> Đang làm</span>
                                        : <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-md font-bold text-xs"><LockKeyhole size={12} /> Đã khóa</span>
                                    }
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => { setEditingUser(u); setShowModal(true); }} className="text-amber-600 hover:text-amber-900 mr-4"><Edit size={18} /></button>
                                    <button onClick={() => toggleStatus(u.username)} className={`${u.status === 1 ? 'text-red-500' : 'text-green-600'} font-bold text-xs`}>{u.status === 1 ? 'Khóa' : 'Mở khóa'}</button>
                                </td>
                            </tr>
                        ))}
                        {paginatedUsers.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-gray-500 font-medium">Không tìm thấy nhân sự.</td></tr>}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            {showModal && <HREmployeeModal user={editingUser} onClose={() => setShowModal(false)} onSave={handleSaveUser} />}
        </div>
    );
}
