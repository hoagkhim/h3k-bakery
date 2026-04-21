import React, { useState, useEffect } from 'react';
import {
    Search, FileText, Package, Clock, CheckCircle2, AlertTriangle,
    Truck, Store, PackagePlus, ChevronDown, ChevronUp, Calendar
} from 'lucide-react';
import { ROLES } from '../../constants';
import StatusBadge from '../common/StatusBadge';
import Pagination from '../common/Pagination';

// --- KDSOrderCard ---
function KDSOrderCard({ order, bakerAction }) {
    const [expanded, setExpanded] = useState(false);
    const isInternal = order.type === 'Sản xuất nội bộ';
    return (
        <div className={`bg-white rounded-2xl shadow-md border-t-8 flex flex-col ${order.urgent ? 'border-red-500' : isInternal ? 'border-purple-500' : 'border-amber-500'}`}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                <div><span className="font-bold text-lg">{order.id}</span><div className="text-sm text-gray-500 mt-1 flex items-center gap-1"><Clock size={14} /> {order.time}</div></div>
                <span className={`px-2 py-1 text-xs font-bold rounded text-white ${order.status === 'Đang sản xuất' ? 'bg-blue-500' : isInternal ? 'bg-purple-500' : 'bg-amber-500'}`}>{order.status}</span>
            </div>
            <div className="p-4 flex-1">
                {order.customDetails ? (
                    <><p className="text-sm font-bold text-gray-800 mb-2">Món: <span className="text-amber-700">{order.items}</span></p>
                        <div className="mt-3">
                            {!expanded ? <button onClick={() => setExpanded(true)} className="text-xs bg-amber-100 text-amber-800 px-3 py-2 rounded-lg font-bold hover:bg-amber-200 transition-colors w-full text-left flex justify-between items-center shadow-sm"><span>+ Xem chi tiết cốt/nhân...</span><ChevronDown size={14} /></button>
                                : <div className="space-y-2 bg-amber-50/80 p-3 rounded-lg border border-amber-200 text-sm shadow-inner">
                                    <div className="flex flex-wrap gap-1.5 mb-2"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-bold shadow-sm">{order.customDetails.size}</span><span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs font-bold shadow-sm">{order.customDetails.base}</span><span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-md text-xs font-bold shadow-sm">{order.customDetails.filling}</span></div>
                                    <p><span className="text-gray-500 font-bold text-xs">Trang trí:</span> {order.customDetails.decor}</p><p><span className="text-gray-500 font-bold text-xs">Chữ:</span> "{order.customDetails.message}"</p><p><span className="text-gray-500 font-bold text-xs">Ghi chú:</span> {order.customDetails.note}</p>
                                    <button onClick={() => setExpanded(false)} className="w-full text-center text-xs text-amber-600 hover:text-amber-800 hover:bg-amber-100 font-bold mt-2 py-1.5 rounded transition-colors flex items-center justify-center gap-1">Thu gọn <ChevronUp size={14} /></button>
                                </div>}
                        </div></>
                ) : <><p className="text-sm font-bold text-gray-800 mb-2">{isInternal ? 'Lệnh nội bộ:' : 'Yêu cầu:'}</p><p className="text-sm font-medium text-gray-800 whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-100">{order.items}</p></>}
                
                {order.receiveType === 'Giao đi' && order.address && (
                    <div className="mt-3 bg-blue-50 border border-blue-100 text-blue-800 p-2.5 rounded-lg flex items-start gap-2 shadow-sm">
                        <Truck size={16} className="shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <span className="font-bold block text-xs uppercase mb-0.5 text-blue-900 border-b border-blue-200 pb-0.5 inline-block">Địa chỉ giao hàng</span>
                            <span className="font-medium block mt-1">{order.address}</span>
                        </div>
                    </div>
                )}
                
                {order.urgent && <p className="mt-3 text-xs font-bold text-red-600 flex items-center gap-1 bg-red-50 p-1.5 rounded-lg w-max"><AlertTriangle size={14} /> ĐƠN GẤP</p>}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">{bakerAction(order)}</div>
        </div>
    );
}

