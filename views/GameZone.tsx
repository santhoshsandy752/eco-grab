
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Anchor, Ship, Trash2, ShoppingBag, Map as MapIcon, 
  Menu, X, Trophy, Zap, Heart, Compass, ArrowUpCircle, 
  Droplets, Skull, Sprout, Wind, Shield, CircleDollarSign, 
  Leaf, Info, Play, Lock, Sun, CloudRain
} from 'lucide-react';

// --- CONSTANTS & DATA LISTS (50 TIERS) ---

const RODS = [
  "Wooden Stick Rod", "Worn Bamboo Rod", "Rough Branch Rod", "Reinforced Bamboo Rod", "Harbor Rod", "Light Metal Rod", "Fiberglass Starter Rod", "Seaside Rod", "Rustproof Rod", "EcoLine Rod",
  "Precision Tip Rod", "Net Attachment Rod", "Wide Hook Rod", "Harpoon-Lite Rod", "Metal Magnet Rod", "Dual-Hook Split Rod", "AirWave Rod", "Glass Seeker Rod", "Plastic Snatcher Rod", "Cloth Collector Rod",
  "Deep Reach Rod", "Triple-Hook Rod", "HydroTail Rod", "CarbonFlex Rod", "Ocean Grip Rod", "Vibration Sensor Rod", "Salvage Rod", "ShockSafe Rod", "PressureLine Rod", "Hydro-Pulse Rod",
  "EcoNet Pro Rod", "ReelJet Rod", "Titan Grip Rod", "Metal Storm Rod", "GhostNet Breaker Rod", "BioFiber Rod", "Crystal Tip Rod", "WaveRider Rod", "ReelSync Rod", "Solar Charge Rod",
  "StormLine Rod", "Tidal Net Rod", "MagnaCore Rod", "Abyss Hunter Rod", "EcoLink Rod", "Ion Grip Rod", "TideForce Rod", "Quantum Reach Rod", "SolarWave Rod", "THE OMNI ROD"
];

const BAGS = [
  "Cloth Pouch", "Worn Sack", "Small Backpack", "Medium Fiber Bag", "Waterproof Pocket Bag", "Rope Sling Bag", "Reinforced Cloth Bag", "Basic Trash Satchel", "Light Plastic Carrier", "Harbor Worker’s Bag",
  "Canvas Recycler Bag", "DryProof Storage Bag", "Twin Pocket Satchel", "Harbor Pack", "Small Compactor Bag", "Triple Pocket Bag", "Solar Zip Bag", "Plastic Press Bag", "Organizer Satchel", "Durable EcoBag",
  "Large Compactor Bag", "EcoFrame Bag", "Metal Reinforced Backpack", "Auto-Separator Bag", "WaterSplit Bag", "PowerPress Bag", "Vacuum Bag", "Big Net Sack", "GlassGuard Bag", "Rubber Tension Bag",
  "ZeroGravity Bag", "High Density Megabag", "Auto-Sorter Pro", "Recycler 3000 Bag", "CargoFrame Bag", "EcoVault Bag", "Smart Sensor Bag", "MagnetSafe Bag", "Hazard Safepack", "DeepCarry Bag",
  "InfinitePress Bag", "Super Separator Bag", "Cargo Engine Bag", "NanoCompression Pack", "Ultra Storage Hub", "MultiLayer Trash Vault", "GravityCore Pack", "NanoVac Bag", "Zero-Mass Bag", "THE COSMIC CARRY BAG"
];

const BOATS = [
  "Rowboat", "Paddle Canoe", "Inflatable Dinghy", "Small Raft", "Fishing Canoe", "Aluminum Skiff", "Basic Motorboat", "Speed Dinghy", "Twin Paddle Boat", "River Cruiser",
  "Ocean Kayak", "Harbor Motorboat", "Mini Cleanup Barge", "Recycling Skiff", "Dual Engine Boat", "Glass Bottom Boat", "Bay Explorer", "EcoSurf Hoverboard", "Compact Trawler", "Solar-Powered Boat",
  "Sea Sweeper Vessel", "Offshore Cleaner", "High-Speed Cutter", "EcoJet Boat", "Ocean Rover", "Large Cleanup Barge", "DeepNet Ship", "AquaCollector Vessel", "Plastic Hunter Craft", "BioFuel Cruiser",
  "Ocean Harvester", "MultiDrone Carrier", "HydroJet Boat", "SeaLab Research Boat", "Ultra Solar Vessel", "OceanScanner Ship", "HydroGlide Hover Vessel", "DeepCurrent Ship", "Abyss Trek Sub", "StormBreaker Vessel",
  "Mega-Recycle Ship", "Deep Ocean Submarine", "HydroFusion Cruiser", "AquaDreadnought", "Global Cleanup Carrier", "Infinite Range Vessel", "SeaTitan Battleship", "HyperScanner MegaShip", "TerraBlue Ark", "THE OCEAN TITAN"
];

