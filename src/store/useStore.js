import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultJobs = [
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

  // --- CLEANER / CLEANING ---
  { id: 40, title: 'Deep home cleaning', customer: 'Karishma Kapoor', distance: '1.2 km', time: 'Today, 2:00 PM', price: '₹2,400', status: 'pending', address: 'B-1202, Oberoi Towers, Goregaon', category: 'Cleaner' },
  { id: 41, title: 'Sofa and carpet shampooing', customer: 'Sushmita Sen', distance: '3.0 km', time: 'Tomorrow, 10:00 AM', price: '₹700', status: 'pending', address: 'Beach Haven, Versova', category: 'Cleaner' },
  { id: 42, title: 'Kitchen deep cleaning', customer: 'Madhuri Dixit', distance: '2.5 km', time: 'Today, 4:00 PM', price: '₹1,000', status: 'accepted', address: 'Palazzo, Kemps Corner', category: 'Cleaner' },
  { id: 43, title: 'Bathroom floor cleaning', customer: 'Rekha Ji', distance: '1.8 km', time: 'Yesterday, 3:00 PM', price: '₹350', status: 'completed', address: 'Basera, Bandra West', category: 'Cleaner' },

  // --- AC SERVICE ---
  { id: 50, title: 'AC Filter cleaning & service', customer: 'Aishwarya Rai', distance: '2.0 km', time: 'Today, 3:00 PM', price: '₹400', status: 'pending', address: 'Jhanvi, Juhu Scheme', category: 'AC Service' },
  { id: 51, title: 'AC Gas leakage repair', customer: 'Katrina Kaif', distance: '4.2 km', time: 'Tomorrow, 11:30 AM', price: '₹1,500', status: 'pending', address: 'Mourya House, Andheri West', category: 'AC Service' },
  { id: 52, title: 'Split AC installation', customer: 'Priyanka Chopra', distance: '3.6 km', time: 'Today, 1:00 PM', price: '₹1,200', status: 'accepted', address: 'Raj Classic, Versova', category: 'AC Service' },
  { id: 53, title: 'AC compressor replacement', customer: 'Kareena Kapoor', distance: '2.4 km', time: 'Yesterday, 2:00 PM', price: '₹3,500', status: 'completed', address: 'Fortune Heights, Bandra', category: 'AC Service' },

  // --- GARDENER / GARDENING ---
  { id: 60, title: 'Lawn mowing & trimming', customer: 'Salman Khan', distance: '5.0 km', time: 'Today, 9:00 AM', price: '₹300', status: 'pending', address: 'Galaxy Apartments, Bandstand', category: 'Gardener' },
  { id: 61, title: 'Garden soil prep & planting', customer: 'Aamir Khan', distance: '3.8 km', time: 'Tomorrow, 8:00 AM', price: '₹800', status: 'pending', address: 'Bella Vista, Bandra West', category: 'Gardener' },
  { id: 62, title: 'Balcony garden vertical setup', customer: 'Saif Ali Khan', distance: '2.1 km', time: 'Today, 5:00 PM', price: '₹2,000', status: 'accepted', address: 'Satguru Sharan, Bandra', category: 'Gardener' },
  { id: 63, title: 'Tree pruning & leaf clearing', customer: 'Hrithik Roshan', distance: '1.9 km', time: 'Yesterday, 11:00 AM', price: '₹400', status: 'completed', address: 'El Palazzo, Juhu', category: 'Gardener' },

  // --- OTHER ---
  { id: 70, title: 'Helper for packing & loading', customer: 'John Abraham', distance: '1.5 km', time: 'Today, 10:00 AM', price: '₹800', status: 'pending', address: 'Ashiyana, Bandra', category: 'Other' },
  { id: 71, title: 'General household helper', customer: 'Sanjay Dutt', distance: '2.3 km', time: 'Tomorrow, 3:00 PM', price: '₹500', status: 'pending', address: 'Imperial Heights, Pali Hill', category: 'Other' },
  { id: 72, title: 'Home furniture moving', customer: 'Tiger Shroff', distance: '3.1 km', time: 'Today, 2:30 PM', price: '₹600', status: 'accepted', address: 'Rustomjee Elements, Juhu', category: 'Other' },
  { id: 73, title: 'Package delivery assistance', customer: 'Varun Dhawan', distance: '2.7 km', time: 'Yesterday, 5:00 PM', price: '₹300', status: 'completed', address: 'Praneta Apartments, Juhu', category: 'Other' },
];

const defaultReviews = [
  { id: 'rev-1', workerId: 1, customerName: 'Amit Patel', rating: 5, text: 'Ramesh was extremely professional and fixed our water tank issue very quickly. Highly recommended!', date: 'May 30, 2026' },
  { id: 'rev-2', workerId: 1, customerName: 'Suresh Mehta', rating: 4, text: 'Good quality plumbing work. Arrived on time.', date: 'May 24, 2026' },
  { id: 'rev-3', workerId: 2, customerName: 'Karan Johar', rating: 5, text: 'Suresh did a fantastic job with the smart switchboards. Very clean wiring work.', date: 'May 29, 2026' },
];

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
      jobs: defaultJobs,
      setJobs: (jobs) => set({ jobs }),
      updateJobStatus: (id, status) => set((state) => ({
        jobs: state.jobs.map((j) => j.id === id ? { ...j, status } : j)
      })),
      declineJob: (id) => set((state) => ({
        jobs: state.jobs.filter((j) => j.id !== id)
      })),

      // Global Reviews State
      reviews: defaultReviews,
      setReviews: (reviews) => set({ reviews }),
      addReview: (review) => set((state) => ({
        reviews: [review, ...(state.reviews || [])]
      })),
    }),
    {
      name: 'user-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
          // If the hydrated state has an empty or missing jobs list, populate it with our defaults
          if (!state.jobs || state.jobs.length === 0) {
            state.setJobs(defaultJobs);
          }
          // Populate reviews default if missing
          if (!state.reviews || state.reviews.length === 0) {
            state.setReviews(defaultReviews);
          }
        }
      },
    }
  )
);

export default useStore;