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
        const currentUser = get().user;
        const currentLogs = get().usersLogs || [];
        const cleanedLogs = currentLogs.filter((u) => 
          u.phone !== user.phone && 
          (!currentUser || u.phone !== currentUser.phone)
        );
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
      
      // Global Jobs State
      jobs: [
        // --- PLUMBER / PLUMBING ---
        { id: 1, title: 'Water tank installation', customer: 'Vikram Singh', distance: '2.5 km', time: 'Today, 2:00 PM', price: '₹600', status: 'pending', address: 'B-402, Green Park Society, Link Road, Andheri', category: 'Plumber' },
        { id: 2, title: 'Kitchen sink repair', customer: 'Meera Patel', distance: '4.1 km', time: 'Tomorrow, 10:00 AM', price: '₹300', status: 'pending', address: 'A-102, Sunshine Apartments, Bandra', category: 'Plumber' },
        { id: 3, title: 'Full home plumbing check', customer: 'Rajesh Gupta', distance: '1.8 km', time: 'Tomorrow, 4:00 PM', price: '₹1,200', status: 'pending', address: 'Plot 42, Juhu Beach Road, Juhu', category: 'Plumber' },
        { id: 4, title: 'Bathroom tap replacement', customer: 'Sita Ram', distance: '0.8 km', time: 'Today, 6:00 PM', price: '₹250', status: 'pending', address: 'Room 12, Chawl No. 4, Dharavi', category: 'Plumber' },
        { id: 5, title: 'Gas geyser installation', customer: 'Nitin Shah', distance: '3.5 km', time: 'June 03, 11:00 AM', price: '₹800', status: 'pending', address: 'Sagar Bungalow, Malabar Hill', category: 'Plumber' },
        { id: 6, title: 'Toilet flush valve repair', customer: 'Rahul Sharma', distance: '1.5 km', time: 'Today, 1:00 PM', price: '₹400', status: 'accepted', address: 'Flat 10, Ashoka Apartments, Nepean Sea Road', category: 'Plumber' },
        { id: 7, title: 'Shower mixer leakage', customer: 'Priya Dutt', distance: '2.9 km', time: 'Today, 3:30 PM', price: '₹550', status: 'accepted', address: 'Sea Breeze, Carter Road, Bandra', category: 'Plumber' },
        { id: 8, title: 'Drain block removal', customer: 'Devendra Fadnavis', distance: '2.2 km', time: 'May 30, 2:00 PM', price: '₹350', status: 'completed', address: 'Sagar, Malabar Hill', category: 'Plumber' },

        // --- ELECTRICIAN / ELECTRICAL ---
        { id: 10, title: 'Ceiling fan installation', customer: 'Harish Mehta', distance: '1.2 km', time: 'Today, 3:00 PM', price: '₹200', status: 'pending', address: '12B, Sea Green Building, Worli', category: 'Electrician' },
        { id: 11, title: 'Short circuit troubleshooting', customer: 'Girish Karnad', distance: '3.4 km', time: 'Today, 5:30 PM', price: '₹500', status: 'pending', address: 'B-702, Raheja Gardens, Thane', category: 'Electrician' },
        { id: 12, title: 'Smart switchboard set up', customer: 'Karan Johar', distance: '2.0 km', time: 'Tomorrow, 11:00 AM', price: '₹950', status: 'pending', address: 'La Mer, Bandra West', category: 'Electrician' },
        { id: 13, title: 'Water pump wiring repair', customer: 'Sunil Gavaskar', distance: '5.0 km', time: 'Yesterday, 4:00 PM', price: '₹900', status: 'completed', address: 'Sunny Ville, Worli', category: 'Electrician' },
        { id: 14, title: 'AC power point installation', customer: 'Anil Ambani', distance: '4.8 km', time: 'Today, 4:00 PM', price: '₹450', status: 'accepted', address: 'Seawind, Cuffe Parade', category: 'Electrician' },

        // --- CARPENTER / CARPENTRY ---
        { id: 20, title: 'Wooden door hinge repair', customer: 'Kapil Dev', distance: '0.9 km', time: 'Today, 1:30 PM', price: '₹250', status: 'pending', address: 'Room 5, Building 2, Shivaji Park', category: 'Carpenter' },
        { id: 21, title: 'Modular kitchen door adjustment', customer: 'Sachin Tendulkar', distance: '2.7 km', time: 'Tomorrow, 2:00 PM', price: '₹1,200', status: 'pending', address: '19-A, Perry Cross Road, Bandra', category: 'Carpenter' },
        { id: 22, title: 'Sofa cushion & fabric polish', customer: 'Alia Bhatt', distance: '1.5 km', time: 'Today, 4:30 PM', price: '₹2,500', status: 'accepted', address: 'Silver Sands, Juhu', category: 'Carpenter' },
        { id: 23, title: 'Bed frame assembly', customer: 'Virat Kohli', distance: '3.8 km', time: 'Yesterday, 10:00 AM', price: '₹1,500', status: 'completed', address: 'Omkar 1973, Worli', category: 'Carpenter' },

        // --- PAINTER / PAINTING ---
        { id: 30, title: 'Single wall textured painting', customer: 'Ranbir Kapoor', distance: '1.8 km', time: 'Today, 11:00 AM', price: '₹1,800', status: 'pending', address: 'Vastu, Pali Hill, Bandra', category: 'Painter' },
        { id: 31, title: 'Waterproofing & balcony paint', customer: 'Deepika Padukone', distance: '3.2 km', time: 'Tomorrow, 9:00 AM', price: '₹4,500', status: 'pending', address: 'Beaulieu, Prabhadevi', category: 'Painter' },
        { id: 32, title: 'Living room full touch-up', customer: 'Shah Rukh Khan', distance: '4.5 km', time: 'Today, 12:00 PM', price: '₹5,000', status: 'accepted', address: 'Mannat, Bandstand, Bandra', category: 'Painter' },
        { id: 33, title: 'Door & window frame painting', customer: 'Amitabh Bachchan', distance: '2.1 km', time: 'Yesterday, 1:00 PM', price: '₹1,500', status: 'completed', address: 'Jalsa, Juhu Scheme, Juhu', category: 'Painter' },
      ],
      setJobs: (jobs) => set({ jobs }),
      updateJobStatus: (id, status) => set((state) => ({
        jobs: state.jobs.map((j) => j.id === id ? { ...j, status } : j)
      })),
      declineJob: (id) => set((state) => ({
        jobs: state.jobs.filter((j) => j.id !== id)
      })),
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