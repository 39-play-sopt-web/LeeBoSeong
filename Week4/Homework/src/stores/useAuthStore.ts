import { create } from 'zustand';
import { PARTS, type Part } from '../apis/member';

const AUTH_STORAGE_KEY = 'sopt-board-auth';

type AuthSession = {
  authorizationCode: string;
  part: Part;
};

type AuthStore = {
  session: AuthSession | null;
  saveSession: (session: AuthSession) => void;
  clearSession: () => void;
};

function readSession(): AuthSession | null {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) return null;

    const session = JSON.parse(saved) as Partial<AuthSession> | null;
    const part = PARTS.find((option) => option === session?.part);
    const authorizationCode = session?.authorizationCode;

    if (!part || typeof authorizationCode !== 'string' || !authorizationCode.trim()) {
      return null;
    }

    return { part, authorizationCode };
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthStore>()((set) => ({
  session: readSession(),
  saveSession: (session) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    set({ session });
  },
  clearSession: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    set({ session: null });
  },
}));
