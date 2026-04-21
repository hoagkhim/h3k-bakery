import React from 'react';
import { Printer, X } from 'lucide-react';

export default function ReceiptViewerModal({ order, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-200 rounded-lg p-4 flex flex-col items-center shadow-2xl max-h-[90vh]">
                <div className="flex justify-between w-full mb-2 text-white font-medium">
                    <span className="flex items-center gap-2"><Printer size={16} /> JasperReports Preview (80mm)</span>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                <div className="bg-white text-black w-[320px] p-6 shadow-md overflow-y-auto font-mono text-xs">
                    <div className="text-center mb-4 border-b-2 border-dashed border-gray-400 pb-4">
                        <h2 className="text-lg font-bold uppercase">La Boulangerie</h2>
                        <p>123 Đường Dĩ An, Bình Dương</p>
                        <p>ĐT: 0909.123.456</p>
                        <h3 className="text-base font-bold mt-3">HÓA ĐƠN THANH TOÁN</h3>
                        <p className="mt-1 text-left">Số HD: {order.id}</p>
                        <p className="text-left">Ngày in: {new Date().toLocaleString('vi-VN')}</p>
                        <p className="text-left">Thu ngân: Demo</p>
                    </div>
                    <table className="w-full mb-4 text-left border-collapse">
                        <thead><tr className="border-b border-gray-800"><th className="pb-1">Tên món</th><th className="text-right pb-1">TTiền</th></tr></thead>
                        <tbody><tr><td colSpan="2" className="pt-2 whitespace-pre-wrap">{order.items}</td></tr></tbody>
                    </table>
                    <div className="border-t-2 border-dashed border-gray-400 pt-2 space-y-1">
                        <div className="flex justify-between"><span>Cộng tiền hàng:</span> <span>{order.total.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>VAT (8%):</span> <span>{(order.total * 0.08).toLocaleString()}</span></div>
                        <div className="flex justify-between font-bold text-sm mt-2"><span>TỔNG CỘNG:</span> <span>{(order.total * 1.08).toLocaleString()}</span></div>
                    </div>
                    <div className="text-center mt-6 text-[10px] text-gray-600">
                        <p>Cảm ơn quý khách và hẹn gặp lại!</p>
                        <p>Pass Wifi: labou123</p>
                    </div>
                </div>
                <button onClick={onClose} className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow">In Hóa Đơn</button>
            </div>
        </div>
    );
}
