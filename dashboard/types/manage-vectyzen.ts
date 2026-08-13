export interface Vectyzen {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  banned: boolean | null;
  isOfficial: boolean;
  isPremium: boolean;
  createdAt: string;
  lastLogin: string | null;
}

export interface VectyzenStats {
  totalAnon: number;
  totalVectyzen: number;
  totalActive: number;
}