const ZONES = [
  { name: "Shallow Bay", minDepth: 0, color: "bg-cyan-200" },
  { name: "Coastline Stretch", minDepth: 500, color: "bg-cyan-300" },
  { name: "Open Waters", minDepth: 1500, color: "bg-blue-400" },
  { name: "Plastic Island", minDepth: 3000, color: "bg-teal-600" },
  { name: "Abyss Edge", minDepth: 5000, color: "bg-indigo-600" },
  { name: "Deep Ocean", minDepth: 8000, color: "bg-blue-900" },
];

// --- SPRITES & SUB-COMPONENTS ---

const NavBtn: React.FC<{active: boolean, icon: any, label: string, onClick: () => void, highlight?: boolean}> = ({active, icon, label, onClick, highlight}) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-16 py-1 rounded-lg transition-colors relative ${active ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'}`}
    >
        {highlight && !active && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
        )}
        {React.cloneElement(icon, { size: 20, strokeWidth: active ? 3 : 2 })}
        <span className="text-[10px] font-bold mt-1">{label}</span>
    </button>
);

const ShopItem: React.FC<any> = ({ icon, color, title, currentName, level, maxLevel, nextCost, onBuy, canAfford }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white shadow-md`}>
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
                <p className="text-xs text-emerald-600 font-bold">{currentName}</p>
                <div className="flex items-center gap-1 mt-1">
                    <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${color}`} style={{width: `${(level/maxLevel)*100}%`}}></div>
                    </div>
                    <span className="text-[10px] text-slate-400">T{level+1}</span>
                </div>
            </div>
        </div>
        {level < maxLevel - 1 ? (
            <button 
                onClick={onBuy}
                disabled={!canAfford}
                className={`px-4 py-2 rounded-lg font-bold text-xs flex flex-col items-center ${canAfford ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
            >
                <span>UPGRADE</span>
                <span className="opacity-80">${nextCost}</span>
            </button>
        ) : (
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">MAXED</span>
        )}
    </div>
);

const SkillNode: React.FC<any> = ({ title, desc, level, color, icon, cost, canAfford, onUpgrade }) => (
    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-start">
            <div className="flex gap-4">
                <div className={`p-3 bg-slate-700 rounded-xl ${color}`}>
                    {icon}
                </div>
                <div>
                    <h3 className={`font-bold text-lg ${color}`}>{title}</h3>
                    <p className="text-slate-400 text-sm mb-3">{desc}</p>
                    <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className={`h-2 w-8 rounded-full ${i <= level ? color.replace('text', 'bg') : 'bg-slate-700'}`}></div>
                        ))}
                    </div>
                </div>
            </div>
            {level < 5 ? (
                <button 
                    onClick={onUpgrade}
                    disabled={!canAfford}
                    className={`px-4 py-3 rounded-xl font-bold text-sm ${canAfford ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-slate-700 text-slate-500'}`}
                >
                    Learn ${cost}
                </button>
            ) : (
                <div className="bg-yellow-500 text-black px-3 py-1 rounded font-black text-xs">MASTERED</div>
            )}
        </div>
    </div>
);

const Joystick: React.FC<{ onMove: (x: number, y: number) => void }> = ({ onMove }) => {
    const [active, setActive] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
        setActive(true);
        handleMove(e);
    };

    const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!active && e.type !== 'mousedown' && e.type !== 'touchstart') return;
        
        let clientX, clientY;
        if ('touches' in e) {
             if (e.touches.length > 0) {
                 clientX = e.touches[0].clientX;
                 clientY = e.touches[0].clientY;
             } else {
                 return;
             }
        } else {
             clientX = (e as React.MouseEvent).clientX;
             clientY = (e as React.MouseEvent).clientY;
        }
        
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        let dx = clientX - centerX;
        let dy = clientY - centerY;
        
        const dist = Math.sqrt(dx*dx + dy*dy);
        const maxDist = 40;
        
        if (dist > maxDist) {
            dx = (dx / dist) * maxDist;
            dy = (dy / dist) * maxDist;
        }
        
        setPos({ x: dx, y: dy });
        onMove(dx / maxDist, dy / maxDist);
    };

    const handleEnd = () => {
        setActive(false);
        setPos({ x: 0, y: 0 });
        onMove(0, 0);
    };

    return (
        <div 
            className="w-24 h-24 bg-black/20 backdrop-blur rounded-full border border-white/30 flex items-center justify-center touch-none select-none relative z-50"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
        >
            <div 
                className="w-10 h-10 bg-white/80 rounded-full shadow-lg pointer-events-none"
                style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
            ></div>
        </div>
    );
};

