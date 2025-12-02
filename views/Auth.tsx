
import React, { useState } from 'react';
import { User } from '../types';
import { Leaf, Mail, Lock, User as UserIcon, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

// Internal type for stored user data including secrets
interface StoredUser extends User {
    email: string;
    password: string;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const getStoredUsers = (): StoredUser[] => {
      try {
          const users = localStorage.getItem('eco_users');
          return users ? JSON.parse(users) : [];
      } catch (e) {
          return [];
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || (!isLogin && !name)) {
        setError('Please fill in all fields');
        return;
    }

    setLoading(true);
    
    // Simulate network delay for realism
    setTimeout(() => {
        setLoading(false);
        const storedUsers = getStoredUsers();

        if (isLogin) {
            // LOGIN LOGIC
            const foundUser = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
            
            if (foundUser) {
                // Remove password before passing to app state
                const { password: _, email: __, ...userProfile } = foundUser;
                onLogin({ ...userProfile }); // Ensure we pass a clean User object
            } else {
                setError('Invalid email or password. Please try again or create an account.');
            }
        } else {
            // SIGNUP LOGIC
            if (storedUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                setError('This email is already registered. Please log in.');
                return;
            }

            const newUser: StoredUser = {
                id: `u_${Date.now()}`,
                name: name,
                email: email,
                password: password,
                points: 0, // New accounts start at 0
                avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${name}&backgroundColor=b6e3f4`,
                clanId: undefined,
                ownedItems: []
            };

            // Save to LocalStorage
            localStorage.setItem('eco_users', JSON.stringify([...storedUsers, newUser]));

            const { password: _, email: __, ...userProfile } = newUser;
            onLogin(userProfile);
        }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-teal-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-24 left-1/2 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden relative z-10 flex flex-col md:flex-row">
        
        {/* Form Section */}
        <div className="p-8 w-full">
            <div className="flex items-center gap-2 mb-8 justify-center">
                <div className="bg-green-100 p-2 rounded-xl">
                    <Leaf className="text-green-600 fill-green-600" size={24} />
                </div>
                <span className="font-bold text-2xl text-slate-800 tracking-tight">EcoGrab</span>
            </div>

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-slate-800 mb-1">
                    {isLogin ? 'Welcome Back!' : 'Join the Mission'}
                </h2>
                <p className="text-slate-500 text-sm">
                    {isLogin ? 'Log in to continue your progress.' : 'Create an account to save your stats.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 ml-1">FULL NAME</label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Jane Doe" 
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium text-slate-800"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">EMAIL ADDRESS</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com" 
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium text-slate-800"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">PASSWORD</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium text-slate-800"
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-lg text-center animate-fade-in">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 hover:bg-slate-800"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                            {isLogin ? 'Log In' : 'Create Account'} <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-slate-500 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button 
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }} 
                        className="text-green-600 font-bold hover:underline"
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
            
            {/* Disclaimer for demo */}
            <div className="mt-8 text-[10px] text-slate-400 text-center max-w-xs mx-auto">
                <Sparkles size={10} className="inline mr-1"/>
                By joining, you agree to become a guardian of our ecosystem.
            </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
