import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, LockKeyhole, Edit } from 'lucide-react';
import Pagination from '../common/Pagination';
import CustomerEditModal from '../modals/CustomerEditModal';

export default function CustomerView({ customers, setCustomers }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => { setCurrentPage(1); }, [searchQuery]);

    const filteredCustomers = customers.filter(c => {
        const nameMatch = (c?.name || '').toLowerCase().includes((searchQuery || '').toLowerCase());
        const phoneMatch = (c?.phone || '').includes(searchQuery || '');
        return nameMatch || phoneMatch;
    });

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleStatus = (id) => {
        if (window.confirm('Xác nhận thay đổi trạng thái của khách hàng này?')) {
            setCustomers(customers.map(c => c.id === id ? { ...c, status: c.status === 1 ? 0 : 1 } : c));
        }
    };

    const handleSaveCustomer = (custData) => {
        setCustomers(customers.map(c => c.id === custData.id ? { ...c, ...custData } : c));
        setShowModal(false);
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-amber-100 overflow-hidden h-full flex flex-col relative">
            <div className="p-5 border-b border-amber-100 bg-amber-50/50 flex justify-between items-center shrink-0">
                <h3 className="font-bold text-xl text-amber-950">Quản lý Khách Hàng</h3>
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
                    <input type="text" placeholder="Tìm tên, SĐT khách..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64 pl-9 pr-4 py-2 border border-amber-200 rounded-lg text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 bg-white" />
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm border-b sticky top-0 z-10">
                        <tr>
                            <th className="p-4">Mã KH</th>
                            <th className="p-4">Họ Tên & SĐT</th>
                            <th className="p-4">Địa chỉ</th>
                            <th className="p-4">Thành tích</th>
                            <th className="p-4 text-center">Trạng thái</th>
                            <th className="p-4 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedCustomers.map(c => (
                            <tr key={c.id} className={`border-b text-sm transition-colors ${c.status === 0 ? 'bg-gray-50 opacity-60' : 'hover:bg-amber-50/30'}`}>
                                <td className="p-4 font-bold text-amber-900">{c.id}</td>
                                <td className="p-4">
                                    <p className="font-bold text-gray-900">{c.name}</p>
                                    <p className="text-gray-500 font-medium">{c.phone}</p>
                                </td>
                                <td className="p-4 text-gray-700">{c.address || 'Chưa cập nhật'}</td>
                                <td className="p-4">
                                    <p className="font-bold text-blue-600">{c.points || 0} điểm</p>
                                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold text-[10px] uppercase">{c.tier || 'Đồng'} (Giảm {c.discount || 0}%)</span>
                                </td>
                                <td className="p-4 text-center">
                                    {c.status === 1
                                        ? <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-md font-bold text-xs"><CheckCircle2 size={12} /> Đang hoạt động</span>
                                        : <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-md font-bold text-xs"><LockKeyhole size={12} /> Đã khóa</span>
                                    }
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => { setEditingCustomer(c); setShowModal(true); }} className="text-amber-600 hover:text-amber-900 mr-4 font-medium"><Edit size={18} /></button>
                                    <button onClick={() => toggleStatus(c.id)} className={`${c.status === 1 ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'} font-bold text-xs`}>{c.status === 1 ? 'Khóa Thẻ' : 'Mở lại'}</button>
                                </td>
                            </tr>
                        ))}
                        {paginatedCustomers.length === 0 && (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500 font-medium">Không tìm thấy khách hàng.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredCustomers.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />

            {showModal && (
                <CustomerEditModal customer={editingCustomer} onClose={() => setShowModal(false)} onSave={handleSaveCustomer} />
            )}
        </div>
    );
}
