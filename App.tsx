
import React, { useState, useEffect } from 'react';
import { Tab, User, Clan } from './types';
import Navigation from './components/Navigation';
import Dashboard from './views/Dashboard';
import ClanHub from './views/ClanHub';
import ActionUpload from './views/ActionUpload';
import EcoAssistant from './views/EcoAssistant';
import GameZone from './views/GameZone';
import Auth from './views/Auth';
import ProfileHub from './views/ProfileHub';
import EcoGarden from './views/EcoGarden';
import { Trophy, Leaf, Download, LogOut, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  
  // Auth state: Undefined initially means user is NOT logged in.
  const [user, setUser] = useState<User | undefined>(undefined);
  
  // Clans state: Initialize from localStorage if available
  const [clans, setClans] = useState<Clan[]>(() => {
      try {
          const stored = localStorage.getItem('eco_clans');
          return stored ? JSON.parse(stored) : [];
      } catch {
          return [];
      }
  });

  // --- STORAGE HELPERS ---

  const saveUserToStorage = (updatedUser: User) => {
      try {
          const usersRaw = localStorage.getItem('eco_users');
          if (usersRaw) {
              const users = JSON.parse(usersRaw);
              const index = users.findIndex((u: any) => u.id === updatedUser.id);
              if (index !== -1) {
                  // Merge updates while preserving email/password which aren't in User type
                  users[index] = { ...users[index], ...updatedUser };
                  localStorage.setItem('eco_users', JSON.stringify(users));
              }
          }
      } catch (e) {
          console.error("Failed to save user progress", e);
      }
  };

  const saveClansToStorage = (updatedClans: Clan[]) => {
      localStorage.setItem('eco_clans', JSON.stringify(updatedClans));
  };

  // --- STATE MODIFIERS ---

  const addPoints = (amount: number) => {
    if (user) {
        setUser(prev => {
            if (!prev) return undefined;
            const updated = { ...prev, points: prev.points + amount };
            saveUserToStorage(updated);
            return updated;
        });
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
        setUser(prev => {
            if (!prev) return undefined;
            const updated = { ...prev, ...updates };
            saveUserToStorage(updated);
            return updated;
        });
    }
  };
  
  const handleCreateClan = (newClan: Clan) => {
      const updatedClans = [...clans, newClan];
      setClans(updatedClans);
      saveClansToStorage(updatedClans);
      
      // Update user to belong to this clan
      updateUser({ clanId: newClan.id });
  };

  const handleLogout = () => {
      if (confirm("Are you sure you want to log out?")) {
        setUser(undefined);
        setActiveTab(Tab.HOME); // Reset tab
      }
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        if (!user) return;

        // 1. Remove from users list
        const usersRaw = localStorage.getItem('eco_users');
        if (usersRaw) {
          const users = JSON.parse(usersRaw);
          const updatedUsers = users.filter((u: any) => u.id !== user.id);
          localStorage.setItem('eco_users', JSON.stringify(updatedUsers));
        }

        // 2. Remove from clan (decrement member count)
        if (user.clanId) {
            const updatedClans = clans.map(c => {
                if (c.id === user.clanId) {
                    return { ...c, members: Math.max(0, c.members - 1) };
                }
                return c;
            });
            // Optional: Remove clan if 0 members? For now, we keep it.
            setClans(updatedClans);
            saveClansToStorage(updatedClans);
        }

        // 3. Reset State (Logout)
        setUser(undefined);
        setActiveTab(Tab.HOME);
        alert("Account deleted successfully.");

      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account.");
      }
    }
  };

  // If not authenticated, show Auth Screen
  if (!user) {
      return <Auth onLogin={(u) => {
          // Ensure new user object has inventory structure
          setUser({
              ...u,
              gardenLevel: u.gardenLevel || 0,
              gardenSize: u.gardenSize || 9,
              inventory: u.inventory || {},
              gardenSlots: u.gardenSlots || []
          });
      }} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case Tab.HOME:
        return <Dashboard user={user} addPoints={addPoints} />;
      case Tab.CLAN:
        return <ClanHub 
            user={user} 
            clans={clans}
            onUpdateUser={updateUser} 
            onCreateClan={handleCreateClan}
        />;
      case Tab.UPLOAD:
        return <ActionUpload onUploadComplete={(points) => addPoints(points)} />;
      case Tab.AI:
        return <EcoAssistant />;
      case Tab.GAMES:
        return <GameZone userPoints={user.points} addPoints={addPoints} gardenLevel={user.gardenLevel || 0} />;
      case Tab.PROFILE:
        return <ProfileHub user={user} onUpdateUser={updateUser} onDeleteAccount={handleDeleteAccount} />;
      case Tab.GARDEN:
        return <EcoGarden user={user} onUpdateUser={updateUser} />;
      default:
        return <Dashboard user={user} addPoints={addPoints} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Navigation (Sidebar on Desktop, Bottom bar on Mobile) */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Wrapper */}
      <main className="flex-1 md:ml-64 relative flex flex-col min-h-screen transition-all duration-300">
        
        {/* Responsive Header */}
        <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-40 px-4 md:px-8 py-3 flex justify-between items-center shadow-sm">
          
          {/* Mobile Logo Only */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="bg-green-100 p-2 rounded-lg">
              <Leaf className="text-green-600" size={20} />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">EcoGrab</span>
          </div>

          {/* Desktop Title */}
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-slate-800">{
              activeTab === Tab.HOME ? 'Dashboard' : 
              activeTab === Tab.CLAN ? 'Clan Headquarters' :
              activeTab === Tab.UPLOAD ? 'Action Center' :
              activeTab === Tab.AI ? 'Eco Assistant' : 
              activeTab === Tab.GAMES ? 'Arcade Zone' :
              activeTab === Tab.GARDEN ? 'My Sanctuary' : 'Profile Studio'
            }</h1>
          </div>

          {/* Right Side Stats & Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-green-600 mr-2 border border-slate-200 rounded-full px-3 py-1.5 transition-colors">
               <Download size={14} /> Install App
            </button>

            {/* User Profile - Clickable to open ProfileHub */}
            <div 
                onClick={() => setActiveTab(Tab.PROFILE)}
                className="flex items-center gap-2 bg-slate-100 pl-1 pr-3 py-1 rounded-full border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors group"
                title="Customize Profile"
            >
              <div className="w-7 h-7 rounded-full border border-white overflow-hidden bg-slate-300">
                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-sm text-slate-700 hidden sm:block truncate max-w-[100px] group-hover:text-green-700">{user.name}</span>
            </div>

            {/* Points Badge */}
            <div className="flex items-center gap-2 bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200 text-amber-800">
              <Trophy className="text-amber-500" size={16} />
              <span className="font-bold text-sm">{user.points} pts</span>
            </div>

            {/* Logout Button */}
            <button 
                onClick={handleLogout}
                className="bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 p-2 rounded-full transition-colors border border-transparent hover:border-red-100"
                title="Log Out"
            >
                <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Content Body - Responsive Width */}
        <div className="flex-1 w-full max-w-7xl mx-auto p-0 pb-24 md:pb-8 md:p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
