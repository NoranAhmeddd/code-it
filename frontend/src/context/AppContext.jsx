import { createContext, useContext, useReducer, useEffect } from 'react';

const MOCK_STUDENT = {
  id: 'u1',
  username: 'tourist',
  displayName: 'Gennady Korotkevich',
  email: 'tourist@cp.dev',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  country: 'Belarus',
  university: 'ITMO University',
  rating: 3822,
  maxRating: 3979,
  rank: 'Legendary Grandmaster',
  globalRank: 1,
  problemsSolved: 2847,
  contestsParticipated: 312,
  streak: 47,
  joinedDate: '2019-03-15',
  friends: ['jiangly', 'ksun48', 'Um_nik', 'Benq'],
};

const MOCK_TEACHER = {
  id: 't1',
  username: 'prof_algorithms',
  displayName: 'Dr. Ahmed Hassan',
  email: 'ahmed@cp.dev',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  country: 'Egypt',
  university: 'Cairo University',
  rating: 2100,
  maxRating: 2350,
  rank: 'Master',
  totalStudents: 234,
  coursesCreated: 5,
  friends: ['tourist', 'Petar_CP'],
};

const MOCK_ADMIN = {
  id: 'a1',
  username: 'admin',
  displayName: 'Platform Admin',
  email: 'admin@cp.dev',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  role: 'admin',
  rating: null,
  friends: [],
};

const USER_MAP = {
  student: MOCK_STUDENT,
  teacher: MOCK_TEACHER,
  admin: MOCK_ADMIN,
};

const savedPlatformMode = typeof window !== 'undefined' ? localStorage.getItem('cp_platform_mode') || 'competitive' : 'competitive';

const initialState = {
  platformMode: savedPlatformMode, // 'competitive' | 'education'
  currentUser: MOCK_STUDENT,
  userRole: 'student',
  sidebarOpen: true,
  notifications: [
    { id: 'notif-1', title: 'Contest Announcement', body: 'CodeArena Global Round 42 begins in 1 hour.', read: false },
    { id: 'notif-2', title: 'Problem 1A Accepted', body: 'Your submission passed all tests in 78ms.', read: false }
  ],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PLATFORM_MODE':
      if (typeof window !== 'undefined') {
        localStorage.setItem('cp_platform_mode', action.payload);
      }
      return {
        ...state,
        platformMode: action.payload,
      };
    case 'SET_ROLE':
      return {
        ...state,
        userRole: action.payload,
        currentUser: USER_MAP[action.payload] || MOCK_STUDENT,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...action.payload,
        },
      };
    case 'TOGGLE_FRIEND': {
      const targetHandle = action.payload;
      const currentFriends = state.currentUser.friends || [];
      const hasFriend = currentFriends.includes(targetHandle);
      const newFriends = hasFriend
        ? currentFriends.filter((f) => f !== targetHandle)
        : [...currentFriends, targetHandle];
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          friends: newFriends,
        },
      };
    }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setPlatformMode = (mode) => dispatch({ type: 'SET_PLATFORM_MODE', payload: mode });
  const setRole = (role) => dispatch({ type: 'SET_ROLE', payload: role });
  const updateProfile = (data) => dispatch({ type: 'UPDATE_PROFILE', payload: data });
  const toggleFriend = (handle) => dispatch({ type: 'TOGGLE_FRIEND', payload: handle });
  const toggleSidebar = () => dispatch({ type: 'TOGGLE_SIDEBAR' });
  const setSidebar = (open) => dispatch({ type: 'SET_SIDEBAR', payload: open });
  const addNotification = (notif) => dispatch({ type: 'ADD_NOTIFICATION', payload: notif });

  const value = {
    ...state,
    setPlatformMode,
    setRole,
    updateProfile,
    toggleFriend,
    toggleSidebar,
    setSidebar,
    addNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
