import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Anchor, Ship, Trash2, ShoppingBag, Map as MapIcon, 
  Menu, X, Trophy, Zap, Heart, Compass, ArrowUpCircle, 
  Droplets, Skull, Sprout, Wind, Shield, CircleDollarSign, 
  Leaf, Info, Play, Lock
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

// --- SPRITES ---

const BoatSprite: React.FC = () => (
  <svg width="48" height="96" viewBox="0 0 48 96" fill="none" className="drop-shadow-2xl">
    {/* Hull Shadow/Base */}
    <path d="M24 94 C 2 50, 8 15, 24 2 C 40 15, 46 50, 44 94 L 4 94 Z" fill="#0f172a" opacity="0.2" transform="translate(4, 4)" />
    
    {/* Wake */}
    <path d="M24 90 C 30 105, 18 105, 24 90" stroke="white" strokeWidth="4" strokeOpacity="0.5" className="blur-sm" />
    
    {/* Hull Main */}
    <path d="M24 2 C 40 15, 46 50, 44 94 L 4 94 C 2 50, 8 15, 24 2 Z" fill="#f8fafc" stroke="#475569" strokeWidth="2"/>
    
    {/* Deck */}
    <path d="M24 10 C 36 20, 40 50, 38 88 L 10 88 C 8 50, 12 20, 24 10 Z" fill="#cbd5e1"/>
    
    {/* Cabin/Console */}
    <path d="M14 55 H 34 V 75 H 14 Z" fill="#334155" rx="2" />
    <path d="M16 57 H 32 V 65 H 16 Z" fill="#0ea5e9" /> {/* Window */}
    
    {/* Motor */}
    <rect x="18" y="92" width="12" height="6" rx="1" fill="#1e293b" />
    
    {/* Accents */}
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
                {/* Fishing Line */}
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
                
                {/* Bobber/Hook */}
                <circle cx={end.x} cy={end.y} r="6" fill="#ef4444" stroke="white" strokeWidth="2">
                     <animate attributeName="opacity" from="0" to="1" dur="0.1s" fill="freeze" />
                     <animate attributeName="cx" from={start.x} to={end.x} dur="0.25s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                     <animate attributeName="cy" from={start.y} to={end.y} dur="0.25s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                     
                     {/* Scale up/down impact effect */}
                     <animate attributeName="r" values="6;8;0" keyTimes="0;0.8;1" dur="0.5s" begin="0.25s" fill="freeze" />
                </circle>
            </svg>
        </div>
    )
};

const FishSprite: React.FC<{isTangled: boolean}> = ({ isTangled }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" className={isTangled ? "animate-pulse" : "animate-bounce"}>
    {/* Shadow */}
    <ellipse cx="16" cy="28" rx="10" ry="3" fill="black" opacity="0.2" />
    
    {/* Fish Body */}
    <path d="M4 16 C 4 10, 10 4, 16 4 C 26 4, 30 16, 26 26 C 20 30, 4 22, 4 16 Z" fill={isTangled ? "#fb7185" : "#facc15"} stroke={isTangled ? "#be123c" : "#ca8a04"} strokeWidth="2" />
    
    {/* Tail */}
    <path d="M26 16 L 32 10 L 32 22 Z" fill={isTangled ? "#fb7185" : "#facc15"} stroke={isTangled ? "#be123c" : "#ca8a04"} strokeWidth="2" strokeLinejoin="round" />
    
    {/* Eye */}
    <circle cx="10" cy="12" r="2.5" fill="white" />
    <circle cx="10.5" cy="12" r="1" fill="black" />
    
    {/* Fin */}
    <path d="M14 16 L 8 20 L 14 20 Z" fill={isTangled ? "#e11d48" : "#eab308"} />
    
    {/* Stripes */}
    <path d="M14 6 C 14 6, 16 16, 14 26" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none" />
    <path d="M20 8 C 20 8, 22 16, 20 24" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none" />
    
    {/* Net/Tangle Overlay */}
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
    {/* Shadow */}
    <ellipse cx="14" cy="26" rx="8" ry="2" fill="black" opacity="0.2" />
    
    {/* Bottle Cap */}
    <rect x="10" y="2" width="8" height="4" fill="#94a3b8" rx="1"/>
    
    {/* Bottle Body */}
    <path d="M8 6 H 20 L 22 12 V 24 C 22 26, 20 26, 20 26 H 8 C 8 26, 6 26, 6 24 V 12 L 8 6 Z" fill="#3b82f6" fillOpacity="0.7" stroke="#2563eb" strokeWidth="1.5" />
    
    {/* Label */}
    <rect x="7" y="14" width="14" height="6" fill="#cbd5e1" />
    <path d="M9 16 H 19 M 9 18 H 15" stroke="#64748b" strokeWidth="1" />
    
    {/* Highlights */}
    <path d="M20 8 L 20 12" stroke="white" strokeWidth="1" opacity="0.5" />
    <path d="M18 22 L 20 22" stroke="white" strokeWidth="1" opacity="0.5" />
  </svg>
);

