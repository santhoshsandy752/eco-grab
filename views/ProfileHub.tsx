import React, { useState, useRef, useMemo } from 'react';
import { User } from '../types';
import { Camera, Check, Lock, ShoppingBag, User as UserIcon, Palette, Image as ImageIcon, Search } from 'lucide-react';

interface ProfileHubProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
}

// Helper to generate a large shop inventory
const generateShopInventory = () => {
    const items = [];

    // COLLECTION 1: ECO WARRIORS (Humans)
    const warriors = [
        'Ranger', 'Scout', 'Captain', 'Guardian', 'Medic', 'Botanist', 'Diver', 'Pilot', 'Hiker', 'Surfer', 
        'Camper', 'Scientist', 'Volunteer', 'Recycler', 'Activist', 'Farmer', 'Gardener', 'Biologist', 'Geologist', 'Astronomer', 
        'Vlogger', 'Influencer', 'Reporter', 'Photographer', 'Artist'
    ];
    warriors.forEach((name, i) => {
        items.push({
            id: `warrior_${i}`,
            name: `Eco ${name}`,
            category: 'Human',
            cost: 100 + (i * 20),
            src: `https://api.dicebear.com/9.x/avataaars/svg?seed=${name}&backgroundColor=c0aede`
        });
    });

    // COLLECTION 2: ROBO CLEANERS (Robots)
    const robots = [
        'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 
        'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 
        'Phi', 'Chi', 'Psi', 'Omega', 'Zero'
    ];
    robots.forEach((name, i) => {
        items.push({
            id: `robo_${i}`,
            name: `Bot ${name}`,
            category: 'Robot',
            cost: 250 + (i * 30),
            src: `https://api.dicebear.com/9.x/bottts/svg?seed=${name}&backgroundColor=ffdfbf`
        });
    });

    // COLLECTION 3: NATURE SPIRITS (Fantasy)
    const spirits = [
        'Willow', 'River', 'Storm', 'Ember', 'Cloud', 'Leaf', 'Rose', 'Daisy', 'Fern', 'Moss', 
        'Rain', 'Snow', 'Sun', 'Moon', 'Star', 'Sky', 'Wind', 'Terra', 'Aqua', 'Ignis', 
        'Aero', 'Flora', 'Fauna', 'Bloom', 'Root'
    ];
    spirits.forEach((name, i) => {
        items.push({
            id: `spirit_${i}`,
            name: `Spirit ${name}`,
            category: 'Spirit',
            cost: 500 + (i * 50),
            src: `https://api.dicebear.com/9.x/lorelei/svg?seed=${name}&backgroundColor=b6e3f4`
        });
    });

    // COLLECTION 4: RETRO PIXELS (8-Bit)
    const pixels = [
        'Retro', 'Bit', 'Byte', 'Glitch', 'Neo', 'Cyber', 'Punk', 'Tech', 'Data', 'Code', 
        'Link', 'Zelda', 'Mario', 'Sonic', 'Mega', 'Pac', 'Space', 'Invader', 'Pong', 'Tetris', 
        'Doom', 'Quake', 'Halo', 'Portal', 'Steam'
    ];
    pixels.forEach((name, i) => {
        items.push({
            id: `pixel_${i}`,
            name: `8-Bit ${name}`,
            category: 'Pixel',
            cost: 150 + (i * 15),
            src: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${name}`
        });
    });

    return items;
};

const COSMETIC_SHOP = generateShopInventory();

const ProfileHub: React.FC<ProfileHubProps> = ({ user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'shop'>('wardrobe');
  const [shopFilter, setShopFilter] = useState<string>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const ownedItems = user.ownedItems || [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdateUser({ avatar: reader.result });
          showNotification("Custom profile picture updated!");
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleBuy = (item: typeof COSMETIC_SHOP[0]) => {
    if (user.points >= item.cost) {
      if (!ownedItems.includes(item.id)) {
        onUpdateUser({
          points: user.points - item.cost,
          ownedItems: [...ownedItems, item.id]
        });
        showNotification(`Purchased ${item.name}!`);
      }
    } else {
      showNotification("Not enough EcoPoints!");
    }
  };

  const handleEquip = (src: string) => {
    onUpdateUser({ avatar: src });
    showNotification("Avatar updated!");
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredShopItems = useMemo(() => {
      if (shopFilter === 'All') return COSMETIC_SHOP;
      return COSMETIC_SHOP.filter(item => item.category === shopFilter);
  }, [shopFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-4 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 animate-bounce">
          <Check size={16} className="text-green-400" /> {notification}
        </div>
      )}

      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-inner bg-slate-50 relative">
            <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover" 
                onError={(e) => {
                    // Fallback to initial if image fails
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.name}&background=16a34a&color=fff`;
                }}
            />
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition-colors"
            title="Upload from Gallery"
          >
            <Camera size={18} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload}
          />
        </div>
        
        <div className="flex-1">
          <h2 className="text-3xl font-black text-slate-800 mb-1">{user.name}</h2>
          <p className="text-slate-500 font-medium mb-4">Eco Guardian Level {Math.floor(user.points / 1000) + 1}</p>
          
          <div className="flex items-center justify-center md:justify-start gap-2">
             <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-bold text-sm">
                {user.points} EcoPoints
             </div>
             <div className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full font-bold text-sm">
                {ownedItems.length} Cosmetics Owned
             </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
        <button 
          onClick={() => setActiveTab('wardrobe')}
          className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'wardrobe' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <UserIcon size={18} /> Wardrobe
        </button>
        <button 
          onClick={() => setActiveTab('shop')}
          className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'shop' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <ShoppingBag size={18} /> Cosmetic Shop
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'wardrobe' ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 min-h-[300px]">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Palette className="text-purple-500"/> Owned Avatars</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Custom Upload Option */}
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors group"
            >
                <ImageIcon className="text-slate-400 group-hover:text-green-500 mb-2" />
                <span className="text-xs font-bold text-slate-500 group-hover:text-green-600">Upload New</span>
            </div>

            {/* Owned Shop Items */}
            {COSMETIC_SHOP.filter(item => ownedItems.includes(item.id)).map(item => (
               <div 
                 key={item.id} 
                 onClick={() => handleEquip(item.src)}
                 className={`aspect-square rounded-xl border-2 p-2 cursor-pointer relative transition-all ${user.avatar === item.src ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-slate-100 hover:border-slate-300'}`}
               >
                  <img 
                    src={item.src} 
                    alt={item.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none'; // Hide if broken in wardrobe
                    }}
                  />
                  {user.avatar === item.src && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-sm">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                  <p className="text-[10px] text-center font-bold text-slate-600 mt-1 truncate">{item.name}</p>
               </div>
            ))}

            {ownedItems.length === 0 && (
                <div className="col-span-full py-8 text-center text-slate-400">
                    <p>You haven't bought any avatars yet.</p>
                    <button onClick={() => setActiveTab('shop')} className="text-green-600 font-bold hover:underline mt-2">Go to Shop</button>
                </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
             <h3 className="font-bold text-lg flex items-center gap-2"><ShoppingBag className="text-green-600"/> Avatar Shop</h3>
             
             {/* Filters */}
             <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                 {['All', 'Human', 'Robot', 'Spirit', 'Pixel'].map(cat => (
                     <button
                        key={cat}
                        onClick={() => setShopFilter(cat)}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${shopFilter === cat ? 'bg-white shadow text-green-600' : 'text-slate-500 hover:text-slate-800'}`}
                     >
                         {cat}
                     </button>
                 ))}
             </div>

             <span className="text-sm font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">Balance: {user.points} pts</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
             {filteredShopItems.map(item => {
               const isOwned = ownedItems.includes(item.id);
               const canAfford = user.points >= item.cost;

               return (
                 <div key={item.id} className="border border-slate-200 rounded-xl p-3 flex flex-col relative group hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-slate-50 rounded-lg mb-3 p-2 flex items-center justify-center">
                        <img 
                            src={item.src} 
                            alt={item.name} 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                // Fallback for shop preview
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${item.name}&background=f1f5f9&color=64748b`;
                            }}
                        />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{item.category}</p>
                    </div>
                    
                    <button
                        onClick={() => !isOwned && handleBuy(item)}
                        disabled={isOwned || !canAfford}
                        className={`w-full mt-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                            isOwned 
                              ? 'bg-slate-100 text-slate-400 cursor-default' 
                              : canAfford 
                                ? 'bg-slate-900 text-white hover:bg-green-600' 
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        {isOwned ? (
                            'Owned'
                        ) : (
                            <>
                                {canAfford ? 'Buy' : <Lock size={12}/>} {item.cost} pts
                            </>
                        )}
                    </button>
                 </div>
               );
             })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHub;