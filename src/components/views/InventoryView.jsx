import React, { useState, useEffect } from 'react';
import {
    Search, PackagePlus, PackageMinus, AlertTriangle, AlertCircle,
    CheckCircle2, X, Save, Trash2
} from 'lucide-react';
import { MOCK_SUPPLIERS } from '../../data/mockData';
import Pagination from '../common/Pagination';
import IngredientModal from '../modals/IngredientModal';

// --- ImportInventoryModal ---
function ImportInventoryModal({ inventory, setInventory, onClose, currentUser, transactions, setTransactions, inventoryHistory, setInventoryHistory }) {
    const [supplierId, setSupplierId] = useState('');
    const [batchNumber, setBatchNumber] = useState('');
    const [note, setNote] = useState('');
    const [items, setItems] = useState([]);

    const handleAddItem = (e) => {
        const nlId = e.target.value; if (!nlId) return;
        if (items.find(item => item.nlId === nlId)) return alert('Mặt hàng này đã có!');
        const invItem = inventory.find(i => i.id === nlId);
        setItems([...items, { nlId, name: invItem.name, unit: invItem.unit, qty: 1, price: invItem.price }]);
        e.target.value = '';
    };

    const updateItem = (index, field, value) => { const newItems = [...items]; newItems[index][field] = Number(value); setItems(newItems); };
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
    const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.price), 0);

    const handleSave = () => {
        if (!supplierId) return alert('Chọn Nhà cung cấp!');
        if (!batchNumber.trim()) return alert('Vui lòng nhập Số Lô (Batch Number)!');
        if (items.length === 0) return alert('Phiếu nhập trống!');
        const newInventory = inventory.map(inv => { const importedItem = items.find(i => i.nlId === inv.id); return importedItem ? { ...inv, stock: inv.stock + importedItem.qty } : inv; });
        setInventory(newInventory);
        
        const maPN = 'PN' + Math.floor(1000 + Math.random() * 9000);
        const supplierName = MOCK_SUPPLIERS.find(s => s.id === supplierId)?.name || '';

        if (setTransactions && transactions) {
            const newTransaction = {
                id: 'PTC' + Math.floor(1000 + Math.random() * 9000),
                date: new Date().toISOString(),
                type: 'Chi',
                categoryId: 'Nhập nguyên liệu',
                amount: totalAmount,
                referenceId: maPN,
                description: `Nhập hàng từ ${supplierName} (Lô: ${batchNumber})`,
                user: currentUser.name,
                isCancelled: false
            };
            setTransactions([newTransaction, ...transactions]);
        }
        
        if (setInventoryHistory && inventoryHistory) {
            const newHistoryRecord = {
                id: maPN,
                type: 'Nhập',
                time: new Date().toISOString(),
                creator: currentUser?.name || 'Nhân viên',
                supplierName: supplierName,
                batchNumber: batchNumber,
                items: items.map(i => ({ id: i.nlId, name: i.name, qty: i.qty, price: i.price, unit: i.unit, batchNumber: batchNumber })),
                totalValue: totalAmount,
                note: note || `Nhập kho từ lô ${batchNumber}`
            };
            setInventoryHistory([newHistoryRecord, ...inventoryHistory]);
        }
        
        alert(`Đã lưu phiếu nhập ${maPN} thành công!\nTổng tiền: ${totalAmount.toLocaleString()}đ\nHệ thống đã tự động tạo Phiếu chi trong Sổ quỹ!`); onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
                <div className="p-6 border-b border-amber-100 bg-amber-50 flex justify-between items-center shrink-0"><div><h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2"><PackagePlus size={24} /> Lập Phiếu Nhập Kho</h2><p className="text-sm text-amber-700 mt-1">Nhân viên lập phiếu: <strong>{currentUser.name}</strong></p></div><button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-amber-100 text-amber-800 shadow-sm"><X size={20} /></button></div>
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50 flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-bold text-gray-700 mb-2">Nhà cung cấp (*)</label><select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="w-full border border-amber-200 bg-white rounded-xl p-3 focus:border-amber-500 outline-none font-medium"><option value="">-- Chọn Nhà Cung Cấp --</option>{MOCK_SUPPLIERS.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}</select></div>
                        <div><label className="block text-sm font-bold text-gray-700 mb-2">Số Lô (Batch Number) (*)</label><input type="text" value={batchNumber} onChange={(e) => setBatchNumber(e.target.value)} placeholder="VD: BATCH-2024-001" className="w-full border border-amber-200 bg-white rounded-xl p-3 focus:border-amber-500 outline-none font-bold" /></div>
                        <div className="col-span-2"><label className="block text-sm font-bold text-gray-700 mb-2">Ghi chú phiếu nhập</label><input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="VD: Nhập hàng đầu tuần..." className="w-full border border-amber-200 bg-white rounded-xl p-3 focus:border-amber-500 outline-none" /></div>
                    </div>
                    <div>
                        <div className="flex justify-between items-end mb-3"><label className="block text-sm font-bold text-gray-700">Chi tiết hàng nhập</label><select onChange={handleAddItem} className="border-2 border-dashed border-amber-400 bg-amber-50 text-amber-800 rounded-lg py-2 px-4 outline-none font-bold text-sm cursor-pointer hover:bg-amber-100"><option value="">+ Thêm mặt hàng...</option>{inventory.map(inv => <option key={inv.id} value={inv.id}>{inv.name}</option>)}</select></div>
                        <div className="bg-white border border-amber-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left"><thead className="bg-amber-800 text-white text-xs uppercase tracking-wider"><tr><th className="p-3">Nguyên liệu</th><th className="p-3 w-24">Số lượng</th><th className="p-3 w-20">ĐVT</th><th className="p-3 w-36">Đơn giá (VNĐ)</th><th className="p-3 w-36 text-right">Thành tiền</th><th className="p-3 w-12 text-center">Xóa</th></tr></thead>
                                <tbody className="text-sm divide-y divide-gray-100">
                                    {items.length > 0 ? items.map((item, index) => (
                                        <tr key={index} className="hover:bg-amber-50/30"><td className="p-3 font-bold text-gray-800">{item.name}</td><td className="p-3"><input type="number" min="1" value={item.qty} onChange={(e) => updateItem(index, 'qty', e.target.value)} className="w-full border border-gray-300 rounded p-1.5 text-center font-bold outline-none focus:border-amber-500" /></td><td className="p-3 text-gray-500">{item.unit}</td><td className="p-3"><input type="number" min="0" value={item.price} onChange={(e) => updateItem(index, 'price', e.target.value)} className="w-full border border-gray-300 rounded p-1.5 font-bold outline-none focus:border-amber-500" /></td><td className="p-3 font-bold text-amber-700 text-right">{(item.qty * item.price).toLocaleString()}đ</td><td className="p-3 text-center"><button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button></td></tr>
                                    )) : <tr><td colSpan="6" className="p-8 text-center text-gray-400 font-medium">Chưa có nguyên liệu nào.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 flex justify-end"><div className="bg-amber-100 text-amber-900 p-4 rounded-xl font-bold text-lg border border-amber-200 shadow-sm flex items-center gap-4"><span>Tổng giá trị nhập:</span><span className="text-2xl">{totalAmount.toLocaleString()} VNĐ</span></div></div>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-4 shrink-0"><button onClick={onClose} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Hủy thao tác</button><button onClick={handleSave} className="px-8 py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition-colors"><Save size={20} /> Hoàn tất & Lưu</button></div>
            </div>
        </div>
    );
}

