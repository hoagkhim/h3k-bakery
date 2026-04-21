import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, X, Search, BarChart3 } from 'lucide-react';
import TransactionModal from '../modals/TransactionModal';
import CategoryModal from '../modals/CategoryModal';
import Pagination from '../common/Pagination';
import { ROLES } from '../../constants';

const CashbookView = ({ transactions, setTransactions, loaithuchi, setLoaithuchi, currentUser }) => {
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'history' | 'categories'
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    
    // Category Modal states
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Filter & Search states cho Lịch sử giao dịch
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all' | 'Thu' | 'Chi'
    const [currentPage, setCurrentPage] = useState(1);
    const [categoryPage, setCategoryPage] = useState(1);
    const itemsPerPage = 6;

    React.useEffect(() => { setCurrentPage(1); }, [searchQuery, filterType]);

    // Calculate KPIs (Tính toán dựa trên toàn bộ transactions TRỪ những phiếu đã hủy)
    const kpi = transactions.filter(t => !t.isCancelled).reduce((acc, curr) => {
        if (curr.type === 'Thu') {
            acc.tongThu += curr.amount;
        } else if (curr.type === 'Chi') {
            acc.tongChi += curr.amount;
        }
        return acc;
    }, { tongThu: 0, tongChi: 0 });
    
    const tonQuy = kpi.tongThu - kpi.tongChi;

    // Lọc danh sách giao dịch hiển thị
    const filteredTransactions = transactions.filter(txn => {
        const query = searchQuery.toLowerCase();
        const matchSearch = txn.id.toLowerCase().includes(query) || (txn.description && txn.description.toLowerCase().includes(query));
        const matchType = filterType === 'all' ? true : txn.type === filterType;
        return matchSearch && matchType;
    });

    // Helper to get category name
    const getCategoryName = (categoryId) => {
        const category = loaithuchi.find(c => c.id === categoryId);
        return category ? category.name : 'Không rõ';
    };

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalCategoryPages = Math.ceil(loaithuchi.length / itemsPerPage);
    const paginatedCategories = loaithuchi.slice((categoryPage - 1) * itemsPerPage, categoryPage * itemsPerPage);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleOpenCategoryModal = (cat = null) => {
        setEditingCategory(cat);
        setIsCategoryModalOpen(true);
    };

    const handleSaveCategory = (catData) => {
        if (catData.id) {
            setLoaithuchi(loaithuchi.map(c => c.id === catData.id ? catData : c));
        } else {
            const newId = 'LTC' + Math.floor(100 + Math.random() * 900);
            setLoaithuchi([...loaithuchi, { ...catData, id: newId }]);
        }
    };

    const handleToggleCategoryStatus = (id) => {
        setLoaithuchi(loaithuchi.map(c => {
            if (c.id === id) {
                return { ...c, deletedAt: c.deletedAt ? null : new Date().toISOString() };
            }
            return c;
        }));
    };

    const handleCancelTransaction = (txnId) => {
        if (window.confirm('Bạn có chắc chắn muốn Hủy phiếu này? Tồn Quỹ sẽ được hệ thống cập nhật lại.')) {
            setTransactions(transactions.map(t => 
                t.id === txnId ? { ...t, isCancelled: true } : t
            ));
        }
    };

    return (
        <div className="p-6 h-full flex flex-col bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Sổ Quỹ</h1>
                    <p className="text-gray-500 text-sm mt-1">Quản lý dòng tiền thu chi của cửa hàng</p>
                </div>
                <button 
                    onClick={() => setIsTransactionModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Lập Phiếu Thu/Chi
                </button>
            </div>

            {/* Main Content Area */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
                <div className="border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex">
                        <button 
                            className={`py-3 px-6 font-bold text-sm transition-colors border-b-2 ${activeTab === 'overview' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Tổng Quan
                        </button>
                        <button 
                            className={`py-3 px-6 font-bold text-sm transition-colors border-b-2 ${activeTab === 'history' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => setActiveTab('history')}
                        >
                            Lịch Sử Giao Dịch
                        </button>
                        {currentUser?.role === ROLES.MANAGER && (
                            <button 
                                className={`py-3 px-6 font-bold text-sm transition-colors border-b-2 ${activeTab === 'categories' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                                onClick={() => setActiveTab('categories')}
                            >
                                Cấu hình Danh mục
                            </button>
                        )}
                    </div>
                    {activeTab === 'categories' && (
                        <div className="px-4">
                            <button 
                                onClick={() => handleOpenCategoryModal()}
                                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-bold bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm"
                            >
                                <Plus size={16} /> Thêm danh mục mới
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="flex-1 overflow-auto flex flex-col">
                    {activeTab === 'overview' ? (
                        <div className="p-6 h-full overflow-y-auto bg-gray-50/50">
                            {/* KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium mb-1">Tổng Thu (Hệ thống)</p>
                                        <p className="text-2xl font-bold text-green-600">{formatCurrency(kpi.tongThu)}</p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <TrendingUp className="text-green-600" size={24} />
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium mb-1">Tổng Chi (Hệ thống)</p>
                                        <p className="text-2xl font-bold text-red-600">{formatCurrency(kpi.tongChi)}</p>
                                    </div>
                                    <div className="bg-red-100 p-3 rounded-full">
                                        <TrendingDown className="text-red-600" size={24} />
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium mb-1">Tồn Quỹ Hiện Tại</p>
                                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(tonQuy)}</p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <Wallet className="text-blue-600" size={24} />
                                    </div>
                                </div>
                            </div>

                            {/* Biểu đồ Minh hoạ */}
                            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2"><BarChart3 size={20} className="text-blue-600" /> Tỷ trọng Thu / Chi (Hệ thống)</h3>
                                </div>
                                
                                {kpi.tongThu === 0 && kpi.tongChi === 0 ? (
                                    <div className="h-48 flex items-center justify-center text-gray-400 font-medium border-2 border-dashed border-gray-200 rounded-xl">
                                        Chưa có giao dịch nào để thống kê
                                    </div>
                                ) : (
                                    <div className="flex flex-col md:flex-row items-center gap-10 justify-center">
                                        {/* CSS Progress Bar Concept */}
                                        <div className="flex-1 w-full flex flex-col gap-6">
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-bold text-green-700">Tỷ trọng Thu</span>
                                                    <span className="font-bold text-green-600">{Math.round((kpi.tongThu / (kpi.tongThu + kpi.tongChi)) * 100) || 0}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                                                    <div className="bg-green-500 h-4 rounded-full transition-all duration-1000" style={{ width: `${Math.round((kpi.tongThu / (kpi.tongThu + kpi.tongChi)) * 100) || 0}%` }}></div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-bold text-red-700">Tỷ trọng Chi</span>
                                                    <span className="font-bold text-red-600">{Math.round((kpi.tongChi / (kpi.tongThu + kpi.tongChi)) * 100) || 0}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                                                    <div className="bg-red-400 h-4 rounded-full transition-all duration-1000" style={{ width: `${Math.round((kpi.tongChi / (kpi.tongThu + kpi.tongChi)) * 100) || 0}%` }}></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Simple Side-by-side Bar Chart */}
                                        <div className="h-56 flex items-end justify-center gap-6 border-b border-gray-200 pb-2 w-64 shrink-0 relative">
                                            <div className="flex flex-col items-center gap-2 h-full justify-end w-16 group">
                                                <span className="text-xs font-bold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity mb-2">Thu</span>
                                                <div className="w-full bg-green-500 rounded-t-lg transition-all duration-1000 hover:opacity-80 shadow-md" style={{ height: `${Math.max(10, Math.round((kpi.tongThu / Math.max(kpi.tongThu, kpi.tongChi)) * 100))}%` }}></div>
                                            </div>
                                            <div className="flex flex-col items-center gap-2 h-full justify-end w-16 group">
                                                <span className="text-xs font-bold text-red-600 opacity-0 group-hover:opacity-100 transition-opacity mb-2">Chi</span>
                                                <div className="w-full bg-red-400 rounded-t-lg transition-all duration-1000 hover:opacity-80 shadow-md" style={{ height: `${Math.max(10, Math.round((kpi.tongChi / Math.max(kpi.tongThu, kpi.tongChi)) * 100))}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : activeTab === 'history' ? (
                        <>
                            {/* Thanh công cụ Tra cứu & Lọc */}
                            <div className="p-4 border-b border-gray-100 flex gap-4 bg-white shrink-0">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Tìm mã phiếu, mô tả..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors"
                                    />
                                </div>
                                <select 
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50 focus:bg-white text-gray-700 font-medium cursor-pointer"
                                >
                                    <option value="all">Tất cả giao dịch</option>
                                    <option value="Thu">Chỉ phiếu Thu</option>
                                    <option value="Chi">Chỉ phiếu Chi</option>
                                </select>
                            </div>
                            
                            <div className="flex-1 overflow-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-gray-50 text-gray-600 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Mã Phiếu</th>
                                            <th className="px-6 py-4 font-medium">Thời Gian</th>
                                            <th className="px-6 py-4 font-medium">Loại</th>
                                            <th className="px-6 py-4 font-medium">Danh Mục</th>
                                            <th className="px-6 py-4 font-medium">Số Tiền</th>
                                            <th className="px-6 py-4 font-medium">Mô Tả</th>
                                            <th className="px-6 py-4 font-medium">Người Lập</th>
                                            <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedTransactions.map((txn) => {
                                            // Kiểm tra phiếu thủ công: Không có reference/MaHD/MaPN và KHÔNG thuộc danh mục auto (Bán hàng, Nhập nguyên liệu)
                                            const catName = getCategoryName(txn.categoryId);
                                            const isManual = !txn.referenceId && !txn.reference && !txn.MaHD && !txn.MaPN && catName !== 'Bán hàng' && catName !== 'Nhập nguyên liệu';

                                            
                                            return (
                                                <tr key={txn.id} className={`transition-colors ${txn.isCancelled ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'}`}>
                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        {txn.id}
                                                        {txn.isCancelled && <span className="ml-2 px-1.5 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded font-bold uppercase tracking-wider">Đã hủy</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {new Date(txn.date).toLocaleString('vi-VN', {
                                                            day: '2-digit', month: '2-digit', year: 'numeric',
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                            txn.type === 'Thu' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {txn.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700">{getCategoryName(txn.categoryId)}</td>
                                                    <td className={`px-6 py-4 font-medium ${txn.isCancelled ? 'line-through text-gray-400' : (txn.type === 'Thu' ? 'text-green-600' : 'text-red-600')}`}>
                                                        {txn.type === 'Thu' ? '+' : '-'}{formatCurrency(txn.amount)}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={txn.description}>
                                                        {txn.description}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">{txn.user}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        {!txn.isCancelled && isManual && (
                                                            <button 
                                                                onClick={() => handleCancelTransaction(txn.id)}
                                                                className="text-xs font-bold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded shadow-sm transition-colors"
                                                            >
                                                                Hủy
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {filteredTransactions.length === 0 && (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                                    Không tìm thấy giao dịch nào phù hợp với bộ lọc
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredTransactions.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
                        </>
                    ) : (
                        <>
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-amber-50/50 text-amber-900 sticky top-0 border-b border-amber-100">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">ID</th>
                                        <th className="px-6 py-4 font-bold">Tên Danh Mục</th>
                                        <th className="px-6 py-4 font-bold text-center">Phân Loại</th>
                                        <th className="px-6 py-4 font-bold text-center">Trạng Thái</th>
                                        <th className="px-6 py-4 font-bold text-right">Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedCategories.map((cat) => (
                                        <tr key={cat.id} className={`transition-colors ${cat.deletedAt ? 'bg-gray-50/50 opacity-75' : 'hover:bg-amber-50/30'}`}>
                                            <td className="px-6 py-4 font-bold text-gray-900">{cat.id}</td>
                                            <td className="px-6 py-4 font-medium text-gray-800">{cat.name}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border ${cat.type === 'Thu' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                    {cat.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {cat.deletedAt ? (
                                                    <span className="text-red-600 font-bold text-xs bg-red-100 px-2 py-1 rounded border border-red-200">Đã khóa</span>
                                                ) : (
                                                    <span className="text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded border border-green-200">Đang dùng</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => handleOpenCategoryModal(cat)} className="text-blue-600 hover:text-blue-800 text-xs font-bold px-3 py-1.5 bg-blue-50 rounded shadow-sm border border-blue-100">Sửa</button>
                                                <button onClick={() => handleToggleCategoryStatus(cat.id)} className={`text-xs font-bold px-3 py-1.5 rounded shadow-sm border ${cat.deletedAt ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}>
                                                    {cat.deletedAt ? 'Mở khóa' : 'Khóa'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {loaithuchi.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                Chưa có danh mục nào
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <Pagination currentPage={categoryPage} totalPages={totalCategoryPages} totalItems={loaithuchi.length} itemsPerPage={itemsPerPage} onPageChange={setCategoryPage} />
                        </>
                    )}
                </div>
            </div>

            {/* Modals */}
            {isTransactionModalOpen && (
                <TransactionModal 
                    onClose={() => setIsTransactionModalOpen(false)}
                    loaithuchi={loaithuchi.filter(c => !c.deletedAt)} // Thêm lọc mục không bị khóa
                    onSave={(newTxn) => {
                        const txnId = 'PTC' + Math.floor(1000 + Math.random() * 9000);
                        const finalTxn = {
                            ...newTxn,
                            id: txnId,
                            date: new Date().toISOString(),
                            user: currentUser?.name || 'Admin', // Lấy tên thật của current user
                            isCancelled: false
                        };
                        setTransactions([finalTxn, ...transactions]);
                    }}
                />
            )}

            <CategoryModal 
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onSave={handleSaveCategory}
                category={editingCategory}
            />
        </div>
    );
};

export default CashbookView;
