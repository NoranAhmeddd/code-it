import { createContext, useContext, useReducer, useEffect } from "react";
import mockData, {
  users as initialUsers,
  problems as initialProblems,
  contests as initialContests,
  submissions as initialSubmissions,
  blogs as initialBlogs,
  contributedDivs as initialContributedDivs,
  contributedProblems as initialContributedProblems,
} from "../data/mockData";

const MOCK_STUDENT = {
  id: "u1",
  username: "tourist",
  displayName: "Gennady Korotkevich",
  email: "tourist@cp.dev",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  country: "Belarus",
  flag: "🇧🇾",
  university: "ITMO University",
  rating: 3822,
  maxRating: 3979,
  rank: "Legendary Grandmaster",
  globalRank: 1,
  problemsSolved: 2847,
  contestsParticipated: 312,
  streak: 47,
  joinedDate: "2019-03-15",
  friends: ["jiangly", "ksun48", "Um_nik", "Benq"],
  bio: "Competitive programmer. Multiple ACM-ICPC and Google Code Jam champion.",
  contribution: 148,
  hideFriendsAdded: false,
  hideWhoAddedMe: false,
};

const MOCK_TEACHER = {
  id: "t1",
  username: "prof_algorithms",
  displayName: "Dr. Ahmed Hassan",
  email: "ahmed@cp.dev",
  avatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  country: "Egypt",
  flag: "🇪🇬",
  university: "Cairo University",
  rating: 2100,
  maxRating: 2350,
  rank: "Master",
  totalStudents: 234,
  coursesCreated: 5,
  friends: ["tourist", "Petar_CP"],
  bio: "Algorithms professor & competitive programming coach.",
  contribution: 82,
};

const MOCK_ADMIN = {
  id: "a1",
  username: "admin",
  displayName: "Platform Admin",
  email: "admin@cp.dev",
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  role: "admin",
  rating: 3000,
  maxRating: 3000,
  rank: "Legendary Grandmaster",
  country: "International",
  flag: "🌐",
  university: "CodeArena Operations Team",
  friends: ["tourist", "jiangly", "prof_algorithms"],
  bio: "Lead system administrator and problem curator.",
  contribution: 512,
  joinedDate: "2018-01-01",
};

const USER_MAP = {
  student: MOCK_STUDENT,
  teacher: MOCK_TEACHER,
  admin: MOCK_ADMIN,
};

const savedPlatformMode =
  typeof window !== "undefined"
    ? localStorage.getItem("cp_platform_mode") || "competitive"
    : "competitive";

