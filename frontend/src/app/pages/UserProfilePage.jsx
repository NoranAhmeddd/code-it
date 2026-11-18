import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams, Link } from "@/app/router-compat";
import mockData from "../data/mockData";
import {
  getRatingColor,
  formatDate,
  formatRelativeTime,
  getVerdictColor,
  getVerdictLabel,
} from "../utils/helpers";
import { useApp } from "../context/AppContext";
import CodeViewerModal from "../components/CodeViewerModal";
import { COUNTRIES, CountryFlag, getCountryFlag } from "../data/countries";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Camera,
  UserPlus,
  UserCheck,
  Check,
  X,
  Trophy,
  Flame,
  Award,
  Settings,
  Star,
  FileCode,
  Calendar,
  Lock,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  Copy,
  TrendingUp,
  Globe,
  School,
  Mail,
  Users,
  Search,
  Upload,
  Sparkles,
  Shield,
  User as UserIcon,
} from "lucide-react";

// Generates 52 weeks (364 days) of activity heatmap data
function generateYearlyActivity(totalSolved = 2847, streakDays = 47) {
  const days = [];
  const today = new Date();
  const dayCount = 52 * 7; // 364 days

  for (let i = dayCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    // Give higher activity in recent streak days
    let count = 0;
    if (i < streakDays) {
      count = Math.floor(3 + Math.random() * 8); // Active streak
    } else {
      const activeChance = Math.random();
      if (activeChance > 0.4) {
        count = Math.floor(1 + Math.random() * 9);
      }
    }

    let level = 0;
    if (count >= 8) level = 4;
    else if (count >= 5) level = 3;
    else if (count >= 3) level = 2;
    else if (count >= 1) level = 1;

    days.push({
      date: dateStr,
      count,
      level,
      dayOfWeek: d.getDay(),
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      formattedDate: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });
  }
  return days;
}

// Custom High-Contrast Tooltip for Rating Distribution
function CustomDistributionTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border-2 border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md min-w-[170px] space-y-1.5 z-50">
        <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-1.5">
          <span className="text-slate-400">Rating Tier:</span>
          <span
            className="font-bold px-2 py-0.5 rounded text-xs"
            style={{ backgroundColor: `${data.color}20`, color: data.color }}
          >
            {data.rating}
          </span>
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-medium">Problems Solved</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5 drop-shadow-sm">
            {data.count.toLocaleString()}
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function UserProfilePage() {
  const { username } = useParams();
  // Using key={username || 'me'} forces React to cleanly unmount and remount a fresh
  // instance when navigating between profiles. This prevents stale state or profile flash.
  return <UserProfileContent key={username || "me"} username={username} />;
}

