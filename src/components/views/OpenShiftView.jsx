import React, { useState } from 'react';
import { Store } from 'lucide-react';

export default function OpenShiftView({ currentUser, onOpen, onLogout }) {
    const [posId, setPosId] = useState('POS-01');
    const [initialCash, setInitialCash] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!posId) return alert('Vui lòng chọn Mã máy POS!');
        if (initialCash === '') return alert('Vui lòng nhập số tiền mặt hiện có trong két!');
        onOpen(initialCash, posId);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4 relative overflow-hidden w-full">
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-amber-200/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-amber-300/30 rounded-full blur-3xl"></div>

            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl w-full max-w-md z-10 border border-amber-50">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-amber-800 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
                        <Store size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-amber-950 text-center">Xác nhận Mở Ca</h1>
                    <p className="text-amber-600 font-medium mt-1 text-center">
                        Xin chào, <strong>{currentUser.name}</strong>
                    </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl mb-6 text-sm text-amber-800 border border-amber-100 leading-relaxed">
                    Vui lòng kiểm đếm và xác nhận <strong>số tiền mặt hiện có trong két</strong> trước khi bắt đầu phiên làm việc để phục vụ việc đối soát doanh thu cuối ca.
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-amber-900 mb-2">Máy POS (Quầy phục vụ)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-500">
                                <Store size={18} />
                            </div>
                            <select
                                value={posId}
                                onChange={e => setPosId(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-amber-200 rounded-xl text-sm font-bold focus:border-amber-600 outline-none transition-all text-amber-900 cursor-pointer"
                            >
                                <option value="POS-01">POS-01 (Quầy Thanh toán 1)</option>
                                <option value="POS-02">POS-02 (Quầy Thanh toán 2)</option>
                                <option value="POS-03">POS-03 (Quầy Mang đi)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-amber-900 mb-2">Tiền mặt đầu ca (VNĐ)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-amber-500 font-bold">
                                ₫
                            </div>
                            <input
                                type="number" min="0"
                                value={initialCash}
                                onChange={e => setInitialCash(e.target.value)}
                                className="w-full pl-10 pr-4 py-3.5 bg-white border-2 border-amber-200 rounded-xl text-lg font-bold focus:border-amber-600 outline-none transition-all"
                                placeholder="Ví dụ: 1500000"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={onLogout} className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-all">
                            Đăng xuất
                        </button>
                        <button type="submit" className="flex-1 py-3.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-sm shadow-md transition-all flex justify-center items-center gap-2">
                            Bắt đầu làm việc
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