const initialState = {
  platformMode: savedPlatformMode, // 'competitive' | 'education'
  currentUser: MOCK_STUDENT,
  userRole: "student",
  sidebarOpen: true,
  favorites: ["1A", "3A"],
  submissions: initialSubmissions || [],
  blogs: initialBlogs || [],
  contributedDivs: initialContributedDivs || [],
  contributedProblems: initialContributedProblems || [],
  contests: initialContests || [],
  problems: initialProblems || [],
  users: initialUsers || [],
  notifications: [
    {
      id: "notif-1",
      title: "Contest Announcement",
      body: "CodeArena Global Round 42 begins in 1 hour.",
      read: false,
    },
    {
      id: "notif-2",
      title: "Problem 1A Accepted",
      body: "Your submission passed all tests in 78ms.",
      read: false,
    },
  ],
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_PLATFORM_MODE":
      if (typeof window !== "undefined") {
        localStorage.setItem("cp_platform_mode", action.payload);
      }
      return {
        ...state,
        platformMode: action.payload,
      };
    case "SET_ROLE":
      return {
        ...state,
        userRole: action.payload,
        currentUser: USER_MAP[action.payload] || MOCK_STUDENT,
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...action.payload,
        },
      };
    case "TOGGLE_FRIEND": {
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
    case "TOGGLE_FAVORITE": {
      const probId = action.payload;
      const current = state.favorites || [];
      const exists = current.includes(probId);
      const newFavorites = exists ? current.filter((id) => id !== probId) : [...current, probId];
      return {
        ...state,
        favorites: newFavorites,
      };
    }
    case "ADD_SUBMISSION": {
      const newSub = action.payload;
      return {
        ...state,
        submissions: [newSub, ...state.submissions],
      };
    }
    case "SUBMIT_BLOG": {
      return {
        ...state,
        blogs: [action.payload, ...state.blogs],
      };
    }
    case "APPROVE_BLOG": {
      const blogId = action.payload;
      return {
        ...state,
        blogs: state.blogs.map((b) => (b.id === blogId ? { ...b, status: "approved" } : b)),
      };
    }
    case "REJECT_BLOG": {
      const blogId = action.payload;
      return {
        ...state,
        blogs: state.blogs.map((b) => (b.id === blogId ? { ...b, status: "rejected" } : b)),
      };
    }
    case "ADD_BLOG_COMMENT": {
      const { blogId, comment } = action.payload;
      return {
        ...state,
        blogs: state.blogs.map((b) => {
          if (b.id !== blogId) return b;
          const comments = b.comments || [];
          return {
            ...b,
            commentsCount: (b.commentsCount || 0) + 1,
            comments: [comment, ...comments],
          };
        }),
      };
    }
    case "SUBMIT_CONTRIBUTED_PROBLEM": {
      return {
        ...state,
        contributedProblems: [action.payload, ...state.contributedProblems],
      };
    }
    case "APPROVE_CONTRIBUTED_PROBLEM": {
      const probId = action.payload;
      const targetProb = state.contributedProblems.find((p) => p.id === probId);
      const updatedList = state.contributedProblems.map((p) =>
        p.id === probId ? { ...p, status: "approved" } : p,
      );
      // Also add to public problems list if not already present
      const alreadyInProblems = state.problems.some((p) => p.id === probId);
      const newProblems =
        !alreadyInProblems && targetProb
          ? [
              {
                id: targetProb.id,
                title: targetProb.title,
                rating: targetProb.difficulty,
                tags: targetProb.tags || ["ad-hoc"],
                timeLimit: targetProb.timeLimit || "2.0s",
                memoryLimit: targetProb.memoryLimit || "256MB",
                author: targetProb.author,
                solvedCount: 0,
                description: targetProb.statement,
              },
              ...state.problems,
            ]
          : state.problems;
      return {
        ...state,
        contributedProblems: updatedList,
        problems: newProblems,
      };
    }
    case "REJECT_CONTRIBUTED_PROBLEM": {
      return {
        ...state,
        contributedProblems: state.contributedProblems.map((p) =>
          p.id === action.payload ? { ...p, status: "rejected" } : p,
        ),
      };
    }
    case "SUBMIT_CONTRIBUTED_DIV": {
      return {
        ...state,
        contributedDivs: [action.payload, ...state.contributedDivs],
      };
    }
    case "APPROVE_CONTRIBUTED_DIV": {
      const divId = action.payload;
      const targetDiv = state.contributedDivs.find((d) => d.id === divId);
      const updatedDivs = state.contributedDivs.map((d) =>
        d.id === divId ? { ...d, status: "approved" } : d,
      );
      // Also add to active/upcoming contests list
      const alreadyInContests = state.contests.some((c) => c.id === divId);
      const newContests =
        !alreadyInContests && targetDiv
          ? [
              {
                id: targetDiv.id,
                name: targetDiv.name,
                type: targetDiv.divLevel,
                status: "upcoming",
                startTime:
                  targetDiv.scheduledDate || new Date(Date.now() + 86400000 * 3).toISOString(),
                duration: 7200000,
                problems: targetDiv.problems || ["1A", "2A", "3A"],
                participantCount: 0,
                rated: true,
                description: targetDiv.description,
                registered: false,
              },
              ...state.contests,
            ]
          : state.contests;
      return {
        ...state,
        contributedDivs: updatedDivs,
        contests: newContests,
      };
    }
    case "REJECT_CONTRIBUTED_DIV": {
      return {
        ...state,
        contributedDivs: state.contributedDivs.map((d) =>
          d.id === action.payload ? { ...d, status: "rejected" } : d,
        ),
      };
    }
    case "TOGGLE_BAN_USER": {
      const userId = action.payload;
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === userId ? { ...u, status: u.status === "banned" ? "active" : "banned" } : u,
        ),
      };
    }
    case "UPDATE_USER_ROLE": {
      const { userId, role } = action.payload;
      return {
        ...state,
        users: state.users.map((u) => (u.id === userId ? { ...u, role } : u)),
      };
    }
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "SET_SIDEBAR":
      return { ...state, sidebarOpen: action.payload };
    case "SET_NOTIFICATIONS":
      return { ...state, notifications: action.payload };
    case "ADD_NOTIFICATION":
      return { ...state, notifications: [action.payload, ...state.notifications] };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setPlatformMode = (mode) => dispatch({ type: "SET_PLATFORM_MODE", payload: mode });
  const setRole = (role) => dispatch({ type: "SET_ROLE", payload: role });
  const updateProfile = (data) => dispatch({ type: "UPDATE_PROFILE", payload: data });
  const toggleFriend = (handle) => dispatch({ type: "TOGGLE_FRIEND", payload: handle });
  const toggleFavorite = (probId) => dispatch({ type: "TOGGLE_FAVORITE", payload: probId });
  const addSubmission = (sub) => dispatch({ type: "ADD_SUBMISSION", payload: sub });

  // Blogs
  const submitBlog = (blog) => dispatch({ type: "SUBMIT_BLOG", payload: blog });
  const approveBlog = (id) => dispatch({ type: "APPROVE_BLOG", payload: id });
  const rejectBlog = (id) => dispatch({ type: "REJECT_BLOG", payload: id });
  const addBlogComment = (blogId, comment) =>
    dispatch({ type: "ADD_BLOG_COMMENT", payload: { blogId, comment } });

  // Contributions
  const submitProblem = (prob) => dispatch({ type: "SUBMIT_CONTRIBUTED_PROBLEM", payload: prob });
  const approveProblem = (id) => dispatch({ type: "APPROVE_CONTRIBUTED_PROBLEM", payload: id });
  const rejectProblem = (id) => dispatch({ type: "REJECT_CONTRIBUTED_PROBLEM", payload: id });

  const submitDiv = (div) => dispatch({ type: "SUBMIT_CONTRIBUTED_DIV", payload: div });
  const approveDiv = (id) => dispatch({ type: "APPROVE_CONTRIBUTED_DIV", payload: id });
  const rejectDiv = (id) => dispatch({ type: "REJECT_CONTRIBUTED_DIV", payload: id });

  // Admin User controls
  const toggleBanUser = (userId) => dispatch({ type: "TOGGLE_BAN_USER", payload: userId });
  const updateUserRole = (userId, role) =>
    dispatch({ type: "UPDATE_USER_ROLE", payload: { userId, role } });

  const toggleSidebar = () => dispatch({ type: "TOGGLE_SIDEBAR" });
  const setSidebar = (open) => dispatch({ type: "SET_SIDEBAR", payload: open });
  const addNotification = (notif) => dispatch({ type: "ADD_NOTIFICATION", payload: notif });

  const changePassword = (oldPass, newPass) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!oldPass) {
          reject(new Error("Current password is required."));
        } else if (newPass.length < 6) {
          reject(new Error("New password must be at least 6 characters."));
        } else {
          resolve({ success: true });
        }
      }, 500);
    });
  };

  const value = {
    ...state,
    setPlatformMode,
    setRole,
    updateProfile,
    toggleFriend,
    toggleFavorite,
    addSubmission,
    submitBlog,
    approveBlog,
    rejectBlog,
    addBlogComment,
    submitProblem,
    approveProblem,
    rejectProblem,
    submitDiv,
    approveDiv,
    rejectDiv,
    toggleBanUser,
    updateUserRole,
    changePassword,
    toggleSidebar,
    setSidebar,
    addNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
