import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  user: any | null;
  menu: any | null;
  // token: string | null;
  organization: any | null;
  businessTypes: any | null;
  categories: any | null;
  masterCategories: any|null;
  isLoading: boolean;
  hasHydrated: boolean;
  stocks: any | null;
  plants: any | null;
  isLoggedin: boolean;
  setUser: (user: any) => void;
  // setToken: (token: string) => void;
  setMenu: (menu: any) => void;
  setBusinessTypes: (businessTypes: any) => void;
  setCategories: (categories: any) => void;
  setOrganization: (organization: any) => void;
  setLoading: (isLoading: boolean) => void;
  setHydration: (hasHydrated: boolean) => void;
  setStocks: (stocks: any) => void;
  setPlants: (plants: any)=> void;
  setMasterCategories: (masterCategories: any)=> void;
  setLoggedIn : (isLoggedin: boolean)=> void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      // token: null,
      menu: null,
      organization: null,
      businessTypes: null,
      categories: null,
      isLoading: false,
      hasHydrated: false,
      stocks: null,
      plants: null,
      masterCategories: null,
      isLoggedin: false,
      setUser: (user) => set({ user }),
      // setToken: (token) => set({ token }),
      setMenu: (menu) => set({ menu }),
      setOrganization: (organization) => set({ organization }),
      setBusinessTypes: (businessTypes) => set({ businessTypes }),
      setCategories: (categories) => set({ categories }),
      setLoading: (isLoading) => set({ isLoading }),
      setHydration: (hasHydrated) => set({ hasHydrated }),
      setStocks: (stocks)=> set({stocks}),
      setPlants: (plants)=> set({plants}),
      setMasterCategories: (masterCategories)=> set({masterCategories}),
      setLoggedIn: (isLoggedin)=> set({isLoggedin})
    }),
    {
      name: 'nursery-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["isLoading", "hasHydrated"].includes(key)
          )
        ) as AppState,
      onRehydrateStorage: () => (state) => {
        state?.setHydration(true)
      },
    }
  )
);