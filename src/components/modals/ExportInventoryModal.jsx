import React, { useState, useEffect } from 'react';
import { PackageMinus, X, Trash2 } from 'lucide-react';

export default function ExportInventoryModal({ inventory, setInventory, products, setProducts, orders, setOrders, onClose }) {
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

        alert(`Lập phiếu xuất thành công!`); onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
                <div className="p-6 border-b border-red-100 bg-red-50 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-red-800 flex items-center gap-2"><PackageMinus size={24} /> Lập Phiếu Xuất Kho</h2>
                        <p className="text-sm text-red-600 mt-1">Hệ thống sẽ trừ lùi trực tiếp vào số lượng tồn kho vật lý</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-red-100 text-red-800 shadow-sm"><X size={20} /></button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50 flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phân loại lý do xuất hàng (*)</label>
                            <select value={exportReason} onChange={handleReasonChange} className="w-full border-2 border-red-200 bg-red-50/30 text-red-900 rounded-xl p-3 focus:border-red-500 outline-none font-bold">
                                <option value="SanXuatTuyChinh">👨‍🍳 Xuất NL làm bánh tùy chỉnh (Thủ công)</option>
                                <option value="SanXuatTrungBay">🍰 Xuất NL làm bánh trưng bày (Theo công thức)</option>
                                <option value="HuyNL">🗑️ Xuất hủy nguyên liệu (Hư hỏng, hết hạn)</option>
                                <option value="HuySP">❌ Xuất hủy thành phẩm bánh (Ế, hết Date)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Ghi chú / Diễn giải chi tiết</label>
                            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập lý do xuất..." className="w-full border border-gray-200 bg-white rounded-xl p-3 focus:border-red-300 outline-none" />
                        </div>
                    </div>
                    <div>
                        {exportReason === 'SanXuatTrungBay' ? (
                            <div className="flex gap-4 items-end mb-4 bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-inner">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-amber-900 mb-2">Chọn bánh cần sản xuất</label>
                                    <select value={selectedProductIdForMake} onChange={e => setSelectedProductIdForMake(e.target.value)} className="w-full border-2 border-amber-200 bg-white rounded-xl p-3 outline-none font-bold text-amber-900">
                                        <option value="">-- Chọn loại bánh --</option>
                                        {products.filter(p => p.recipe && p.recipe.length > 0).map(p => (<option key={p.id} value={p.id}>{p.name} (Tồn quầy: {p.stock})</option>))}
                                    </select>
                                </div>
                                <div className="w-40">
                                    <label className="block text-sm font-bold text-amber-900 mb-2">Số lượng làm</label>
                                    <input type="number" min="1" value={makeQty} onChange={e => setMakeQty(Number(e.target.value))} className="w-full border-2 border-amber-200 rounded-xl p-3 outline-none font-bold text-center text-xl text-amber-800" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-end mb-3">
                                <label className="block text-sm font-bold text-gray-700">Danh sách mặt hàng xuất đi</label>
                                <select onChange={handleAddItem} className="border-2 border-dashed border-red-400 bg-red-50 text-red-700 rounded-lg py-2 px-4 outline-none font-bold text-sm cursor-pointer hover:bg-red-100">
                                    <option value="">+ Chọn mặt hàng cần xuất...</option>
                                    {availableItems.map(item => (<option key={item.id} value={item.id} disabled={item.stock === 0}>{item.name} (Tồn hiện tại: {item.stock})</option>))}
                                </select>
                            </div>
                        )}
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider border-b">
                                    <tr><th className="p-3">Tên mặt hàng</th><th className="p-3 w-32 text-center">Tồn kho hiện tại</th><th className="p-3 w-32 text-center">Số lượng xuất</th><th className="p-3 w-24">Đơn vị</th>{exportReason !== 'SanXuatTrungBay' && <th className="p-3 w-16 text-center">Xóa</th>}</tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-50">
                                    {items.length > 0 ? items.map((item, index) => {
                                        const isInsufficient = item.qty > item.currentStock;
                                        return (
                                            <tr key={index} className={isInsufficient ? 'bg-red-50/50' : 'hover:bg-red-50/30'}>
                                                <td className="p-3 font-bold text-gray-800 flex items-center gap-2">{item.name}{isInsufficient && exportReason === 'SanXuatTrungBay' && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded uppercase">Thiếu NL</span>}</td>
                                                <td className="p-3 text-center font-medium text-gray-500">{item.currentStock}</td>
                                                <td className="p-3 text-center">
                                                    {exportReason === 'SanXuatTrungBay'
                                                        ? <span className={`font-bold text-lg ${isInsufficient ? 'text-red-600' : 'text-gray-800'}`}>{item.qty}</span>
                                                        : <input type="number" min="1" max={item.currentStock} value={item.qty} onChange={(e) => updateItemQty(index, e.target.value)} className="w-full border-2 border-red-200 rounded-lg p-2 text-center font-bold text-red-700 outline-none focus:border-red-500 bg-red-50/50" />
                                                    }
                                                </td>
                                                <td className="p-3 font-medium text-gray-600">{item.unit}</td>
                                                {exportReason !== 'SanXuatTrungBay' && (<td className="p-3 text-center"><button onClick={() => removeItem(index)} className="text-gray-400 hover:text-red-600"><Trash2 size={18} /></button></td>)}
                                            </tr>
                                        );
                                    }) : <tr><td colSpan="5" className="p-8 text-center text-gray-400 font-medium">Danh sách xuất đang trống.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-4 shrink-0">
                    <button onClick={onClose} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Hủy thao tác</button>
                    <button onClick={handleSave} className="px-8 py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition-colors"><PackageMinus size={20} /> Thực hiện Trừ Kho</button>
                </div>
            </div>
        </div>
    );
}
