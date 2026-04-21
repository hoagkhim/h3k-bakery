import React, { useState } from 'react';
import { Search, TrendingUp, Edit, Beaker } from 'lucide-react';
import EditProductModal from '../modals/EditProductModal';
import EditRecipeModal from '../modals/EditRecipeModal';

export default function ProductRecipeView({ products, setProducts, inventory }) {
    const [selectedProductId, setSelectedProductId] = useState(products[0]?.id);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditProduct, setShowEditProduct] = useState(false);
    const [showEditRecipe, setShowEditRecipe] = useState(false);

    const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const calculateMaxProduction = (recipe) => {
        if (!recipe || recipe.length === 0) return 0;
        let max = Infinity;
        recipe.forEach(item => {
            const invItem = inventory.find(i => i.id === item.nlId);
            if (invItem) {
                const possible = Math.floor(invItem.stock / item.qty);
                if (possible < max) max = possible;
            } else { max = 0; }
        });
        return max === Infinity ? 0 : max;
    };

    const handleUpdateProduct = (updatedProduct) => setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));

    return (
        <div className="flex gap-6 h-full relative">
            <div className="w-1/3 bg-white rounded-3xl shadow-sm border border-amber-100 flex flex-col overflow-hidden shrink-0">
                <div className="p-5 border-b border-amber-100 bg-amber-50/50 flex flex-col gap-3">
                    <div className="flex justify-between items-center"><h3 className="font-bold text-lg text-amber-950">Danh Mục Bánh</h3></div>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Tìm tên bánh..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-amber-200 rounded-xl text-sm outline-none focus:border-amber-500 bg-white" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {filteredProducts.map(product => (
                        <div key={product.id} onClick={() => setSelectedProductId(product.id)} className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${selectedProduct?.id === product.id ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-transparent hover:bg-gray-50'}`}>
                            <div className="text-3xl bg-white w-12 h-12 rounded-lg shadow-sm border flex items-center justify-center shrink-0">{product.image}</div>
                            <div className="flex-1 min-w-0"><h4 className="font-bold text-sm text-gray-900 truncate">{product.name}</h4></div>
                            <div className="font-bold text-amber-700 text-sm">{product.price.toLocaleString()}đ</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-amber-100 flex flex-col overflow-hidden">
                {selectedProduct && (
                    <>
                        <div className="p-6 border-b flex gap-6 items-start">
                            <div className="text-6xl bg-amber-50 w-24 h-24 rounded-2xl flex items-center justify-center shadow-inner">{selectedProduct.image}</div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h2 className="text-2xl font-bold text-amber-950">{selectedProduct.name}</h2>
                                    <button onClick={() => setShowEditProduct(true)} className="px-3 py-1.5 bg-amber-50 border text-amber-800 rounded-lg text-sm font-bold flex items-center gap-1"><Edit size={14} /> Sửa</button>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    <div className="bg-gray-50 p-3 rounded-xl border"><p className="text-xs text-gray-500 font-bold mb-1">Giá cơ bản</p><p className="font-bold text-amber-800">{selectedProduct.price.toLocaleString()}đ</p></div>
                                    <div className="bg-gray-50 p-3 rounded-xl border"><p className="text-xs text-gray-500 font-bold mb-1">Chuẩn bị</p><p className="font-bold text-gray-900">{selectedProduct.prepTime}</p></div>
                                    <div className="bg-gray-50 p-3 rounded-xl border"><p className="text-xs text-gray-500 font-bold mb-1">Hạn bảo quản</p><p className="font-bold text-gray-900">{selectedProduct.shelfLife} ngày</p></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-amber-950 flex gap-2"><Beaker size={20} /> Định lượng</h3>
                                <button onClick={() => setShowEditRecipe(true)} className="text-sm font-bold text-amber-700 bg-white border px-3 py-1.5 rounded-lg flex items-center gap-2"><Edit size={14} /> Chỉnh công thức</button>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border mb-6">
                                <table className="w-full text-left">
                                    <thead className="bg-amber-50/80 text-amber-900 text-xs border-b"><tr><th className="p-3">Nguyên liệu</th><th className="p-3">Tiêu hao</th><th className="p-3">Tồn hiện tại</th></tr></thead>
                                    <tbody className="text-sm">
                                        {selectedProduct.recipe?.map((item, idx) => {
                                            const invItem = inventory.find(i => i.id === item.nlId);
                                            return <tr key={idx} className="border-b"><td className="p-3 font-bold">{invItem?.name}</td><td className="p-3 font-bold text-amber-700">{item.qty} {invItem?.unit}</td><td className="p-3 font-bold text-green-600">{invItem?.stock}</td></tr>;
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0"><TrendingUp size={24} /></div>
                                <div><h4 className="font-bold text-blue-900">Dự báo năng lực sản xuất</h4><p className="text-sm text-blue-800 mt-1">Dựa trên tồn kho nguyên liệu hiện tại, xưởng có thể làm ngay tối đa: <strong className="text-lg text-blue-700 ml-2 bg-white px-3 py-1 rounded-lg border border-blue-200 shadow-sm">{calculateMaxProduction(selectedProduct.recipe)} cái</strong></p></div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {showEditProduct && <EditProductModal product={selectedProduct} onClose={() => setShowEditProduct(false)} onSave={handleUpdateProduct} />}
            {showEditRecipe && <EditRecipeModal product={selectedProduct} inventory={inventory} onClose={() => setShowEditRecipe(false)} onSave={handleUpdateProduct} />}
        </div>
    );
}
