import React, { useState } from 'react';
import { Search, Plus, MapPin, Mail, Phone, Box, Filter } from 'lucide-react';
import Pagination from '../common/Pagination';
import SupplierModal from '../modals/SupplierModal';

export default function SupplierView({ suppliers, setSuppliers }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const itemsPerPage = 8;

    const filteredSuppliers = suppliers.filter(s =>
        (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.phone || '').includes(searchQuery)
    );

    const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
    const paginatedSuppliers = filteredSuppliers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleOpenModal = (supplier = null) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleSaveSupplier = (supplierData) => {
        if (supplierData.id) {
            setSuppliers(suppliers.map(s => s.id === supplierData.id ? supplierData : s));
        } else {
            const newId = 'NCC' + Math.floor(100 + Math.random() * 900);
            setSuppliers([{ ...supplierData, id: newId }, ...suppliers]);
        }
        setIsModalOpen(false);
    };

    const handleToggleStatus = (id) => {
        setSuppliers(suppliers.map(s => {
            if (s.id === id) {
                return { ...s, status: s.status === 'Hoạt động' ? 'Ngừng hợp tác' : 'Hoạt động' };
            }
            return s;
        }));
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col relative">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
                <div>
                    <h3 className="font-bold text-xl text-gray-800">Quản lý Nhà Cung Cấp</h3>
                    <p className="text-sm text-gray-500 mt-1">Quản lý danh sách đối tác cung cấp nguyên liệu</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm tên, SĐT..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64 pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-shadow"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus size={16} /> Thêm nhà cung cấp
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                            <th className="p-4 font-medium uppercase tracking-wider">Nhà Cung Cấp</th>
                            <th className="p-4 font-medium uppercase tracking-wider">Người Liên Hệ</th>
                            <th className="p-4 font-medium uppercase tracking-wider">Mặt Hàng CC</th>
                            <th className="p-4 font-medium uppercase tracking-wider text-center">Trạng Thái</th>
                            <th className="p-4 font-medium uppercase tracking-wider text-right">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {paginatedSuppliers.map(sup => (
                            <tr key={sup.id} className={`hover:bg-gray-50/50 transition-colors ${sup.status === 'Ngừng hợp tác' ? 'opacity-60 bg-gray-50' : ''}`}>
                                <td className="p-4">
                                    <div className="font-bold text-gray-900 text-base">{sup.name}</div>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin size={12} /> {sup.address}</div>
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-gray-800">{sup.contactPerson}</div>
                                    <div className="text-xs text-gray-500 mt-1 flex flex-col gap-0.5">
                                        <span className="flex items-center gap-1"><Phone size={10} /> {sup.phone}</span>
                                        <span className="flex items-center gap-1"><Mail size={10} /> {sup.email}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-start gap-1.5 max-w-xs text-gray-700">
                                        <Box size={14} className="mt-0.5 text-gray-400 shrink-0" />
                                        <span className="line-clamp-2">{sup.products}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm ${
                                        sup.status === 'Hoạt động' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                                    }`}>
                                        {sup.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button 
                                        onClick={() => handleOpenModal(sup)}
                                        className="text-xs font-bold px-3 py-1.5 text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition-colors"
                                    >
                                        Sửa
                                    </button>
                                    <button 
                                        onClick={() => handleToggleStatus(sup.id)}
                                        className={`text-xs font-bold px-3 py-1.5 border rounded transition-colors ${
                                            sup.status === 'Hoạt động' ? 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100' : 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100'
                                        }`}
                                    >
                                        {sup.status === 'Hoạt động' ? 'Khóa' : 'Mở lại'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {paginatedSuppliers.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    Không tìm thấy nhà cung cấp nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            
            {isModalOpen && (
                <SupplierModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSaveSupplier}
                    supplier={editingSupplier}
                />
            )}
        </div>
    );
}