// --- ExportInventoryModal ---
function ExportInventoryModal({ inventory, setInventory, products, setProducts, orders, setOrders, onClose, currentUser, inventoryHistory, setInventoryHistory }) {
    const [exportReason, setExportReason] = useState('SanXuatTuyChinh');
    const [note, setNote] = useState('');
    const [items, setItems] = useState([]);
    const [selectedProductIdForMake, setSelectedProductIdForMake] = useState('');
    const [makeQty, setMakeQty] = useState(1);

    const availableItems = exportReason === 'HuySP' ? products : inventory;

    const handleReasonChange = (e) => { setExportReason(e.target.value); setItems([]); setSelectedProductIdForMake(''); setMakeQty(1); };

    useEffect(() => {
        if (exportReason === 'SanXuatTrungBay') {
            if (selectedProductIdForMake) {
                const prod = products.find(p => p.id.toString() === selectedProductIdForMake);
                if (prod && prod.recipe) {
                    setItems(prod.recipe.map(r => {
                        const invItem = inventory.find(i => i.id === r.nlId);
                        return { id: invItem ? invItem.id : r.nlId, name: invItem ? invItem.name : 'Unknown', unit: invItem ? invItem.unit : '', currentStock: invItem ? invItem.stock : 0, qty: Number((r.qty * makeQty).toFixed(2)) };
                    }));
                } else setItems([]);
            } else setItems([]);
        }
    }, [selectedProductIdForMake, makeQty, exportReason, products, inventory]);

    const handleAddItem = (e) => {
        const id = e.target.value; if (!id) return;
        if (items.find(item => item.id === id)) return alert('Mặt hàng này đã có trong danh sách xuất!');
        const selectedItem = availableItems.find(i => i.id.toString() === id);
        setItems([...items, { id: selectedItem.id, name: selectedItem.name, unit: exportReason === 'HuySP' ? 'Cái' : selectedItem.unit, currentStock: selectedItem.stock, qty: 1 }]);
        e.target.value = '';
    };

    const updateItemQty = (index, value) => {
        const newItems = [...items]; const qty = Number(value);
        if (qty > newItems[index].currentStock) return alert(`Số lượng xuất không được vượt quá tồn kho hiện tại (${newItems[index].currentStock})!`);
        newItems[index].qty = qty; setItems(newItems);
    };

    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

    const handleSave = () => {
        if (exportReason === 'SanXuatTrungBay') {
            if (!selectedProductIdForMake) return alert('Vui lòng chọn bánh cần sản xuất!');
            if (items.length === 0) return alert('Sản phẩm này chưa được thiết lập công thức nguyên liệu!');
            if (items.some(item => item.qty > item.currentStock)) return alert('Cảnh báo: Không đủ nguyên liệu trong kho để sản xuất số lượng này!');
        } else {
            if (items.length === 0) return alert('Phiếu xuất trống!');
        }

        if (exportReason === 'HuySP') {
            setProducts(products.map(prod => { const exportedItem = items.find(i => i.id === prod.id); return exportedItem ? { ...prod, stock: prod.stock - exportedItem.qty } : prod; }));
        } else {
            setInventory(inventory.map(inv => { const exportedItem = items.find(i => i.id === inv.id); return exportedItem ? { ...inv, stock: inv.stock - exportedItem.qty } : inv; }));
        }

        if (exportReason === 'SanXuatTrungBay') {
            const prod = products.find(p => p.id.toString() === selectedProductIdForMake);
            setOrders([{ id: `DH_NB${Math.floor(Math.random() * 1000)}`, customer: 'Kho & Bếp (Nội bộ)', phone: '', total: 0, deposit: 0, status: 'Mới đặt', type: 'Sản xuất nội bộ', receiveType: 'Nhập kho', time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' Hôm nay', items: `${makeQty}x ${prod.name}`, productId: prod.id, makeQty: makeQty, urgent: false }, ...orders]);
        }

        if (setInventoryHistory && inventoryHistory) {
            const maPX = 'PX' + Math.floor(1000 + Math.random() * 9000);
            const totalValue = items.reduce((sum, item) => {
                const invItem = inventory.find(i => i.id === item.id);
                return sum + (item.qty * (invItem?.price || 0));
            }, 0);
            
            const newHistoryRecord = {
                id: maPX,
                type: 'Xuất',
                time: new Date().toISOString(),
                creator: currentUser?.name || 'Nhân viên',
                items: items.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: (inventory.find(inv => inv.id === i.id)?.price || 0), unit: i.unit })),
                totalValue: totalValue,
                note: note || `Xuất kho: ${exportReason}`
            };
            setInventoryHistory([newHistoryRecord, ...inventoryHistory]);
        }

        alert(`Lập phiếu xuất thành công!`); onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
                <div className="p-6 border-b border-red-100 bg-red-50 flex justify-between items-center shrink-0"><div><h2 className="text-2xl font-bold text-red-800 flex items-center gap-2"><PackageMinus size={24} /> Lập Phiếu Xuất Kho</h2><p className="text-sm text-red-600 mt-1">Hệ thống sẽ trừ lùi trực tiếp vào số lượng tồn kho vật lý</p></div><button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-red-100 text-red-800 shadow-sm"><X size={20} /></button></div>
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50 flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <div><label className="block text-sm font-bold text-gray-700 mb-2">Phân loại lý do xuất hàng (*)</label><select value={exportReason} onChange={handleReasonChange} className="w-full border-2 border-red-200 bg-red-50/30 text-red-900 rounded-xl p-3 focus:border-red-500 outline-none font-bold"><option value="SanXuatTuyChinh">👨‍🍳 Xuất NL làm bánh tùy chỉnh (Thủ công)</option><option value="SanXuatTrungBay">🍰 Xuất NL làm bánh trưng bày (Theo công thức)</option><option value="HuyNL">🗑️ Xuất hủy nguyên liệu (Hư hỏng, hết hạn)</option><option value="HuySP">❌ Xuất hủy thành phẩm bánh (Ế, hết Date)</option></select></div>
                        <div><label className="block text-sm font-bold text-gray-700 mb-2">Ghi chú / Diễn giải chi tiết</label><input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập lý do xuất..." className="w-full border border-gray-200 bg-white rounded-xl p-3 focus:border-red-300 outline-none" /></div>
                    </div>
                    <div>
                        {exportReason === 'SanXuatTrungBay' ? (
                            <div className="flex gap-4 items-end mb-4 bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-inner">
                                <div className="flex-1"><label className="block text-sm font-bold text-amber-900 mb-2">Chọn bánh cần sản xuất</label><select value={selectedProductIdForMake} onChange={e => setSelectedProductIdForMake(e.target.value)} className="w-full border-2 border-amber-200 bg-white rounded-xl p-3 outline-none font-bold text-amber-900"><option value="">-- Chọn loại bánh --</option>{products.filter(p => p.recipe && p.recipe.length > 0).map(p => (<option key={p.id} value={p.id}>{p.name} (Tồn quầy: {p.stock})</option>))}</select></div>
                                <div className="w-40"><label className="block text-sm font-bold text-amber-900 mb-2">Số lượng làm</label><input type="number" min="1" value={makeQty} onChange={e => setMakeQty(Number(e.target.value))} className="w-full border-2 border-amber-200 rounded-xl p-3 outline-none font-bold text-center text-xl text-amber-800" /></div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-end mb-3"><label className="block text-sm font-bold text-gray-700">Danh sách mặt hàng xuất đi</label><select onChange={handleAddItem} className="border-2 border-dashed border-red-400 bg-red-50 text-red-700 rounded-lg py-2 px-4 outline-none font-bold text-sm cursor-pointer hover:bg-red-100"><option value="">+ Chọn mặt hàng cần xuất...</option>{availableItems.map(item => (<option key={item.id} value={item.id} disabled={item.stock === 0}>{item.name} (Tồn hiện tại: {item.stock})</option>))}</select></div>
                        )}
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left"><thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider border-b"><tr><th className="p-3">Tên mặt hàng</th><th className="p-3 w-32 text-center">Tồn kho hiện tại</th><th className="p-3 w-32 text-center">Số lượng xuất</th><th className="p-3 w-24">Đơn vị</th>{exportReason !== 'SanXuatTrungBay' && <th className="p-3 w-16 text-center">Xóa</th>}</tr></thead>
                                <tbody className="text-sm divide-y divide-gray-50">
                                    {items.length > 0 ? items.map((item, index) => {
                                        const isInsufficient = item.qty > item.currentStock;
                                        return (
                                            <tr key={index} className={isInsufficient ? 'bg-red-50/50' : 'hover:bg-red-50/30'}><td className="p-3 font-bold text-gray-800 flex items-center gap-2">{item.name}{isInsufficient && exportReason === 'SanXuatTrungBay' && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded uppercase">Thiếu NL</span>}</td><td className="p-3 text-center font-medium text-gray-500">{item.currentStock}</td>
                                                <td className="p-3 text-center">{exportReason === 'SanXuatTrungBay' ? (<span className={`font-bold text-lg ${isInsufficient ? 'text-red-600' : 'text-gray-800'}`}>{item.qty}</span>) : (<input type="number" min="1" max={item.currentStock} value={item.qty} onChange={(e) => updateItemQty(index, e.target.value)} className="w-full border-2 border-red-200 rounded-lg p-2 text-center font-bold text-red-700 outline-none focus:border-red-500 bg-red-50/50" />)}</td>
                                                <td className="p-3 font-medium text-gray-600">{item.unit}</td>{exportReason !== 'SanXuatTrungBay' && (<td className="p-3 text-center"><button onClick={() => removeItem(index)} className="text-gray-400 hover:text-red-600"><Trash2 size={18} /></button></td>)}
                                            </tr>
                                        );
                                    }) : <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-medium">Danh sách xuất đang trống.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-4 shrink-0"><button onClick={onClose} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Hủy thao tác</button><button onClick={handleSave} className="px-8 py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition-colors"><PackageMinus size={20} /> Thực hiện Trừ Kho</button></div>
            </div>
        </div>
    );
}

