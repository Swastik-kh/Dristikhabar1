import React, { useState } from 'react';
import { ROLES, PERMISSIONS } from '../constants.ts';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  users: any[];
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // 1. Try to find user in the loaded Database list
    let user = users.find(u => u.username === cleanUsername && u.password === cleanPassword);
    
    // 2. FAILSAFE: If database is empty, slow, or 'admin' is missing, 
    // manually allow login for 'admin'/'admin'.
    if (!user && cleanUsername === 'admin' && cleanPassword === 'admin') {
      console.log("Using Failsafe Admin Login");
      user = { 
        username: 'admin', 
        password: 'admin', 
        name: 'System Admin (Failsafe)', 
        role: ROLES.CHIEF_EDITOR,
        permissions: Object.values(PERMISSIONS) 
      };
    }

    if (user) {
      setError('');
      onLoginSuccess(user);
      onClose();
      // Reset form
      setUsername('');
      setPassword('');
    } else {
      if (users.length === 0) {
        // If users list is empty but credentials were wrong (not admin/admin)
        setError('डाटा लोड हुँदैछ... कृपया admin / admin प्रयोग गर्नुहोस्।');
      } else {
        setError('प्रयोगकर्ताको नाम वा पासवर्ड मिलेन।');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">लगइन गर्नुहोस्</h2>
            <p className="text-gray-500 mt-2 text-sm">दृष्टि खबर व्यवस्थापन प्रणाली</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">प्रयोगकर्ताको नाम (Username)</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                placeholder="उदा: admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">पासवर्ड (Password)</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm font-medium text-center bg-red-50 p-2 rounded">{error}</p>
            )}

            <button 
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg active:transform active:scale-95"
            >
              लगइन गर्नुहोस्
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400">
            <p>Admin लगइन: user: admin / pass: admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;