// --- OrderKDSView ---
export default function OrderKDSView({ role, orders, setOrders, products, setProducts }) {
    const [filter, setFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => { setCurrentPage(1); }, [filter, searchQuery, dateFilter]);

    const isBaker = role === ROLES.BAKER;

    const filteredOrders = orders.filter(o => {
        let isStatusMatch = true;
        if (isBaker) {
            isStatusMatch = ['Mới đặt', 'Đã cọc', 'Đang sản xuất'].includes(o?.status || '');
        } else {
            if (filter === 'completed') isStatusMatch = ['Chờ giao', 'Chờ khách lấy', 'Hoàn thành'].includes(o?.status || '');
            else if (filter === 'processing') isStatusMatch = ['Mới đặt', 'Đã cọc', 'Đang sản xuất'].includes(o?.status || '');
        }

        let isSearchMatch = true;
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            const matchId = (o?.id || '').toLowerCase().includes(query);
            const matchPhone = (o?.phone || '').includes(query);
            isSearchMatch = matchId || matchPhone;
        }

        let isDateMatch = true;
        if (dateFilter === 'today') isDateMatch = (o?.time || '').includes('Hôm nay');
        else if (dateFilter === 'tomorrow') isDateMatch = (o?.time || '').includes('Ngày mai');

        return isStatusMatch && isSearchMatch && isDateMatch;
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleStatusChange = (orderId, newStatus) => {
        const targetOrder = orders.find(o => o.id === orderId);
        if (newStatus === 'Hoàn thành' && targetOrder?.type === 'Sản xuất nội bộ') {
            const updatedProducts = products.map(p =>
                p.id === targetOrder.productId ? { ...p, stock: (p.stock || 0) + (targetOrder.makeQty || 0) } : p
            );
            setProducts(updatedProducts);
        }
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    const bakerAction = (order) => {
        if (order.status === 'Mới đặt' || order.status === 'Đã cọc') return <button onClick={() => handleStatusChange(order.id, 'Đang sản xuất')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg w-full shadow-sm">👨‍🍳 Bắt đầu làm</button>;
        if (order.status === 'Đang sản xuất') {
            if (order.type === 'Sản xuất nội bộ') return <button onClick={() => handleStatusChange(order.id, 'Hoàn thành')} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg w-full shadow-sm">✅ Xong & Nhập Kho</button>;
            const nextStatus = order.receiveType === 'Giao đi' ? 'Chờ giao' : 'Chờ khách lấy';
            return <button onClick={() => handleStatusChange(order.id, nextStatus)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg w-full shadow-sm">✅ Xong & In Tem</button>;
        }
        return null;
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-3xl shadow-sm border border-amber-100 overflow-hidden">
            <div className="p-5 border-b border-amber-100 flex justify-between items-center bg-amber-50/50 shrink-0">
                <div>
                    <h3 className="font-bold text-xl text-amber-950">{isBaker ? 'Màn Hình Bếp' : 'Quản lý Đơn Đặt Hàng'}</h3>
                    {isBaker && <p className="text-sm text-red-600 font-medium">⚠️ Ưu tiên làm các đơn Khẩn cấp trước</p>}
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
                        <input type="text" placeholder="Tìm mã đơn, SĐT khách..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-48 xl:w-64 pl-9 pr-4 py-2 border border-amber-200 rounded-lg text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 bg-white" />
                    </div>
                    <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
                        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="pl-9 pr-8 py-2 bg-white border border-amber-200 text-sm rounded-lg outline-none focus:border-amber-500 cursor-pointer text-amber-900 font-medium">
                            <option value="all">Tất cả thời gian</option><option value="today">Hôm nay</option><option value="tomorrow">Ngày mai</option>
                        </select>
                    </div>
                    {!isBaker && (
                        <select onChange={(e) => setFilter(e.target.value)} className="bg-white border border-amber-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-amber-500 text-amber-900 font-medium">
                            <option value="all">Tất cả đơn hàng</option><option value="processing">Đang xử lý</option><option value="completed">Đã hoàn thành/Chờ giao</option>
                        </select>
                    )}
                </div>
            </div>

            {isBaker ? (
                <div className="flex-1 p-6 bg-gray-100 overflow-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 content-start">
                        {paginatedOrders.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0)).map(order => <KDSOrderCard key={order.id} order={order} bakerAction={bakerAction} />)}
                        {paginatedOrders.length === 0 && <div className="col-span-full text-center py-10 text-gray-500 font-medium">Không tìm thấy đơn hàng nào.</div>}
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-amber-50/80 text-amber-800 text-sm border-b border-amber-200">
                                <th className="p-4 font-bold">Mã Đơn</th><th className="p-4 font-bold">Khách Hàng</th><th className="p-4 font-bold">Nhận Lúc</th><th className="p-4 font-bold">Loại / Nhận hàng</th><th className="p-4 font-bold">Tài chính</th><th className="p-4 font-bold">Trạng Thái</th><th className="p-4 font-bold text-right">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {paginatedOrders.map(order => (
                                <tr key={order.id} className="border-b border-amber-50 hover:bg-amber-50/30 transition-colors">
                                    <td className="p-4 font-bold text-amber-900">{order.id}</td>
                                    <td className="p-4"><div className="font-bold text-amber-950">{order.customer}</div><div className="text-xs text-amber-600">{order.phone}</div></td>
                                    <td className="p-4 text-amber-800 font-medium"><span className={order.urgent ? 'text-red-600 font-bold' : ''}>{order.time}</span></td>
                                    <td className="p-4">
                                        <div className="font-medium flex items-center gap-1">{order.type === 'Sản xuất nội bộ' && <PackagePlus size={14} className="text-purple-600" />} {order.type}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">{order.receiveType === 'Giao đi' ? <Truck size={12} /> : <Store size={12} />} {order.receiveType}</div>
                                    </td>
                                    <td className="p-4">
                                        {order.type === 'Sản xuất nội bộ' ? <span className="text-gray-400 font-medium italic">Nội bộ (Không thu)</span> : <><div className="font-bold text-amber-900">{(order.total || 0).toLocaleString()}đ</div><div className="text-xs text-gray-500 mt-1">Đã cọc: {(order.deposit || 0).toLocaleString()}đ</div></>}
                                    </td>
                                    <td className="p-4"><StatusBadge status={order.status} /></td>
                                    <td className="p-4 text-right">
                                        {(order.status === 'Chờ giao' || order.status === 'Chờ khách lấy') && <button onClick={() => handleStatusChange(order.id, 'Hoàn thành')} className="text-xs px-3 py-1.5 bg-green-600 text-white font-bold rounded shadow-sm hover:bg-green-700 mr-2">Giao bánh</button>}
                                        <button className="text-sm text-amber-700 hover:text-amber-900 font-bold underline">Chi tiết</button>
                                    </td>
                                </tr>
                            ))}
                            {paginatedOrders.length === 0 && <tr><td colSpan="7" className="p-8 text-center text-gray-500 font-medium">Không tìm thấy đơn hàng nào.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
}
