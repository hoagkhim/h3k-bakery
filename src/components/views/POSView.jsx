import React, { useState, useEffect } from 'react';
import {
    Users, ShoppingCart, Search, ChefHat, ShoppingBag,
    CheckCircle2, Calculator, UserPlus
} from 'lucide-react';
import { calculateTierAndDiscount } from '../../data/mockData';

export default function POSView({ products, setProducts, orders, setOrders, customers, setCustomers, onOpenCustomCake }) {
    const [cart, setCart] = useState([]);
    const [checkoutModal, setCheckoutModal] = useState(false);
    const [receiptModal, setReceiptModal] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Tất cả');

    const [phoneInput, setPhoneInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [addressInput, setAddressInput] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
        else setCart([...cart, { ...product, qty: 1 }]);
    };

    // Calculate details and safeguard against NaN with Number() and Math.round()
    const totalOrigin = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discountRate = selectedCustomer ? Number(selectedCustomer.discount || 0) : 0;
    const discountAmount = Math.round((totalOrigin * discountRate) / 100);
    const totalAfterDiscount = totalOrigin - discountAmount;
    const vatAmount = Math.round(totalAfterDiscount * 0.08);
    const finalTotal = totalAfterDiscount + vatAmount;

    useEffect(() => {
        if (phoneInput.length >= 4) {
            const match = customers.find(c => c.phone === phoneInput && c.status === 1);
            if (match) {
                setSelectedCustomer(match);
                setNameInput(match.name || '');
                setShowNewCustomerForm(false);
            } else {
                setSelectedCustomer(null);
            }
        } else {
            setSelectedCustomer(null);
            setShowNewCustomerForm(false);
        }
    }, [phoneInput, customers]);

    const handleCheckout = (paymentMethod) => {
        let finalCustomerName = nameInput.trim() || 'Khách lẻ';
        let earnedPoints = Math.floor(finalTotal / 10000);

        if (showNewCustomerForm && phoneInput && nameInput) {
            const newCust = {
                id: `KH${Math.floor(Math.random() * 10000)}`,
                name: nameInput,
                phone: phoneInput,
                address: addressInput,
                points: earnedPoints,
                tier: 'Đồng',
                discount: 0,
                joinDate: new Date().toLocaleDateString('vi-VN'),
                status: 1
            };
            setCustomers([...customers, newCust]);
            finalCustomerName = nameInput;
            alert(`Đã lưu thông tin khách hàng mới!\nTích lũy được: +${earnedPoints} điểm.`);
        } else if (selectedCustomer) {
            const newPoints = (selectedCustomer.points || 0) + earnedPoints;
            const { tier, discount } = calculateTierAndDiscount(newPoints);

            const updatedCustomers = customers.map(c => {
                if (c.id === selectedCustomer.id) {
                    if (c.tier !== tier) alert(`Chúc mừng!\nKhách hàng ${c.name} đã thăng lên hạng ${tier}!`);
                    return { ...c, points: newPoints, tier, discount };
                }
                return c;
            });
            setCustomers(updatedCustomers);
            finalCustomerName = selectedCustomer.name || 'Khách lẻ';
        }

        const newOrder = {
            id: `DH00${orders.length + 1}`,
            customer: finalCustomerName,
            phone: phoneInput,
            total: finalTotal,
            deposit: finalTotal,
            status: 'Hoàn thành',
            type: 'Bán sẵn',
            receiveType: 'Tại quầy',
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' Hôm nay',
            items: cart.map(i => `${i.qty}x ${i.name}`).join(', '),
            urgent: false
        };

        setOrders([newOrder, ...orders]);
        setCheckoutModal(false);
        setReceiptModal(newOrder);
        setCart([]);
        setPhoneInput('');
        setNameInput('');
        setAddressInput('');
        setSelectedCustomer(null);
        setShowNewCustomerForm(false);
    };

    const filteredProducts = products.filter(p => {
        const matchName = (p?.name || '').toLowerCase().includes((searchTerm || '').toLowerCase());
        const matchCategory = activeCategory === 'Tất cả' || p?.category === activeCategory;
        return matchName && matchCategory;
    });

    return (
        <div className="flex gap-6 h-full">
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Tìm tên bánh..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-amber-200 rounded-full text-sm outline-none focus:border-amber-500 bg-white" />
                        </div>
                        <button onClick={onOpenCustomCake} className="shrink-0 px-4 py-2 bg-amber-800 text-white rounded-full text-sm font-bold flex items-center gap-2 hover:bg-amber-900 shadow-sm"><ChefHat size={16} /> Đặt bánh tùy chỉnh</button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {['Tất cả', 'Bánh Mì', 'Bánh Lạnh', 'Bánh Kem', 'Đồ Uống'].map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 border rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeCategory === cat ? 'bg-amber-800 text-white border-amber-800' : 'bg-white border-amber-200 text-amber-800 hover:bg-amber-100'}`}>{cat}</button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-4 content-start">
                    {filteredProducts.map(product => {
                        const cartItem = cart.find(item => item.id === product.id);
                        const availableStock = product.stock - (cartItem ? cartItem.qty : 0);
                        const isOutOfStock = availableStock <= 0;

                        return (
                            <div key={product.id} onClick={() => { if (!isOutOfStock) addToCart(product); }} className={`bg-white p-4 rounded-2xl border shadow-sm transition-all flex flex-col items-center text-center gap-2 group relative overflow-hidden ${isOutOfStock ? 'border-gray-200 opacity-60 cursor-not-allowed' : 'border-amber-100 hover:shadow-md hover:border-amber-400 cursor-pointer'}`}>
                                <div className={`absolute top-0 right-0 px-2.5 py-1 rounded-bl-xl text-[10px] font-bold ${isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>{isOutOfStock ? 'Hết hàng' : `Còn: ${availableStock}`}</div>
                                <div className={`text-5xl mt-3 mb-1 transition-transform ${!isOutOfStock && 'group-hover:scale-110'}`}>{product.image}</div>
                                <h3 className="font-semibold text-sm text-amber-950 line-clamp-2 leading-tight">{product.name}</h3>
                                <p className="text-amber-700 font-bold mt-auto">{product.price.toLocaleString()}đ</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="w-[360px] bg-white rounded-3xl shadow-sm border border-amber-200 flex flex-col overflow-hidden shrink-0">
                <div className="p-4 border-b border-amber-100 bg-amber-800 text-white flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2"><ShoppingBag size={20} /> Hóa đơn tại quầy</h3>
                    <span className="bg-amber-900 px-2 py-1 rounded text-xs font-bold">{cart.reduce((a, b) => a + b.qty, 0)} món</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-amber-300"><ShoppingCart size={48} className="mb-2 opacity-50" /><p className="text-sm font-medium">Chưa có món nào</p></div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-amber-100 shadow-sm">
                                <div className="flex-1 pr-2"><h4 className="text-sm font-bold text-amber-950 leading-tight">{item.name}</h4><p className="text-xs text-amber-600 mt-1">{item.price.toLocaleString()}đ</p></div>
                                <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-1 border border-amber-100">
                                    <button onClick={() => setCart(cart.map(i => i.id === item.id ? { ...i, qty: Math.max(0, i.qty - 1) } : i).filter(i => i.qty > 0))} className="w-6 h-6 rounded bg-white text-amber-800 font-bold shadow-sm hover:bg-amber-200">-</button>
                                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                    <button disabled={item.qty >= products.find(p => p.id === item.id).stock} onClick={() => setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))} className="w-6 h-6 rounded bg-amber-800 text-white font-bold shadow-sm hover:bg-amber-900 disabled:opacity-50 disabled:cursor-not-allowed">+</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-5 bg-white border-t border-amber-200 space-y-4 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-between items-center font-bold text-xl text-amber-950"><span>Tổng cộng:</span><span className="text-amber-800">{totalOrigin.toLocaleString()}đ</span></div>
                    <button disabled={cart.length === 0} onClick={() => setCheckoutModal(true)} className="w-full py-3.5 bg-amber-800 hover:bg-amber-900 disabled:bg-amber-200 disabled:text-amber-500 text-white rounded-xl font-bold transition-colors flex justify-center items-center gap-2 text-lg">Thanh toán</button>
                </div>
            </div>

            {checkoutModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-3xl w-[450px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
                        <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2 shrink-0"><Calculator size={24} /> Thanh toán Hóa đơn</h2>
                        <div className="overflow-y-auto flex-1 pr-2 space-y-5 pb-4">
                            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                                <h3 className="font-bold text-amber-900 mb-3 text-sm flex items-center gap-1.5"><Users size={16} /> Thông tin Khách hàng</h3>
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <input type="text" placeholder="Số điện thoại..." value={phoneInput} onChange={e => setPhoneInput(e.target.value)} className="w-1/2 border-2 border-amber-100 rounded-xl p-2.5 focus:border-amber-500 outline-none text-sm font-bold bg-white" />
                                        <input type="text" placeholder="Họ và tên..." value={nameInput} onChange={e => setNameInput(e.target.value)} disabled={!!selectedCustomer} className={`w-1/2 border-2 rounded-xl p-2.5 outline-none text-sm font-bold ${selectedCustomer ? 'border-green-200 bg-green-50 text-green-800' : 'border-amber-100 bg-white focus:border-amber-500'}`} />
                                    </div>
                                    {selectedCustomer ? (
                                        <div className="flex items-center gap-2 text-xs font-bold bg-green-100 text-green-800 px-3 py-2 rounded-lg border border-green-200"><CheckCircle2 size={14} /> Tìm thấy KH: Hạng {selectedCustomer.tier} (Giảm {selectedCustomer.discount}%) | {selectedCustomer.points} điểm</div>
                                    ) : phoneInput.length >= 8 && !showNewCustomerForm ? (
                                        <button onClick={() => setShowNewCustomerForm(true)} className="w-full py-2 bg-white border border-dashed border-amber-400 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-100 transition-colors flex justify-center items-center gap-1"><UserPlus size={14} /> Lưu thông tin khách mới để Tích điểm</button>
                                    ) : null}
                                    {showNewCustomerForm && (
                                        <div className="animate-in fade-in slide-in-from-top-2">
                                            <input type="text" placeholder="Địa chỉ giao hàng (Tùy chọn)..." value={addressInput} onChange={e => setAddressInput(e.target.value)} className="w-full border-2 border-blue-200 bg-blue-50 rounded-xl p-2.5 focus:border-blue-500 outline-none text-sm font-medium" />
                                            <p className="text-[10px] text-blue-600 mt-1 font-bold italic">*Hệ thống sẽ tự tạo thẻ thành viên Hạng Đồng sau khi thanh toán.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="flex justify-between text-gray-600 mb-2"><span>Cộng tiền hàng:</span> <span className="font-bold">{totalOrigin.toLocaleString()}đ</span></div>
                                {discountRate > 0 && <div className="flex justify-between text-green-600 mb-2"><span>Chiết khấu ({discountRate}%):</span> <span className="font-bold">-{discountAmount.toLocaleString()}đ</span></div>}
                                <div className="flex justify-between text-gray-600 mb-2 border-b border-gray-200 pb-2"><span>VAT (8%):</span> <span className="font-bold">{vatAmount.toLocaleString()}đ</span></div>
                                <div className="flex justify-between text-xl text-amber-950 font-black pt-1"><span>Khách phải trả:</span> <span>{finalTotal.toLocaleString()}đ</span></div>
                                <div className="text-right text-[10px] font-bold text-amber-600 mt-1">Sẽ tích lũy: +{Math.floor(finalTotal / 10000)} điểm</div>
                            </div>
                        </div>
                        <div className="shrink-0 pt-2 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <button onClick={() => handleCheckout('Tiền mặt')} className="py-3 border-2 border-amber-200 rounded-xl hover:bg-amber-50 font-bold text-amber-900 shadow-sm">💵 Tiền mặt</button>
                                <button onClick={() => handleCheckout('Chuyển khoản')} className="py-3 border-2 border-amber-200 rounded-xl hover:bg-amber-50 font-bold text-amber-900 shadow-sm">📱 Quẹt mã/CK</button>
                            </div>
                            <button onClick={() => setCheckoutModal(false)} className="w-full py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">Hủy bỏ / Quay lại</button>
                        </div>
                    </div>
                </div>
            )}
            {receiptModal && <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"><div className="bg-white p-6 rounded-3xl shadow-2xl"><p className="font-bold text-amber-900">Hóa đơn: {receiptModal.id}</p><button onClick={() => setReceiptModal(null)} className="mt-4 px-4 py-2 bg-amber-800 text-white rounded-lg font-bold">Đóng</button></div></div>}
        </div>
    );
}
