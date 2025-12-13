
import React, { useState, useEffect } from 'react';
import { User, Clan, ClanMessage } from '../types';
import { Users, Shield, Send, Trophy, Sword, Target, Crown, Medal, User as UserIcon, AlertTriangle, Plus, Search, LogOut, Info } from 'lucide-react';

interface ClanHubProps {
  user: User;
  clans: Clan[];
  onUpdateUser: (updates: Partial<User>) => void;
  onCreateClan: (clan: Clan) => void;
}

interface ClanMember {
    id: string;
    name: string;
    role: 'Leader' | 'Assistant' | 'Member';
    points: number;
}

interface Challenge {
    id: string;
    opponent: string;
    description: string;
    stakes: number; // Points to win/lose
    status: 'active' | 'pending' | 'completed';
    progress: number; // 0-100
    myClanScore: number;
    opponentScore: number;
}

const ClanHub: React.FC<ClanHubProps> = ({ user, clans, onUpdateUser, onCreateClan }) => {
  const [view, setView] = useState<'chat' | 'rankings' | 'members' | 'challenges'>('chat');
  const [inputValue, setInputValue] = useState('');
  const [joinSearch, setJoinSearch] = useState('');
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  
  // Mock Data for Clan Chat (Active Clan view)
  const [messages, setMessages] = useState<ClanMessage[]>([
    { id: '1', sender: 'System', text: 'Welcome to the clan chat! 🌳', timestamp: new Date(), isMe: false },
  ]);

  const [members, setMembers] = useState<ClanMember[]>([]);

  useEffect(() => {
    if (user.clanId) {
        try {
            const stored = localStorage.getItem('eco_users');
            if (stored) {
                const allUsers: any[] = JSON.parse(stored);
                const clanMembers = allUsers
                    .filter(u => u.clanId === user.clanId)
                    .map(u => ({
                        id: u.id,
                        name: u.name,
                        role: 'Member' as const, // Default role for now
                        points: u.points
                    }))
                    .sort((a, b) => b.points - a.points);
                setMembers(clanMembers);
            } else {
                 setMembers([{ id: user.id, name: user.name, role: 'Leader', points: user.points }]);
            }
        } catch {
             setMembers([{ id: user.id, name: user.name, role: 'Leader', points: user.points }]);
        }
    }
  }, [user.clanId, user.id, user.name, user.points]);


  const challenges: Challenge[] = [
      { id: 'ch1', opponent: 'River Rats', description: 'Collect most plastic waste this week', stakes: 500, status: 'active', progress: 60, myClanScore: 120, opponentScore: 110 },
  ];

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    const newMsg: ClanMessage = {
      id: Date.now().toString(),
      sender: user.name,
      text: inputValue,
      timestamp: new Date(),
      isMe: true
    };
    setMessages([...messages, newMsg]);
    setInputValue('');
  };

  const handleCreateClan = () => {
      if(!createName) return;
      
      const newClan: Clan = {
          id: `clan_${Date.now()}`,
          name: createName,
          description: createDesc,
          members: 1,
          totalPoints: user.points,
          rank: clans.length + 1
      };
      
      onCreateClan(newClan);
  };

  const handleJoinClan = (clanId: string) => {
      onUpdateUser({ clanId });
  };

  const handleLeaveClan = () => {
      if(confirm('Are you sure you want to leave your clan?')) {
          onUpdateUser({ clanId: undefined });
      }
  };

  // --- RENDER NO CLAN VIEW ---
  if (!user.clanId) {
    const filteredClans = clans.filter(c => c.name.toLowerCase().includes(joinSearch.toLowerCase()));

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center py-8">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="text-green-600" size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-2">Join the Community</h2>
                <p className="text-slate-500 max-w-md mx-auto">Together we are stronger! Join a clan to participate in clan wars, chat with members, and multiply your impact.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Join Clan Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Search size={20}/> Find a Clan</h3>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name..." 
                            value={joinSearch}
                            onChange={(e) => setJoinSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="space-y-3 h-64 overflow-y-auto custom-scrollbar">
                        {filteredClans.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                                <Info size={32} className="mb-2 opacity-50"/>
                                <p className="text-sm font-medium">No clans found.</p>
                                <p className="text-xs">Be the first to create one!</p>
                            </div>
                        ) : (
                            filteredClans.map(clan => (
                                <div key={clan.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                    <div>
                                        <p className="font-bold text-slate-800">{clan.name}</p>
                                        <p className="text-xs text-slate-500">{clan.members} members</p>
                                    </div>
                                    <button 
                                        onClick={() => handleJoinClan(clan.id)}
                                        className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Join
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Create Clan Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <Shield size={150} />
                    </div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10"><Plus size={20}/> Create a Clan</h3>
                    <div className="space-y-4 relative z-10">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">CLAN NAME</label>
                            <input 
                                type="text"
                                value={createName}
                                onChange={(e) => setCreateName(e.target.value)} 
                                placeholder="e.g. Eco Warriors" 
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">DESCRIPTION</label>
                            <textarea 
                                value={createDesc}
                                onChange={(e) => setCreateDesc(e.target.value)}
                                placeholder="What is your clan about?" 
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                            ></textarea>
                        </div>
                        <button 
                            onClick={handleCreateClan}
                            disabled={!createName}
                            className={`w-full py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95 ${
                                createName ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            Create & Lead
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  // --- CLAN HUB LOGIC ---
  const myClan = clans.find(c => c.id === user.clanId) || { name: 'Unknown Clan', rank: 0, description: '' };

  const renderContent = () => {
      switch(view) {
        case 'chat':
            return (
                <div className="flex-1 flex flex-col bg-green-50 h-[600px] md:h-[500px]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                            msg.isMe 
                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                            }`}>
                            {!msg.isMe && <p className="text-[10px] font-bold text-indigo-600 mb-1">{msg.sender}</p>}
                            {msg.text}
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="p-3 bg-white border-t border-slate-200">
                        <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Message your clan..." 
                            className="flex-1 bg-slate-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                        <button 
                            onClick={sendMessage}
                            className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 shadow-lg active:scale-95 transition-transform"
                        >
                            <Send size={18} />
                        </button>
                        </div>
                    </div>
                </div>
            );
        
        case 'members':
            return (
                <div className="p-4 space-y-3">
                    <h3 className="font-bold text-slate-700 mb-2">Clan Roster ({members.length})</h3>
                    {members.length === 0 ? (
                        <p className="text-slate-400 text-sm">No members found.</p>
                    ) : (
                        members.map(member => (
                            <div key={member.id} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${member.role === 'Leader' ? 'bg-yellow-100 text-yellow-600' : member.role === 'Assistant' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {member.role === 'Leader' ? <Crown size={20} /> : member.role === 'Assistant' ? <Medal size={20} /> : <UserIcon size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{member.name}</p>
                                        <p className="text-xs text-slate-500 font-medium">{member.role}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-indigo-600 text-sm">{member.points} pts</span>
                            </div>
                        ))
                    )}
                    <button className="w-full mt-4 py-3 border-2 border-dashed border-slate-300 text-slate-400 rounded-xl font-bold text-sm hover:border-indigo-400 hover:text-indigo-500 transition-colors">
                        + Invite New Member
                    </button>

                    <div className="pt-8 border-t border-slate-200 mt-8">
                        <button onClick={handleLeaveClan} className="flex items-center gap-2 text-red-500 font-bold text-sm hover:text-red-700 transition-colors">
                            <LogOut size={16}/> Leave Clan
                        </button>
                    </div>
                </div>
            );

        case 'challenges':
            return (
                <div className="p-4 space-y-4">
                     <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="font-bold text-orange-800 text-sm">War Zone Rules</p>
                            <p className="text-xs text-orange-700 mt-1">Winning a challenge awards your clan <span className="font-bold">+Stakes</span>. Losing will deduct points. Choose your battles wisely!</p>
                        </div>
                     </div>

                    {challenges.map(challenge => (
                        <div key={challenge.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-900 text-white p-3 flex justify-between items-center">
                                <span className="font-bold text-sm flex items-center gap-2">
                                    <Sword size={14} className="text-red-400" /> vs {challenge.opponent}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${challenge.status === 'active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                                    {challenge.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="p-4">
                                <p className="font-bold text-slate-800 mb-2">{challenge.description}</p>
                                <div className="flex justify-between text-xs text-slate-500 mb-3 bg-slate-50 p-2 rounded-lg">
                                    <span className="font-medium">Stakes:</span>
                                    <span className="font-bold text-indigo-600">Win +{challenge.stakes} / Lose -{Math.floor(challenge.stakes / 2)}</span>
                                </div>
                                
                                {challenge.status === 'active' && (
                                    <div className="space-y-2 mt-3">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-indigo-600">Us: {challenge.myClanScore}</span>
                                            <span className="text-red-500">Them: {challenge.opponentScore}</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex relative">
                                            <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${(challenge.myClanScore / (challenge.myClanScore + challenge.opponentScore + 1)) * 100}%` }}></div>
                                            <div className="bg-red-500 h-full flex-1 transition-all duration-1000"></div>
                                        </div>
                                    </div>
                                )}
                                
                                {challenge.status === 'pending' && (
                                    <div className="mt-3 flex gap-2">
                                        <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700">Accept Challenge</button>
                                        <button className="flex-1 bg-slate-100 text-slate-500 py-2 rounded-lg text-xs font-bold hover:bg-slate-200">Decline</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-md active:scale-95 flex items-center justify-center gap-2">
                       <Sword size={18}/> Declare War
                    </button>
                </div>
            );

        case 'rankings':
        default:
            return (
                <div className="p-4 space-y-3">
                    {clans.length === 0 && (
                        <div className="text-center p-8 text-slate-400">
                             <p>You are the first clan here!</p>
                        </div>
                    )}
                    {clans.map((clan, index) => (
                    <div key={clan.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 relative overflow-hidden border border-slate-100">
                        <div className={`text-2xl font-black w-8 text-center ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-600' : 'text-slate-300'}`}>
                        #{index + 1}
                        </div>
                        <div className="flex-1">
                        <h3 className="font-bold text-slate-800">{clan.name}</h3>
                        <p className="text-xs text-slate-500">{clan.members} members • {clan.description}</p>
                        </div>
                        <div className="text-right">
                        <p className="font-bold text-indigo-600">{clan.totalPoints}</p>
                        <p className="text-[10px] text-slate-400">PTS</p>
                        </div>
                        {index === 0 && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-100 to-transparent rounded-bl-full -mr-8 -mt-8"></div>}
                    </div>
                    ))}
                </div>
            );
      }
  }

  // --- MAIN CLAN HUB VIEW ---
  return (
    <div className="flex flex-col h-full bg-green-50 md:rounded-2xl md:overflow-hidden md:border md:border-slate-200 md:shadow-sm animate-fade-in">
      
      {/* Clan Header Information */}
      <div className="bg-indigo-600 text-white p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2"><Shield size={24} className="fill-white"/> {myClan.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-indigo-200 text-xs font-medium bg-indigo-700/50 px-2 py-1 rounded">Rank #{myClan.rank || '-'}</span>
                    <span className="text-indigo-200 text-xs font-medium bg-indigo-700/50 px-2 py-1 rounded">Level 1 Clan</span>
                </div>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                 <Crown className="text-yellow-300" size={24} />
              </div>
            </div>
            
            {/* Active Quest */}
            <div className="bg-indigo-800/50 p-3 rounded-lg flex items-center gap-3 border border-indigo-500/30 backdrop-blur-sm">
              <div className="bg-green-500 p-2 rounded-full shadow-lg shadow-green-900/20">
                <Target size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-bold uppercase text-indigo-200 tracking-wider">Clan Quest</p>
                    <span className="text-[10px] font-bold text-white">0%</span>
                </div>
                <p className="text-xs font-bold text-white">Clean Local Beach (0/10)</p>
                <div className="w-full bg-indigo-900/50 h-1.5 rounded-full mt-1.5">
                    <div className="bg-green-400 h-1.5 rounded-full" style={{width: '0%'}}></div>
                </div>
              </div>
            </div>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute -right-10 -top-10 text-indigo-500 opacity-20">
            <Shield size={200} />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white border-b border-slate-200 overflow-x-auto scrollbar-hide">
        {[
            { id: 'chat', label: 'Chat', icon: Users },
            { id: 'challenges', label: 'Wars', icon: Sword },
            { id: 'members', label: 'Roster', icon: UserIcon },
            { id: 'rankings', label: 'Rank', icon: Trophy },
        ].map((tab) => {
            const Icon = tab.icon;
            return (
                <button 
                    key={tab.id}
                    onClick={() => setView(tab.id as any)}
                    className={`flex-1 py-3 px-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors min-w-[100px] ${
                        view === tab.id 
                        ? 'border-indigo-600 text-indigo-700 bg-indigo-50' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Icon size={16} /> {tab.label}
                </button>
            )
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-green-50 md:h-[500px] overflow-y-auto custom-scrollbar">
        {renderContent()}
      </div>
    </div>
  );
};

export default ClanHub;