function UserProfileContent({ username }) {
  const {
    currentUser,
    updateProfile,
    toggleFriend,
    favorites,
    toggleFavorite,
    submissions: globalSubmissions,
    problems: allProblemsList,
    changePassword,
  } = useApp();

  const targetUser = useMemo(() => {
    if (currentUser && currentUser.username === username) return currentUser;
    const found = mockData.users.find((u) => u.username === username);
    if (found) return found;
    return {
      id: `u-${username}`,
      username: username || "tourist",
      displayName: username || "Competitor",
      rating: 2400,
      maxRating: 2550,
      rank: "Grandmaster",
      country: "International",
      flag: "🌐",
      avatar: null,
      university: "Independent Competitive Programmer",
      bio: "Competitive programming enthusiast and algorithm solver.",
      problemsSolved: 650,
      contestsParticipated: 42,
      streak: 15,
      joinedDate: "2023-01-10",
      friends: ["tourist", "jiangly"],
      followers: ["tourist"],
      contribution: 35,
    };
  }, [username, currentUser]);

  const isSelf = currentUser && currentUser.username === targetUser.username;
  const user = isSelf ? currentUser : targetUser;

  // Active section tab: starts cleanly on 'main' for every profile
  const [activeTab, setActiveTab] = useState("main");

  // Friends Sub-tab: 'following' (who user added) | 'followers' (who added user)
  const [friendsSubTab, setFriendsSubTab] = useState("following");

  // Ensure private tabs (Settings & Security, Favorites) are never active on other users' profiles
  useEffect(() => {
    if (!isSelf && (activeTab === "settings" || activeTab === "favorites")) {
      setActiveTab("main");
    }
  }, [isSelf, activeTab]);

  // Heatmap tooltip state
  const [hoveredDay, setHoveredDay] = useState(null);

  // File input refs for uploading photos from computer
  const fileInputRef = useRef(null);
  const settingsFileInputRef = useRef(null);

  // Settings form state
  const [settingsHandle, setSettingsHandle] = useState(user.username || "");
  const [settingsName, setSettingsName] = useState(user.displayName || "");
  const [settingsEmail, setSettingsEmail] = useState(user.email || "tourist@cp.dev");
  const [settingsCountry, setSettingsCountry] = useState(user.country || "Belarus");
  const [settingsFlag, setSettingsFlag] = useState(user.flag || "🇧🇾");
  const [settingsUniversity, setSettingsUniversity] = useState(
    user.university || "ITMO University",
  );
  const [settingsBio, setSettingsBio] = useState(
    user.bio || "Competitive programmer & algorithm enthusiast.",
  );
  const [settingsAvatar, setSettingsAvatar] = useState(
    user.avatar ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  );

  // Privacy checkboxes state (Block everyone from seeing friends I added / who added me)
  const [hideFriendsAdded, setHideFriendsAdded] = useState(Boolean(user.hideFriendsAdded));
  const [hideWhoAddedMe, setHideWhoAddedMe] = useState(Boolean(user.hideWhoAddedMe));

  // Friends search and add state
  const [friendSearch, setFriendSearch] = useState("");
  const [newFriendHandle, setNewFriendHandle] = useState("");
  const [friendActionMsg, setFriendActionMsg] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");

  // Submissions filters and modal
  const [verdictFilter, setVerdictFilter] = useState("ALL");
  const [selectedSubmissionCode, setSelectedSubmissionCode] = useState(null);

  const isFriend = currentUser?.friends?.includes(user.username);

  // Handle direct file upload from PC
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (PNG, JPG, WebP, etc.).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setSettingsAvatar(dataUrl);
      if (isSelf) {
        updateProfile({ avatar: dataUrl });
      }
      setProfileSuccessMsg("Profile photo updated successfully from local file!");
      setTimeout(() => setProfileSuccessMsg(""), 4000);
    };
    reader.readAsDataURL(file);
  };

  // Submissions for this user
  const userSubmissions = useMemo(() => {
    const list = globalSubmissions || mockData.submissions;
    return list.filter((s) => s.username === user.username || s.userId === user.id || isSelf);
  }, [globalSubmissions, user.username, user.id, isSelf]);

  const filteredSubmissions = useMemo(() => {
    if (verdictFilter === "ALL") return userSubmissions;
    return userSubmissions.filter((s) => s.verdict === verdictFilter);
  }, [userSubmissions, verdictFilter]);

  // Favorite problems full objects
  const favoriteProblemsList = useMemo(() => {
    const pList = allProblemsList?.length ? allProblemsList : mockData.problems;
    return pList.filter((p) => favorites?.includes(p.id));
  }, [allProblemsList, favorites]);

  // Heatmap dataset
  const heatmapDays = useMemo(
    () => generateYearlyActivity(user.problemsSolved, user.streak),
    [user.problemsSolved, user.streak],
  );

  // Helper to map handles to full user objects
  const mapHandlesToUsers = (handles) => {
    return (handles || []).map((h) => {
      const found = mockData.users.find((u) => u.username === h);
      return (
        found || {
          id: `u-${h}`,
          username: h,
          displayName: h,
          rating: 3200,
          rank: "Grandmaster",
          country: "International",
          flag: "🌐",
          avatar: null,
          problemsSolved: 1450,
          streak: 12,
        }
      );
    });
  };

  // 1. Friends THIS user added ("Following")
  const userFollowingList = useMemo(() => {
    const handles = isSelf
      ? currentUser?.friends || []
      : targetUser?.friends || ["tourist", "jiangly", "Benq"];
    return mapHandlesToUsers(handles);
  }, [isSelf, currentUser?.friends, targetUser?.friends]);

  // 2. Users WHO ADDED this user as a friend ("Followers")
  const userFollowersList = useMemo(() => {
    // Find all users where (u.friends || []).includes(user.username)
    const directFollowers = mockData.users
      .filter((u) => (u.friends || []).includes(user.username) && u.username !== user.username)
      .map((u) => u.username);

    // Also include any followers listed in targetUser.followers
    const fallbackFollowers = targetUser.followers || ["tourist", "jiangly", "Um_nik"];
    const mergedHandles = Array.from(new Set([...directFollowers, ...fallbackFollowers]));
    return mapHandlesToUsers(mergedHandles);
  }, [user.username, targetUser.followers]);

  // Current active friends list based on sub-tab
  const currentFriendsData = friendsSubTab === "following" ? userFollowingList : userFollowersList;

  const filteredFriends = useMemo(() => {
    if (!friendSearch.trim()) return currentFriendsData;
    return currentFriendsData.filter(
      (f) =>
        f.username.toLowerCase().includes(friendSearch.toLowerCase()) ||
        f.displayName?.toLowerCase().includes(friendSearch.toLowerCase()) ||
        f.country?.toLowerCase().includes(friendSearch.toLowerCase()),
    );
  }, [currentFriendsData, friendSearch]);

  const handleAddFriendSubmit = (e) => {
    e.preventDefault();
    if (!newFriendHandle.trim()) return;
    const handle = newFriendHandle.trim();
    toggleFriend(handle);
    setFriendActionMsg(`Friend @${handle} added to your friends list!`);
    setNewFriendHandle("");
    setTimeout(() => setFriendActionMsg(""), 3000);
  };

  // Handle Profile Update
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateProfile({
      username: settingsHandle,
      displayName: settingsName,
      email: settingsEmail,
      country: settingsCountry,
      flag: settingsFlag,
      university: settingsUniversity,
      bio: settingsBio,
      avatar: settingsAvatar,
      hideFriendsAdded,
      hideWhoAddedMe,
    });
    setProfileSuccessMsg("Profile details successfully updated!");
    setTimeout(() => setProfileSuccessMsg(""), 4000);
  };

  // Handle Password Update
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });
    if (!currentPassword) {
      setPasswordMsg({ type: "error", text: "Please enter your current password." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMsg({ type: "success", text: "Password has been updated successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMsg({ type: "", text: "" }), 4000);
    } catch (err) {
      setPasswordMsg({ type: "error", text: err.message || "Failed to update password." });
    }
  };

  const ratingHistory = mockData.ratingHistory || [];
  const pastContests = mockData.contests.filter((c) => c.status === "past");

  const solvedRatingDistribution = [
    { rating: "800", count: 420, color: "#9ca3af" },
    { rating: "1000", count: 380, color: "#9ca3af" },
    { rating: "1200", count: 510, color: "#4ade80" },
    { rating: "1400", count: 460, color: "#2dd4bf" },
    { rating: "1600", count: 390, color: "#60a5fa" },
    { rating: "1900", count: 280, color: "#c084fc" },
    { rating: "2200", count: 195, color: "#fbbf24" },
    { rating: "2400", count: 120, color: "#fb923c" },
    { rating: "2600", count: 65, color: "#f43f5e" },
    { rating: "3000+", count: 27, color: "#f87171" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Hidden file input for open file popup */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageFileUpload}
        className="hidden"
      />

      {/* Codeforces Style Header Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 gap-4">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs font-semibold">
          {[
            { id: "main", label: "Main Profile", icon: UserIcon },
            { id: "friends", label: `Friends (${userFollowingList.length})`, icon: Users },
            { id: "submissions", label: `Submissions (${userSubmissions.length})`, icon: FileCode },
            ...(isSelf
              ? [
                  {
                    id: "favorites",
                    label: `Favorites (${favoriteProblemsList.length})`,
                    icon: Star,
                  },
                ]
              : []),
            { id: "contests", label: `Past Contests (${pastContests.length})`, icon: Trophy },
            ...(isSelf ? [{ id: "settings", label: "Settings & Security", icon: Settings }] : []),
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-t-lg transition border-b-2 font-mono text-xs whitespace-nowrap ${
                  isActive
                    ? "border-blue-500 text-blue-400 bg-slate-800/60 font-bold"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-xs font-mono text-slate-400 hidden sm:flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Online</span>
        </div>
      </div>

      {/* ========================================================
          TAB 1: MAIN PROFILE (Spacious & Clean, Each Item on Its Own Line)
          ======================================================== */}
      {activeTab === "main" && (
        <div className="space-y-6">
          {/* Main User Profile Card */}
          <div className="cp-card p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 border-b border-slate-800 pb-6">
              {/* Left Column: Avatar & Identification */}
              <div className="flex items-start space-x-5">
                <div className="relative group shrink-0">
                  <div className="w-28 h-28 rounded-2xl bg-slate-900 border-2 border-slate-700 overflow-hidden flex items-center justify-center font-bold text-slate-300 text-3xl shadow-xl">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{user.username?.slice(0, 1).toUpperCase()}</span>
                    )}
                  </div>
                  {isSelf && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-[10px] font-semibold"
                      title="Upload photo from computer"
                    >
                      <Upload size={18} className="mb-0.5" />
                      <span>Open File</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-xs uppercase font-mono tracking-wider font-bold text-red-500">
                    {user.rank || "Legendary Grandmaster"}
                  </div>

                  <div className="flex items-center space-x-3">
                    <h1
                      className={`text-2xl sm:text-3xl font-black tracking-tight ${getRatingColor(user.rating)}`}
                    >
                      {user.username}
                    </h1>

                    {!isSelf && (
                      <button
                        onClick={() => toggleFriend(user.username)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition ${
                          isFriend
                            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                            : "bg-blue-600 hover:bg-blue-500 text-white"
                        }`}
                      >
                        {isFriend ? (
                          <>
                            <UserCheck size={13} />
                            <span>Friends ✓</span>
                          </>
                        ) : (
                          <>
                            <UserPlus size={13} />
                            <span>Add Friend</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-slate-300">
                    <span className="font-semibold text-white">{user.displayName}</span>
                    <span className="text-slate-500 mx-1.5">•</span>
                    <span className="inline-flex items-center gap-1.5 align-middle">
                      <CountryFlag country={user.country} className="w-5 h-3.5" />
                      <span>{user.country}</span>
                    </span>
                    {user.university && (
                      <>
                        <span className="text-slate-500 mx-1.5">•</span>
                        <span>{user.university}</span>
                      </>
                    )}
                  </div>

                  {/* SPATIOUS LINES: Bio, Registration, Last Seen, Contribution, Friends - each on own line */}
                  <div className="pt-3 space-y-2.5">
                    {/* Line 1: Bio */}
                    {user.bio && (
                      <div className="py-1">
                        <p className="text-xs text-slate-300 italic bg-slate-900/80 border-l-2 border-blue-500 pl-3 py-2 rounded-r max-w-xl leading-relaxed">
                          "{user.bio}"
                        </p>
                      </div>
                    )}

                    {/* Line 2: Registration */}
                    <div className="flex items-center space-x-2.5 text-xs text-slate-300 font-mono">
                      <Calendar size={14} className="text-blue-400 shrink-0" />
                      <span>
                        Registered:{" "}
                        <strong className="text-white font-bold">
                          {formatDate(user.joinedDate || "2019-03-15")}
                        </strong>{" "}
                        (5 years ago)
                      </span>
                    </div>

                    {/* Line 3: Last Seen / Status */}
                    <div className="flex items-center space-x-2.5 text-xs text-slate-300 font-mono">
                      <Clock size={14} className="text-emerald-400 shrink-0" />
                      <span>
                        Last visit: <strong className="text-white font-bold">Just now</strong> •{" "}
                        <span className="text-emerald-400 font-semibold">Currently Online</span>
                      </span>
                    </div>

                    {/* Line 4: Contribution */}
                    <div className="flex items-center space-x-2.5 text-xs text-slate-300 font-mono">
                      <Sparkles size={14} className="text-amber-400 shrink-0" />
                      <span>
                        Contribution:{" "}
                        <strong className="text-emerald-400 font-bold">
                          +{user.contribution || 148}
                        </strong>
                      </span>
                    </div>

                    {/* Line 5: Friends Page Link */}
                    <div className="flex items-center space-x-2.5 text-xs text-slate-300 font-mono pt-0.5">
                      <Users size={14} className="text-purple-400 shrink-0" />
                      <span>
                        Friends:{" "}
                        {!isSelf && user.hideFriendsAdded ? (
                          <strong className="text-slate-400 font-bold">Private 🔒</strong>
                        ) : (
                          <strong className="text-blue-400 font-bold">
                            {userFollowingList.length} users
                          </strong>
                        )}
                        <span className="text-slate-500 ml-1.5">
                          {!isSelf && user.hideWhoAddedMe ? (
                            <span className="text-slate-500 italic">(Followers hidden 🔒)</span>
                          ) : (
                            <span>(Followed by {userFollowersList.length})</span>
                          )}
                        </span>
                      </span>
                      <span className="text-slate-600">•</span>
                      <button
                        onClick={() => setActiveTab("friends")}
                        className="text-blue-400 hover:text-blue-300 hover:underline font-bold flex items-center space-x-1"
                      >
                        <span>View Friends Page</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contest Rating Box */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5 text-left md:text-right shrink-0 min-w-[200px]">
                <div className="text-[11px] text-slate-400 uppercase tracking-widest font-mono">
                  Contest Rating
                </div>
                <div
                  className={`text-4xl font-black font-mono mt-1 ${getRatingColor(user.rating)}`}
                >
                  {user.rating}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  max.{" "}
                  <strong className="text-red-500 font-bold">
                    {user.rank || "legendary grandmaster"}
                  </strong>
                  , <strong className="text-slate-200">{user.maxRating || 3979}</strong>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Global Rank: <strong className="text-white">#{user.globalRank || 1}</strong>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3">
                <div className="text-[11px] text-slate-400 uppercase font-mono">
                  Problems Solved
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                  {user.problemsSolved?.toLocaleString() || "2,847"}
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3">
                <div className="text-[11px] text-slate-400 uppercase font-mono">
                  Contests Played
                </div>
                <div className="text-xl font-bold font-mono text-blue-400 mt-0.5">
                  {user.contestsParticipated || 312}
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3">
                <div className="text-[11px] text-slate-400 uppercase font-mono">Current Streak</div>
                <div className="text-xl font-bold font-mono text-amber-400 mt-0.5 flex items-center justify-center space-x-1">
                  <Flame size={18} />
                  <span>{user.streak || 47} days</span>
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3">
                <div className="text-[11px] text-slate-400 uppercase font-mono">
                  Total Submissions
                </div>
                <div className="text-xl font-bold font-mono text-purple-400 mt-0.5">
                  {userSubmissions.length + 3120}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              CODEFORCES / GITHUB SUBMISSION ACTIVITY HEATMAP
              ======================================================== */}
          <div className="cp-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
                  <Calendar size={15} className="text-blue-400" />
                  <span>Annual Submission Heatmap</span>
                </h2>
                <div className="text-xs text-slate-400 mt-0.5">
                  {(user.problemsSolved || 2847).toLocaleString()} submissions in the last 364 days
                </div>
              </div>

              <div className="text-xs font-mono text-slate-400 flex items-center space-x-3">
                <span>
                  Streak: <strong className="text-amber-400">{user.streak || 47} days</strong>
                </span>
                <span>•</span>
                <span>
                  Max Streak: <strong className="text-emerald-400">89 days</strong>
                </span>
              </div>
            </div>

            {/* Heatmap Grid (52 weeks x 7 days) */}
            <div className="overflow-x-auto pb-2">
              <div className="inline-block min-w-[720px] p-2 bg-slate-950/60 border border-slate-800 rounded-lg relative">
                <div className="grid grid-rows-7 grid-flow-col gap-1.5 auto-cols-max">
                  {heatmapDays.map((day, idx) => {
                    const bgColors = [
                      "bg-slate-800/70 hover:ring-1 hover:ring-slate-500",
                      "bg-emerald-950 text-emerald-300 hover:ring-1 hover:ring-emerald-400",
                      "bg-emerald-700 text-white hover:ring-1 hover:ring-emerald-300",
                      "bg-emerald-500 text-white hover:ring-1 hover:ring-emerald-200",
                      "bg-emerald-300 text-slate-900 hover:ring-1 hover:ring-white",
                    ];

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-3 h-3 rounded-xs cursor-pointer transition-all duration-150 ${bgColors[day.level]}`}
                      />
                    );
                  })}
                </div>

                {/* Hover Tooltip display */}
                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div>
                    {hoveredDay ? (
                      <span className="text-slate-200 font-semibold">
                        {hoveredDay.count} submission{hoveredDay.count !== 1 ? "s" : ""} on{" "}
                        {hoveredDay.formattedDate}
                      </span>
                    ) : (
                      <span>Hover over any day square to inspect submissions count</span>
                    )}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] text-slate-500">Less</span>
                    <div className="w-2.5 h-2.5 rounded-xs bg-slate-800/70" />
                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-950" />
                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-700" />
                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-300" />
                    <span className="text-[11px] text-slate-500">More</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Progression Graph */}
          <div className="cp-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              <span className="flex items-center space-x-2">
                <TrendingUp size={15} className="text-blue-400" />
                <span>Contest Rating Progression</span>
              </span>
              <span className="text-slate-400 font-normal">Rated Rounds History</span>
            </div>

            <div className="h-64 w-full bg-slate-950/60 border border-slate-800 rounded-lg p-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ratingHistory}>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis
                    domain={["auto", "auto"]}
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "8px",
                      color: "#f8fafc",
                      fontSize: "11px",
                    }}
                    formatter={(val, name, item) => [
                      `${val} (Δ ${item.payload.change > 0 ? "+" : ""}${item.payload.change})`,
                      "Rating",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="newRating"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: "#38bdf8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Problem Rating Distribution (High-Contrast Beautiful Tooltip) */}
          <div className="cp-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              <span>Rating Distribution of Solved Problems</span>
              <span className="text-slate-400 font-normal">
                Total: {user.problemsSolved?.toLocaleString()} Solved
              </span>
            </div>

            <div className="h-60 w-full bg-slate-950/60 border border-slate-800 rounded-lg p-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={solvedRatingDistribution}>
                  <XAxis dataKey="rating" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    content={<CustomDistributionTooltip />}
                    cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                  />
                  <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                    {solvedRatingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: SEPARATE FRIENDS PAGE (With Who I Added vs Who Added Me)
          ======================================================== */}
      {activeTab === "friends" && (
        <div className="space-y-6">
          <div className="cp-card p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Users size={18} className="text-blue-400" />
                  <span>Friends Network of @{user.username}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage friends list, inspect followers, and compare competition standings.
                </p>
              </div>

              {/* Search Friends Input */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter by handle or name..."
                  value={friendSearch}
                  onChange={(e) => setFriendSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* TWO OPTIONS: Who I Added as Friend vs Who Added Me */}
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setFriendsSubTab("following")}
                className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition flex items-center space-x-2 ${
                  friendsSubTab === "following"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <UserCheck size={14} />
                <span>
                  {isSelf ? "Friends I Added" : `Friends of @${user.username}`}
                  {!isSelf && user.hideFriendsAdded
                    ? " (Private 🔒)"
                    : ` (${userFollowingList.length})`}
                </span>
                {isSelf && hideFriendsAdded && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono flex items-center gap-1">
                    <Lock size={9} /> Private
                  </span>
                )}
              </button>

              <button
                onClick={() => setFriendsSubTab("followers")}
                className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition flex items-center space-x-2 ${
                  friendsSubTab === "followers"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Users size={14} />
                <span>
                  {isSelf ? "Users Who Added Me" : `Users Who Added @${user.username}`}
                  {!isSelf && user.hideWhoAddedMe
                    ? " (Private 🔒)"
                    : ` (${userFollowersList.length})`}
                </span>
                {isSelf && hideWhoAddedMe && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono flex items-center gap-1">
                    <Lock size={9} /> Private
                  </span>
                )}
              </button>
            </div>

            {/* Add Friend Input Bar (For Current User) */}
            {isSelf && (
              <form
                onSubmit={handleAddFriendSubmit}
                className="flex gap-2 p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs"
              >
                <input
                  type="text"
                  placeholder="Enter a handle to add as friend (e.g. jiangly, ksun48, Um_nik, Benq)..."
                  value={newFriendHandle}
                  onChange={(e) => setNewFriendHandle(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={!newFriendHandle.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-lg flex items-center space-x-1.5 transition"
                >
                  <UserPlus size={14} />
                  <span>Add Friend</span>
                </button>
              </form>
            )}

            {friendActionMsg && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle size={15} />
                <span>{friendActionMsg}</span>
              </div>
            )}

            {/* Friends Content: If blocked by user privacy preference */}
            {!isSelf &&
            ((friendsSubTab === "following" && user.hideFriendsAdded) ||
              (friendsSubTab === "followers" && user.hideWhoAddedMe)) ? (
              <div className="py-16 text-center space-y-3 bg-slate-950/60 border border-slate-800 rounded-xl p-8">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-lg shadow-amber-500/10">
                  <Lock size={26} />
                </div>
                <h3 className="text-white font-bold text-base">This Friends List is Private</h3>
                <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
                  @{user.username} has blocked everyone from seeing{" "}
                  {friendsSubTab === "following"
                    ? "the friends they have added"
                    : "who added them as a friend"}
                  .
                </p>
              </div>
            ) : (
              /* Friends Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFriends.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-slate-500 text-xs">
                    No users found matching "{friendSearch}".
                  </div>
                ) : (
                  filteredFriends.map((f) => {
                    const isAlreadyMyFriend = currentUser?.friends?.includes(f.username);

                    return (
                      <div
                        key={f.username}
                        className="p-4 bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl space-y-3 transition flex flex-col justify-between"
                      >
                        <div className="flex items-start space-x-3.5">
                          <Link
                            to={`/profile/${f.username}`}
                            className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-slate-300 text-base shrink-0 hover:ring-2 hover:ring-blue-500 transition"
                          >
                            {f.avatar ? (
                              <img
                                src={f.avatar}
                                alt={f.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{f.username.slice(0, 1).toUpperCase()}</span>
                            )}
                          </Link>

                          <div className="min-w-0 flex-1">
                            <Link
                              to={`/profile/${f.username}`}
                              className={`font-bold hover:underline truncate block text-sm ${getRatingColor(f.rating)}`}
                            >
                              {f.username}
                            </Link>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <CountryFlag country={f.country} className="w-4 h-3" />
                              <span>{f.country || "International"}</span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">
                              {f.rank || "Grandmaster"}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span
                              className={`font-mono font-bold text-sm block ${getRatingColor(f.rating)}`}
                            >
                              {f.rating}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">rating</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                          <span className="text-[11px] font-mono text-slate-400">
                            Solved:{" "}
                            <strong className="text-slate-200">{f.problemsSolved || 1200}</strong>
                          </span>

                          <div className="flex items-center space-x-2">
                            {isSelf && friendsSubTab === "following" && (
                              <button
                                onClick={() => {
                                  toggleFriend(f.username);
                                  setFriendActionMsg(`Removed @${f.username} from friends.`);
                                  setTimeout(() => setFriendActionMsg(""), 3000);
                                }}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 rounded text-xs transition"
                              >
                                Unfriend
                              </button>
                            )}

                            {isSelf && friendsSubTab === "followers" && !isAlreadyMyFriend && (
                              <button
                                onClick={() => {
                                  toggleFriend(f.username);
                                  setFriendActionMsg(`Added @${f.username} back as friend!`);
                                  setTimeout(() => setFriendActionMsg(""), 3000);
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition"
                              >
                                Add Friend +
                              </button>
                            )}

                            <Link
                              to={`/profile/${f.username}`}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition"
                            >
                              View Profile
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: SUBMISSIONS SECTION
          ======================================================== */}
      {activeTab === "submissions" && (
        <div className="space-y-6">
          <div className="cp-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white">Recent Submissions</h2>
                <p className="text-xs text-slate-400">
                  Inspect verdict, runtime, memory, and code for @{user.username}
                </p>
              </div>

              {/* Verdict Filter Buttons */}
              <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs font-mono">
                {["ALL", "AC", "WA", "TLE", "QUEUE"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setVerdictFilter(v)}
                    className={`px-2.5 py-1 rounded transition ${
                      verdictFilter === v
                        ? "bg-blue-600 text-white font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Submissions Table */}
            <div className="overflow-x-auto">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th># ID</th>
                    <th>When</th>
                    <th>Problem</th>
                    <th>Lang</th>
                    <th className="text-center">Verdict</th>
                    <th className="text-center">Time</th>
                    <th className="text-center">Memory</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-400 text-xs">
                        No submissions matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((s) => {
                      const isAC = s.verdict === "AC";
                      const isQueue = s.verdict === "QUEUE" || s.verdict === "PENDING";
                      const isWrong = ["WA", "TLE", "MLE", "RE", "CE"].includes(s.verdict);

                      return (
                        <tr key={s.id}>
                          <td className="font-mono text-xs text-slate-400">{s.id}</td>
                          <td className="text-xs text-slate-400">
                            {formatRelativeTime(s.submittedAt)}
                          </td>
                          <td>
                            <Link
                              to={`/problems/${s.problemId}`}
                              className="font-bold text-slate-200 hover:text-blue-400 transition"
                            >
                              {s.problemId}. {s.problemTitle || "Problem Solution"}
                            </Link>
                          </td>
                          <td className="font-mono text-xs text-slate-300">
                            {s.language || "C++"}
                          </td>
                          <td className="text-center">
                            {isAC && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                                <CheckCircle size={12} />
                                <span>Accepted</span>
                              </span>
                            )}
                            {isQueue && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/60 text-amber-400 border border-amber-500/30">
                                <Clock size={12} className="animate-spin" />
                                <span>In Queue</span>
                              </span>
                            )}
                            {isWrong && (
                              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/60 text-rose-400 border border-rose-500/30">
                                <AlertCircle size={12} />
                                <span>{getVerdictLabel(s.verdict)}</span>
                              </span>
                            )}
                          </td>
                          <td className="text-center font-mono text-xs text-slate-300">
                            {s.time ? `${s.time} ms` : "—"}
                          </td>
                          <td className="text-center font-mono text-xs text-slate-300">
                            {s.memory ? `${s.memory} KB` : "—"}
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => setSelectedSubmissionCode(s)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition shadow-sm"
                            >
                              View Code
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: FAVORITE PROBLEMS SECTION (Only Visible to Profile Owner)
          ======================================================== */}
      {activeTab === "favorites" && isSelf && (
        <div className="space-y-6">
          <div className="cp-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Star size={16} className="text-amber-400" fill="currentColor" />
                  <span>Favorite Problems ({favoriteProblemsList.length})</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Problems bookmarked for quick practice and contest prep
                </p>
              </div>

              <Link
                to="/problems"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition"
              >
                Browse Problemset &rarr;
              </Link>
            </div>

            {favoriteProblemsList.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800 space-y-3">
                <Star size={28} className="mx-auto text-slate-500" />
                <p className="text-sm text-slate-300">No favorite problems saved yet.</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Click the star bookmark button on any problem page or problem card to collect them
                  here.
                </p>
                <Link
                  to="/problems"
                  className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
                >
                  Explore Problemset
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteProblemsList.map((prob) => (
                  <div
                    key={prob.id}
                    className="p-4 bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl space-y-3 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/problems/${prob.id}`}
                          className="font-bold text-white hover:text-blue-400 transition text-sm"
                        >
                          {prob.id}. {prob.title}
                        </Link>
                        <button
                          onClick={() => toggleFavorite(prob.id)}
                          className="text-amber-400 hover:text-slate-400 p-1"
                          title="Remove from favorites"
                        >
                          <Star size={16} fill="currentColor" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 mt-2 text-xs">
                        <span className="text-slate-400">Rating:</span>
                        <span className={`font-mono font-bold ${getRatingColor(prob.rating)}`}>
                          {prob.rating}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">
                          Tags: {(prob.tags || []).slice(0, 3).join(", ")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                      <span className="font-mono text-slate-500">
                        {prob.timeLimit || "2.0s"} / {prob.memoryLimit || "256MB"}
                      </span>
                      <Link
                        to={`/problems/${prob.id}`}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded text-xs transition"
                      >
                        Solve Problem &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: PAST CONTESTS WITH OLD & NEW RATING + CHANGES
          ======================================================== */}
      {activeTab === "contests" && (
        <div className="space-y-6">
          <div className="cp-card overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex justify-between items-center text-xs">
              <div>
                <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center space-x-2">
                  <Trophy size={16} className="text-amber-400" />
                  <span>Past Contests History &amp; Rating Calculations</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete record of rated participation, rank, old rating, new rating, and rating
                  delta (Δ)
                </p>
              </div>
              <span className="text-slate-400 font-mono text-xs">
                {pastContests.length} rated contests
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th>Contest Name</th>
                    <th className="text-center">Date</th>
                    <th className="text-center">Rank</th>
                    <th className="text-center">Solved</th>
                    <th className="text-center">Old Rating</th>
                    <th className="text-center">Rating Δ</th>
                    <th className="text-center">New Rating</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pastContests.map((c, i) => {
                    const hist = ratingHistory[i] || {};
                    const delta = c.ratingChange || hist.change || 18;
                    const isPositive = delta >= 0;
                    const oldR = hist.oldRating || user.rating - delta;
                    const newR = hist.newRating || user.rating;

                    return (
                      <tr key={c.id}>
                        <td>
                          <Link
                            to={`/contests/${c.id}`}
                            className="font-bold text-slate-200 hover:text-blue-400 transition"
                          >
                            {c.name}
                          </Link>
                          <span className="text-[11px] text-slate-500 block">
                            {c.type || "Rated Round"}
                          </span>
                        </td>
                        <td className="text-center font-mono text-xs text-slate-400">
                          {formatDate(c.startTime || hist.date)}
                        </td>
                        <td className="text-center font-mono font-bold text-slate-200 text-sm">
                          #{c.yourRank || i + 1}
                        </td>
                        <td className="text-center font-mono text-xs text-slate-300 font-bold">
                          5 / 5
                        </td>
                        <td className="text-center font-mono font-semibold text-slate-400 text-xs">
                          {oldR}
                        </td>
                        <td className="text-center font-mono font-bold text-sm">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs ${
                              isPositive
                                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-950/60 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {isPositive ? `+${delta}` : delta}
                          </span>
                        </td>
                        <td className="text-center font-mono font-extrabold text-sm">
                          <span className={getRatingColor(newR)}>{newR}</span>
                        </td>
                        <td className="text-right">
                          <Link
                            to={`/contests/${c.id}`}
                            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 font-semibold rounded text-xs transition inline-flex items-center space-x-1"
                          >
                            <span>Standings</span>
                            <ChevronRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 6: SETTINGS & ACCOUNT SECTION (Only Visible to Profile Owner)
          ======================================================== */}
      {activeTab === "settings" && isSelf && (
        <div className="space-y-6">
          {profileSuccessMsg && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle size={16} />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          {/* Profile Details Edit Form */}
          <div className="cp-card p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Settings size={18} className="text-blue-400" />
                <span>Account &amp; Profile Information</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Update your avatar from file, username, handle, display name, organization, country,
                and bio.
              </p>
            </div>

            {/* Hidden settings file input */}
            <input
              type="file"
              ref={settingsFileInputRef}
              accept="image/*"
              onChange={handleImageFileUpload}
              className="hidden"
            />

            {/* 1. AVATAR UPLOAD AT THE VERY TOP (FILE POPUP ONLY, NO URL) */}
            <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-xs uppercase font-mono tracking-wider">
                    Profile Avatar Picture
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Choose an image from your computer (PNG, JPG, WebP).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => settingsFileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center space-x-2 transition shadow-md shadow-blue-500/20"
                >
                  <Upload size={14} />
                  <span>Choose Image File...</span>
                </button>
              </div>

              <div className="flex items-center space-x-4 pt-1">
                <div
                  onClick={() => settingsFileInputRef.current?.click()}
                  className="w-16 h-16 rounded-xl bg-slate-900 border-2 border-dashed border-slate-700 hover:border-blue-500 overflow-hidden shrink-0 flex items-center justify-center cursor-pointer transition group"
                  title="Click to select image file"
                >
                  {settingsAvatar ? (
                    <img
                      src={settingsAvatar}
                      alt="preview"
                      className="w-full h-full object-cover group-hover:opacity-80 transition"
                    />
                  ) : (
                    <UserIcon className="text-slate-500" size={24} />
                  )}
                </div>

                <div className="text-xs space-y-1">
                  <div className="text-slate-300 font-semibold">Current Image Preview</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Click the image or "Choose Image File" to open file selector.
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Username / Handle */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 block">
                    Username / Handle <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={settingsHandle}
                    onChange={(e) => setSettingsHandle(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500 transition"
                  />
                  <span className="text-[11px] text-slate-500">
                    Your unique competitive handle on CodeArena.
                  </span>
                </div>

                {/* Display Name */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 block">Full Display Name</label>
                  <input
                    type="text"
                    value={settingsName}
                    onChange={(e) => setSettingsName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                  />
                  <span className="text-[11px] text-slate-500">
                    Real name or nickname shown on profile.
                  </span>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 block">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={settingsEmail}
                    onChange={(e) => setSettingsEmail(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                {/* Country & Flag Dropdown (All Countries, No BY) */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 block">
                    Country &amp; Flag <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-2.5">
                    <div className="w-14 h-10 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center shrink-0 p-1">
                      <CountryFlag
                        country={settingsCountry}
                        className="w-8 h-5.5 rounded-sm shadow-md"
                      />
                    </div>
                    <select
                      value={settingsCountry}
                      onChange={(e) => {
                        const selected = COUNTRIES.find((c) => c.name === e.target.value);
                        if (selected) {
                          setSettingsCountry(selected.name);
                        }
                      }}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 text-xs font-semibold"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.name} value={c.name} className="bg-slate-900 text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Select country from the world list. Flag updates automatically.
                  </span>
                </div>

                {/* University / Organization */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-slate-300 block">
                    University / Organization / Workplace
                  </label>
                  <input
                    type="text"
                    value={settingsUniversity}
                    onChange={(e) => setSettingsUniversity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Bio / About */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-slate-300 block">Biography / Status</label>
                  <textarea
                    rows={3}
                    value={settingsBio}
                    onChange={(e) => setSettingsBio(e.target.value)}
                    placeholder="Tell other competitors about yourself..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition shadow-md shadow-blue-500/20"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Privacy & Security: Friends Visibility Checkboxes */}
          <div className="cp-card p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Shield size={18} className="text-emerald-400" />
                <span>Friends Privacy &amp; Security</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Block or allow competitors from viewing your friends list and follower network.
              </p>
            </div>

            <div className="space-y-4 max-w-2xl">
              {/* Checkbox 1: Block everyone from seeing friends I added */}
              <label className="flex items-start space-x-3.5 p-4 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition select-none group">
                <input
                  type="checkbox"
                  checked={hideFriendsAdded}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setHideFriendsAdded(val);
                    if (isSelf) {
                      updateProfile({ hideFriendsAdded: val });
                      setProfileSuccessMsg(
                        val
                          ? "Blocked everyone from seeing friends you added (Following)."
                          : "Friends you added are now visible to other users.",
                      );
                      setTimeout(() => setProfileSuccessMsg(""), 4000);
                    }
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white group-hover:text-blue-300 transition flex items-center gap-2">
                    <span>Block everyone from seeing friends I added</span>
                    {hideFriendsAdded && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono">
                        Private 🔒
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    When checked, other competitors are blocked from viewing the list of users you
                    have added as friends.
                  </p>
                </div>
              </label>

              {/* Checkbox 2: Block everyone from seeing friends who added me */}
              <label className="flex items-start space-x-3.5 p-4 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition select-none group">
                <input
                  type="checkbox"
                  checked={hideWhoAddedMe}
                  onChange={(e) => {
                    const val = e.target.checked;
                    setHideWhoAddedMe(val);
                    if (isSelf) {
                      updateProfile({ hideWhoAddedMe: val });
                      setProfileSuccessMsg(
                        val
                          ? "Blocked everyone from seeing who added you as a friend (Followers)."
                          : "Followers who added you are now visible to other users.",
                      );
                      setTimeout(() => setProfileSuccessMsg(""), 4000);
                    }
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white group-hover:text-purple-300 transition flex items-center gap-2">
                    <span>Block everyone from seeing friends who added me</span>
                    {hideWhoAddedMe && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono">
                        Private 🔒
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    When checked, other competitors are blocked from viewing who has added you as a
                    friend.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="cp-card p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Lock size={18} className="text-amber-400" />
                <span>Change Password</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Keep your CodeArena account secure by updating your password regularly.
              </p>
            </div>

            {passwordMsg.text && (
              <div
                className={`p-3 rounded-lg text-xs font-semibold flex items-center space-x-2 ${
                  passwordMsg.type === "error"
                    ? "bg-rose-950/60 text-rose-400 border border-rose-500/30"
                    : "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                {passwordMsg.type === "error" ? (
                  <AlertCircle size={15} />
                ) : (
                  <CheckCircle size={15} />
                )}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">
                  Current Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">
                  New Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">
                  Confirm New Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition shadow-md shadow-amber-500/20"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enlarged VSCode Syntax Highlighted Code Viewer Modal */}
      {selectedSubmissionCode && (
        <CodeViewerModal
          submission={selectedSubmissionCode}
          onClose={() => setSelectedSubmissionCode(null)}
        />
      )}
    </div>
  );
}
