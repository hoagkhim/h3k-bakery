import React, { useState, useEffect } from 'react';
import { ChefHat, X, Printer, AlertTriangle, MapPin, UserPlus, CheckCircle2 } from 'lucide-react';
import { CUSTOM_OPTIONS } from '../../data/mockData';

function SelectField({ label, options, value, onChange }) {
    return (
        <div>
            <label className="text-xs font-bold text-amber-700 mb-1 block">{label}</label>
            <select value={value} onChange={e => onChange(e.target.value)} className="w-full border border-amber-200 rounded-xl p-2.5 outline-none focus:border-amber-500 bg-white text-sm font-medium">
                {options.map(o => <option key={o.id} value={o.id}>{o.name} {o.price > 0 ? `(+${o.price / 1000}k)` : ''}</option>)}
            </select>
        </div>
    );
}

export default function CustomCakeOrderModal({ onClose, onSave, customers, setCustomers }) {
    const [config, setConfig] = useState({ size: 'S1', base: 'B1', filling: 'F1', decor: 'D1' });
    const [deposit, setDeposit] = useState('');
    
    // Đồng bộ state từ POSView
    const [phoneInput, setPhoneInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [addressInput, setAddressInput] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

    const [receiveType, setReceiveType] = useState('Tại quầy');
    const [message, setMessage] = useState('');
    const [note, setNote] = useState('');

    const basePrice = 150000;
    const extraPrice = CUSTOM_OPTIONS.sizes.find(s => s.id === config.size).price + CUSTOM_OPTIONS.bases.find(b => b.id === config.base).price + CUSTOM_OPTIONS.fillings.find(f => f.id === config.filling).price + CUSTOM_OPTIONS.decors.find(d => d.id === config.decor).price;

    const total = basePrice + extraPrice;
    const minDeposit = total * 0.5;

    // Hook tự động tìm khách hàng theo SĐT (Copy từ POSView)
    useEffect(() => {
        if (phoneInput.length >= 4) {
            const match = customers?.find(c => c.phone === phoneInput && c.status === 1);
            if (match) {
                setSelectedCustomer(match);
                setNameInput(match.name || '');
                // Nếu khách hàng đã được đồng bộ địa chỉ từ trước, có thể update
                if (match.address) setAddressInput(match.address);
                setShowNewCustomerForm(false);
            } else {
                setSelectedCustomer(null);
            }
        } else {
            setSelectedCustomer(null);
            setShowNewCustomerForm(false);
        }
    }, [phoneInput, customers]);

    const handleSave = () => {
        let finalCustomerName = nameInput.trim() || 'Khách lẻ';

        if (!nameInput || !phoneInput) return alert('Vui lòng nhập thông tin khách hàng!');
        if (receiveType === 'Giao đi' && !addressInput) return alert('Vui lòng nhập địa chỉ giao hàng!');
        if (deposit < minDeposit) return alert(`Lỗi: Tiền cọc tối thiểu phải là 50% (${minDeposit.toLocaleString()}đ)`);

        // Check lưu khách hàng mới
        if (showNewCustomerForm && setCustomers) {
            const newCustId = `KH${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
            setCustomers([{
                id: newCustId,
                name: nameInput,
                phone: phoneInput,
                address: addressInput,
                points: 0,
                tier: 'Đồng',
                status: 1
            }, ...(customers || [])]);
            finalCustomerName = nameInput;
        } else if (selectedCustomer) {
            finalCustomerName = selectedCustomer.name || 'Khách lẻ';
        }

        const sizeName = CUSTOM_OPTIONS.sizes.find(s => s.id === config.size).name;
        const baseName = CUSTOM_OPTIONS.bases.find(b => b.id === config.base).name;
        const fillingName = CUSTOM_OPTIONS.fillings.find(f => f.id === config.filling).name;
        const decorName = CUSTOM_OPTIONS.decors.find(d => d.id === config.decor).name;

        const newOrder = {
            id: `DH_C${Math.floor(Math.random() * 1000)}`, 
            customer: finalCustomerName, 
            phone: phoneInput, 
            total, 
            deposit: Number(deposit), 
            status: 'Đã cọc', 
            type: 'Tùy chỉnh', 
            receiveType, 
            address: addressInput, 
            time: '17:00 Ngày mai', 
            items: '1x Bánh Kem Tùy Chỉnh', 
            customDetails: { size: sizeName, base: baseName, filling: fillingName, decor: decorName, message: message || '(Không có)', note: note || '(Không có)' }, 
            urgent: false
        };
        onSave(newOrder); onClose();
        alert('Đã lưu đơn và In Phiếu Hẹn thành công!');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl flex overflow-hidden shadow-2xl">
                <div className="flex-1 p-8 overflow-y-auto max-h-[90vh]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2"><ChefHat /> Thiết Kế Bánh Tùy Chỉnh</h2>
                        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={20} /></button>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Đồng bộ UI nhập thông tin Khách hàng */}
                        <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                            <h3 className="font-bold text-amber-900 mb-3 text-sm flex items-center gap-1.5"><UserPlus size={16} /> Thông tin Khách hàng</h3>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <input type="text" placeholder="Số điện thoại (*)..." value={phoneInput} onChange={e => setPhoneInput(e.target.value)} className="w-1/2 border-2 border-amber-100 rounded-xl p-2.5 focus:border-amber-500 outline-none text-sm font-bold bg-white" />
                                    <input type="text" placeholder="Họ và tên (*)..." value={nameInput} onChange={e => setNameInput(e.target.value)} disabled={!!selectedCustomer} className={`w-1/2 border-2 rounded-xl p-2.5 outline-none text-sm font-bold ${selectedCustomer ? 'border-green-200 bg-green-50 text-green-800' : 'border-amber-100 bg-white focus:border-amber-500'}`} />
                                </div>
                                {selectedCustomer ? (
                                    <div className="flex items-center gap-2 text-xs font-bold bg-green-100 text-green-800 px-3 py-2 rounded-lg border border-green-200"><CheckCircle2 size={14} /> Tìm thấy KH: Hạng {selectedCustomer.tier} (Giảm {selectedCustomer.discount}%) | {selectedCustomer.points} điểm</div>
                                ) : phoneInput.length >= 8 && !showNewCustomerForm ? (
                                    <button onClick={() => setShowNewCustomerForm(true)} className="w-full py-2 bg-white border border-dashed border-amber-400 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-100 transition-colors flex justify-center items-center gap-1"><UserPlus size={14} /> Lưu thông tin khách mới</button>
                                ) : null}
                                {showNewCustomerForm && receiveType === 'Tại quầy' && (  // Chỉ hiện cái này nếu không chọn Giao đi, vì Giao đi đã có ô nhập địa chỉ to bên dưới
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <input type="text" placeholder="Địa chỉ (Tùy chọn)..." value={addressInput} onChange={e => setAddressInput(e.target.value)} className="w-full border-2 border-amber-200 bg-white rounded-xl p-2.5 focus:border-amber-500 outline-none text-sm font-medium" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hình thức nhận */}
                        <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-100 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-blue-900 flex items-center gap-2"><MapPin size={16} /> Hình thức nhận</h3>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer text-gray-700">
                                        <input type="radio" name="receiveType" value="Tại quầy" checked={receiveType === 'Tại quầy'} onChange={() => setReceiveType('Tại quầy')} className="w-4 h-4 text-amber-600" /> Nhận tại quầy
                                    </label>
                                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer text-gray-700">
                                        <input type="radio" name="receiveType" value="Giao đi" checked={receiveType === 'Giao đi'} onChange={() => setReceiveType('Giao đi')} className="w-4 h-4 text-amber-600" /> Giao hàng tận nơi
                                    </label>
                                </div>
                            </div>
                            {receiveType === 'Giao đi' && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Địa chỉ giao hàng (*)</label>
                                    <input type="text" value={addressInput} onChange={e => setAddressInput(e.target.value)} placeholder="Nhập địa chỉ nhà, đường, quận..." className="w-full border border-blue-200 rounded-xl p-2.5 outline-none focus:border-blue-500 bg-white text-sm" />
                                </div>
                            )}
                        </div>

                        {/* Cấu hình bánh */}
                        <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 space-y-4">
                            <h3 className="font-bold text-amber-900">Cấu hình bánh</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <SelectField label="1. Kích Cỡ" options={CUSTOM_OPTIONS.sizes} value={config.size} onChange={v => setConfig({ ...config, size: v })} />
                                <SelectField label="2. Cốt Bánh" options={CUSTOM_OPTIONS.bases} value={config.base} onChange={v => setConfig({ ...config, base: v })} />
                                <SelectField label="3. Loại Nhân" options={CUSTOM_OPTIONS.fillings} value={config.filling} onChange={v => setConfig({ ...config, filling: v })} />
                                <SelectField label="4. Kiểu Trang Trí" options={CUSTOM_OPTIONS.decors} value={config.decor} onChange={v => setConfig({ ...config, decor: v })} />
                            </div>
                        </div>

                        {/* Ghi chú */}
                        <div className="grid grid-cols-2 gap-4 mb-2">
                            <div><label className="text-xs font-bold text-gray-500 mb-1 block">Chữ ghi trên bánh</label><input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="VD: HPBD Sếp..." className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-amber-500 bg-gray-50 text-sm" /></div>
                            <div><label className="text-xs font-bold text-gray-500 mb-1 block">Ghi chú cho bếp</label><input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="VD: Ít ngọt, nhiều kem..." className="w-full border border-gray-200 rounded-xl p-2.5 outline-none focus:border-amber-500 bg-gray-50 text-sm" /></div>
                        </div>
                    </div>
                </div>
                
                {/* Panel Thanh toán */}
                <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Tổng Kết Đơn</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between"><span>Giá gốc:</span> <span>{basePrice.toLocaleString()}đ</span></div>
                            <div className="flex justify-between"><span>Phụ phí bánh:</span> <span>{extraPrice.toLocaleString()}đ</span></div>
                            {receiveType === 'Giao đi' && (
                                <div className="flex justify-between text-blue-600 font-medium"><span>Phí giao hàng:</span> <span>Khách tự trả tài xế</span></div>
                            )}
                            <div className="flex justify-between text-lg font-bold text-amber-900 border-t pt-2 mt-2"><span>Tổng Tiền:</span> <span>{total.toLocaleString()}đ</span></div>
                        </div>
                        <div className="mt-8">
                            <label className="block text-sm font-bold text-amber-700 mb-2">Thu tiền cọc (Tối thiểu 50%):</label>
                            <input type="number" value={deposit} onChange={e => setDeposit(e.target.value)} placeholder={`Ít nhất ${minDeposit.toLocaleString()}đ`} className="w-full border-2 border-amber-300 rounded-xl p-3 outline-none focus:border-amber-600 font-bold text-lg bg-white" />
                            {deposit && deposit < minDeposit && <p className="text-xs text-red-500 mt-1 font-bold flex items-center gap-1"><AlertTriangle size={12} /> Chưa đủ mức cọc tối thiểu!</p>}
                        </div>
                    </div>
                    <button onClick={handleSave} disabled={!nameInput || !phoneInput || !deposit || deposit < minDeposit} className="w-full py-4 bg-amber-800 hover:bg-amber-900 disabled:bg-gray-300 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"><Printer size={18} /> Lưu & In Phiếu Hẹn</button>
                </div>
            </div>
        </div>
    );
}
