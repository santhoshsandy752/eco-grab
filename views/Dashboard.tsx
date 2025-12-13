
import React, { useState, useEffect } from 'react';
import { User, Task } from '../types';
import { CheckCircle2, Circle, Flame, Calendar, ArrowRight, Leaf, Trophy, X, Crown, Medal, User as UserIcon, Eye } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  user: User;
  addPoints: (amount: number) => void;
  onVisitGarden: (user: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, addPoints, onVisitGarden }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Recycle 3 plastic bottles', description: 'Upload a photo of you recycling.', points: 50, completed: false, type: 'daily' },
    { id: '2', title: 'Plant a seed', description: 'Start your own garden.', points: 100, completed: false, type: 'league' },
    { id: '3', title: 'Use a reusable bag', description: 'Avoid plastic bags today.', points: 30, completed: false, type: 'daily' },
    { id: '4', title: 'Watch Eco-Doc', description: 'Learn about marine life.', points: 20, completed: false, type: 'daily' },
    { id: '5', title: 'Compost Leftovers', description: 'Dispose of food waste properly.', points: 40, completed: false, type: 'daily' },
  ]);

  const [timeState, setTimeState] = useState({
      daysRemaining: 0,
      dailyTimer: '00:00:00',
      monthName: ''
  });

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<User[]>([]);

  useEffect(() => {
    const updateTime = () => {
        const now = new Date();
        
        // 1. League Calculation (End of Current Month)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const msPerDay = 1000 * 60 * 60 * 24;
        const diffDays = Math.max(0, Math.ceil((endOfMonth.getTime() - now.getTime()) / msPerDay));
        
        // 2. Daily Timer (Next Midnight)
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const diffMs = tomorrow.getTime() - now.getTime();
        
        const hours = Math.floor((diffMs % (msPerDay)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        const dailyString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // 3. Month Name
        const month = now.toLocaleString('default', { month: 'long' });

        setTimeState({
            daysRemaining: diffDays,
            dailyTimer: dailyString,
            monthName: month
        });
    };

    updateTime(); // Initial call
    const timer = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  // Fetch Real Users for Leaderboard
  useEffect(() => {
      if (showLeaderboard) {
          try {
              const stored = localStorage.getItem('eco_users');
              if (stored) {
                  const users: User[] = JSON.parse(stored);
                  const data = users.sort((a, b) => b.points - a.points);
                  setLeaderboardData(data);
              } else {
                   setLeaderboardData([user]);
              }
          } catch (e) {
              setLeaderboardData([user]);
          }
      }
  }, [showLeaderboard, user]);

  const completeTask = (id: string, points: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t));
    addPoints(points);
  };

  // Dynamic Rank Logic
  const getRankInfo = (points: number) => {
    if (points < 100) return { title: 'Seedling', min: 0, max: 100, next: 'Sprout' };
    if (points < 250) return { title: 'Sprout', min: 100, max: 250, next: 'Sapling' };
    if (points < 500) return { title: 'Sapling', min: 250, max: 500, next: 'Tree' };
    if (points < 1000) return { title: 'Tree', min: 500, max: 1000, next: 'Forest' };
    return { title: 'Guardian', min: 1000, max: 5000, next: 'Hero' };
  };

  const rankInfo = getRankInfo(user.points);
  const progress = user.points - rankInfo.min;
  const goal = rankInfo.max - rankInfo.min;
  
  // Prevent division by zero if max point reached
  const percentage = Math.min(100, Math.floor((progress / goal) * 100));
  
  // League Data for Chart
  const data = [
    { name: 'Completed', value: Math.max(1, progress) }, 
    { name: 'Remaining', value: Math.max(0, goal - progress) }, 
  ];
  const COLORS = ['#ffffff', 'rgba(255,255,255,0.2)'];

  const myRank = leaderboardData.findIndex(u => u.id === user.id) + 1;

  return (
    <div className="p-0 space-y-6 animate-fade-in relative">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* League Banner - Clickable */}
        <div 
            onClick={() => setShowLeaderboard(true)}
            className="bg-gradient-to-r from-teal-500 to-green-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[220px] cursor-pointer hover:shadow-xl transition-all hover:scale-[1.01] group"
        >
            <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Trophy size={20} />
            </div>

            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Calendar size={180} />
            </div>
            
            <div className="relative z-10 pointer-events-none">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1 flex items-center gap-1"><Leaf size={14}/> Current League</h2>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">{timeState.monthName} Guardians</h1>
                    <div className="flex items-center gap-2">
                         <p className="text-teal-100 text-sm font-medium bg-teal-800/30 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                            Ends in {timeState.daysRemaining} days
                        </p>
                        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded text-white flex items-center gap-1 group-hover:bg-white/30 transition-colors">
                            <Trophy size={10} /> View Leaderboard
                        </span>
                    </div>
                </div>
                {/* Fixed Size Chart to avoid ResponsiveContainer errors on hidden/mobile */}
                <div className="w-20 h-20 relative bg-white/10 rounded-full p-1 backdrop-blur-md hidden sm:flex items-center justify-center">
                    <PieChart width={70} height={70}>
                        <Pie
                            data={data}
                            innerRadius={28}
                            outerRadius={35}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold pointer-events-none">
                        {percentage}%
                    </div>
                </div>
            </div>
            </div>

            <div className="relative z-10 mt-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 flex items-center justify-between pointer-events-none">
                <div>
                    <p className="text-xs uppercase font-bold text-teal-100">Current Rank</p>
                    <p className="font-bold text-xl">{rankInfo.title}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-teal-100">Next: {rankInfo.next}</p>
                    <p className="font-bold text-xl">{rankInfo.max - user.points} pts</p>
                </div>
            </div>
        </div>

        {/* Monthly Theme Tasks */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden min-h-[220px]">
            <div className="absolute -right-10 -bottom-10 opacity-20 rotate-12">
                <ArrowRight size={200} />
            </div>
            <div className="relative z-10 h-full flex flex-col">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Calendar className="text-blue-300" size={20} /> League Bonuses
                </h3>
                <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[150px]">
                    {tasks.filter(t => t.type === 'league').map(task => (
                        <div key={task.id} className="bg-blue-700/50 p-3 rounded-xl border border-blue-500/30 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-sm">{task.title}</h4>
                                <div className="mt-1 inline-block bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">
                                +{task.points} Bonus Pts
                                </div>
                            </div>
                            {task.completed ? <CheckCircle2 size={24} className="text-blue-200"/> : (
                                <button onClick={() => completeTask(task.id, task.points)} className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm active:scale-95 hover:bg-blue-50">
                                Claim
                                </button>
                            )}
                        </div>
                    ))}
                    <div className="bg-blue-700/30 p-3 rounded-xl border border-blue-500/10 border-dashed text-center">
                        <p className="text-xs font-medium text-blue-200">Complete daily tasks to unlock more bonuses!</p>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* Daily Tasks */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
            <Flame className="text-orange-500 fill-orange-500" size={24} /> Daily Quests
          </h3>
          <span className="text-xs text-slate-500 font-bold bg-slate-200 px-3 py-1 rounded-full flex items-center gap-1 font-mono">
             Reset in {timeState.dailyTimer}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.filter(t => t.type === 'daily').map(task => (
            <div key={task.id} className={`p-5 rounded-2xl border-2 transition-all hover:shadow-md ${task.completed ? 'border-green-100 bg-green-50' : 'border-slate-100 bg-white shadow-sm'}`}>
              <div className="flex items-start justify-between h-full flex-col">
                <div className="w-full mb-4">
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${task.completed ? 'bg-green-200 text-green-800' : 'bg-orange-100 text-orange-600'}`}>
                            +{task.points} pts
                        </span>
                        <button 
                            disabled={task.completed}
                            onClick={() => completeTask(task.id, task.points)}
                            className={`transition-colors ${task.completed ? 'text-green-500' : 'text-slate-300 hover:text-green-500'}`}
                        >
                        {task.completed ? <CheckCircle2 size={28} className="fill-green-100" /> : <Circle size={28} />}
                        </button>
                    </div>
                   <h4 className={`font-bold text-lg leading-tight ${task.completed ? 'text-green-800 line-through opacity-70' : 'text-slate-800'}`}>{task.title}</h4>
                   <p className="text-sm text-slate-500 mt-2 leading-snug">{task.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEADERBOARD MODAL */}
      {showLeaderboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowLeaderboard(false)}>
            <div 
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-bottom-5 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-br from-teal-500 to-green-600 p-6 text-white shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Trophy size={120} />
                    </div>
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h2 className="text-2xl font-black flex items-center gap-2"><Trophy className="text-yellow-300 fill-yellow-300"/> Leaderboard</h2>
                        <button onClick={() => setShowLeaderboard(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                            <X size={20}/>
                        </button>
                    </div>
                    <div className="relative z-10 flex justify-between items-end">
                         <div>
                            <p className="text-teal-100 text-sm font-medium">Top Guardians</p>
                            <p className="text-2xl font-bold">{timeState.monthName}</p>
                         </div>
                         <div className="text-right">
                             <p className="text-xs text-teal-100">Your Rank</p>
                             <p className="text-3xl font-black text-white">#{myRank > 0 ? myRank : '-'}</p>
                         </div>
                    </div>
                </div>
                
                {/* List */}
                <div className="flex-1 overflow-y-auto p-0 bg-slate-50">
                    {leaderboardData.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            <p>No other players yet.</p>
                        </div>
                    ) : (
                        leaderboardData.map((u, index) => {
                            const rank = index + 1;
                            const isMe = u.id === user.id;
                            let rankIcon = <span className="font-bold text-slate-400 w-6 text-center">{rank}</span>;
                            let bgClass = "bg-white";
                            let borderClass = "border-slate-100";

                            if (rank === 1) {
                                rankIcon = <Crown size={24} className="text-yellow-500 fill-yellow-500" />;
                                borderClass = "border-yellow-200";
                                bgClass = "bg-yellow-50/50";
                            } else if (rank === 2) {
                                rankIcon = <Medal size={24} className="text-slate-400 fill-slate-300" />;
                            } else if (rank === 3) {
                                rankIcon = <Medal size={24} className="text-amber-600 fill-amber-600" />;
                            }

                            // Highlight Me
                            if (isMe) {
                                bgClass = "bg-green-50";
                                borderClass = "border-green-200 shadow-sm sticky top-0 bottom-0 z-10"; // Sticky effect for user
                            }

                            return (
                                <div 
                                    key={u.id} 
                                    onClick={() => !isMe && onVisitGarden(u)}
                                    className={`flex items-center gap-4 p-4 border-b ${borderClass} ${bgClass} transition-colors ${!isMe ? 'hover:bg-slate-100 cursor-pointer group' : ''}`}
                                >
                                    <div className="w-8 flex justify-center shrink-0">
                                        {rankIcon}
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300 shrink-0 relative">
                                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-bold text-sm ${isMe ? 'text-green-700' : 'text-slate-800'}`}>
                                            {u.name} {isMe && '(You)'}
                                        </h4>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                            Guardian
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-slate-800">{u.points.toLocaleString()}</p>
                                        
                                        {!isMe && (
                                            <div className="text-[10px] text-green-600 font-bold flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Eye size={10} /> Visit
                                            </div>
                                        )}
                                        {isMe && <p className="text-[10px] text-slate-400 font-bold">PTS</p>}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                
                {/* Footer Tip */}
                <div className="p-3 bg-slate-100 text-center text-[10px] text-slate-400 font-medium shrink-0">
                    Tap on a player to visit their garden
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