const BoatSprite: React.FC = () => (
  <svg width="48" height="96" viewBox="0 0 48 96" fill="none" className="drop-shadow-2xl">
    <path d="M24 94 C 2 50, 8 15, 24 2 C 40 15, 46 50, 44 94 L 4 94 Z" fill="#0f172a" opacity="0.2" transform="translate(4, 4)" />
    <path d="M24 90 C 30 105, 18 105, 24 90" stroke="white" strokeWidth="4" strokeOpacity="0.5" className="blur-sm" />
    <path d="M24 2 C 40 15, 46 50, 44 94 L 4 94 C 2 50, 8 15, 24 2 Z" fill="#f8fafc" stroke="#475569" strokeWidth="2"/>
    <path d="M24 10 C 36 20, 40 50, 38 88 L 10 88 C 8 50, 12 20, 24 10 Z" fill="#cbd5e1"/>
    <path d="M14 55 H 34 V 75 H 14 Z" fill="#334155" rx="2" />
    <path d="M16 57 H 32 V 65 H 16 Z" fill="#0ea5e9" />
    <rect x="18" y="92" width="12" height="6" rx="1" fill="#1e293b" />
    <path d="M24 2 L 24 20" stroke="#ef4444" strokeWidth="2" />
    <circle cx="24" cy="80" r="3" fill="#fbbf24" />
  </svg>
);

const FishingRodCast: React.FC<{ start: {x:number, y:number}, end: {x:number, y:number} }> = ({ start, end }) => {
    return (
        <div className="absolute top-0 left-0 w-0 h-0 pointer-events-none overflow-visible z-30">
            <svg width="100%" height="100%" className="overflow-visible">
                <defs>
                    <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L6,3 z" fill="#ef4444" />
                    </marker>
                </defs>
                <line 
                    x1={start.x} 
                    y1={start.y} 
                    x2={end.x} 
                    y2={end.y} 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                    className="drop-shadow-md"
                >
                     <animate attributeName="x2" from={start.x} to={end.x} dur="0.25s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                     <animate attributeName="y2" from={start.y} to={end.y} dur="0.25s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                     <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.8;1" dur="0.5s" fill="freeze" />
                </line>
                <circle cx={end.x} cy={end.y} r="6" fill="#ef4444" stroke="white" strokeWidth="2">
                     <animate attributeName="opacity" from="0" to="1" dur="0.1s" fill="freeze" />
                     <animate attributeName="cx" from={start.x} to={end.x} dur="0.25s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                     <animate attributeName="cy" from={start.y} to={end.y} dur="0.25s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                     <animate attributeName="r" values="6;8;0" keyTimes="0;0.8;1" dur="0.5s" begin="0.25s" fill="freeze" />
                </circle>
            </svg>
        </div>
    )
};

const FishSprite: React.FC<{isTangled: boolean}> = ({ isTangled }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" className={isTangled ? "animate-pulse" : "animate-bounce"}>
    <ellipse cx="16" cy="28" rx="10" ry="3" fill="black" opacity="0.2" />
    <path d="M4 16 C 4 10, 10 4, 16 4 C 26 4, 30 16, 26 26 C 20 30, 4 22, 4 16 Z" fill={isTangled ? "#fb7185" : "#facc15"} stroke={isTangled ? "#be123c" : "#ca8a04"} strokeWidth="2" />
    <path d="M26 16 L 32 10 L 32 22 Z" fill={isTangled ? "#fb7185" : "#facc15"} stroke={isTangled ? "#be123c" : "#ca8a04"} strokeWidth="2" strokeLinejoin="round" />
    <circle cx="10" cy="12" r="2.5" fill="white" />
    <circle cx="10.5" cy="12" r="1" fill="black" />
    <path d="M14 16 L 8 20 L 14 20 Z" fill={isTangled ? "#e11d48" : "#eab308"} />
    <path d="M14 6 C 14 6, 16 16, 14 26" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none" />
    <path d="M20 8 C 20 8, 22 16, 20 24" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none" />
    {isTangled && (
      <g stroke="#374151" strokeWidth="1" opacity="0.8">
        <path d="M2 10 L 30 22" />
        <path d="M2 22 L 30 10" />
        <path d="M16 2 L 16 30" />
        <circle cx="16" cy="16" r="14" fill="none" strokeDasharray="4 2" />
      </g>
    )}
  </svg>
);

const TrashSprite: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" className="drop-shadow-md">
    <ellipse cx="14" cy="26" rx="8" ry="2" fill="black" opacity="0.2" />
    <rect x="10" y="2" width="8" height="4" fill="#94a3b8" rx="1"/>
    <path d="M8 6 H 20 L 22 12 V 24 C 22 26, 20 26, 20 26 H 8 C 8 26, 6 26, 6 24 V 12 L 8 6 Z" fill="#3b82f6" fillOpacity="0.7" stroke="#2563eb" strokeWidth="1.5" />
    <rect x="7" y="14" width="14" height="6" fill="#cbd5e1" />
    <path d="M9 16 H 19 M 9 18 H 15" stroke="#64748b" strokeWidth="1" />
    <path d="M20 8 L 20 12" stroke="white" strokeWidth="1" opacity="0.5" />
    <path d="M18 22 L 20 22" stroke="white" strokeWidth="1" opacity="0.5" />
  </svg>
);

// --- TYPES ---

interface GameZoneProps {
  userPoints: number;
  addPoints: (points: number) => void;
  gardenLevel: number;
}

interface PlayerState {
  x: number;
  y: number;
  rot: number;
}

