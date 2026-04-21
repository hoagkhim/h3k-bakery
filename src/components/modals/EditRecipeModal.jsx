import React, { useState } from 'react';
import { Beaker, X, Save, Trash2 } from 'lucide-react';

export default function EditRecipeModal({ product, inventory, onClose, onSave }) {
    const [recipe, setRecipe] = useState(product.recipe ? [...product.recipe] : []);

    const handleUpdateQty = (index, value) => {
        const updated = [...recipe];
        updated[index].qty = Number(value);
        setRecipe(updated);
    };
    const handleRemoveItem = (index) => { setRecipe(recipe.filter((_, i) => i !== index)); };
    const handleAddItem = (e) => {
        const nlId = e.target.value; if (!nlId) return;
        if (recipe.find(item => item.nlId === nlId)) return alert('Nguyên liệu này đã có trong công thức!');
        setRecipe([...recipe, { nlId, qty: 0 }]); e.target.value = '';
    };
    const handleSave = () => { onSave({ ...product, recipe: recipe }); onClose(); };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl w-[600px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-amber-100 bg-amber-50 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2"><Beaker size={20} /> Điều chỉnh công thức</h2>
                        <p className="text-sm text-amber-700 mt-1">Bánh: <strong>{product.name}</strong></p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-amber-200 rounded-full text-amber-800"><X size={20} /></button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
                    <div className="bg-white border border-amber-100 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-amber-50 text-amber-900 text-xs uppercase tracking-wider border-b border-amber-100">
                                <tr><th className="p-3">Nguyên liệu thô</th><th className="p-3">Đơn vị</th><th className="p-3 w-32">Định lượng</th><th className="p-3 w-12 text-center">Xóa</th></tr>
                            </thead>
                            <tbody className="text-sm">
                                {recipe.length > 0 ? recipe.map((item, index) => {
                                    const invItem = inventory.find(i => i.id === item.nlId);
                                    return (
                                        <tr key={index} className="border-b border-gray-50">
                                            <td className="p-3 font-bold text-gray-800">{invItem ? invItem.name : item.nlId}</td>
                                            <td className="p-3 text-gray-500 font-medium">{invItem ? invItem.unit : ''}</td>
                                            <td className="p-3"><input type="number" step="0.01" min="0" value={item.qty} onChange={(e) => handleUpdateQty(index, e.target.value)} className="w-full border-2 border-amber-200 rounded-lg p-1.5 focus:border-amber-600 outline-none text-center font-bold text-amber-800" /></td>
                                            <td className="p-3 text-center"><button onClick={() => handleRemoveItem(index)} className="p-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={16} /></button></td>
                                        </tr>
                                    );
                                }) : <tr><td colSpan="4" className="p-6 text-center text-gray-400 font-medium">Chưa có nguyên liệu nào. Hãy thêm ở bên dưới.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4">
                        <select onChange={handleAddItem} className="w-full border-2 border-dashed border-amber-300 bg-amber-50 text-amber-800 rounded-xl p-3 outline-none font-bold cursor-pointer hover:bg-amber-100 transition-colors">
                            <option value="">+ Thêm nguyên liệu từ Kho vào công thức...</option>
                            {inventory.map(inv => <option key={inv.id} value={inv.id}>{inv.name} (Tồn: {inv.stock} {inv.unit})</option>)}
                        </select>
                    </div>
                </div>
                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl">Hủy</button>
                    <button onClick={handleSave} className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm"><Save size={18} /> Lưu công thức</button>
                </div>
            </div>
        </div>
    );
}
