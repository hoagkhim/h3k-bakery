import { ROLES } from '../constants';

// ==========================================
// DỮ LIỆU MẪU (MOCK DATA)
// ==========================================

export const MOCK_PRODUCTS = [
    { id: 1, name: 'Tiramisu Cổ Điển', price: 65000, category: 'Bánh Lạnh', image: '🍰', stock: 12, prepTime: '30 phút', shelfLife: 3, recipe: [{ nlId: 'NL01', qty: 0.1 }, { nlId: 'NL02', qty: 1 }, { nlId: 'NL04', qty: 0.05 }, { nlId: 'NL05', qty: 0.1 }] },
    { id: 2, name: 'Bánh Mì Hoa Cúc', price: 85000, category: 'Bánh Mì', image: '🍞', stock: 5, prepTime: '120 phút', shelfLife: 4, recipe: [{ nlId: 'NL01', qty: 0.3 }, { nlId: 'NL02', qty: 2 }, { nlId: 'NL03', qty: 0.1 }] },
    { id: 3, name: 'Croissant Bơ Pháp', price: 35000, category: 'Bánh Mì', image: '🥐', stock: 20, prepTime: '90 phút', shelfLife: 2, recipe: [{ nlId: 'NL01', qty: 0.15 }, { nlId: 'NL03', qty: 0.05 }] },
    { id: 4, name: 'Macaron Hộp 6', price: 120000, category: 'Bánh Ngọt', image: '🍪', stock: 8, prepTime: '60 phút', shelfLife: 7, recipe: [{ nlId: 'NL02', qty: 2 }, { nlId: 'NL04', qty: 0.1 }] },
    { id: 5, name: 'Bánh Kem Dâu (16cm)', price: 280000, category: 'Bánh Kem', image: '🎂', stock: 2, prepTime: '45 phút', shelfLife: 3, recipe: [{ nlId: 'NL01', qty: 0.2 }, { nlId: 'NL02', qty: 3 }, { nlId: 'NL04', qty: 0.2 }] },
    { id: 6, name: 'Trà Sữa Trân Châu', price: 45000, category: 'Đồ Uống', image: '🧋', stock: 50, prepTime: '5 phút', shelfLife: 1, recipe: [{ nlId: 'NL03', qty: 0.2 }] },
];

export const CUSTOM_OPTIONS = {
    sizes: [{ id: 'S1', name: '15cm', price: 0 }, { id: 'S2', name: '20cm', price: 50000 }, { id: 'S3', name: '2 Tầng', price: 200000 }],
    bases: [{ id: 'B1', name: 'Vani', price: 0 }, { id: 'B2', name: 'Socola', price: 20000 }, { id: 'B3', name: 'Trà Xanh', price: 30000 }],
    fillings: [{ id: 'F1', name: 'Mứt Dâu', price: 0 }, { id: 'F2', name: 'Phô Mai', price: 40000 }],
    decors: [{ id: 'D1', name: 'Viết chữ cơ bản', price: 0 }, { id: 'D2', name: 'Vẽ hình 2D', price: 50000 }, { id: 'D3', name: 'Tạo hình Labubu', price: 150000 }],
};

export const INITIAL_ORDERS = [
    { id: 'DH001', customer: 'Nguyễn Văn A', phone: '0901234567', total: 450000, deposit: 250000, status: 'Đã cọc', type: 'Tùy chỉnh', receiveType: 'Tại quầy', time: '18:00 Hôm nay', items: '1x Bánh Kem Tùy Chỉnh', customDetails: { size: 'Size 25cm', base: 'Cốt Vani', filling: 'Nhân Mứt Dâu', decor: 'Bắt bông kem viền', message: 'HPBD Sếp Khiêm', note: 'Không có' }, urgent: true },
    { id: 'DH002', customer: 'Trần Thị B', phone: '0912345678', total: 65000, deposit: 65000, status: 'Đang sản xuất', type: 'Bán sẵn', receiveType: 'Giao đi', time: '15:00 Hôm nay', items: '1x Tiramisu', urgent: false },
    { id: 'DH003', customer: 'Lê Văn C', phone: '0987654321', total: 120000, deposit: 120000, status: 'Chờ giao', type: 'Bán sẵn', receiveType: 'Giao đi', time: '16:15 Hôm nay', items: '1x Macaron', urgent: false },
    { id: 'DH004', customer: 'Phạm Thị D', phone: '0977112233', total: 250000, deposit: 150000, status: 'Đã cọc', type: 'Tùy chỉnh', receiveType: 'Tại quầy', time: '10:00 Ngày mai', items: '1x Bánh Kem Trà Xanh', customDetails: { size: 'Size 15cm', base: 'Cốt Trà Xanh', filling: 'Phô Mai', decor: 'Vẽ hình 2D', message: 'Kỉ niệm 1 năm', note: 'Ít ngọt' }, urgent: false },
    { id: 'DH005', customer: 'Vũ Văn E', phone: '0933445566', total: 85000, deposit: 85000, status: 'Hoàn thành', type: 'Bán sẵn', receiveType: 'Tại quầy', time: '09:00 Hôm nay', items: '1x Bánh Mì Hoa Cúc', urgent: false },
];

export const MOCK_INVENTORY = [
    { id: 'NL01', name: 'Bột mì đa dụng', unit: 'Kg', stock: 15, safeStock: 20, price: 18000, status: 'warning' },
    { id: 'NL02', name: 'Trứng gà', unit: 'Quả', stock: 120, safeStock: 100, price: 3000, status: 'ok' },
    { id: 'NL03', name: 'Sữa tươi không đường', unit: 'Lít', stock: 2, safeStock: 10, price: 35000, status: 'danger' },
    { id: 'NL04', name: 'Whipping Cream', unit: 'Lít', stock: 8, safeStock: 5, price: 120000, status: 'ok' },
    { id: 'NL05', name: 'Chocolate đen 70%', unit: 'Kg', stock: 5, safeStock: 5, price: 250000, status: 'warning' },
];

export const MOCK_SUPPLIERS = [
    { id: 'NCC01', name: 'Công ty Bột Mì Miền Nam' },
    { id: 'NCC02', name: 'Trang trại Trứng Gà Ba Huân' },
];

export const INITIAL_CUSTOMERS = [
    { id: 'KH01', name: 'Nguyễn Văn A', phone: '0901234567', points: 1500, tier: 'Vàng', discount: 10, address: 'Ký túc xá khu A', joinDate: '12/01/2023', status: 1 },
    { id: 'KH02', name: 'Trần Thị B', phone: '0912345678', points: 650, tier: 'Bạc', discount: 5, address: 'Dĩ An, Bình Dương', joinDate: '05/06/2023', status: 1 },
    { id: 'KH03', name: 'Lê Văn C', phone: '0987654321', points: 50, tier: 'Đồng', discount: 0, address: 'Quận 9, TP.HCM', joinDate: '28/10/2023', status: 1 },
    { id: 'KH05', name: 'Vũ Văn E', phone: '0933445566', points: 2100, tier: 'Kim Cương', discount: 15, address: 'Linh Trung, Thủ Đức', joinDate: '02/03/2022', status: 1 },
    { id: 'KH06', name: 'Nguyễn Khóa TK', phone: '0966778899', points: 120, tier: 'Đồng', discount: 0, address: 'Bình Dương', joinDate: '10/11/2023', status: 0 },
];

export const INITIAL_USERS = [
    { username: 'admin', password: '123', role: ROLES.MANAGER, name: 'Quản Lý Demo', phone: '0988111222', dob: '1990-05-15', status: 1 },
    { username: 'thungan', password: '123', role: ROLES.CASHIER, name: 'Thu Ngân Demo', phone: '0933444555', dob: '1998-10-20', status: 1 },
    { username: 'thobep', password: '123', role: ROLES.BAKER, name: 'Thợ Bếp Demo', phone: '0977888999', dob: '1995-12-12', status: 1 },
    { username: 'nghiviec', password: '123', role: ROLES.CASHIER, name: 'Nhân Viên Nghỉ Việc', phone: '0900111222', dob: '2000-01-01', status: 0 },
];

export const calculateTierAndDiscount = (points) => {
    if (points >= 2000) return { tier: 'Kim Cương', discount: 15 };
    if (points >= 1000) return { tier: 'Vàng', discount: 10 };
    if (points >= 500) return { tier: 'Bạc', discount: 5 };
    return { tier: 'Đồng', discount: 0 };
};
