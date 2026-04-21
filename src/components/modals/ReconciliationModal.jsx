import React, { useState } from 'react';
import { Calculator, AlertTriangle, CheckCircle2, LockKeyhole } from 'lucide-react';

export default function ReconciliationModal({ onClose, currentShift, onConfirm }) {
    const doanhThuCa = 3450000;
    const tongTienHeThong = (currentShift?.initialCash || 0) + doanhThuCa;
    const [tienDem, setTienDem] = useState('');
    const [lyDo, setLyDo] = useState('');
    const [step, setStep] = useState(1);
    const chenhLech = tienDem ? parseInt(tienDem) - tongTienHeThong : null;
    const isChenhLech = chenhLech !== 0 && chenhLech !== null;

    const handleCheck = () => { if (!tienDem) return alert('Vui lòng nhập tiền!'); setStep(2); };
    const handleLockAndReveal = () => { if (isChenhLech && !lyDo) return alert('Vui lòng nhập lý do!'); setStep(3); };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-[500px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
                <div className="p-6 border-b border-amber-100 bg-amber-50 shrink-0">
                    <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2"><Calculator size={24} /> Đối soát đóng ca</h2>
                </div>
                <div className="p-6 overflow-y-auto flex-1 space-y-5">
                    <div className="bg-gray-50 p-4 rounded-xl text-sm border border-gray-200 shadow-inner">
                        <div className="flex justify-between mb-1">
                            <p className="text-gray-600">Mã ca: <span className="font-bold text-gray-900">CA_{new Date().getTime().toString().slice(-6)}</span></p>
                            <p className="text-gray-600">Máy POS: <span className="font-bold text-gray-900">{currentShift?.posId || 'POS-01'}</span></p>
                        </div>
                        <div className="flex justify-between mt-3 pt-3 border-t border-gray-200"><p className="text-gray-600 font-medium">Tiền mặt đầu ca:</p><span className="font-bold text-amber-700">{(currentShift?.initialCash || 0).toLocaleString()}đ</span></div>
                        <div className="flex justify-between mt-1"><p className="text-gray-600 font-medium">Doanh thu phát sinh:</p><span className="font-bold text-green-700">{doanhThuCa.toLocaleString()}đ</span></div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tiền thực tế đếm được trong két (VNĐ):</label>
                        <div className="flex gap-2">
                            <input type="number" value={tienDem} onChange={(e) => { setTienDem(e.target.value); setStep(1); setLyDo(''); }} onKeyDown={(e) => { if (e.key === 'Enter' && step === 1) handleCheck(); }} className="flex-1 border-2 border-amber-200 rounded-xl p-3 focus:border-amber-600 outline-none font-bold text-xl text-amber-900 bg-white disabled:bg-gray-100 disabled:text-gray-500 transition-colors" disabled={step >= 2} autoFocus />
                            {step === 1
                                ? <button onClick={handleCheck} className="px-6 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl transition-colors border border-amber-300 shadow-sm">Kiểm tra</button>
                                : <button onClick={() => setStep(1)} disabled={step === 3} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-colors border border-gray-300 disabled:opacity-50">Sửa lại</button>
                            }
                        </div>
                    </div>
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            {isChenhLech
                                ? <div className="space-y-4">
                                    <div className="bg-orange-50 text-orange-800 p-4 rounded-xl border border-orange-200 flex items-start gap-3">
                                        <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                                        <p className="text-sm font-medium leading-relaxed"><strong className="block mb-1">Cảnh báo: Số tiền không khớp!</strong>Tiền đếm đang chênh lệch. Vui lòng đếm lại hoặc <strong>nhập lý do giải trình</strong>.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-red-600 mb-1">⚠️ Lý do giải trình (Bắt buộc):</label>
                                        <textarea value={lyDo} onChange={(e) => setLyDo(e.target.value)} className="w-full border-2 border-red-300 rounded-xl p-3 outline-none text-sm focus:border-red-500 bg-red-50/30" rows="3" />
                                    </div>
                                  </div>
                                : <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 flex items-center gap-3"><CheckCircle2 className="shrink-0" size={24} /><p className="text-sm font-medium">Tuyệt vời! Số tiền đếm thực tế <strong>khớp 100%</strong>.</p></div>
                            }
                        </div>
                    )}
                    {step === 3 && (
                        <div className="animate-in fade-in zoom-in duration-500 space-y-4">
                            {isChenhLech && (
                                <div className="opacity-70">
                                    <label className="block text-sm font-bold text-gray-600 mb-1">Lý do đã giải trình:</label>
                                    <div className="w-full border border-gray-200 rounded-xl p-3 bg-gray-100 text-sm text-gray-600 italic">"{lyDo}"</div>
                                </div>
                            )}
                            <div className={`p-5 rounded-2xl border-2 shadow-sm ${isChenhLech ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                                <h4 className="font-bold text-center text-gray-800 mb-4 text-lg">KẾT QUẢ ĐỐI SOÁT</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm"><span className="text-gray-600">Tiền đếm thực tế:</span><span className="font-bold text-gray-900">{parseInt(tienDem).toLocaleString()}đ</span></div>
                                    <div className="flex justify-between items-center text-sm"><span className="text-gray-600">Hệ thống tính:</span><span className="font-bold text-gray-900">{tongTienHeThong.toLocaleString()}đ</span></div>
                                    <div className="pt-3 mt-3 border-t border-gray-300 flex justify-between items-center text-xl font-black">
                                        <span className={isChenhLech ? 'text-red-700' : 'text-green-700'}>Chênh lệch:</span>
                                        <span className={isChenhLech ? 'text-red-700' : 'text-green-700'}>{chenhLech > 0 ? '+' : ''}{chenhLech?.toLocaleString()}đ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-6 border-t border-gray-100 bg-white flex gap-3 shrink-0">
                    {step < 3 && <button onClick={onClose} className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors">Hủy bỏ</button>}
                    {step === 2 && <button disabled={isChenhLech && !lyDo.trim()} onClick={handleLockAndReveal} className="flex-1 py-3.5 bg-amber-800 hover:bg-amber-900 disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold rounded-xl transition-colors shadow-md flex justify-center items-center gap-2"><LockKeyhole size={18} /> Khóa sổ & Xem kết quả</button>}
                    {step === 3 && <button onClick={() => { alert('Lưu đối soát thành công! Hệ thống sẽ tự động đăng xuất.'); onConfirm(); }} className="flex-1 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 text-lg animate-pulse"><CheckCircle2 size={20} /> Hoàn tất & Đăng xuất</button>}
                </div>
            </div>
        </div>
    );
}
