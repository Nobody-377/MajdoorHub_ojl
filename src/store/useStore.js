import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create(
  persist(
    (set, get) => ({
      user: null, // { uid, role: 'customer' | 'worker', phone }
      usersLogs: [],
      setUser: (user) => {
        if (!user || !user.phone) {
          set({ user });
          return;
        }
        const currentLogs = get().usersLogs || [];
        const cleanedLogs = currentLogs.filter((u) => u.phone !== user.phone);
        set({
          user,
          usersLogs: [...cleanedLogs, user]
        });
      },
      role: null,
      setRole: (role) => set({ role }),
      isAuthenticated: false,
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      hydrated: false,
      setHydrated: (status) => set({ hydrated: status }),
    }),
    {
      name: 'user-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);

export default useStore;