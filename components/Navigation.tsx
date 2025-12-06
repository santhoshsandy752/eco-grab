import React from 'react';
import { Home, Users, Camera, Bot, Gamepad2, Leaf, Sprout } from 'lucide-react';
import { Tab } from '../types';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: Tab.HOME, icon: Home, label: 'Home' },
    { id: Tab.GARDEN, icon: Sprout, label: 'Garden' },
    { id: Tab.UPLOAD, icon: Camera, label: 'Action', highlight: true },
    { id: Tab.GAMES, icon: Gamepad2, label: 'Games' },
    { id: Tab.CLAN, icon: Users, label: 'Clan' },
    { id: Tab.AI, icon: Bot, label: 'EcoBot' },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            if (item.highlight) {
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className="relative -top-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-lg hover:shadow-green-500/50 transition-all active:scale-95"
                  aria-label={item.label}
                >
                  <Icon size={28} />
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${
                  isActive ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-50 shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-xl">
            <Leaf className="text-green-600 fill-green-600" size={24} />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">EcoGrab</span>
        </div>

        <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
             const isActive = activeTab === item.id;
             const Icon = item.icon;
             
             return (
               <button
                 key={item.id}
                 onClick={() => onTabChange(item.id)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                   isActive 
                     ? 'bg-green-50 text-green-700 font-bold shadow-sm' 
                     : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                 }`}
               >
                 <Icon 
                   size={22} 
                   className={`transition-colors ${isActive ? 'text-green-600' : 'text-slate-400 group-hover:text-slate-600'}`} 
                 />
                 <span>{item.label}</span>
               </button>
             );
          })}
        </div>

        <div className="p-4 border-t border-slate-100">
           <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-2 -mt-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Install App</p>
              <p className="text-sm text-slate-200 mb-3 font-medium">Get the mobile app for the full experience!</p>
              <button className="w-full bg-white text-slate-900 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
                Download Now
              </button>
           </div>
        </div>
      </aside>
    </>
  );
};

export default Navigation;