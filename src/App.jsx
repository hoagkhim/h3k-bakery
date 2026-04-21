import React, { useState, useMemo, useEffect } from 'react';
import { Store, LogOut } from 'lucide-react';

// Cấu hình
import { ROLES, MODULES } from './constants';

// Dữ liệu mẫu
import {
    INITIAL_USERS,
    MOCK_PRODUCTS,
    INITIAL_ORDERS,
    MOCK_INVENTORY,
    INITIAL_CUSTOMERS,
} from './data/mockData';

// Views
import AuthView from './components/views/AuthView';
import DashboardView from './components/views/DashboardView';
import POSView from './components/views/POSView';
import OrderKDSView from './components/views/OrderKDSView';
import InventoryView from './components/views/InventoryView';
import CustomerView from './components/views/CustomerView';
import ProductRecipeView from './components/views/ProductRecipeView';
import HRView from './components/views/HRView';
import AccountView from './components/views/AccountView';
import OpenShiftView from './components/views/OpenShiftView';

// Modals
import CustomCakeOrderModal from './components/modals/CustomCakeOrderModal';

// ==========================================
// 2. MAIN APP COMPONENT
// ==========================================
export default function App() {
    const [usersDb, setUsersDb] = useState(INITIAL_USERS);
    const [currentUser, setCurrentUser] = useState(null);
    const [role, setRole] = useState(ROLES.MANAGER);
    const [activeModule, setActiveModule] = useState('dashboard');

    const [currentShift, setCurrentShift] = useState(null);
    const [products, setProducts] = useState(MOCK_PRODUCTS);
    const [orders, setOrders] = useState(INITIAL_ORDERS);
    const [inventory, setInventory] = useState(MOCK_INVENTORY);
    const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);

    const [showCustomCakeModal, setShowCustomCakeModal] = useState(false);

    const visibleModules = useMemo(() => MODULES.filter(m => m.roles.includes(role)), [role]);

    useEffect(() => {
        if (!visibleModules.find(m => m.id === activeModule)) setActiveModule(visibleModules[0]?.id || '');
    }, [role, visibleModules, activeModule]);

    if (!currentUser) {
        return <AuthView usersDb={usersDb} setUsersDb={setUsersDb} onLogin={(user) => { setCurrentUser(user); setRole(user.role); }} />;
    }

    if (!currentShift && role === ROLES.CASHIER) {
        return <OpenShiftView currentUser={currentUser} onOpen={(cash, posId) => setCurrentShift({ initialCash: Number(cash), posId: posId, startTime: new Date() })} onLogout={() => setCurrentUser(null)} />;
    }

    return (
        <div className="flex h-screen bg-[#FDFBF7] font-sans text-amber-950">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r border-amber-100 flex flex-col shadow-sm z-20 shrink-0">
                <div className="p-6 flex items-center gap-3 border-b border-amber-50">
                    <div className="w-10 h-10 bg-amber-800 rounded-xl flex items-center justify-center text-white shadow-md">
                        <Store size={22} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-amber-900 leading-tight">H3K Bakery</h1>
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Hệ thống quản lý</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
                    {visibleModules.map((module) => {
                        const Icon = module.icon;
                        const isActive = activeModule === module.id;
                        return (
                            <button
                                key={module.id}
                                onClick={() => setActiveModule(module.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                    isActive ? 'bg-amber-800 text-white shadow-md' : 'text-amber-700 hover:bg-amber-100 hover:text-amber-900 font-medium'
                                }`}
                            >
                                <Icon size={18} />
                                <span className="text-sm">{module.id === 'orders' && role === ROLES.BAKER ? 'Màn hình bếp' : module.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-amber-100 bg-amber-50/50">
                    <div className="flex items-center gap-3 mb-4 p-2 bg-white rounded-lg border border-amber-100 shadow-sm">
                        <div className="w-9 h-9 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-sm shadow-inner">
                            {currentUser.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-amber-950 truncate">{currentUser.name}</div>
                            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider truncate">{role}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => { setCurrentUser(null); setActiveModule('dashboard'); setCurrentShift(null); }}
                        className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors text-sm border border-red-100"
                    >
                        <LogOut size={16} /> Đăng xuất
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <header className="h-16 bg-white border-b border-amber-100 flex items-center justify-between px-8 shadow-sm shrink-0 z-10">
                    <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
                        {MODULES.find(m => m.id === activeModule)?.id === 'orders' && role === ROLES.BAKER ? 'Màn hình bếp' : MODULES.find(m => m.id === activeModule)?.label}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-800 flex items-center justify-center text-white font-bold shadow-sm">
                            {currentUser.name.charAt(0)}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-6 relative">
                    {activeModule === 'dashboard' && <DashboardView role={role} currentShift={currentShift} onConfirmCloseShift={() => { setCurrentShift(null); setCurrentUser(null); }} />}
                    {activeModule === 'pos' && <POSView products={products} orders={orders} setOrders={setOrders} customers={customers} setCustomers={setCustomers} onOpenCustomCake={() => setShowCustomCakeModal(true)} />}
                    {activeModule === 'orders' && <OrderKDSView role={role} orders={orders} setOrders={setOrders} products={products} setProducts={setProducts} />}
                    {activeModule === 'inventory' && <InventoryView inventory={inventory} setInventory={setInventory} products={products} setProducts={setProducts} currentUser={currentUser} orders={orders} setOrders={setOrders} />}
                    {activeModule === 'customers' && <CustomerView customers={customers} setCustomers={setCustomers} />}
                    {activeModule === 'products' && <ProductRecipeView products={products} setProducts={setProducts} inventory={inventory} />}
                    {activeModule === 'hr' && <HRView usersDb={usersDb} setUsersDb={setUsersDb} />}
                    {activeModule === 'account' && <AccountView currentUser={currentUser} setCurrentUser={setCurrentUser} usersDb={usersDb} setUsersDb={setUsersDb} />}
                    {activeModule === 'reports' && <DashboardView role={role} isReportOnly currentShift={currentShift} />}
                </div>
            </main>

            {showCustomCakeModal && <CustomCakeOrderModal onClose={() => setShowCustomCakeModal(false)} onSave={(newOrder) => setOrders([newOrder, ...orders])} customers={customers} setCustomers={setCustomers} />}
        </div>
    );
}
