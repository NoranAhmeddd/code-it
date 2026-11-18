import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getRatingColor } from '../utils/helpers';
import {
  PlusCircle,
  Trophy,
  Code2,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Send,
  Sparkles,
  Layers,
  Calendar,
  Tag,
  ListOrdered,
} from 'lucide-react';

export default function ContributePage() {
  const {
    currentUser,
    submitProblem,
    submitDiv,
    contributedProblems,
    contributedDivs,
    problems: allProblems,
  } = useApp();

  const [activeTab, setActiveTab] = useState('problem'); // 'problem' | 'div' | 'history'
  const [successToast, setSuccessToast] = useState('');

  // Problem Form State
  const [probTitle, setProbTitle] = useState('');
  const [probDiff, setProbDiff] = useState(1600);
  const [probDiv, setProbDiv] = useState('Div. 2');
  const [probTags, setProbTags] = useState('dp, greedy, data structures');
  const [probTimeLimit, setProbTimeLimit] = useState('2.0s');
  const [probMemoryLimit, setProbMemoryLimit] = useState('256MB');
  const [probStatement, setProbStatement] = useState('');
  const [probInputSpec, setProbInputSpec] = useState('');
  const [probOutputSpec, setProbOutputSpec] = useState('');
  const [probSampleInput, setProbSampleInput] = useState('');
  const [probSampleOutput, setProbSampleOutput] = useState('');

  // Div Form State
  const [divTitle, setDivTitle] = useState('');
  const [divLevel, setDivLevel] = useState('Div. 2');
  const [divDuration, setDivDuration] = useState('2 hours');
  const [divDate, setDivDate] = useState('2026-11-28 17:35');
  const [divDescription, setDivDescription] = useState('');
  const [selectedDivProblems, setSelectedDivProblems] = useState(['1A', '2A', '3A']);

  const handleProblemSubmit = (e) => {
    e.preventDefault();
    if (!probTitle.trim() || !probStatement.trim()) return;

    const probId = `P-CUST-${Date.now().toString().slice(-4)}`;
    const newProb = {
      id: probId,
      title: probTitle.trim(),
      difficulty: Number(probDiff),
      divLevel: probDiv,
      tags: probTags.split(',').map((t) => t.trim()).filter(Boolean),
      timeLimit: probTimeLimit,
      memoryLimit: probMemoryLimit,
      statement: probStatement.trim(),
      inputFormat: probInputSpec.trim() || 'Standard input format.',
      outputFormat: probOutputSpec.trim() || 'Standard output format.',
      sampleInput: probSampleInput.trim() || '1 2',
      sampleOutput: probSampleOutput.trim() || '3',
      author: currentUser?.username || 'tourist',
      authorRating: currentUser?.rating || 3822,
      status: 'pending', // Awaiting admin review
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    submitProblem(newProb);
    setSuccessToast(`Problem "${probTitle}" submitted! Sent to Admin Dashboard for review.`);
    setTimeout(() => setSuccessToast(''), 4000);

    // Reset form
    setProbTitle('');
    setProbStatement('');
    setProbInputSpec('');
    setProbOutputSpec('');
    setProbSampleInput('');
    setProbSampleOutput('');
  };

  const handleDivSubmit = (e) => {
    e.preventDefault();
    if (!divTitle.trim()) return;

    const divId = `DIV-${Date.now().toString().slice(-4)}`;
    const newDiv = {
      id: divId,
      name: divTitle.trim(),
      divLevel: divLevel,
      duration: divDuration,
      scheduledDate: divDate,
      description: divDescription.trim() || `Official ${divLevel} contest curated by @${currentUser?.username || 'tourist'}.`,
      problems: selectedDivProblems,
      author: currentUser?.username || 'tourist',
      authorRating: currentUser?.rating || 3822,
      status: 'pending', // Awaiting admin review
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    submitDiv(newDiv);
    setSuccessToast(`Contest Div "${divTitle}" submitted! Admin will review the problem curation.`);
    setTimeout(() => setSuccessToast(''), 4000);

    // Reset form
    setDivTitle('');
    setDivDescription('');
  };

  const toggleProblemSelection = (probId) => {
    setSelectedDivProblems((prev) =>
      prev.includes(probId) ? prev.filter((id) => id !== probId) : [...prev, probId]
    );
  };

  const myProblems = (contributedProblems || []).filter(
    (p) => p.author === currentUser?.username || currentUser?.role === 'admin'
  );
  const myDivs = (contributedDivs || []).filter(
    (d) => d.author === currentUser?.username || currentUser?.role === 'admin'
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 font-semibold uppercase">
            <Sparkles size={14} />
            <span>Problemset &amp; Contest Authoring Hub</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Contribution Portal
          </h1>
          <p className="text-xs text-slate-400">
            Contribute original algorithmic problems or organize a new contest Division. All contributions are reviewed by Platform Admins.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveTab('problem')}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'problem'
                ? 'bg-blue-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 size={14} />
            <span>Add Problem</span>
          </button>

          <button
            onClick={() => setActiveTab('div')}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'div'
                ? 'bg-amber-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy size={14} />
            <span>Create a Div</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers size={14} />
            <span>My Submissions ({myProblems.length + myDivs.length})</span>
          </button>
        </div>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center space-x-2 shadow-lg animate-fade-in">
          <CheckCircle size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* ========================================================
          TAB 1: ADD PROBLEM
          ======================================================== */}
      {activeTab === 'problem' && (
        <div className="cp-card p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Code2 size={17} className="text-blue-400" />
              <span>Submit a New Algorithmic Problem</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify the statement, constraints, time &amp; memory limits, and sample input/output.
            </p>
          </div>

          <form onSubmit={handleProblemSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-semibold text-slate-300 block">
                  Problem Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subtree XOR Inversion Queries"
                  value={probTitle}
                  onChange={(e) => setProbTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Target Division</label>
                <select
                  value={probDiv}
                  onChange={(e) => setProbDiv(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Div. 4">Div. 4 (Newbies 800-1200)</option>
                  <option value="Div. 3">Div. 3 (Pupils 1200-1600)</option>
                  <option value="Div. 2">Div. 2 (Experts 1600-2100)</option>
                  <option value="Div. 1">Div. 1 (Masters 2100-3000)</option>
                  <option value="Global">Global / Open</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Difficulty Rating ({probDiff})</label>
                <input
                  type="range"
                  min="800"
                  max="3500"
                  step="100"
                  value={probDiff}
                  onChange={(e) => setProbDiff(Number(e.target.value))}
                  className="w-full accent-blue-500 mt-2"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>800</span>
                  <span className={`font-bold ${getRatingColor(probDiff)}`}>{probDiff}</span>
                  <span>3500</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Time Limit</label>
                <input
                  type="text"
                  value={probTimeLimit}
                  onChange={(e) => setProbTimeLimit(e.target.value)}
                  placeholder="2.0s"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Memory Limit</label>
                <input
                  type="text"
                  value={probMemoryLimit}
                  onChange={(e) => setProbMemoryLimit(e.target.value)}
                  placeholder="256MB"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 block">Tags (comma-separated)</label>
              <input
                type="text"
                value={probTags}
                onChange={(e) => setProbTags(e.target.value)}
                placeholder="dp, greedy, trees, bitmasks, math"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 block">Problem Statement *</label>
              <textarea
                rows={5}
                required
                value={probStatement}
                onChange={(e) => setProbStatement(e.target.value)}
                placeholder="Detailed description of the problem story, variables, and goal..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 leading-relaxed font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Input Format</label>
                <textarea
                  rows={3}
                  value={probInputSpec}
                  onChange={(e) => setProbInputSpec(e.target.value)}
                  placeholder="The first line contains an integer T (1 <= T <= 1000)..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Output Format</label>
                <textarea
                  rows={3}
                  value={probOutputSpec}
                  onChange={(e) => setProbOutputSpec(e.target.value)}
                  placeholder="For each test case, print the minimum operations on a new line."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Sample Input</label>
                <textarea
                  rows={4}
                  value={probSampleInput}
                  onChange={(e) => setProbSampleInput(e.target.value)}
                  placeholder="5&#10;1 4 2 5 3"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Sample Output</label>
                <textarea
                  rows={4}
                  value={probSampleOutput}
                  onChange={(e) => setProbSampleOutput(e.target.value)}
                  placeholder="12"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition shadow-md shadow-blue-500/25 flex items-center space-x-2"
              >
                <Send size={14} />
                <span>Submit Problem for Admin Review</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================
          TAB 2: CREATE A DIV
          ======================================================== */}
      {activeTab === 'div' && (
        <div className="cp-card p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Trophy size={17} className="text-amber-400" />
              <span>Create a New Contest Division (Div)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Organize an official or educational round with curated problems, schedule, and division tier.
            </p>
          </div>

          <form onSubmit={handleDivSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-semibold text-slate-300 block">
                  Contest / Div Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CodeArena Round #925 (Div. 2)"
                  value={divTitle}
                  onChange={(e) => setDivTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Division Tier</label>
                <select
                  value={divLevel}
                  onChange={(e) => setDivLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Div. 1">Div. 1 (Advanced 2100+)</option>
                  <option value="Div. 2">Div. 2 (Standard 1600-2100)</option>
                  <option value="Div. 3">Div. 3 (Beginner-Friendly &lt; 1600)</option>
                  <option value="Div. 4">Div. 4 (Newcomers &lt; 1200)</option>
                  <option value="Div. 1 + Div. 2">Div. 1 + Div. 2 (Combined)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 block">Duration</label>
                <select
                  value={divDuration}
                  onChange={(e) => setDivDuration(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                >
                  <option value="2 hours">2 hours (Standard)</option>
                  <option value="2.5 hours">2.5 hours (Extended)</option>
                  <option value="3 hours">3 hours</option>
                  <option value="5 hours">5 hours (ICPC format)</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-semibold text-slate-300 block">Scheduled Start Time</label>
                <input
                  type="text"
                  value={divDate}
                  onChange={(e) => setDivDate(e.target.value)}
                  placeholder="2026-11-28 17:35 UTC"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 block">Div Rules &amp; Description</label>
              <textarea
                rows={3}
                value={divDescription}
                onChange={(e) => setDivDescription(e.target.value)}
                placeholder="Describe who this round is rated for, problem setters, and testers..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {/* Problem Selection for this Div */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300 block">
                  Select Problems for this Div ({selectedDivProblems.length} selected)
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  Pick from available problemset
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-2 bg-slate-950/70 border border-slate-800 rounded-xl">
                {(allProblems || []).slice(0, 15).map((p) => {
                  const isSelected = selectedDivProblems.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleProblemSelection(p.id)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-950/40 text-amber-300 border-amber-500/40 font-semibold'
                          : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="font-mono text-[11px] font-bold mr-1.5">{p.id}.</span>
                        <span>{p.title}</span>
                      </div>
                      <span className={`text-[10px] font-mono shrink-0 font-bold ${getRatingColor(p.rating)}`}>
                        {p.rating}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition shadow-md shadow-amber-500/25 flex items-center space-x-2"
              >
                <Trophy size={14} />
                <span>Submit Div for Admin Review</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================
          TAB 3: MY CONTRIBUTIONS & STATUS
          ======================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Contributed Problems */}
          <div className="cp-card overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider font-mono">
                My Problem Submissions ({myProblems.length})
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Problem Title</th>
                    <th className="text-center">Division</th>
                    <th className="text-center">Difficulty</th>
                    <th className="text-center">Submitted At</th>
                    <th className="text-right">Review Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myProblems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-slate-400 text-xs">
                        No problems contributed yet.
                      </td>
                    </tr>
                  ) : (
                    myProblems.map((p) => (
                      <tr key={p.id}>
                        <td className="font-mono text-xs text-slate-400">{p.id}</td>
                        <td className="font-bold text-white">{p.title}</td>
                        <td className="text-center font-mono text-xs text-slate-300">{p.divLevel}</td>
                        <td className={`text-center font-mono font-bold ${getRatingColor(p.difficulty)}`}>
                          {p.difficulty}
                        </td>
                        <td className="text-center font-mono text-xs text-slate-400">{p.submittedAt}</td>
                        <td className="text-right">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase font-mono ${
                              p.status === 'approved'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : p.status === 'rejected'
                                ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contributed Divs */}
          <div className="cp-card overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider font-mono">
                My Created Divs ({myDivs.length})
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th>Div ID</th>
                    <th>Contest Name</th>
                    <th className="text-center">Tier</th>
                    <th className="text-center">Duration</th>
                    <th className="text-center">Problems</th>
                    <th className="text-right">Review Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myDivs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-slate-400 text-xs">
                        No Divs created yet.
                      </td>
                    </tr>
                  ) : (
                    myDivs.map((d) => (
                      <tr key={d.id}>
                        <td className="font-mono text-xs text-slate-400">{d.id}</td>
                        <td className="font-bold text-white">{d.name}</td>
                        <td className="text-center font-mono text-xs text-slate-300">{d.divLevel}</td>
                        <td className="text-center font-mono text-xs text-slate-400">{d.duration}</td>
                        <td className="text-center font-mono text-xs text-slate-300">
                          {(d.problems || []).length} challenges
                        </td>
                        <td className="text-right">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase font-mono ${
                              d.status === 'approved'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : d.status === 'rejected'
                                ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
