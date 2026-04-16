import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  user: any | null;
  menu: any | null;
  token: string | null;
  setUser: (user: any) => void;
  setToken: (token: string) => void;
  setMenu: (menu: any) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      menu: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setMenu: (menu) => set({ menu }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'app-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);