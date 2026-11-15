import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import mockData from '../data/mockData';
import { getRatingColor, formatDate } from '../utils/helpers';
import { useApp } from '../context/AppContext';
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
} from 'recharts';
import {
  Camera,
  UserPlus,
  UserCheck,
  Edit2,
  Check,
  X,
  Trophy,
  Flame,
  Award,
} from 'lucide-react';

export default function UserProfilePage() {
  const { username } = useParams();
  const { currentUser, updateProfile, toggleFriend } = useApp();

  const targetUser = mockData.users.find((u) => u.username === username) || mockData.users[0];
  const isSelf = currentUser && currentUser.username === targetUser.username;
  const user = isSelf ? currentUser : targetUser;

  const [isEditing, setIsEditing] = useState(false);
  const [editHandle, setEditHandle] = useState(user.username);
  const [editName, setEditName] = useState(user.displayName);
  const [avatarUrl, setAvatarUrl] = useState(
    user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );
  const [showAvatarPrompt, setShowAvatarPrompt] = useState(false);
  const [tempAvatarInput, setTempAvatarInput] = useState('');

  const isFriend = currentUser?.friends?.includes(user.username);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      username: editHandle,
      displayName: editName,
      avatar: avatarUrl,
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    e.preventDefault();
    if (tempAvatarInput.trim()) {
      setAvatarUrl(tempAvatarInput.trim());
      if (isSelf) {
        updateProfile({ avatar: tempAvatarInput.trim() });
      }
      setShowAvatarPrompt(false);
      setTempAvatarInput('');
    }
  };

  const ratingHistory = mockData.ratingHistory || [];
  const submissions = mockData.submissions || [];
  const pastContests = mockData.contests.filter((c) => c.status === 'past');

  const solvedRatingDistribution = [
    { rating: '800', count: 420, color: '#9ca3af' },
    { rating: '1000', count: 380, color: '#9ca3af' },
    { rating: '1200', count: 510, color: '#4ade80' },
    { rating: '1400', count: 460, color: '#2dd4bf' },
    { rating: '1600', count: 390, color: '#60a5fa' },
    { rating: '1900', count: 280, color: '#c084fc' },
    { rating: '2200', count: 195, color: '#fbbf24' },
    { rating: '2400', count: 120, color: '#fb923c' },
    { rating: '2600', count: 65, color: '#f43f5e' },
    { rating: '3000+', count: 27, color: '#f87171' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="cp-card p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="flex items-start space-x-5">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-slate-700 overflow-hidden flex items-center justify-center font-bold text-slate-300 text-3xl shadow-xl">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.username.slice(0, 1).toUpperCase()}</span>
                )}
              </div>

              {isSelf && (
                <button
                  onClick={() => setShowAvatarPrompt(true)}
                  className="absolute inset-0 bg-black/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-[10px] font-semibold"
                  title="Change avatar photo"
                >
                  <Camera size={18} className="mb-0.5" />
                  <span>Update Photo</span>
                </button>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase font-mono text-slate-400">
                {user.rank || 'International Grandmaster'}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-2 pt-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editHandle}
                      onChange={(e) => setEditHandle(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-sm font-bold text-white focus:outline-none focus:border-blue-500"
                      placeholder="Handle"
                    />
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                      placeholder="Display Name"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="submit"
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition flex items-center space-x-1"
                    >
                      <Check size={12} />
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 bg-slate-800 text-slate-300 font-semibold text-xs rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className={`text-2xl font-bold tracking-tight ${getRatingColor(user.rating)}`}>
                      {user.username}
                    </h1>

                    {isSelf && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-slate-400 hover:text-white p-1 rounded transition"
                        title="Edit handle and display name"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}

                    {!isSelf && (
                      <button
                        onClick={() => toggleFriend(user.username)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition ${
                          isFriend
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
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

                  <div className="text-xs text-slate-300 mt-0.5">
                    {user.displayName} • {user.country} {user.university && `• ${user.university}`}
                  </div>

                  <div className="text-[11px] text-slate-400 pt-1 font-mono">
                    Member since {formatDate(user.joinedDate)} • Streak: <strong className="text-amber-400">{user.streak || 47} days 🔥</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">
              Contest Rating
            </div>
            <div className={`text-3xl font-extrabold font-mono ${getRatingColor(user.rating)}`}>
              {user.rating}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Max: <span className="font-semibold text-slate-200">{user.maxRating}</span> • Rank #{user.globalRank || 1}
            </div>
          </div>
        </div>

        {/* Change Pic Popover */}
        {showAvatarPrompt && (
          <form onSubmit={handleAvatarChange} className="p-4 bg-slate-900 border border-slate-700 rounded-lg space-y-2 text-xs">
            <div className="font-semibold text-slate-200">Enter image URL for profile picture:</div>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={tempAvatarInput}
                onChange={(e) => setTempAvatarInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                required
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded"
              >
                Update Photo
              </button>
              <button
                type="button"
                onClick={() => setShowAvatarPrompt(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* GRAPH 1: Recent Contests Rating History */}
      <div className="cp-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-bold text-slate-200 uppercase tracking-wider">
          <span>Contest Rating Progression</span>
          <span className="text-slate-400 font-normal">Last 10 Rated Contests</span>
        </div>

        <div className="h-64 w-full bg-slate-950/60 border border-slate-800 rounded-lg p-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratingHistory}>
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '11px' }}
                formatter={(val, name, item) => [`${val} (Δ ${item.payload.change > 0 ? '+' : ''}${item.payload.change})`, 'Rating']}
              />
              <Line
                type="monotone"
                dataKey="newRating"
                stroke="#38bdf8"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#38bdf8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRAPH 2: Rating Distribution of Solved Problems */}
      <div className="cp-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-bold text-slate-200 uppercase tracking-wider">
          <span>Rating Distribution of Solved Problems</span>
          <span className="text-slate-400 font-normal">Total: {user.problemsSolved?.toLocaleString()} Solved</span>
        </div>

        <div className="h-60 w-full bg-slate-950/60 border border-slate-800 rounded-lg p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={solvedRatingDistribution}>
              <XAxis dataKey="rating" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '11px' }}
                formatter={(val) => [`${val} problems solved`, 'Count']}
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

      {/* Past Contests Participated */}
      <div className="cp-card overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-bold text-xs text-slate-200 uppercase tracking-wider flex justify-between">
          <span>Past Contests Participated &amp; Performance</span>
          <span className="text-slate-400 font-normal">{pastContests.length} rounds recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="cp-table">
            <thead>
              <tr>
                <th>Contest Name</th>
                <th className="text-center">Date</th>
                <th className="text-center">Rank</th>
                <th className="text-center">Rating Δ</th>
                <th className="text-center">New Rating</th>
                <th className="text-right">Standings</th>
              </tr>
            </thead>
            <tbody>
              {pastContests.map((c, i) => {
                const hist = ratingHistory[i] || {};
                return (
                  <tr key={c.id}>
                    <td>
                      <Link to={`/contests/${c.id}`} className="font-semibold text-slate-200 hover:text-blue-400 transition">
                        {c.name}
                      </Link>
                    </td>
                    <td className="text-center font-mono text-xs text-slate-400">{formatDate(c.startTime)}</td>
                    <td className="text-center font-mono font-bold text-slate-200">
                      {c.yourRank ? `#${c.yourRank}` : `#${i + 1}`}
                    </td>
                    <td className="text-center font-mono font-bold text-emerald-400">
                      +{c.ratingChange || (hist.change || 15)}
                    </td>
                    <td className="text-center font-mono font-bold text-slate-200">
                      {hist.newRating || user.rating}
                    </td>
                    <td className="text-right">
                      <Link to={`/contests/${c.id}`} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition">
                        Standings
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
  );
}