// --- InventoryView ---
export default function InventoryView({ inventory, setInventory, ingredients, setIngredients, products, setProducts, currentUser, orders, setOrders, transactions, setTransactions, inventoryHistory, setInventoryHistory }) {
    const [activeTab, setActiveTab] = useState('inventory');
    const [showImport, setShowImport] = useState(false);
    const [showExport, setShowExport] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // History states
    const [historySearchQuery, setHistorySearchQuery] = useState('');
    const [historyFilterType, setHistoryFilterType] = useState('all');
    const [historyFilterItem, setHistoryFilterItem] = useState('all');
    const [historyFilterBatch, setHistoryFilterBatch] = useState('');
    const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
    
    // Ingredients states
    const [ingredientsSearchQuery, setIngredientsSearchQuery] = useState('');
    const [ingredientsCurrentPage, setIngredientsCurrentPage] = useState(1);
    const [showIngredientModal, setShowIngredientModal] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState(null);

    const itemsPerPage = 5;

    useEffect(() => { setCurrentPage(1); }, [searchQuery]);
    useEffect(() => { setHistoryCurrentPage(1); }, [historySearchQuery, historyFilterType, historyFilterItem, historyFilterBatch]);
    useEffect(() => { setIngredientsCurrentPage(1); }, [ingredientsSearchQuery]);

    const filteredInventory = inventory.filter(i =>
        (i?.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
        (i?.id || '').toLowerCase().includes((searchQuery || '').toLowerCase())
    );
    const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
    const paginatedInventory = filteredInventory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const filteredHistory = (inventoryHistory || []).filter(h => {
        const query = historySearchQuery.toLowerCase();
        const matchSearch = h.id.toLowerCase().includes(query) || (h.note && h.note.toLowerCase().includes(query));
        const matchType = historyFilterType === 'all' ? true : h.type === historyFilterType;
        const matchItem = historyFilterItem === 'all' ? true : h.items?.some(i => i.id === historyFilterItem || i.nlId === historyFilterItem);
        const matchBatch = historyFilterBatch.trim() === '' ? true : (h.batchNumber && h.batchNumber.toLowerCase().includes(historyFilterBatch.toLowerCase()));
        return matchSearch && matchType && matchItem && matchBatch;
    });
    const totalHistoryPages = Math.ceil(filteredHistory.length / itemsPerPage);
    const paginatedHistory = filteredHistory.slice((historyCurrentPage - 1) * itemsPerPage, historyCurrentPage * itemsPerPage);

    const filteredIngredients = (ingredients || []).filter(i => (i.name || '').toLowerCase().includes(ingredientsSearchQuery.toLowerCase()) || (i.id || '').toLowerCase().includes(ingredientsSearchQuery.toLowerCase()));
    const totalIngredientPages = Math.ceil(filteredIngredients.length / itemsPerPage);
    const paginatedIngredients = filteredIngredients.slice((ingredientsCurrentPage - 1) * itemsPerPage, ingredientsCurrentPage * itemsPerPage);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-amber-100 overflow-hidden h-full flex flex-col relative">
            <div className="border-b border-amber-100 flex justify-between items-center bg-amber-50/50 shrink-0">
                <div className="flex">
                    <button 
                        className={`py-4 px-6 font-bold text-sm transition-colors border-b-2 ${activeTab === 'inventory' ? 'border-amber-600 text-amber-800 bg-white' : 'border-transparent text-amber-900/60 hover:text-amber-800 hover:bg-amber-50/80'}`}
                        onClick={() => setActiveTab('inventory')}
                    >
                        Tồn Kho Hiện Tại
                    </button>
                    <button 
                        className={`py-4 px-6 font-bold text-sm transition-colors border-b-2 ${activeTab === 'history' ? 'border-amber-600 text-amber-800 bg-white' : 'border-transparent text-amber-900/60 hover:text-amber-800 hover:bg-amber-50/80'}`}
                        onClick={() => setActiveTab('history')}
                    >
                        Lịch sử Giao dịch
                    </button>
                    <button 
                        className={`py-4 px-6 font-bold text-sm transition-colors border-b-2 ${activeTab === 'ingredients' ? 'border-amber-600 text-amber-800 bg-white' : 'border-transparent text-amber-900/60 hover:text-amber-800 hover:bg-amber-50/80'}`}
                        onClick={() => setActiveTab('ingredients')}
                    >
                        Danh mục Nguyên liệu
                    </button>
                </div>
                <div className="pr-5 flex gap-3 items-center">
                    {activeTab === 'inventory' && (
                        <div className="relative mr-2"><Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" /><input type="text" placeholder="Tìm mã, tên NL..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64 pl-9 pr-4 py-2 border border-amber-200 rounded-lg text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 bg-white" /></div>
                    )}
                    {activeTab === 'ingredients' && (
                        <button onClick={() => { setEditingIngredient(null); setShowIngredientModal(true); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-sm transition-colors"><PackagePlus size={16} /> Thêm nguyên liệu</button>
                    )}
                    {activeTab !== 'ingredients' && (
                        <button onClick={() => setShowExport(true)} className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-50 shadow-sm transition-colors"><PackageMinus size={16} /> Xuất kho</button>
                    )}
                    {activeTab !== 'ingredients' && (
                        <button onClick={() => setShowImport(true)} className="px-4 py-2 bg-amber-800 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-amber-900 shadow-sm transition-colors"><PackagePlus size={16} /> Nhập kho</button>
                    )}
                </div>
            </div>
            
            <div className="flex-1 overflow-auto flex flex-col">
                {activeTab === 'inventory' && (
                    <>
                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-left border-collapse">
                                <thead><tr className="bg-amber-50/80 text-amber-800 text-sm border-b border-amber-200 sticky top-0"><th className="p-4 font-bold">Mã NL</th><th className="p-4 font-bold">Tên Nguyên Liệu</th><th className="p-4 font-bold">Giá Vốn</th><th className="p-4 font-bold">Tồn Thực Tế</th><th className="p-4 font-bold">Mức An Toàn</th><th className="p-4 font-bold text-center">Trạng Thái</th></tr></thead>
                                <tbody className="text-sm">
                                    {paginatedInventory.map(item => (
                                        <tr key={item.id} className="border-b border-amber-50 hover:bg-amber-50/30">
                                            <td className="p-4 font-bold text-amber-900">{item.id}</td><td className="p-4 font-medium text-gray-800">{item.name}</td><td className="p-4 text-gray-600">{(item.price || 0).toLocaleString()}đ / {item.unit}</td>
                                            <td className="p-4 font-bold"><span className={(item.stock || 0) < (item.safeStock || 0) ? 'text-red-600' : 'text-green-600'}>{item.stock} {item.unit}</span></td><td className="p-4 text-gray-500">{item.safeStock} {item.unit}</td>
                                            <td className="p-4 text-center">{(item.stock || 0) <= (item.safeStock || 0) * 0.5 ? <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded flex items-center justify-center gap-1 w-24 mx-auto"><AlertTriangle size={12} /> Sắp hết</span> : (item.stock || 0) <= (item.safeStock || 0) ? <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded flex items-center justify-center gap-1 w-24 mx-auto"><AlertCircle size={12} /> Cảnh báo</span> : <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded flex items-center justify-center gap-1 w-24 mx-auto"><CheckCircle2 size={12} /> Đầy đủ</span>}</td>
                                        </tr>
                                    ))}
                                    {paginatedInventory.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-gray-500">Không tìm thấy vật tư nào</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredInventory.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
                    </>
                )}
                {activeTab === 'history' && (
                    <>
                        <div className="p-4 border-b border-amber-100 flex flex-wrap gap-4 bg-white shrink-0">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Tìm mã phiếu, ghi chú..." 
                                    value={historySearchQuery}
                                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-amber-500 bg-gray-50 focus:bg-white transition-colors"
                                />
                            </div>
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Tìm số lô (Batch Number)..." 
                                    value={historyFilterBatch}
                                    onChange={(e) => setHistoryFilterBatch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-amber-500 bg-gray-50 focus:bg-white transition-colors"
                                />
                            </div>
                            <select 
                                value={historyFilterItem}
                                onChange={(e) => setHistoryFilterItem(e.target.value)}
                                className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-amber-500 bg-gray-50 focus:bg-white text-gray-700 font-medium cursor-pointer"
                            >
                                <option value="all">Tất cả nguyên liệu (Thẻ kho)</option>
                                {inventory.map(inv => <option key={inv.id} value={inv.id}>{inv.name}</option>)}
                            </select>
                            <select 
                                value={historyFilterType}
                                onChange={(e) => setHistoryFilterType(e.target.value)}
                                className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-amber-500 bg-gray-50 focus:bg-white text-gray-700 font-medium cursor-pointer"
                            >
                                <option value="all">Tất cả giao dịch</option>
                                <option value="Nhập">Chỉ Nhập Kho</option>
                                <option value="Xuất">Chỉ Xuất Kho</option>
                            </select>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-left border-collapse">
                                <thead><tr className="bg-amber-50/80 text-amber-800 text-sm border-b border-amber-200 sticky top-0"><th className="p-4 font-bold">Mã Phiếu</th><th className="p-4 font-bold">Thời Gian</th><th className="p-4 font-bold text-center">Loại</th><th className="p-4 font-bold">Mô tả hàng hóa</th><th className="p-4 font-bold">Nhà Cung Cấp</th><th className="p-4 font-bold">Số Lô</th><th className="p-4 font-bold text-right">Tổng Giá Trị</th><th className="p-4 font-bold">Người Lập</th><th className="p-4 font-bold">Ghi chú</th></tr></thead>
                                <tbody className="text-sm">
                                    {paginatedHistory.map(h => {
                                        let timeDisplay = h.time;
                                        try { timeDisplay = new Date(h.time).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) } catch(e){}
                                        return (
                                        <tr key={h.id} className="border-b border-amber-50 hover:bg-amber-50/30">
                                            <td className="p-4 font-bold text-amber-900">{h.id}</td>
                                            <td className="p-4 text-gray-600">{timeDisplay}</td>
                                            <td className="p-4 text-center"><span className={`px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm ${h.type === 'Nhập' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{h.type}</span></td>
                                            <td className="p-4 text-gray-800 font-medium">{h.type} {h.items?.length || 0} mặt hàng</td>
                                            <td className="p-4 text-gray-800 font-medium">{h.type === 'Nhập' ? (h.supplierName || '-') : '-'}</td>
                                            <td className="p-4 font-bold text-amber-700 tracking-wider text-xs">{h.type === 'Nhập' ? (h.batchNumber || '-') : '-'}</td>
                                            <td className="p-4 font-bold text-right text-gray-800">{(h.totalValue || 0).toLocaleString()}đ</td>
                                            <td className="p-4 text-gray-600">{h.creator}</td>
                                            <td className="p-4 text-gray-500 italic truncate max-w-xs" title={h.note}>{h.note}</td>
                                        </tr>
                                    )})}
                                    {paginatedHistory.length === 0 && <tr><td colSpan="9" className="p-8 text-center text-gray-500">Không có lịch sử giao dịch nào</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        <Pagination currentPage={historyCurrentPage} totalPages={totalHistoryPages} totalItems={filteredHistory.length} itemsPerPage={itemsPerPage} onPageChange={setHistoryCurrentPage} />
                    </>
                )}
                {activeTab === 'ingredients' && (
                    <>
                        <div className="p-4 border-b border-gray-100 flex gap-4 bg-white shrink-0">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Tìm tên, mã nguyên liệu..." 
                                    value={ingredientsSearchQuery}
                                    onChange={(e) => setIngredientsSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-left border-collapse">
                                <thead><tr className="bg-emerald-50/50 text-emerald-800 text-sm border-b border-emerald-100 sticky top-0"><th className="p-4 font-bold">ID</th><th className="p-4 font-bold">Tên Nguyên Liệu</th><th className="p-4 font-bold">Đơn Vị Tính</th><th className="p-4 font-bold">Tồn Tối Thiểu</th><th className="p-4 font-bold text-center">Trạng Thái</th><th className="p-4 font-bold text-right">Thao Tác</th></tr></thead>
                                <tbody className="text-sm">
                                    {paginatedIngredients.map(ing => (
                                        <tr key={ing.id} className="border-b border-gray-50 hover:bg-emerald-50/20">
                                            <td className="p-4 font-bold text-gray-900">{ing.id}</td>
                                            <td className="p-4 text-gray-800 font-medium">{ing.name}</td>
                                            <td className="p-4 text-gray-600">{ing.unit}</td>
                                            <td className="p-4 text-gray-600 font-bold">{ing.minStock}</td>
                                            <td className="p-4 text-center"><span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${ing.status === 'Hoạt động' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{ing.status}</span></td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => { setEditingIngredient(ing); setShowIngredientModal(true); }} className="text-xs font-bold px-3 py-1.5 text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition-colors">Sửa</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!filteredIngredients.length) && <tr><td colSpan="6" className="p-8 text-center text-gray-500">Chưa có dữ liệu nguyên liệu</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        <Pagination currentPage={ingredientsCurrentPage} totalPages={totalIngredientPages} totalItems={filteredIngredients.length} itemsPerPage={itemsPerPage} onPageChange={setIngredientsCurrentPage} />
                    </>
                )}
            </div>

            {showImport && <ImportInventoryModal inventory={inventory} setInventory={setInventory} onClose={() => setShowImport(false)} currentUser={currentUser} transactions={transactions} setTransactions={setTransactions} inventoryHistory={inventoryHistory} setInventoryHistory={setInventoryHistory} />}
            {showExport && <ExportInventoryModal inventory={inventory} setInventory={setInventory} products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} onClose={() => setShowExport(false)} currentUser={currentUser} inventoryHistory={inventoryHistory} setInventoryHistory={setInventoryHistory} />}
            {showIngredientModal && (
                <IngredientModal 
                    isOpen={showIngredientModal} 
                    onClose={() => setShowIngredientModal(false)}
                    ingredient={editingIngredient}
                    onSave={(data) => {
                        if (data.id) {
                            setIngredients(ingredients.map(i => i.id === data.id ? data : i));
                        } else {
                            const newId = 'NL' + Math.floor(100 + Math.random() * 900);
                            setIngredients([...ingredients, { ...data, id: newId }]);
                        }
                        setShowIngredientModal(false);
                    }}
                />
            )}
        </div>
    );
}
