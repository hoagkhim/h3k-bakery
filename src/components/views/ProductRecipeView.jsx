import React, { useState } from 'react';
import { Search, TrendingUp, Edit, Beaker, Layers } from 'lucide-react';
import EditProductModal from '../modals/EditProductModal';
import RecipeModal from '../modals/RecipeModal';
import ProductCategoryModal from '../modals/ProductCategoryModal';
import ProductModal from '../modals/ProductModal';

export default function ProductRecipeView({ products, setProducts, inventory, ingredients, categories, setCategories }) {
    const [activeTab, setActiveTab] = useState('categories');
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState(products[0]?.id);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
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
        <div className="bg-white rounded-3xl shadow-sm border border-amber-100 overflow-hidden h-full flex flex-col relative">
            <div className="border-b border-amber-100 flex gap-1 bg-amber-50/50 shrink-0 px-6 pt-2">
                <button 
                    className={`py-4 px-6 font-bold text-sm transition-colors border-b-2 ${activeTab === 'categories' ? 'border-amber-600 text-amber-800 bg-white' : 'border-transparent text-amber-900/60 hover:text-amber-800 hover:bg-white/50'}`}
                    onClick={() => setActiveTab('categories')}
                >
                    Danh mục Sản phẩm
                </button>
                <button 
                    className={`py-4 px-6 font-bold text-sm transition-colors border-b-2 ${activeTab === 'products' ? 'border-amber-600 text-amber-800 bg-white' : 'border-transparent text-amber-900/60 hover:text-amber-800 hover:bg-white/50'}`}
                    onClick={() => setActiveTab('products')}
                >
                    Danh sách Sản phẩm
                </button>
            </div>
            
            <div className="flex-1 overflow-auto bg-[#FDFBF7]">
                {activeTab === 'categories' && (
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-amber-950 flex items-center gap-2"><Layers size={22} className="text-amber-700" /> Quản lý Danh mục</h2>
                            <button onClick={() => { setEditingCategory(null); setShowCategoryModal(true); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-sm transition-colors">
                                + Thêm danh mục
                            </button>
                        </div>
                        <div className="bg-white border rounded-xl overflow-hidden shadow-sm flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-amber-50 text-amber-900 text-sm border-b">
                                    <tr>
                                        <th className="p-4 font-bold">Mã DM</th>
                                        <th className="p-4 font-bold">Tên Danh Mục</th>
                                        <th className="p-4 font-bold">Mô tả</th>
                                        <th className="p-4 font-bold text-center">Trạng thái</th>
                                        <th className="p-4 font-bold text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(categories || []).map(cat => (
                                        <tr key={cat.id} className="border-b border-gray-50 hover:bg-amber-50/30 text-sm">
                                            <td className="p-4 font-bold text-gray-900">{cat.id}</td>
                                            <td className="p-4 text-gray-800 font-medium">{cat.name}</td>
                                            <td className="p-4 text-gray-600 max-w-xs truncate">{cat.description}</td>
                                            <td className="p-4 text-center"><span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${cat.status === 'Hoạt động' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{cat.status}</span></td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => { setEditingCategory(cat); setShowCategoryModal(true); }} className="text-xs font-bold px-3 py-1.5 text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition-colors mr-2">Sửa</button>
                                                <button onClick={() => {
                                                    const newStatus = cat.status === 'Hoạt động' ? 'Khóa' : 'Hoạt động';
                                                    if(window.confirm(`Bạn có chắc muốn ${newStatus === 'Khóa' ? 'khóa' : 'mở khóa'} danh mục này?`)) {
                                                        setCategories(categories.map(c => c.id === cat.id ? {...c, status: newStatus} : c));
                                                    }
                                                }} className={`text-xs font-bold px-3 py-1.5 border rounded transition-colors ${cat.status === 'Hoạt động' ? 'text-red-600 bg-red-50 border-red-100 hover:bg-red-100' : 'text-green-600 bg-green-50 border-green-100 hover:bg-green-100'}`}>
                                                    {cat.status === 'Hoạt động' ? 'Khóa' : 'Mở khóa'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!(categories || []).length) && <tr><td colSpan="5" className="p-8 text-center text-gray-500">Chưa có danh mục nào</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-amber-950 flex items-center gap-2"><Beaker size={22} className="text-amber-700" /> Quản lý Sản Phẩm</h2>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input type="text" placeholder="Tìm tên sản phẩm..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64 pl-9 pr-4 py-2 border border-amber-200 rounded-lg text-sm outline-none focus:border-amber-500 bg-white" />
                                </div>
                                <button onClick={() => { setEditingProduct(null); setShowProductModal(true); }} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-amber-700 shadow-sm transition-colors">
                                    + Thêm sản phẩm
                                </button>
                            </div>
                        </div>
                        <div className="bg-white border rounded-xl overflow-hidden shadow-sm flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-amber-50 text-amber-900 text-sm border-b">
                                    <tr>
                                        <th className="p-4 font-bold text-center w-20">Ảnh</th>
                                        <th className="p-4 font-bold">Tên Sản phẩm</th>
                                        <th className="p-4 font-bold">Danh mục</th>
                                        <th className="p-4 font-bold text-right">Giá bán</th>
                                        <th className="p-4 font-bold text-center">Trạng thái</th>
                                        <th className="p-4 font-bold text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(product => {
                                        const categoryName = categories?.find(c => c.id === product.categoryId)?.name || 'Chưa phân loại';
                                        return (
                                        <tr key={product.id} className="border-b border-gray-50 hover:bg-amber-50/30 text-sm">
                                            <td className="p-4 text-center text-3xl">{product.image}</td>
                                            <td className="p-4 text-gray-800 font-bold">{product.name}</td>
                                            <td className="p-4 text-gray-600 font-medium">{categoryName}</td>
                                            <td className="p-4 text-gray-900 font-bold text-right">{product.price.toLocaleString()}đ</td>
                                            <td className="p-4 text-center"><span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${product.status === 'Hoạt động' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{product.status}</span></td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => { setEditingProduct(product); setShowProductModal(true); }} className="text-xs font-bold px-3 py-1.5 text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition-colors mr-2">Sửa</button>
                                                <button onClick={() => { setSelectedProductId(product.id); setShowEditRecipe(true); }} className="text-xs font-bold px-3 py-1.5 text-amber-700 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100 transition-colors mr-2">Sửa Công Thức</button>
                                                <button onClick={() => {
                                                    const newStatus = product.status === 'Hoạt động' ? 'Ngừng kinh doanh' : 'Hoạt động';
                                                    if(window.confirm(`Bạn có chắc muốn chuyển trạng thái sản phẩm này thành ${newStatus}?`)) {
                                                        setProducts(products.map(p => p.id === product.id ? {...p, status: newStatus} : p));
                                                    }
                                                }} className={`text-xs font-bold px-3 py-1.5 border rounded transition-colors ${product.status === 'Hoạt động' ? 'text-red-600 bg-red-50 border-red-100 hover:bg-red-100' : 'text-green-600 bg-green-50 border-green-100 hover:bg-green-100'}`}>
                                                    {product.status === 'Hoạt động' ? 'Khóa' : 'Mở khóa'}
                                                </button>
                                            </td>
                                        </tr>
                                    )})}
                                    {(!filteredProducts.length) && <tr><td colSpan="6" className="p-8 text-center text-gray-500">Chưa có sản phẩm nào</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            
            {showProductModal && (
                <ProductModal 
                    isOpen={showProductModal} 
                    onClose={() => setShowProductModal(false)}
                    product={editingProduct}
                    categories={categories}
                    onSave={(data) => {
                        if (data.id) {
                            setProducts(products.map(p => p.id === data.id ? data : p));
                        } else {
                            const newId = Math.floor(100 + Math.random() * 900);
                            setProducts([...products, { ...data, id: newId }]);
                        }
                        setShowProductModal(false);
                    }}
                />
            )}
            {showEditRecipe && <RecipeModal isOpen={showEditRecipe} product={selectedProduct} ingredients={ingredients} onClose={() => setShowEditRecipe(false)} onSave={handleUpdateProduct} />}
            
            {showCategoryModal && (
                <ProductCategoryModal 
                    isOpen={showCategoryModal} 
                    onClose={() => setShowCategoryModal(false)}
                    category={editingCategory}
                    onSave={(data) => {
                        if (data.id) {
                            setCategories(categories.map(c => c.id === data.id ? data : c));
                        } else {
                            const newId = 'CAT' + Math.floor(100 + Math.random() * 900);
                            setCategories([...categories, { ...data, id: newId }]);
                        }
                        setShowCategoryModal(false);
                    }}
                />
            )}
        </div>
    );
}
