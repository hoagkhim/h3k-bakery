import React from 'react';

export default function StatusBadge({ status }) {
    let color = 'bg-gray-100 text-gray-800';
    if (status === 'Đã cọc' || status === 'Mới đặt') color = 'bg-yellow-100 text-yellow-800';
    if (status === 'Đang sản xuất') color = 'bg-blue-100 text-blue-800';
    if (status === 'Chờ giao' || status === 'Chờ khách lấy') color = 'bg-purple-100 text-purple-800';
    if (status === 'Hoàn thành') color = 'bg-green-100 text-green-800';
    return <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${color}`}>{status}</span>;
}
