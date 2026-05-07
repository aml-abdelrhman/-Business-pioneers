import { User } from "@/types";
import { create } from "zustand";

interface StoreProps {
  user: User | null;
  setUser: (user: User) => void;
}

export const useStore = create<StoreProps>((set) => ({
  user: null,

  setUser: (user) =>
    set(() => ({
      user,
    })),
}));
