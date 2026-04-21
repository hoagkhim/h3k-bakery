import React, { useState } from 'react';
import { PackagePlus, X, Save, Trash2 } from 'lucide-react';
import { MOCK_SUPPLIERS } from '../../data/mockData';

export default function ImportInventoryModal({ inventory, setInventory, onClose, currentUser }) {
    const [supplierId, setSupplierId] = useState('');
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
        if (items.length === 0) return alert('Phiếu nhập trống!');
        const newInventory = inventory.map(inv => {
            const importedItem = items.find(i => i.nlId === inv.id);
            return importedItem ? { ...inv, stock: inv.stock + importedItem.qty } : inv;
        });
        setInventory(newInventory);
        alert(`Đã lưu phiếu nhập thành công!\nTổng tiền: ${totalAmount.toLocaleString()}đ`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
                <div className="p-6 border-b border-amber-100 bg-amber-50 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2"><PackagePlus size={24} /> Lập Phiếu Nhập Kho</h2>
                        <p className="text-sm text-amber-700 mt-1">Nhân viên lập phiếu: <strong>{currentUser.name}</strong></p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-amber-100 text-amber-800 shadow-sm"><X size={20} /></button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50 flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nhà cung cấp (*)</label>
                            <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="w-full border border-amber-200 bg-white rounded-xl p-3 focus:border-amber-500 outline-none font-medium">
                                <option value="">-- Chọn Nhà Cung Cấp --</option>
                                {MOCK_SUPPLIERS.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Ghi chú phiếu nhập</label>
                            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="VD: Nhập hàng đầu tuần..." className="w-full border border-amber-200 bg-white rounded-xl p-3 focus:border-amber-500 outline-none" />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-end mb-3">
                            <label className="block text-sm font-bold text-gray-700">Chi tiết hàng nhập</label>
                            <select onChange={handleAddItem} className="border-2 border-dashed border-amber-400 bg-amber-50 text-amber-800 rounded-lg py-2 px-4 outline-none font-bold text-sm cursor-pointer hover:bg-amber-100">
                                <option value="">+ Thêm mặt hàng...</option>
                                {inventory.map(inv => <option key={inv.id} value={inv.id}>{inv.name}</option>)}
                            </select>
                        </div>
                        <div className="bg-white border border-amber-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-amber-800 text-white text-xs uppercase tracking-wider">
                                    <tr><th className="p-3">Nguyên liệu</th><th className="p-3 w-24">Số lượng</th><th className="p-3 w-20">ĐVT</th><th className="p-3 w-36">Đơn giá (VNĐ)</th><th className="p-3 w-36 text-right">Thành tiền</th><th className="p-3 w-12 text-center">Xóa</th></tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-100">
                                    {items.length > 0 ? items.map((item, index) => (
                                        <tr key={index} className="hover:bg-amber-50/30">
                                            <td className="p-3 font-bold text-gray-800">{item.name}</td>
                                            <td className="p-3"><input type="number" min="1" value={item.qty} onChange={(e) => updateItem(index, 'qty', e.target.value)} className="w-full border border-gray-300 rounded p-1.5 text-center font-bold outline-none focus:border-amber-500" /></td>
                                            <td className="p-3 text-gray-500">{item.unit}</td>
                                            <td className="p-3"><input type="number" min="0" value={item.price} onChange={(e) => updateItem(index, 'price', e.target.value)} className="w-full border border-gray-300 rounded p-1.5 font-bold outline-none focus:border-amber-500" /></td>
                                            <td className="p-3 font-bold text-amber-700 text-right">{(item.qty * item.price).toLocaleString()}đ</td>
                                            <td className="p-3 text-center"><button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button></td>
                                        </tr>
                                    )) : <tr><td colSpan="6" className="p-8 text-center text-gray-400 font-medium">Chưa có nguyên liệu nào.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <div className="bg-amber-100 text-amber-900 p-4 rounded-xl font-bold text-lg border border-amber-200 shadow-sm flex items-center gap-4">
                                <span>Tổng giá trị nhập:</span><span className="text-2xl">{totalAmount.toLocaleString()} VNĐ</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-4 shrink-0">
                    <button onClick={onClose} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Hủy thao tác</button>
                    <button onClick={handleSave} className="px-8 py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition-colors"><Save size={20} /> Hoàn tất & Lưu</button>
                </div>
            </div>
        </div>
    );
}
