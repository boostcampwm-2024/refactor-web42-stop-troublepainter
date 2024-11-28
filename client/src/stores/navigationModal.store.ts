import { create } from 'zustand';

interface NavigationModalStore {
  isOpen: boolean;
  actions: {
    openModal: () => void;
    closeModal: () => void;
  };
}

export const useNavigationModalStore = create<NavigationModalStore>((set) => ({
  isOpen: false,
  actions: {
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
  },
}));
