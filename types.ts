
export interface User {
  id: string;
  name: string;
  points: number;
  avatar: string;
  clanId?: string;
  ownedItems?: string[]; // IDs of purchased cosmetics
}

export interface Clan {
  id: string;
  name: string;
  members: number;
  totalPoints: number;
  rank: number;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  type: 'daily' | 'league';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ClanMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
}

export interface Game {
  id: string;
  title: string;
  unlockPoints: number;
  image: string;
  isUnlocked: boolean;
}

export enum Tab {
  HOME = 'HOME',
  CLAN = 'CLAN',
  UPLOAD = 'UPLOAD',
  AI = 'AI',
  GAMES = 'GAMES',
  PROFILE = 'PROFILE'
}
