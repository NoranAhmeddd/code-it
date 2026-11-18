import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getRatingColor } from '../utils/helpers';
import {
  BookOpen,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Tag,
  PenSquare,
  Send,
  CheckCircle,
  ThumbsUp,
  Search,
  Filter,
  Share2,
} from 'lucide-react';

export default function BlogsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogs, submitBlog, addBlogComment, currentUser } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // New blog form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Editorials');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('editorial, solutions');

  // Comment input state
  const [newCommentText, setNewCommentText] = useState('');

  // Selected blog: either from URL :id, or null (showing list)
  const selectedBlog = id ? blogs.find((b) => b.id === id) : null;

  // Filter approved blogs for public view
  const approvedBlogs = blogs.filter((b) => b.status === 'approved' || b.author === currentUser?.username);

  const filteredBlogs = approvedBlogs.filter((b) => {
    const matchesCategory = categoryFilter === 'ALL' || b.category === categoryFilter;
    const matchesSearch =
      searchQuery === '' ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePostBlog = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newBlog = {
      id: `blog-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      author: currentUser?.username || 'tourist',
      authorRating: currentUser?.rating || 3822,
      authorAvatar: currentUser?.avatar || null,
      date: 'Just now',
      summary: newSummary.trim() || newContent.slice(0, 150) + '...',
      content: newContent,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      status: 'pending', // Requires admin review
      commentsCount: 0,
      comments: [],
    };

    submitBlog(newBlog);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowSubmitModal(false);
      setNewTitle('');
      setNewSummary('');
      setNewContent('');
    }, 2500);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedBlog) return;

    const comment = {
      id: `comment-${Date.now()}`,
      author: currentUser?.username || 'tourist',
      authorRating: currentUser?.rating || 3822,
      authorAvatar: currentUser?.avatar || null,
      date: 'Just now',
      text: newCommentText.trim(),
      upvotes: 0,
    };

    addBlogComment(selectedBlog.id, comment);
    setNewCommentText('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 font-semibold uppercase">
            <BookOpen size={14} />
            <span>Community Blogs &amp; Editorials</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            {selectedBlog ? selectedBlog.title : 'Competitive Arena Blogs'}
          </h1>
          <p className="text-xs text-slate-400">
            Official contest editorials, advanced algorithmic analyses, tutorials, and announcements.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {selectedBlog ? (
            <button
              onClick={() => navigate('/blogs')}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition"
            >
              <ArrowLeft size={14} />
              <span>Back to All Blogs</span>
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 shadow-md shadow-blue-500/20 transition"
            >
              <PenSquare size={14} />
              <span>Write Blog Post</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          DETAIL VIEW: SINGLE BLOG POST WITH COMMENTS
          ======================================================== */}
      {selectedBlog ? (
        <div className="space-y-6">
          <div className="cp-card p-6 md:p-8 space-y-6">
            {/* Meta header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 text-xs">
              <div className="flex items-center space-x-3">
                <Link
                  to={`/profile/${selectedBlog.author}`}
                  className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-white shrink-0"
                >
                  {selectedBlog.authorAvatar ? (
                    <img src={selectedBlog.authorAvatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{selectedBlog.author.slice(0, 1).toUpperCase()}</span>
                  )}
                </Link>

                <div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/profile/${selectedBlog.author}`}
                      className={`font-bold hover:underline ${getRatingColor(selectedBlog.authorRating)}`}
                    >
                      {selectedBlog.author}
                    </Link>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono uppercase">
                      {selectedBlog.category}
                    </span>
                    {selectedBlog.status === 'pending' && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono">
                        Pending Admin Review
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                    Published: {selectedBlog.date}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {(selectedBlog.tags || []).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700/60"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Blog Full Content / Editorial Body */}
            <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4 whitespace-pre-line">
              {selectedBlog.content || selectedBlog.summary}
            </div>
          </div>

          {/* Comments Section */}
          <div className="cp-card p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <MessageSquare size={16} className="text-blue-400" />
                <span>Discussion &amp; Comments ({(selectedBlog.comments || []).length})</span>
              </h2>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-3">
              <textarea
                rows={3}
                placeholder="Share your thoughts, solution doubts, or optimizations..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition"
                >
                  <Send size={13} />
                  <span>Post Comment</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-2">
              {(selectedBlog.comments || []).length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No comments yet. Start the conversation!
                </div>
              ) : (
                (selectedBlog.comments || []).map((c) => (
                  <div
                    key={c.id}
                    className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/profile/${c.author}`}
                          className={`font-bold hover:underline ${getRatingColor(c.authorRating)}`}
                        >
                          {c.author}
                        </Link>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500 font-mono text-[11px]">{c.date}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                        <ThumbsUp size={11} className="text-slate-400" />
                        <span>{c.upvotes || 0}</span>
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================
            LIST VIEW: ALL BLOGS & EDITORIALS
            ======================================================== */
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl text-xs">
            <div className="flex items-center space-x-1 font-mono overflow-x-auto pb-1 sm:pb-0">
              {['ALL', 'Editorials', 'Announcements', 'Tutorials', 'Platform'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search blogs or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full sm:w-60"
              />
            </div>
          </div>

          {/* Blogs Grid / List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredBlogs.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm">
                No blogs found matching the selected filters.
              </div>
            ) : (
              filteredBlogs.map((b) => (
                <div
                  key={b.id}
                  className="cp-card p-6 space-y-4 hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono uppercase font-bold">
                          {b.category}
                        </span>
                        <span className="text-slate-500">•</span>
                        <Link
                          to={`/profile/${b.author}`}
                          className={`font-semibold hover:underline ${getRatingColor(b.authorRating)}`}
                        >
                          {b.author}
                        </Link>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-500 font-mono text-[11px]">{b.date}</span>
                      </div>

                      {b.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono">
                          Pending Admin Review
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/blogs/${b.id}`}
                      className="block text-lg font-bold text-white hover:text-blue-400 transition leading-snug"
                    >
                      {b.title}
                    </Link>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {b.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <Link
                      to={`/blogs/${b.id}`}
                      className="text-blue-400 hover:underline font-bold flex items-center space-x-1"
                    >
                      <span>Read Editorial Discussion</span>
                      <ArrowRight size={13} />
                    </Link>

                    <div className="flex items-center space-x-1 text-slate-500">
                      <MessageSquare size={13} />
                      <span>{b.commentsCount || (b.comments || []).length} comments</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          WRITE BLOG MODAL (Sends to Admin Review)
          ======================================================== */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <PenSquare size={16} className="text-blue-400" />
                  <span>Submit a New Blog Post</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Posts are submitted to Platform Admins for review prior to public listing.
                </p>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-6 text-center space-y-2 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300">
                <CheckCircle size={32} className="mx-auto text-emerald-400" />
                <h4 className="font-bold text-sm">Blog Submitted Successfully!</h4>
                <p className="text-xs text-emerald-200/80">
                  Your blog has been submitted for admin approval. Once approved, it will appear in the main blogs list.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostBlog} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 block">Blog Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solution Analysis for Div. 2 Round #921"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300 block">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Editorials">Editorials</option>
                      <option value="Tutorials">Tutorials</option>
                      <option value="Announcements">Announcements</option>
                      <option value="Community">Community</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300 block">Tags (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="graphs, dp, tutorial"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 block">Short Summary</label>
                  <input
                    type="text"
                    placeholder="One or two sentences summarizing the post..."
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300 block">Full Post Content / Editorial *</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Write your detailed problem explanation, approach, and code..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 leading-relaxed font-mono text-xs"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-md shadow-blue-500/25"
                  >
                    Submit for Admin Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