// --- TYPES ---

interface GameZoneProps {
  userPoints: number;
  addPoints: (points: number) => void;
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
  
  // Progression
  rodLevel: number;
  bagLevel: number;
  boatLevel: number;
  
  // Skills
  skills: {
    cleaning: number;
    conservation: number;
    engineering: number;
  };
  
  // Inventory
  trashInBag: number;
}

// --- MAIN COMPONENT ---

const GameZone: React.FC<GameZoneProps> = ({ userPoints, addPoints }) => {
  // Game System State
  const [hasStarted, setHasStarted] = useState(false);
  const [showStory, setShowStory] = useState(true);
  const [activeTab, setActiveTab] = useState<'game' | 'dock' | 'skills' | 'map'>('game');
  
  // Gameplay State
  const [player, setPlayer] = useState<PlayerState>({ x: 0, y: 0, rot: 0 });
  const [items, setItems] = useState<Item[]>([]);
  const [isCasting, setIsCasting] = useState(false); // For animation
  const [fishingTarget, setFishingTarget] = useState<{x: number, y: number} | null>(null);
  
  const [gameData, setGameData] = useState<GameData>({
    ecoPoints: 100, // Starting money
    totalTrashCollected: 0,
    fishRescued: 0,
    rodLevel: 0,
    bagLevel: 0,
    boatLevel: 0,
    skills: { cleaning: 0, conservation: 0, engineering: 0 },
    trashInBag: 0
  });

  // UI State
  const [joystick, setJoystick] = useState({ x: 0, y: 0 });
  const [notification, setNotification] = useState<string | null>(null);
  const gameLoopRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(Date.now());
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // --- STATS CALCULATORS ---
  const getRodStats = useCallback(() => {
    const lvl = gameData.rodLevel;
    return {
      name: RODS[lvl],
      range: 100 + (lvl * 15) + (gameData.skills.cleaning * 20),
      speed: 1 + (lvl * 0.1),
      power: lvl, // Determines what difficulty of trash you can pull
      multiGrab: Math.floor(lvl / 10) + 1,
      cost: Math.floor(50 * Math.pow(1.15, lvl))
    };
  }, [gameData.rodLevel, gameData.skills.cleaning]);

  const getBagStats = useCallback(() => {
    const lvl = gameData.bagLevel;
    return {
      name: BAGS[lvl],
      capacity: 10 + (lvl * 5) + (gameData.skills.engineering * 5),
      cost: Math.floor(40 * Math.pow(1.15, lvl))
    };
  }, [gameData.bagLevel, gameData.skills.engineering]);

  const getBoatStats = useCallback(() => {
    const lvl = gameData.boatLevel;
    const speed = 4 + (lvl * 0.5) + (gameData.skills.engineering * 0.5);
    const cost = Math.floor(100 * Math.pow(1.2, lvl));
    
    // Boat level determines max travel distance from dock
    const maxRange = 500 + (lvl * 500); 

    return {
      name: BOATS[lvl],
      speed,
      cost,
      maxRange
    };
  }, [gameData.boatLevel, gameData.skills.engineering]);

  const getCurrentZone = useCallback(() => {
    const dist = Math.sqrt(player.x * player.x + player.y * player.y);
    // Find highest zone that matches minDepth
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
      const dt = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      // 1. Movement Logic (Joystick + WASD)
      const boat = getBoatStats();
      
      let inputX = joystick.x;
      let inputY = joystick.y;

      // Keyboard Overrides
      if (keysRef.current['w'] || keysRef.current['arrowup']) inputY -= 1;
      if (keysRef.current['s'] || keysRef.current['arrowdown']) inputY += 1;
      if (keysRef.current['a'] || keysRef.current['arrowleft']) inputX -= 1;
      if (keysRef.current['d'] || keysRef.current['arrowright']) inputX += 1;

      // Clamp Magnitude (so diagonal isn't faster)
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

            // Boat Range Restriction
            if (nextDist > boat.maxRange) {
                // If moving further away, block it
                const currentDist = Math.sqrt(p.x*p.x + p.y*p.y);
                if (nextDist > currentDist) {
                     // Check notification throttle to avoid spamming
                     if (Math.random() > 0.95) setNotification("Rough Waters! Upgrade Boat to go deeper.");
                     return p; // Don't move
                }
            }

            return {
                x: nextX,
                y: nextY, 
                // Rot calc: Atan2(x, -y) creates 0 deg at Up (0,-1)
                rot: Math.atan2(inputX, -inputY) * (180 / Math.PI)
            };
        });
      }

      // 2. Spawning Items
      setItems(currentItems => {
        // Limit total items for performance
        if (currentItems.length > 50) return currentItems;
        
        // Spawn chance based on distance (harder/more rewarding further out)
        if (Math.random() < 0.05) {
            const dist = Math.sqrt(player.x * player.x + player.y * player.y);
            const spawnDist = 600; // spawn items around player but outside view
            const angle = Math.random() * Math.PI * 2;
            const x = player.x + Math.sin(angle) * spawnDist;
            const y = player.y + Math.cos(angle) * spawnDist;
            
            const isFish = Math.random() > 0.7;
            const isTangled = isFish && Math.random() > 0.5;
            
            // Difficulty increases with distance
            const itemDifficulty = Math.floor(dist / 500); // Every 500px requires +1 Rod Level

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
  }, [hasStarted, joystick, activeTab, getBoatStats, player]);

  // --- INTERACTION HANDLERS ---
  const handleAction = () => {
    if (isCasting) return; // Prevent spamming while animation plays
    
    // Calculate target logic for animation
    const rod = getRodStats();
    let targetX = 0;
    let targetY = 0;
    
    // Find closest items within range for targeting
    const reachableItems = items.filter(i => {
      const dx = i.x - player.x;
      const dy = i.y - player.y;
      return Math.sqrt(dx*dx + dy*dy) < rod.range;
    });

    // Determine target based on distance
    let targetItem = null;
    let minDist = Infinity;
    reachableItems.forEach(item => {
        const d = (item.x - player.x)**2 + (item.y - player.y)**2;
        if(d < minDist) {
            minDist = d;
            targetItem = item;
        }
    });

    if (targetItem) {
        targetX = targetItem.x;
        targetY = targetItem.y;
    } else {
        // Cast ahead if no target
        const rads = player.rot * (Math.PI / 180);
        targetX = player.x + Math.sin(rads) * (rod.range * 0.8);
        targetY = player.y - Math.cos(rads) * (rod.range * 0.8);
    }
    
    setFishingTarget({ x: targetX, y: targetY });
    setIsCasting(true); // Trigger Animation
    
    // DELAY actual collection to match animation (500ms)
    setTimeout(() => {
        performFishing();
        setIsCasting(false);
        setFishingTarget(null);
    }, 500);
  };

  const performFishing = () => {
    const rod = getRodStats();
    const bag = getBagStats();
    
    // Find closest items within range
    const reachableItems = items.filter(i => {
      const dx = i.x - player.x;
      const dy = i.y - player.y;
      return Math.sqrt(dx*dx + dy*dy) < rod.range;
    });

    if (reachableItems.length === 0) {
        showNotification("Nothing in range!");
        return;
    }

    // Collect items up to rod multiGrab limit
    let collectedCount = 0;
    const newItems = items.filter(item => {
      const dx = item.x - player.x;
      const dy = item.y - player.y;
      const isInRange = Math.sqrt(dx*dx + dy*dy) < rod.range;
      
      if (isInRange && collectedCount < rod.multiGrab) {
        
        // CHECK ROD STRENGTH
        if (item.difficulty > rod.power) {
            showNotification("Too heavy! Upgrade Rod.");
            return true; // Keep item
        }

        if (item.type === 'fish') {
            if (item.isTangled) {
                // Rescue!
                setGameData(prev => ({ 
                    ...prev, 
                    fishRescued: prev.fishRescued + 1,
                    ecoPoints: prev.ecoPoints + (item.value * 2) 
                }));
                showNotification(`Rescued Fish! +${item.value*2} pts`);
                collectedCount++;
                return false; // Remove from map
            } else {
                // Oops, caught a free fish
                showNotification("Avoid free-swimming fish!");
                return true; // Keep in map
            }
        } else {
            // Trash
            if (gameData.trashInBag < bag.capacity) {
                setGameData(prev => ({
                    ...prev,
                    trashInBag: prev.trashInBag + 1,
                    totalTrashCollected: prev.totalTrashCollected + 1
                }));
                showNotification("Trash collected");
                collectedCount++;
                return false; // Remove from map
            } else {
                showNotification("Bag Full! Return to Dock.");
                return true;
            }
        }
      }
      return true;
    });

    setItems(newItems);
  }

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  const sellTrash = () => {
    if (gameData.trashInBag === 0) return;
    const value = gameData.trashInBag * 5 * (1 + (gameData.skills.conservation * 0.1));
    setGameData(prev => ({
      ...prev,
      ecoPoints: prev.ecoPoints + Math.floor(value),
      trashInBag: 0
    }));
    // Note: Removed global addPoints to separate game economy from app leaderboard
    showNotification(`Sold trash for ${Math.floor(value)} EcoPoints!`);
  };

  const buyUpgrade = (type: 'rod' | 'bag' | 'boat') => {
    let cost = 0;
    if (type === 'rod') cost = getRodStats().cost;
    if (type === 'bag') cost = getBagStats().cost;
    if (type === 'boat') cost = getBoatStats().cost;

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
      // Simple skill cost logic: 100 * (level + 1)
      const cost = 100 * (gameData.skills[type] + 1);
      if (gameData.ecoPoints >= cost && gameData.skills[type] < 4) {
          setGameData(prev => ({
              ...prev,
              ecoPoints: prev.ecoPoints - cost,
              skills: { ...prev.skills, [type]: prev.skills[type] + 1 }
          }));
      }
  };

  // --- RENDER HELPERS ---
  const currentRod = getRodStats();
  const currentBag = getBagStats();
  const currentBoat = getBoatStats();
  const currentZone = getCurrentZone();

  // --- COMPONENT RENDER ---

  // 1. STORY / INTRO SCREEN
  if (showStory) {
    return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
            <div className="max-w-2xl animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-black text-cyan-400 mb-6 uppercase tracking-tight">Ocean Sweeper</h1>
                
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md mb-8 border border-white/20">
                    <h2 className="text-xl font-bold mb-4 text-emerald-300">Project Initiative: Day 1</h2>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        The oceans are dying under the weight of centuries of pollution. 
                        Global organizations have failed, but the <strong>Ocean Sweeper Project</strong> has just launched.
                    </p>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        You are a volunteer. You have a wooden dock, a basic stick rod, and a cloth pouch. 
                        It isn't much, but it's a start.
                    </p>
                    <p className="text-white font-bold text-lg">
                        Clean the waters. Restore the coral. Save the wildlife.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-2 mb-8 text-slate-400 text-sm">
                   <div className="flex gap-4">
                       <span className="bg-slate-800 px-3 py-1 rounded">W A S D to Move</span>
                       <span className="bg-slate-800 px-3 py-1 rounded">Action Button to Clean</span>
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

  // 2. MAIN GAME INTERFACE
  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-slate-900 select-none">
      
      {/* 2A. GAME VIEW (Map & Player) */}
      {activeTab === 'game' && (
        <div className={`absolute inset-0 transition-colors duration-1000 ${currentZone.color}`}>
           {/* Water Texture Overlay */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           
           {/* World Container (Centered on Player) */}
           <div 
             className="absolute left-1/2 top-1/2"
             style={{ 
               transform: `translate(${-player.x}px, ${-player.y}px)`,
               transition: 'transform 0.1s linear'
             }}
           >
                {/* DOCK */}
                <div className="absolute -translate-x-1/2 -translate-y-1/2 left-0 top-0 w-64 h-64 bg-[#8B4513] rounded-full border-4 border-[#5e2f0d] flex items-center justify-center z-0">
                    <div className="text-white/50 text-center">
                        <Anchor size={48} className="mx-auto mb-2 opacity-50"/>
                        <span className="font-bold tracking-widest block opacity-50">DOCK 01</span>
                    </div>
                </div>

                {/* ITEMS */}
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
                                {/* Show lock if rod too weak */}
                                {item.difficulty > currentRod.power && (
                                    <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-0.5">
                                        <Lock size={8} />
                                    </div>
                                )}
                            </div>
                        )}
                   </div>
                ))}
                
                {/* FISHING ROD ANIMATION LAYER */}
                {isCasting && fishingTarget && (
                    <FishingRodCast start={player} end={fishingTarget} />
                )}

                {/* PLAYER */}
                <div 
                    className="absolute z-20 transition-transform"
                    style={{ left: player.x, top: player.y, transform: `translate(-50%, -50%) rotate(${player.rot}deg)` }}
                >
                    {/* Boat Graphic */}
                    <div className="relative">
                        <BoatSprite />
                        
                        {/* Range Ring */}
                        <div 
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 pointer-events-none"
                            style={{ width: currentRod.range * 2, height: currentRod.range * 2 }}
                        ></div>
                    </div>
                </div>
           </div>

           {/* --- HUD --- */}
           
           {/* Top Left: Status */}
           <div className="absolute top-4 left-4 flex flex-col gap-2">
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

           {/* Top Right: Zone Info */}
           <div className="absolute top-4 right-4 bg-black/40 backdrop-blur text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 flex items-center gap-2">
               <Compass size={14} /> {currentZone.name}
           </div>

           {/* Dock Prompt */}
           {Math.sqrt(player.x*player.x + player.y*player.y) < 150 && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-24 animate-bounce">
                   <button 
                    onClick={() => setActiveTab('dock')}
                    className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
                   >
                       <Anchor size={18} /> ENTER DOCK
                   </button>
               </div>
           )}

           {/* Notifications */}
           {notification && (
               <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-slate-800/90 text-white px-6 py-3 rounded-full font-bold shadow-xl animate-fade-in flex items-center gap-2 z-50 whitespace-nowrap">
                   <Info size={18} className="text-cyan-400"/> {notification}
               </div>
           )}

           {/* Controls: Joystick (Mobile/Desktop) - Moved Up */}
           <div className="absolute bottom-36 md:bottom-16 left-8 md:hidden">
               <Joystick onMove={(x, y) => setJoystick({ x, y })} />
           </div>
           
           {/* Desktop Hint */}
           <div className="hidden md:block absolute bottom-8 left-8 bg-black/30 text-white p-3 rounded-xl backdrop-blur-md">
               <p className="text-xs font-bold">CONTROLS</p>
               <div className="flex gap-2 mt-1">
                   <kbd className="bg-white/20 px-2 py-1 rounded">W</kbd>
                   <kbd className="bg-white/20 px-2 py-1 rounded">A</kbd>
                   <kbd className="bg-white/20 px-2 py-1 rounded">S</kbd>
                   <kbd className="bg-white/20 px-2 py-1 rounded">D</kbd>
               </div>
           </div>

           {/* Controls: Action Button - Moved Up */}
           <div className="absolute bottom-36 md:bottom-16 right-8">
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

      {/* 2B. DOCK VIEW */}
      {activeTab === 'dock' && (
          <div className="absolute inset-0 bg-slate-100 overflow-y-auto pb-20">
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
                  
                  {/* Stats Row */}
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
                  {/* Quick Actions */}
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

                  {/* SHOP */}
                  <div className="space-y-4">
                      <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider ml-1">Equipment Shop</h3>
                      
                      {/* RODS */}
                      <ShopItem 
                        icon={<ArrowUpCircle/>} color="bg-blue-500"
                        title="Fishing Rod" 
                        currentName={currentRod.name} 
                        level={gameData.rodLevel} 
                        maxLevel={RODS.length}
                        nextCost={getRodStats().cost}
                        onBuy={() => buyUpgrade('rod')}
                        canAfford={gameData.ecoPoints >= getRodStats().cost}
                      />

                      {/* BAGS */}
                      <ShopItem 
                        icon={<ShoppingBag/>} color="bg-orange-500"
                        title="Storage Bag" 
                        currentName={currentBag.name} 
                        level={gameData.bagLevel} 
                        maxLevel={BAGS.length}
                        nextCost={getBagStats().cost}
                        onBuy={() => buyUpgrade('bag')}
                        canAfford={gameData.ecoPoints >= getBagStats().cost}
                      />

                      {/* BOATS */}
                      <ShopItem 
                        icon={<Ship/>} color="bg-indigo-500"
                        title="Research Boat" 
                        currentName={currentBoat.name} 
                        level={gameData.boatLevel} 
                        maxLevel={BOATS.length}
                        nextCost={getBoatStats().cost}
                        onBuy={() => buyUpgrade('boat')}
                        canAfford={gameData.ecoPoints >= getBoatStats().cost}
                      />
                  </div>

                  {/* SKILLS TEASER */}
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

      {/* 2C. SKILLS VIEW */}
      {activeTab === 'skills' && (
          <div className="absolute inset-0 bg-slate-900 text-white overflow-y-auto pb-20">
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

      {/* 3. NAVIGATION (Within Game) */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 pb-safe z-40">
          <NavBtn active={activeTab === 'game'} icon={<Compass/>} label="Ocean" onClick={() => setActiveTab('game')} />
          <NavBtn active={activeTab === 'dock'} icon={<Anchor/>} label="Dock" onClick={() => setActiveTab('dock')} />
          <NavBtn active={activeTab === 'skills'} icon={<Zap/>} label="Skills" onClick={() => setActiveTab('skills')} />
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const NavBtn: React.FC<{active: boolean, icon: any, label: string, onClick: () => void}> = ({active, icon, label, onClick}) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-16 py-1 rounded-lg transition-colors ${active ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'}`}
    >
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
    const center = { x: 50, y: 50 }; // Half of w-24 (96px) roughly, keeping logic simple relative to container

    const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
        setActive(true);
        handleMove(e);
    };

    const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!active && e.type !== 'mousedown' && e.type !== 'touchstart') return;
        
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        
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
            className="w-24 h-24 bg-black/20 backdrop-blur rounded-full border border-white/30 flex items-center justify-center touch-none select-none relative"
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

export default GameZone;