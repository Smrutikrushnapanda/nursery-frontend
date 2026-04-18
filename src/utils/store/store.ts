import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  user: any | null;
  menu: any | null;
  token: string | null;
  organization: any | null;
  businessTypes: any | null;
  categories: any | null;
  isLoading: boolean;
  hasHydrated: boolean,
  setUser: (user: any) => void;
  setToken: (token: string) => void;
  setMenu: (menu: any) => void;
  setBusinessTypes: (businessTypes: any) => void;
  setCategories: (categories: any) => void;
  setOrganization: (organization: any) => void;
  setLoading: (isLoading: boolean) => void;
  setHydration: (hasHydrated: boolean) => void;
  // logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      menu: null,
      organization: null,
      businessTypes: null,
      categories: null,
      isLoading: false,
      hasHydrated: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setMenu: (menu) => set({ menu }),
      setOrganization: (organization) => set({ organization }),
      setBusinessTypes: (businessTypes) => set({ businessTypes }),
      setCategories: (categories) => set({ categories }),
      setLoading: (isLoading) => set({ isLoading }),
      setHydration: (hasHydrated) => set({ hasHydrated }),
      // logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'nursery-storage',
      storage: createJSONStorage(() => localStorage), 
       onRehydrateStorage: () => (state) => {
        state?.setHydration(true)
      },
    }
  )
);