interface Item {
  id: number;
  x: number;
  y: number;
  type: 'trash' | 'fish' | 'rare' | 'toxic';
  isTangled?: boolean;
  value: number;
  difficulty: number; // Required Rod Level
}

interface GameData {
  ecoPoints: number;
  totalTrashCollected: number;
  fishRescued: number;
  rodLevel: number;
  bagLevel: number;
  boatLevel: number;
  skills: {
    cleaning: number;
    conservation: number;
    engineering: number;
  };
  trashInBag: number;
}

// --- MAIN COMPONENT ---

const GameZone: React.FC<GameZoneProps> = ({ userPoints, addPoints, gardenLevel }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [showStory, setShowStory] = useState(true);
  const [activeTab, setActiveTab] = useState<'game' | 'dock' | 'skills'>('game');
  
  const [player, setPlayer] = useState<PlayerState>({ x: 0, y: 0, rot: 0 });
  const [items, setItems] = useState<Item[]>([]);
  const [isCasting, setIsCasting] = useState(false); 
  const [fishingTarget, setFishingTarget] = useState<{x: number, y: number} | null>(null);
  
  const [gameData, setGameData] = useState<GameData>({
    ecoPoints: 100,
    totalTrashCollected: 0,
    fishRescued: 0,
    rodLevel: 0,
    bagLevel: 0,
    boatLevel: 0,
    skills: { cleaning: 0, conservation: 0, engineering: 0 },
    trashInBag: 0
  });

  const [joystick, setJoystick] = useState({ x: 0, y: 0 });
  const [notification, setNotification] = useState<string | null>(null);
  
  // Refs for Game Loop / Async Logic
  const gameLoopRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(Date.now());
  const keysRef = useRef<{ [key: string]: boolean }>({});
  
  // State Refs for avoiding stale closures in async timeout
  const itemsRef = useRef(items);
  const playerRef = useRef(player);
  const gameDataRef = useRef(gameData);

  // Sync Refs
  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { playerRef.current = player; }, [player]);
  useEffect(() => { gameDataRef.current = gameData; }, [gameData]);

  // --- STATS CALCULATORS ---
  const getRodStats = useCallback((data: GameData) => {
    const lvl = data.rodLevel;
    return {
      name: RODS[lvl] || RODS[RODS.length-1],
      range: 100 + (lvl * 15) + (data.skills.cleaning * 20),
      speed: 1 + (lvl * 0.1),
      power: lvl, 
      multiGrab: Math.floor(lvl / 10) + 1,
      cost: Math.floor(50 * Math.pow(1.15, lvl))
    };
  }, []);

  const getBagStats = useCallback((data: GameData) => {
    const lvl = data.bagLevel;
    return {
      name: BAGS[lvl] || BAGS[BAGS.length-1],
      capacity: 10 + (lvl * 5) + (data.skills.engineering * 5),
      cost: Math.floor(40 * Math.pow(1.15, lvl))
    };
  }, []);

  const getBoatStats = useCallback((data: GameData) => {
    const lvl = data.boatLevel;
    const speed = 4 + (lvl * 0.5) + (data.skills.engineering * 0.5);
    const cost = Math.floor(100 * Math.pow(1.2, lvl));
    const maxRange = 500 + (lvl * 500); 

    return {
      name: BOATS[lvl] || BOATS[BOATS.length-1],
      speed,
      cost,
      maxRange
    };
  }, []);

  const getCurrentZone = useCallback(() => {
    const dist = Math.sqrt(player.x * player.x + player.y * player.y);
    return [...ZONES].reverse().find(z => dist >= z.minDepth) || ZONES[0];
  }, [player]);

  // --- KEYBOARD LISTENERS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // --- GAME LOOP ---
  useEffect(() => {
    if (!hasStarted) return;

    const loop = () => {
      const now = Date.now();
      lastUpdateRef.current = now;

      // 1. Movement Logic
      const boat = getBoatStats(gameDataRef.current);
      
      let inputX = joystick.x;
      let inputY = joystick.y;

      if (keysRef.current['w'] || keysRef.current['arrowup']) inputY -= 1;
      if (keysRef.current['s'] || keysRef.current['arrowdown']) inputY += 1;
      if (keysRef.current['a'] || keysRef.current['arrowleft']) inputX -= 1;
      if (keysRef.current['d'] || keysRef.current['arrowright']) inputX += 1;

      const mag = Math.sqrt(inputX * inputX + inputY * inputY);
      if (mag > 1) {
          inputX /= mag;
          inputY /= mag;
      }

      if (inputX !== 0 || inputY !== 0) {
        setPlayer(p => {
            const nextX = p.x + inputX * boat.speed;
            const nextY = p.y + inputY * boat.speed;
            const nextDist = Math.sqrt(nextX*nextX + nextY*nextY);

            if (nextDist > boat.maxRange) {
                const currentDist = Math.sqrt(p.x*p.x + p.y*p.y);
                if (nextDist > currentDist) {
                     if (Math.random() > 0.98) showNotification("Rough Waters! Upgrade Boat to go deeper.");
                     return p; 
                }
            }
            return {
                x: nextX,
                y: nextY, 
                rot: Math.atan2(inputX, -inputY) * (180 / Math.PI)
            };
        });
      }

      // 2. Spawning Items
      setItems(currentItems => {
        if (currentItems.length > 50) return currentItems;
        if (Math.random() < 0.05) {
            const currentP = playerRef.current;
            const spawnDist = 600; 
            const angle = Math.random() * Math.PI * 2;
            const x = currentP.x + Math.sin(angle) * spawnDist;
            const y = currentP.y + Math.cos(angle) * spawnDist;
            
            const dist = Math.sqrt(x*x + y*y);

            const isFish = Math.random() > 0.7;
            const isTangled = isFish && Math.random() > 0.5;
            const itemDifficulty = Math.floor(dist / 500); 

            return [...currentItems, {
                id: Date.now() + Math.random(),
                x, y,
                type: isFish ? 'fish' : (Math.random() > 0.9 ? 'rare' : 'trash'),
                isTangled,
                value: 10 + Math.floor(dist / 100),
                difficulty: itemDifficulty
            }];
        }
        return currentItems;
      });

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [hasStarted, joystick, activeTab]);

  // --- ACTIONS ---
  const handleAction = () => {
    if (isCasting) return; 
    
    // Read from REF to get latest state for calculation
    const currentP = playerRef.current;
    const currentI = itemsRef.current;
    const currentData = gameDataRef.current;
    const rod = getRodStats(currentData);

    let targetX = 0;
    let targetY = 0;
    
    // Logic: Find closest reachable item
    let targetItem = null;
    let minDist = Infinity;
    
    currentI.forEach(item => {
        const d = (item.x - currentP.x)**2 + (item.y - currentP.y)**2;
        if(d < rod.range**2 && d < minDist) {
            minDist = d;
            targetItem = item;
        }
    });

    if (targetItem) {
        targetX = (targetItem as any).x;
        targetY = (targetItem as any).y;
    } else {
        const rads = currentP.rot * (Math.PI / 180);
        targetX = currentP.x + Math.sin(rads) * (rod.range * 0.8);
        targetY = currentP.y - Math.cos(rads) * (rod.range * 0.8);
    }
    
    setFishingTarget({ x: targetX, y: targetY });
    setIsCasting(true); 
    
    setTimeout(() => {
        performFishing();
        setIsCasting(false);
        setFishingTarget(null);
    }, 500);
  };

  const performFishing = () => {
    // CRITICAL: Read from REFs to avoid stale state in timeout
    const currentP = playerRef.current;
    const currentI = itemsRef.current;
    const currentData = gameDataRef.current;
    
    const rod = getRodStats(currentData);
    const bag = getBagStats(currentData);
    
    const reachable = currentI.filter(i => (i.x - currentP.x)**2 + (i.y - currentP.y)**2 < rod.range**2);

    if (reachable.length === 0) {
        showNotification("Nothing in range!");
        return;
    }

    let collectedCount = 0;
    let bagCount = currentData.trashInBag;
    let ecoPoints = currentData.ecoPoints;
    let fishRescued = currentData.fishRescued;
    let totalTrash = currentData.totalTrashCollected;

    const newItems = currentI.filter(item => {
      const distSq = (item.x - currentP.x)**2 + (item.y - currentP.y)**2;
      
      if (distSq < rod.range**2 && collectedCount < rod.multiGrab) {
        
        if (item.difficulty > rod.power) {
            showNotification("Too heavy! Upgrade Rod.");
            return true; 
        }

        if (item.type === 'fish') {
            if (item.isTangled) {
                fishRescued++;
                ecoPoints += item.value * 2;
                showNotification(`Rescued Fish! +${item.value*2} pts`);
                collectedCount++;
                return false; 
            } else {
                showNotification("Avoid free-swimming fish!");
                return true; 
            }
        } else {
            if (bagCount < bag.capacity) {
                bagCount++;
                totalTrash++;
                showNotification("Trash collected");
                collectedCount++;
                return false; 
            } else {
                showNotification("Bag Full! Return to Dock.");
                return true;
            }
        }
      }
      return true;
    });

    setItems(newItems);
    setGameData(prev => ({
        ...prev,
        ecoPoints,
        fishRescued,
        totalTrashCollected: totalTrash,
        trashInBag: bagCount
    }));
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  const sellTrash = () => {
    if (gameData.trashInBag === 0) return;
    
    // Removed Garden Bonus calculation as requested
    const value = gameData.trashInBag * 5 * (1 + (gameData.skills.conservation * 0.1));
    
    setGameData(prev => ({
      ...prev,
      ecoPoints: prev.ecoPoints + Math.floor(value),
      trashInBag: 0
    }));
    showNotification(`Sold trash for ${Math.floor(value)} EcoPoints!`);
  };

  const buyUpgrade = (type: 'rod' | 'bag' | 'boat') => {
    let cost = 0;
    const currentData = gameData;
    if (type === 'rod') cost = getRodStats(currentData).cost;
    if (type === 'bag') cost = getBagStats(currentData).cost;
    if (type === 'boat') cost = getBoatStats(currentData).cost;

    if (gameData.ecoPoints >= cost) {
      const levelKey = (type + 'Level') as 'rodLevel' | 'bagLevel' | 'boatLevel';
      setGameData(prev => ({
        ...prev,
        ecoPoints: prev.ecoPoints - cost,
        [levelKey]: (prev[levelKey] as number) + 1
      }));
      showNotification("Upgrade Purchased!");
    } else {
      showNotification("Not enough EcoPoints!");
    }
  };
  
  const upgradeSkill = (type: 'cleaning' | 'conservation' | 'engineering') => {
      const cost = 100 * (gameData.skills[type] + 1);
      if (gameData.ecoPoints >= cost && gameData.skills[type] < 4) {
          setGameData(prev => ({
              ...prev,
              ecoPoints: prev.ecoPoints - cost,
              skills: { ...prev.skills, [type]: prev.skills[type] + 1 }
          }));
      }
  };

  const currentRod = getRodStats(gameData);
  const currentBag = getBagStats(gameData);
  const currentBoat = getBoatStats(gameData);
  const currentZone = getCurrentZone();

  // --- STORY SCREEN ---
  if (showStory) {
    return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
             <div className="absolute inset-0 z-0 bg-slate-800">
                <img 
                    src="https://lh3.googleusercontent.com/d/1wuQ0-ezBuMOqqbFu_9-Fn5qe3ePzXeml=s2000" 
                    alt="Ocean Sweeper" 
                    className="w-full h-full object-cover opacity-30 blur-sm transition-opacity duration-1000"
                    onLoad={(e) => e.currentTarget.style.opacity = '0.3'}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none'; // Hide if fails
                    }}
                />
             </div>

            <div className="max-w-2xl animate-fade-in relative z-10">
                <div className="w-full max-w-sm mx-auto mb-6 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-slate-800 aspect-video relative">
                     <img 
                        src="https://lh3.googleusercontent.com/d/1wuQ0-ezBuMOqqbFu_9-Fn5qe3ePzXeml=s2000" 
                        alt="Ocean Sweeper Game" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback if main image fails
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-cyan-900');
                            if(e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '<span class="text-4xl">🌊</span>';
                        }}
                     />
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black text-cyan-400 mb-6 uppercase tracking-tight drop-shadow-lg">Ocean Sweeper</h1>
                
                <div className="bg-black/60 p-6 rounded-2xl backdrop-blur-md mb-8 border border-white/20 shadow-xl">
                    <h2 className="text-xl font-bold mb-4 text-emerald-300">Project Initiative: Day 1</h2>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        The oceans are dying under the weight of centuries of pollution. 
                        Global organizations have failed, but the <strong>Ocean Sweeper Project</strong> has just launched.
                    </p>
                    <p className="text-white font-bold text-lg">
                        Clean the waters. Restore the coral. Save the wildlife.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-2 mb-8 text-slate-400 text-sm">
                   <div className="flex gap-4">
                       <span className="bg-slate-800/80 px-3 py-1 rounded border border-white/10">W A S D to Move</span>
                       <span className="bg-slate-800/80 px-3 py-1 rounded border border-white/10">Action Button to Clean</span>
                   </div>
                </div>

                <button 
                    onClick={() => { setShowStory(false); setHasStarted(true); }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-black text-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
                >
                    <Play fill="currentColor" /> BEGIN MISSION
                </button>
            </div>
        </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-slate-900 select-none">
      
      {/* GAME VIEW */}
      {activeTab === 'game' && (
        <div className={`absolute inset-0 transition-colors duration-1000 ${currentZone.color}`}>
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           
           <div 
             className="absolute left-1/2 top-1/2"
             style={{ 
               transform: `translate(${-player.x}px, ${-player.y}px)`,
               transition: 'transform 0.1s linear'
             }}
           >
                <div className="absolute -translate-x-1/2 -translate-y-1/2 left-0 top-0 w-64 h-64 bg-[#8B4513] rounded-full border-4 border-[#5e2f0d] flex items-center justify-center z-0">
                    <div className="text-white/50 text-center">
                        <Anchor size={48} className="mx-auto mb-2 opacity-50"/>
                        <span className="font-bold tracking-widest block opacity-50">DOCK 01</span>
                    </div>
                </div>

                {items.map(item => (
                   <div 
                     key={item.id} 
                     className="absolute -translate-x-1/2 -translate-y-1/2 transition-all"
                     style={{ left: item.x, top: item.y }}
                   >
                        {item.type === 'fish' ? (
                            <FishSprite isTangled={item.isTangled || false} />
                        ) : (
                            <div className="transform rotate-12 relative">
                                <TrashSprite />
                                {item.difficulty > currentRod.power && (
                                    <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-0.5">
                                        <Lock size={8} />
                                    </div>
                                )}
                            </div>
                        )}
                   </div>
                ))}
                
                {isCasting && fishingTarget && (
                    <FishingRodCast start={player} end={fishingTarget} />
                )}

                <div 
                    className="absolute z-20 transition-transform"
                    style={{ left: player.x, top: player.y, transform: `translate(-50%, -50%) rotate(${player.rot}deg)` }}
                >
                    <div className="relative">
                        <BoatSprite />
                        <div 
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 pointer-events-none"
                            style={{ width: currentRod.range * 2, height: currentRod.range * 2 }}
                        ></div>
                    </div>
                </div>
           </div>

           {/* HUD */}
           <div className="absolute top-4 left-4 flex flex-col gap-2 z-40">
               <div className="bg-white/90 backdrop-blur rounded-xl p-3 shadow-lg flex items-center gap-3 border border-white/50">
                   <div className="bg-yellow-100 p-2 rounded-full">
                       <CircleDollarSign className="text-yellow-600" size={20} />
                   </div>
                   <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">EcoPoints</p>
                       <p className="text-xl font-black text-slate-800">{gameData.ecoPoints}</p>
                   </div>
               </div>
               <div className="bg-white/90 backdrop-blur rounded-xl p-3 shadow-lg flex items-center gap-3 border border-white/50">
                    <div className="bg-blue-100 p-2 rounded-full">
                       <ShoppingBag className="text-blue-600" size={20} />
                   </div>
                   <div className="flex-1">
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Bag {gameData.trashInBag}/{currentBag.capacity}</p>
                       <div className="w-24 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                           <div 
                            className={`h-full ${gameData.trashInBag >= currentBag.capacity ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{ width: `${(gameData.trashInBag / currentBag.capacity) * 100}%` }}
                           ></div>
                       </div>
                   </div>
               </div>
           </div>

           <div className="absolute top-4 right-4 bg-black/40 backdrop-blur text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 flex items-center gap-2 z-40">
               <Compass size={14} /> {currentZone.name}
           </div>

           {Math.sqrt(player.x*player.x + player.y*player.y) < 150 && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-24 animate-bounce z-40">
                   <button 
                    onClick={() => setActiveTab('dock')}
                    className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
                   >
                       <Anchor size={18} /> ENTER DOCK
                   </button>
               </div>
           )}

           {notification && (
               <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-slate-800/90 text-white px-6 py-3 rounded-full font-bold shadow-xl animate-fade-in flex items-center gap-2 z-50 whitespace-nowrap">
                   <Info size={18} className="text-cyan-400"/> {notification}
               </div>
           )}

           <div className="absolute bottom-36 md:bottom-16 left-8 md:hidden z-40">
               <Joystick onMove={(x, y) => setJoystick({ x, y })} />
           </div>
           
           <div className="hidden md:block absolute bottom-8 left-8 bg-black/30 text-white p-3 rounded-xl backdrop-blur-md z-40">
               <p className="text-xs font-bold">CONTROLS</p>
               <div className="flex gap-2 mt-1">
                   <kbd className="bg-white/20 px-2 py-1 rounded">W</kbd>
                   <kbd className="bg-white/20 px-2 py-1 rounded">A</kbd>
                   <kbd className="bg-white/20 px-2 py-1 rounded">S</kbd>
                   <kbd className="bg-white/20 px-2 py-1 rounded">D</kbd>
               </div>
           </div>

           <div className="absolute bottom-36 md:bottom-16 right-8 z-40">
               <button 
                onClick={handleAction}
                disabled={isCasting}
                className={`w-20 h-20 rounded-full shadow-xl border-4 border-white/30 active:scale-95 transition-transform flex items-center justify-center ${isCasting ? 'bg-cyan-700' : 'bg-cyan-500 hover:bg-cyan-400'}`}
               >
                   <ArrowUpCircle size={32} className={`text-white ${isCasting ? 'animate-spin' : ''}`} />
               </button>
           </div>
        </div>
      )}

      {/* DOCK VIEW */}
      {activeTab === 'dock' && (
          <div className="absolute inset-0 bg-slate-100 overflow-y-auto pb-20 z-40">
              <div className="bg-emerald-600 text-white p-6 pb-12 rounded-b-3xl shadow-lg relative">
                  <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                          <div className="bg-white/20 p-2 rounded-xl"><Anchor size={24}/></div>
                          <div>
                              <h2 className="text-2xl font-black">Port Haven Dock</h2>
                              <p className="text-emerald-100 text-xs">Level 1 Outpost</p>
                          </div>
                      </div>
                      <button onClick={() => setActiveTab('game')} className="bg-white/20 p-2 rounded-full"><X/></button>
                  </div>
                  
                  <div className="flex gap-4 overflow-x-auto pb-2">
                      <div className="bg-emerald-700/50 p-3 rounded-xl min-w-[120px]">
                          <p className="text-xs text-emerald-200 font-bold mb-1">TRASH VALUE</p>
                          <p className="text-2xl font-black">${gameData.trashInBag * 5}</p>
                      </div>
                      <div className="bg-emerald-700/50 p-3 rounded-xl min-w-[120px]">
                          <p className="text-xs text-emerald-200 font-bold mb-1">BALANCE</p>
                          <p className="text-2xl font-black">${gameData.ecoPoints}</p>
                      </div>
                  </div>
              </div>

              <div className="p-6 -mt-8 space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                      <div>
                          <h3 className="font-bold text-slate-800">Recycle Center</h3>
                          <p className="text-slate-500 text-sm">{gameData.trashInBag} items to recycle</p>
                      </div>
                      <button 
                        onClick={sellTrash}
                        disabled={gameData.trashInBag === 0}
                        className={`px-6 py-3 rounded-xl font-bold ${gameData.trashInBag > 0 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-200 text-slate-400'}`}
                      >
                          Sell All
                      </button>
                  </div>

                  <div className="space-y-4">
                      <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider ml-1">Equipment Shop</h3>
                      
                      <ShopItem 
                        icon={<ArrowUpCircle/>} color="bg-blue-500"
                        title="Fishing Rod" 
                        currentName={currentRod.name} 
                        level={gameData.rodLevel} 
                        maxLevel={RODS.length}
                        nextCost={getRodStats(gameData).cost}
                        onBuy={() => buyUpgrade('rod')}
                        canAfford={gameData.ecoPoints >= getRodStats(gameData).cost}
                      />

                      <ShopItem 
                        icon={<ShoppingBag/>} color="bg-orange-500"
                        title="Storage Bag" 
                        currentName={currentBag.name} 
                        level={gameData.bagLevel} 
                        maxLevel={BAGS.length}
                        nextCost={getBagStats(gameData).cost}
                        onBuy={() => buyUpgrade('bag')}
                        canAfford={gameData.ecoPoints >= getBagStats(gameData).cost}
                      />

                      <ShopItem 
                        icon={<Ship/>} color="bg-indigo-500"
                        title="Research Boat" 
                        currentName={currentBoat.name} 
                        level={gameData.boatLevel} 
                        maxLevel={BOATS.length}
                        nextCost={getBoatStats(gameData).cost}
                        onBuy={() => buyUpgrade('boat')}
                        canAfford={gameData.ecoPoints >= getBoatStats(gameData).cost}
                      />
                  </div>

                  <button 
                    onClick={() => setActiveTab('skills')}
                    className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold flex items-center justify-between shadow-lg"
                  >
                      <div className="flex items-center gap-3">
                          <Zap className="text-yellow-400" />
                          <span>Skill Tree Mastery</span>
                      </div>
                      <span className="bg-white/20 px-2 py-1 rounded text-xs">Open</span>
                  </button>
              </div>
          </div>
      )}

      {/* SKILLS VIEW */}
      {activeTab === 'skills' && (
          <div className="absolute inset-0 bg-slate-900 text-white overflow-y-auto pb-20 z-40">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-800">
                  <h2 className="text-xl font-bold flex items-center gap-2"><Zap className="text-yellow-400"/> Skill Matrix</h2>
                  <button onClick={() => setActiveTab('dock')} className="bg-white/10 p-2 rounded-full"><X/></button>
              </div>
              
              <div className="p-6 space-y-8">
                  <SkillNode 
                    title="Cleaning Mastery" 
                    desc="Increases rod range and trash value."
                    level={gameData.skills.cleaning}
                    color="text-blue-400"
                    icon={<Trash2/>}
                    cost={100 * (gameData.skills.cleaning + 1)}
                    canAfford={gameData.ecoPoints >= 100 * (gameData.skills.cleaning + 1)}
                    onUpgrade={() => upgradeSkill('cleaning')}
                  />
                  <SkillNode 
                    title="Conservationist" 
                    desc="Bonus points for fish rescue & rare finds."
                    level={gameData.skills.conservation}
                    color="text-emerald-400"
                    icon={<Heart/>}
                    cost={100 * (gameData.skills.conservation + 1)}
                    canAfford={gameData.ecoPoints >= 100 * (gameData.skills.conservation + 1)}
                    onUpgrade={() => upgradeSkill('conservation')}
                  />
                  <SkillNode 
                    title="Engineering" 
                    desc="Boosts boat speed and bag capacity."
                    level={gameData.skills.engineering}
                    color="text-orange-400"
                    icon={<Zap/>}
                    cost={100 * (gameData.skills.engineering + 1)}
                    canAfford={gameData.ecoPoints >= 100 * (gameData.skills.engineering + 1)}
                    onUpgrade={() => upgradeSkill('engineering')}
                  />
              </div>
          </div>
      )}

      {/* NAVIGATION */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 pb-safe z-50">
          <NavBtn active={activeTab === 'game'} icon={<Compass/>} label="Ocean" onClick={() => setActiveTab('game')} />
          <NavBtn active={activeTab === 'dock'} icon={<Anchor/>} label="Dock" onClick={() => setActiveTab('dock')} />
          <NavBtn active={activeTab === 'skills'} icon={<Zap/>} label="Skills" onClick={() => setActiveTab('skills')} />
      </div>
    </div>
  );
};

export default GameZone;
