
import React, { useState } from 'react';
import { User } from '../types';
import { Sprout, ShoppingBag, ArrowUpCircle, Flower, Trees, Check, Lock, Shovel, Hammer, Maximize, AlertTriangle, Trash2, X } from 'lucide-react';

interface EcoGardenProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
}

const SEEDS = [
    // --- TIER 1: STARTERS (Cheap) ---
    { id: 'grass', name: 'Wild Grass', cost: 20, icon: '🌿', desc: 'Simple greenery.' },
    { id: 'daisy', name: 'White Daisy', cost: 40, icon: '🌼', desc: 'Fresh start.' },
    { id: 'dandelion', name: 'Dandelion', cost: 60, icon: '🏵️', desc: 'Make a wish.' },
    { id: 'sunflower', name: 'Sunflower', cost: 80, icon: '🌻', desc: 'Bright and sunny.' },
    { id: 'clover', name: 'Lucky Clover', cost: 100, icon: '🍀', desc: 'Maybe it helps?' },

    // --- TIER 2: CROPS (Edible) ---
    { id: 'carrot', name: 'Carrot', cost: 150, icon: '🥕', desc: 'Crunchy snack.' },
    { id: 'potato', name: 'Potato', cost: 200, icon: '🥔', desc: 'Versatile tuber.' },
    { id: 'corn', name: 'Corn Stalk', cost: 250, icon: '🌽', desc: 'Grow your own food.' },
    { id: 'tomato', name: 'Tomato Vine', cost: 300, icon: '🍅', desc: 'Juicy and red.' },
    { id: 'strawberry', name: 'Strawberry', cost: 400, icon: '🍓', desc: 'Sweet delight.' },
    { id: 'watermelon', name: 'Watermelon', cost: 500, icon: '🍉', desc: 'Summer refreshing.' },
    { id: 'grapes', name: 'Grape Vine', cost: 650, icon: '🍇', desc: 'Fancy fruit.' },

    // --- TIER 3: FLORAL (Beautiful) ---
    { id: 'tulip', name: 'Pink Tulip', cost: 800, icon: '🌷', desc: 'Springtime favorite.' },
    { id: 'rose', name: 'Red Rose', cost: 1000, icon: '🌹', desc: 'Classic romance.' },
    { id: 'lavender', name: 'Lavender', cost: 1200, icon: '🪻', desc: 'Calming scent.' },
    { id: 'hibiscus', name: 'Hibiscus', cost: 1500, icon: '🌺', desc: 'Tropical vibes.' },
    { id: 'lotus', name: 'Sacred Lotus', cost: 1800, icon: '🪷', desc: 'Zen garden essential.' },
    { id: 'cherry', name: 'Cherry Blossom', cost: 2200, icon: '🌸', desc: 'Falling petals.' },

    // --- TIER 4: TREES (Mighty) ---
    { id: 'cactus', name: 'Saguaro Cactus', cost: 2500, icon: '🌵', desc: 'Desert survivor.' },
    { id: 'bamboo', name: 'Bamboo', cost: 3000, icon: '🎋', desc: 'Fast growing.' },
    { id: 'palm', name: 'Palm Tree', cost: 3500, icon: '🌴', desc: 'Beach atmosphere.' },
    { id: 'deciduous', name: 'Green Tree', cost: 4000, icon: '🌳', desc: 'Classic shade.' },
    { id: 'pine', name: 'Pine Tree', cost: 4500, icon: '🌲', desc: 'Evergreen spirit.' },
    { id: 'autumn', name: 'Maple Tree', cost: 5000, icon: '🍁', desc: 'Fall colors.' },
    
    // --- TIER 5: EXOTIC (Rare) ---
    { id: 'mushroom_red', name: 'Toadstool', cost: 6000, icon: '🍄', desc: 'Fairy garden.' },
    { id: 'coral', name: 'Land Coral', cost: 7500, icon: '🪸', desc: 'From the ocean.' },
    { id: 'money', name: 'Money Tree', cost: 9000, icon: '💰', desc: 'Does it work?' },
    { id: 'gem', name: 'Crystal Plant', cost: 12000, icon: '💎', desc: 'Shiny minerals.' },
    { id: 'fire', name: 'Flame Flower', cost: 15000, icon: '🔥', desc: 'Hot to touch.' },
    { id: 'ice', name: 'Frost Fern', cost: 18000, icon: '❄️', desc: 'Cold snap.' },

    // --- TIER 6: MYTHICAL (Legendary) ---
    { id: 'star', name: 'Stardust Lily', cost: 25000, icon: '✨', desc: 'Glows at night.' },
    { id: 'moon', name: 'Moon Flower', cost: 30000, icon: '🌚', desc: 'Blooms in dark.' },
    { id: 'rainbow', name: 'Prisma Tree', cost: 40000, icon: '🌈', desc: 'All the colors.' },
    { id: 'alien', name: 'Cosmic Vine', cost: 50000, icon: '👾', desc: 'Not from Earth.' },
    { id: 'galaxy', name: 'Galaxy Rose', cost: 75000, icon: '🌌', desc: 'Contains a universe.' },
    { id: 'unicorn', name: 'Unicorn Horn', cost: 100000, icon: '🦄', desc: 'Pure magic.' },
    { id: 'crown', name: 'Royal Garden', cost: 250000, icon: '👑', desc: 'The ultimate flex.' }
];

