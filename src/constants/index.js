import {
    LayoutDashboard, Users, ShoppingCart, FileText, Package,
    BarChart3, Settings, CakeSlice, UserCircle
} from 'lucide-react';

// ==========================================
// 1. CẤU HÌNH
// ==========================================

export const ROLES = { MANAGER: 'Quản lý', CASHIER: 'Thu ngân', BAKER: 'Thợ bếp' };

export const MODULES = [
    { id: 'dashboard', label: 'Tổng quan & Đối soát', icon: LayoutDashboard, roles: [ROLES.MANAGER, ROLES.CASHIER] },
    { id: 'pos', label: 'Bán hàng', icon: ShoppingCart, roles: [ROLES.MANAGER, ROLES.CASHIER] },
    { id: 'orders', label: 'Đơn hàng', icon: FileText, roles: [ROLES.MANAGER, ROLES.CASHIER, ROLES.BAKER] },
    { id: 'inventory', label: 'Kho & Nguyên liệu', icon: Package, roles: [ROLES.MANAGER, ROLES.BAKER] },
    { id: 'products', label: 'Sản phẩm & Công thức', icon: CakeSlice, roles: [ROLES.MANAGER, ROLES.BAKER] },
    { id: 'customers', label: 'Khách hàng', icon: Users, roles: [ROLES.MANAGER, ROLES.CASHIER] },
    { id: 'hr', label: 'Nhân sự', icon: UserCircle, roles: [ROLES.MANAGER] },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3, roles: [ROLES.MANAGER] },
    { id: 'account', label: 'Tài khoản', icon: Settings, roles: [ROLES.MANAGER, ROLES.CASHIER, ROLES.BAKER] },
];
