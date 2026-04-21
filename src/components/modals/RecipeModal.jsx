import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Beaker, Trash2 } from 'lucide-react';

export default function RecipeModal({ isOpen, onClose, onSave, product, ingredients, isReadOnly = false }) {
    const [recipe, setRecipe] = useState([]);

    useEffect(() => {
        if (product) {
            // Clone the recipe array to avoid mutating the original prop directly
            setRecipe(product.recipe ? JSON.parse(JSON.stringify(product.recipe)) : []);
        } else {
            setRecipe([]);
        }
    }, [product, isOpen]);

    const handleAddIngredient = () => {
        const defaultIngredientId = ingredients && ingredients.length > 0 ? ingredients[0].id : '';
        setRecipe([...recipe, { nlId: defaultIngredientId, qty: 1 }]);
    };

    const handleRemoveIngredient = (index) => {
        const newRecipe = [...recipe];
        newRecipe.splice(index, 1);
        setRecipe(newRecipe);
    };

    const handleChangeIngredient = (index, field, value) => {
        const newRecipe = [...recipe];
        if (field === 'qty') {
            newRecipe[index][field] = Number(value);
        } else {
            newRecipe[index][field] = value;
        }
        setRecipe(newRecipe);
    };

    const handleSave = () => {
        // Validate
        for (let i = 0; i < recipe.length; i++) {
            if (!recipe[i].nlId) {
                return alert(`Nguyên liệu ở dòng thứ ${i + 1} chưa được chọn!`);
            }
            if (recipe[i].qty <= 0) {
                return alert(`Định lượng ở dòng thứ ${i + 1} phải lớn hơn 0!`);
            }
        }
        
        onSave({ 
            ...product, 
            recipe: recipe 
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-[700px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-amber-100 bg-amber-50 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                            <Beaker size={20} /> 
                            {isReadOnly ? 'Chi tiết Công Thức' : 'Sửa Công Thức'}
                        </h2>
                        <p className="text-sm text-amber-700 font-medium mt-1">Sản phẩm: {product?.name}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-amber-200 rounded-full text-amber-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto bg-[#FDFBF7] flex-1">
                    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-amber-50 text-amber-900 text-sm border-b">
                                <tr>
                                    <th className="p-3 font-bold w-12 text-center">STT</th>
                                    <th className="p-3 font-bold">Tên Nguyên Liệu</th>
                                    <th className="p-3 font-bold text-right w-40">Định lượng</th>
                                    <th className="p-3 font-bold w-24">Đơn vị</th>
                                    {!isReadOnly && <th className="p-3 font-bold text-center w-16">Xóa</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {recipe.map((item, index) => {
                                    const selectedIngredient = ingredients?.find(ing => ing.id === item.nlId);
                                    const unit = selectedIngredient ? selectedIngredient.unit : '---';
                                    
                                    return (
                                        <tr key={index} className="border-b border-gray-50 text-sm hover:bg-amber-50/20">
                                            <td className="p-3 text-center font-bold text-gray-500">{index + 1}</td>
                                            <td className="p-3">
                                                <select 
                                                    value={item.nlId} 
                                                    onChange={(e) => handleChangeIngredient(index, 'nlId', e.target.value)}
                                                    className={`w-full border border-gray-200 rounded-lg p-2 focus:border-amber-500 outline-none font-medium ${isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'}`}
                                                    disabled={isReadOnly}
                                                >
                                                    <option value="" disabled>-- Chọn nguyên liệu --</option>
                                                    {(ingredients || []).map(ing => (
                                                        <option key={ing.id} value={ing.id}>{ing.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-3">
                                                <input 
                                                    type="number" 
                                                    min="0.01" 
                                                    step="0.01"
                                                    value={item.qty} 
                                                    onChange={(e) => handleChangeIngredient(index, 'qty', e.target.value)}
                                                    className={`w-full border border-gray-200 rounded-lg p-2 focus:border-amber-500 outline-none text-right font-bold ${isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'text-amber-700'}`} 
                                                    readOnly={isReadOnly}
                                                />
                                            </td>
                                            <td className="p-3 font-medium text-gray-600">
                                                {unit}
                                            </td>
                                            {!isReadOnly && (
                                                <td className="p-3 text-center">
                                                    <button onClick={() => handleRemoveIngredient(index)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                                {recipe.length === 0 && (
                                    <tr>
                                        <td colSpan={isReadOnly ? 4 : 5} className="p-8 text-center text-gray-500 italic">
                                            Công thức đang trống. Vui lòng thêm nguyên liệu!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {!isReadOnly && (
                        <button 
                            onClick={handleAddIngredient} 
                            className="mt-4 w-full py-3 border-2 border-dashed border-amber-300 text-amber-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-50 hover:border-amber-400 transition-colors"
                        >
                            <Plus size={18} /> Thêm nguyên liệu vào công thức
                        </button>
                    )}
                    {!isReadOnly && <p className="text-xs text-center text-gray-400 mt-3">* Lưu ý: Định lượng được tính để làm ra 1 đơn vị sản phẩm.</p>}
                </div>

                <div className="p-5 border-t border-amber-100 bg-white flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors border border-gray-200">
                        {isReadOnly ? 'Đóng' : 'Hủy thoát'}
                    </button>
                    {!isReadOnly && (
                        <button onClick={handleSave} className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors border border-amber-700">
                            <Save size={18} /> Lưu Công Thức
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