const EcoGarden: React.FC<EcoGardenProps> = ({ user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'garden' | 'shop'>('garden');
  const [selectedSeed, setSelectedSeed] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [deleteSlotId, setDeleteSlotId] = useState<number | null>(null);

  const inventory: Record<string, number> = user.inventory || {};
  const gardenSlots = user.gardenSlots || [];
  const currentGardenSize = user.gardenSize || 9;

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  const buySeed = (seedId: string, cost: number) => {
      if (user.points >= cost) {
          const newInventory = { ...inventory };
          newInventory[seedId] = (newInventory[seedId] || 0) + 1;
          
          onUpdateUser({
              points: user.points - cost,
              inventory: newInventory
          });
          showNotification("Seed Purchased!");
      } else {
          showNotification("Not enough EcoPoints!");
      }
  };

  const plantSeed = (slotId: number) => {
      if (!selectedSeed) {
          showNotification("Select a seed first!");
          return;
      }
      
      if (inventory[selectedSeed] > 0) {
          const newInventory = { ...inventory };
          newInventory[selectedSeed]--;

          const newSlots = [...gardenSlots, { slotId, plantId: selectedSeed, plantedAt: Date.now() }];

          onUpdateUser({
              inventory: newInventory,
              gardenSlots: newSlots
          });
          
          if (newInventory[selectedSeed] === 0) {
              setSelectedSeed(null);
          }
          showNotification("Planted successfully!");
      }
  };

  const confirmDigUp = () => {
      if (deleteSlotId !== null) {
          const newSlots = gardenSlots.filter(s => s.slotId !== deleteSlotId);
          onUpdateUser({ gardenSlots: newSlots });
          setDeleteSlotId(null);
          showNotification("Plant removed.");
      }
  };

  const handleSlotClick = (index: number, isPlanted: boolean) => {
      if (!isPlanted) {
          plantSeed(index);
      } else {
          showNotification("Double tap to dig up");
      }
  };

  const handleSlotDoubleClick = (index: number, isPlanted: boolean) => {
      if (isPlanted) {
          setDeleteSlotId(index);
      }
  };

  const expandGarden = () => {
      const cost = Math.floor((currentGardenSize / 3) * 1000);
      if (user.points >= cost) {
          if (currentGardenSize >= 30) {
              showNotification("Max garden size reached!");
              return;
          }
          onUpdateUser({
              points: user.points - cost,
              gardenSize: currentGardenSize + 3 // Add 3 slots (1 row)
          });
          showNotification("Territory Expanded! +3 Slots");
      } else {
          showNotification(`Need ${cost} pts to expand!`);
      }
  };

  const expansionCost = Math.floor((currentGardenSize / 3) * 1000);

  return (
    <div className="space-y-6 animate-fade-in pb-24 relative">
        {notification && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-2 rounded-full shadow-xl text-sm font-bold animate-bounce whitespace-nowrap">
                {notification}
            </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black mb-1">My Sanctuary</h2>
                    <p className="text-emerald-100 text-sm">Grow your personal ecosystem.</p>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md">
                    <span className="text-xs font-bold text-emerald-100 uppercase">Balance</span>
                    <p className="text-xl font-black">{user.points} pts</p>
                </div>
            </div>
            <div className="absolute -right-6 -bottom-10 opacity-20 rotate-12"><Sprout size={150} /></div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
            <button 
                onClick={() => setActiveTab('garden')}
                className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'garden' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                <Flower size={18} /> Garden Grid
            </button>
            <button 
                onClick={() => setActiveTab('shop')}
                className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'shop' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                <ShoppingBag size={18} /> Seed Shop
            </button>
        </div>

        {/* GARDEN VIEW */}
        {activeTab === 'garden' && (
            <div className="space-y-6">
                {/* Inventory Strip */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">Your Seeds (Tap to Select)</p>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {Object.keys(inventory).filter(k => inventory[k] > 0).length === 0 && (
                            <p className="text-sm text-slate-400 italic">No seeds. Visit the shop!</p>
                        )}
                        {Object.entries(inventory).map(([seedId, count]) => {
                            if (count <= 0) return null;
                            const seedInfo = SEEDS.find(s => s.id === seedId);
                            if (!seedInfo) return null;
                            const isSelected = selectedSeed === seedId;

                            return (
                                <button
                                    key={seedId}
                                    onClick={() => setSelectedSeed(isSelected ? null : seedId)}
                                    className={`relative shrink-0 w-16 h-16 rounded-xl border-2 flex items-center justify-center text-2xl transition-all ${isSelected ? 'border-green-500 bg-green-50 scale-110 shadow-md' : 'border-slate-200 bg-slate-50'}`}
                                >
                                    {seedInfo.icon}
                                    <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                        {count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* The Grid */}
                <div className="bg-[#795548] rounded-3xl p-6 shadow-inner relative border-4 border-[#5d4037]">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
                    
                    <div className="grid grid-cols-3 gap-4 relative z-10 mb-6">
                        {Array.from({ length: currentGardenSize }).map((_, index) => {
                            const planted = gardenSlots.find(s => s.slotId === index);
                            const seedInfo = planted ? SEEDS.find(s => s.id === planted.plantId) : null;

                            return (
                                <div 
                                    key={index}
                                    onClick={() => handleSlotClick(index, !!planted)}
                                    onDoubleClick={() => handleSlotDoubleClick(index, !!planted)}
                                    className={`
                                        aspect-square rounded-2xl border-2 flex items-center justify-center relative cursor-pointer transition-all active:scale-95
                                        ${planted 
                                            ? 'bg-gradient-to-b from-green-300 to-green-100 border-green-400 shadow-sm' 
                                            : 'bg-[#5d4037]/50 border-[#8d6e63] hover:bg-[#8d6e63]/50'
                                        }
                                    `}
                                >
                                    {planted ? (
                                        <div className="text-center animate-fade-in pointer-events-none">
                                            <div className="text-4xl drop-shadow-md">{seedInfo?.icon}</div>
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/80 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider text-green-900 whitespace-nowrap backdrop-blur-sm shadow-sm">
                                                {seedInfo?.name}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-[#a1887f] opacity-50 font-bold text-xs uppercase pointer-events-none">
                                            {selectedSeed ? 'Plant' : 'Empty'}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Expand Button */}
                    <button 
                        onClick={expandGarden}
                        disabled={currentGardenSize >= 30}
                        className={`w-full py-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1 transition-all group relative z-10 ${
                            currentGardenSize >= 30 
                                ? 'border-white/20 text-white/40 cursor-default'
                                : 'border-white/40 text-white/60 hover:bg-white/10 hover:border-white hover:text-white'
                        }`}
                    >
                        {currentGardenSize >= 30 ? (
                            <span className="font-bold text-sm">MAX SIZE REACHED</span>
                        ) : (
                            <>
                                <Maximize size={24} className="mb-1" />
                                <span className="font-bold text-sm">EXPAND TERRITORY</span>
                                <span className="text-xs font-medium bg-black/30 px-2 py-1 rounded-full">{expansionCost} pts</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        )}

        {/* SHOP VIEW */}
        {activeTab === 'shop' && (
            <div className="grid grid-cols-2 gap-4">
                {SEEDS.map(seed => {
                    const canAfford = user.points >= seed.cost;
                    return (
                        <div key={seed.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
                            <div className="text-4xl mb-2">{seed.icon}</div>
                            <h3 className="font-bold text-slate-800">{seed.name}</h3>
                            <p className="text-xs text-slate-400 mb-4 h-8">{seed.desc}</p>
                            
                            <button
                                onClick={() => buySeed(seed.id, seed.cost)}
                                disabled={!canAfford}
                                className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                                    canAfford 
                                    ? 'bg-slate-900 text-white hover:bg-green-600' 
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                {canAfford ? 'Buy' : <Lock size={12}/>} {seed.cost} pts
                            </button>
                        </div>
                    )
                })}
            </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteSlotId !== null && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center animate-in zoom-in-50 duration-200">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="text-red-500" size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">Dig up Plant?</h3>
                    <p className="text-slate-500 text-sm mb-6">
                        This will permanently remove the plant from this slot. You won't get the seed back.
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setDeleteSlotId(null)}
                            className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmDigUp}
                            className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 size={18} /> Remove
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default EcoGarden;
