import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types'; 

interface AppState {
  user: User | null;         
  wishlist: string[];
  cart: any[];
  darkMode: boolean;
  setUser: (user: User) => void;   
  logout: () => void;              
  addToWishlist: (id: string) => void;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      wishlist: [],
      cart: [],
      darkMode: true,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, wishlist: [], cart: [] }),
      addToWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.includes(id)
            ? state.wishlist.filter((i) => i !== id)
            : [...state.wishlist, id],
        })),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    { name: 'etech-storage' }
  )
);