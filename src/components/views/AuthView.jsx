import React, { useState } from 'react';
import { Store, AlertCircle, User, Lock, Eye, EyeOff } from 'lucide-react';
import { ROLES } from '../../constants';

export default function AuthView({ usersDb, setUsersDb, onLogin }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState(ROLES.CASHIER);
  const [adminCode, setAdminCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (isLoginMode) {
      const user = usersDb.find(u => u.username === username && u.password === password);
      if (user) {
        if (user.status === 0) setError('Tài khoản này đã bị khóa!');
        else onLogin(user);
      } else setError('Tài khoản hoặc mật khẩu không chính xác!');
    } else {
      if (!username || !password || !fullName || !adminCode) return setError('Vui lòng điền đầy đủ thông tin!');
      if (usersDb.some(u => u.username === username)) return setError('Tên đăng nhập đã tồn tại!');
      if (adminCode !== 'admin123') return setError('Mã xác nhận của Quản lý không chính xác!');

      setUsersDb([...usersDb, { username, password, name: fullName, role: selectedRole, phone: '', dob: '', status: 1 }]);
      setIsLoginMode(true);
      setUsername(username);
      setPassword('');
      alert('Tạo tài khoản thành công! Vui lòng cấp cho nhân viên để đăng nhập.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4 relative overflow-hidden w-full">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-amber-200/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-amber-300/30 rounded-full blur-3xl"></div>

      <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl w-full max-w-md z-10 border border-amber-50">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-amber-800 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4 transform -rotate-6">
            <Store size={32} />
          </div>
          <h1 className="text-3xl font-bold text-amber-950">H3K Bakery</h1>
          <p className="text-amber-600 font-medium mt-1">
            {isLoginMode ? 'Chào mừng trở lại!' : 'Tạo tài khoản hệ thống'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-bold flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-xs font-bold text-amber-800 mb-1.5 ml-1">Họ và tên nhân viên (*)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400"><User size={18} /></div>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-amber-800 mb-1.5 ml-1">Tên đăng nhập (*)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400"><User size={18} /></div>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                placeholder="admin / thungan / thobep"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-800 mb-1.5 ml-1">Mật khẩu (*)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-400"><Lock size={18} /></div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-amber-50/50 border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                placeholder="123"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-amber-400 hover:text-amber-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLoginMode && (
            <>
              <div>
                <label className="block text-xs font-bold text-amber-800 mb-1.5 ml-1">Vai trò cấp phát (*)</label>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none font-medium text-amber-900 cursor-pointer"
                >
                  {Object.values(ROLES).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                <label className="block text-xs font-bold text-red-700 mb-1.5">Mã xác nhận của Quản lý (*)</label>
                <input
                  type="password"
                  value={adminCode}
                  onChange={e => setAdminCode(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-red-200 rounded-lg text-sm focus:border-red-400 outline-none"
                  placeholder="Nhập mã bí mật để cho phép tạo..."
                />
              </div>
            </>
          )}

          {isLoginMode && (
            <div className="flex justify-end">
              <button type="button" className="text-xs font-bold text-amber-600 hover:text-amber-800">Quên mật khẩu?</button>
            </div>
          )}

          <button type="submit" className="w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-sm shadow-md transition-all mt-4 flex justify-center items-center gap-2">
            {isLoginMode ? 'Đăng nhập vào hệ thống' : 'Tạo tài khoản'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-amber-100 pt-6">
          <p className="text-sm text-gray-500 font-medium">
            {isLoginMode ? 'Nhân viên mới?' : 'Quay lại đăng nhập'}
            <button
              onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
              className="ml-1 text-amber-700 font-bold hover:underline"
            >
              {isLoginMode ? 'Tạo tài khoản (Yêu cầu quyền Quản lý)' : 'Về trang Login'}
            </button>
          </p>

          {isLoginMode && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs text-left text-gray-500">
              <p className="font-bold mb-1">💡 Gợi ý tài khoản test (Mật khẩu: 123):</p>
              <ul className="space-y-1 ml-2">
                <li>• Quản lý: <span className="font-mono bg-amber-100 px-1 rounded text-amber-900">admin</span></li>
                <li>• Thu ngân: <span className="font-mono bg-amber-100 px-1 rounded text-amber-900">thungan</span></li>
                <li>• Thợ bếp: <span className="font-mono bg-amber-100 px-1 rounded text-amber-900">thobep</span></li>
                <li>• Khóa TK: <span className="font-mono bg-amber-100 px-1 rounded text-amber-900">nghiviec</span></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
