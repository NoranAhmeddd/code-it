import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import mockData from '../data/mockData';
import { getRatingColor } from '../utils/helpers';
import { Radio, ArrowLeft } from 'lucide-react';

export default function ContestDetailPage() {
  const { id } = useParams();
  const contest = mockData.contests.find((c) => c.id === id) || mockData.contests[0];
  const standings = mockData.contestStandings || [];

  const [activeTab, setActiveTab] = useState('standings');
  const [activeProblem, setActiveProblem] = useState('A');

  const problems = [
    { label: 'A', id: '1A', title: 'Two Sum Optimization' },
    { label: 'B', id: '2A', title: 'Graph Connectivity Queries' },
    { label: 'C', id: '3A', title: 'Segment Tree Range Update' },
    { label: 'D', id: '4A', title: 'Knapsack Bounded Items' },
    { label: 'E', id: '5A', title: 'Suffix Array & LCP' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Contest Console Header */}
      <div className="cp-card p-6 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 font-semibold uppercase">
            <span>{contest.type} Rated Contest</span>
            <span>•</span>
            <span>ICPC Rules (20m Penalty)</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {contest.name}
          </h1>
          <div className="text-xs text-slate-400">
            5 Algorithmic Problems • Live System Pretesting
          </div>
        </div>

        {/* Live Timer */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-left sm:text-right shrink-0">
          <div className="text-[11px] text-slate-400 font-mono uppercase">Contest Remaining Time</div>
          <div className="text-2xl font-extrabold font-mono text-red-500 mt-0.5">
            01:04:22
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('standings')}
          className={`px-4 py-2.5 rounded-t-lg transition ${
            activeTab === 'standings'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Live Standings
        </button>

        {problems.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setActiveTab('problem');
              setActiveProblem(p.label);
            }}
            className={`px-4 py-2.5 rounded-t-lg transition ${
              activeTab === 'problem' && activeProblem === p.label
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            Problem {p.label}
          </button>
        ))}
      </div>

      {/* Standings View */}
      {activeTab === 'standings' && (
        <div className="cp-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="cp-table">
              <thead>
                <tr>
                  <th className="w-12 text-center">Rank</th>
                  <th>Competitor</th>
                  <th className="w-16 text-center">Solved</th>
                  <th className="w-20 text-center">Penalty</th>
                  <th className="w-16 text-center">A</th>
                  <th className="w-16 text-center">B</th>
                  <th className="w-16 text-center">C</th>
                  <th className="w-16 text-center">D</th>
                  <th className="w-16 text-center">E</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row) => (
                  <tr key={row.userId} className={row.userId === 'u1' ? 'bg-blue-950/20' : ''}>
                    <td className="text-center font-mono font-bold text-slate-400">
                      {row.rank}
                    </td>

                    <td>
                      <Link
                        to={`/profile/${row.username}`}
                        className={`font-bold hover:underline ${getRatingColor(row.rating)}`}
                      >
                        {row.username}
                      </Link>
                      <span className="text-[11px] text-slate-500 ml-2">({row.country})</span>
                    </td>

                    <td className="text-center font-bold font-mono text-emerald-400 text-sm">
                      {row.solved}
                    </td>

                    <td className="text-center font-mono text-xs text-slate-400">
                      {row.penalty}
                    </td>

                    {/* Results per problem */}
                    {['A', 'B', 'C', 'D', 'E'].map((letter) => {
                      const res = row.problemResults?.[letter];
                      if (!res) {
                        return <td key={letter} className="text-center text-slate-600 font-mono">—</td>;
                      }
                      if (res.verdict === 'AC') {
                        return (
                          <td key={letter} className="text-center font-mono text-xs bg-emerald-950/20 text-emerald-400">
                            <span className="font-bold block">
                              +{res.attempts > 1 ? res.attempts - 1 : ''}
                            </span>
                            <span className="text-[10px] text-slate-500 block">{res.time}</span>
                          </td>
                        );
                      }
                      return (
                        <td key={letter} className="text-center font-mono text-xs bg-red-950/20 text-red-400 font-bold">
                          -{res.attempts}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Problem View */}
      {activeTab === 'problem' && (
        <div className="cp-card p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white">
                Problem {activeProblem}: {problems.find((p) => p.label === activeProblem)?.title}
              </h2>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Standard Input/Output • Time Limit 2.0s • Memory 256MB
              </div>
            </div>

            <Link
              to={`/problems/${problems.find((p) => p.label === activeProblem)?.id || '1A'}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-md shadow-sm transition"
            >
              Open Full Editor &rarr;
            </Link>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            Solve this problem within the active contest session. Submissions are judged live by the contest judging cluster.
          </p>
        </div>
      )}
    </div>
  );
}
