import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import mockData from '../data/mockData';
import { useSubmission } from '../hooks/useSubmission';
import { useApp } from '../context/AppContext';
import { getRatingColor } from '../utils/helpers';
import { Play, Send, ChevronLeft, Clock, HardDrive, Check, Copy, Bookmark, Star } from 'lucide-react';

export default function ProblemDetailPage() {
  const { id } = useParams();
  const { favorites, toggleFavorite, problems: customProblems } = useApp();
  const allProblems = customProblems?.length ? customProblems : mockData.problems;
  const problem = allProblems.find((p) => p.id === id) || mockData.problems[0];
  const isFavorite = favorites?.includes(problem.id);

  const [language, setLanguage] = useState('C++');
  const [code, setCode] = useState(
`#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    
    // Write your solution here
    cout << "Ready\\n";
    return 0;
}`
  );
  const [customInput, setCustomInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const {
    submitCode,
    runCode,
    isSubmitting,
    isRunning,
    lastSubmission,
    runResult,
    submissionHistory,
  } = useSubmission();

  const handleSubmit = () => {
    submitCode(problem.id, code, language, problem.title);
  };

  const handleRun = () => {
    runCode(problem.id, code, language, customInput);
  };

  const copySample = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Breadcrumb & Resource Limits */}
      <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <Link to="/problems" className="text-blue-400 hover:underline font-semibold flex items-center space-x-1">
            <ChevronLeft size={15} />
            <span>Problemset</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="font-bold text-slate-200">{problem.id}. {problem.title}</span>
        </div>

        <div className="flex items-center space-x-6 text-slate-400 font-mono">
          <span className="flex items-center space-x-1">
            <Clock size={13} className="text-blue-400" />
            <span>Time: <strong className="text-slate-200">{problem.timeLimit}</strong></span>
          </span>
          <span className="flex items-center space-x-1">
            <HardDrive size={13} className="text-indigo-400" />
            <span>Memory: <strong className="text-slate-200">{problem.memoryLimit}</strong></span>
          </span>
        </div>
      </div>

      {/* Split screen: Left (Statement) + Right (Code Editor & Submissions) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side: Statement */}
        <div className="cp-card p-6 space-y-6 text-slate-300 leading-relaxed text-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {problem.id}. {problem.title}
              </h1>
              <div className="flex items-center space-x-3 mt-1.5 text-xs">
                <span className="text-slate-400">Rating:</span>
                <span className={`font-mono font-bold ${getRatingColor(problem.rating)}`}>
                  {problem.rating}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">Tags: {problem.tags.join(', ')}</span>
              </div>
            </div>

            <button
              onClick={() => toggleFavorite(problem.id)}
              className={`p-2 rounded-lg border transition flex items-center space-x-1.5 text-xs font-semibold ${
                isFavorite
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorite problems'}
            >
              <Star size={15} fill={isFavorite ? 'currentColor' : 'none'} />
              <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
            </button>
          </div>

          {/* Statement body */}
          <div className="border-t border-slate-800 pt-4 text-[13.5px] space-y-3 text-slate-200">
            <p>{problem.statement}</p>
          </div>

          {/* Input Specification */}
          <div className="space-y-1 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 font-mono text-[11px]">
              Input Format
            </h3>
            <p className="text-slate-300 leading-relaxed">{problem.inputSpec}</p>
          </div>

          {/* Output Specification */}
          <div className="space-y-1 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 font-mono text-[11px]">
              Output Format
            </h3>
            <p className="text-slate-300 leading-relaxed">{problem.outputSpec}</p>
          </div>

          {/* Constraints */}
          {problem.constraints && (
            <div className="space-y-1 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-slate-400 font-mono text-[11px]">
                Constraints
              </h3>
              <p className="text-slate-300 font-mono bg-slate-900/60 p-2.5 rounded border border-slate-800">
                {problem.constraints}
              </p>
            </div>
          )}

          {/* Sample Tests */}
          {problem.examples && (
            <div className="space-y-4">
              <h3 className="font-bold uppercase tracking-wider text-slate-400 font-mono text-xs">
                Sample Tests
              </h3>
              {problem.examples.map((ex, i) => (
                <div key={i} className="border border-slate-800 rounded-lg overflow-hidden text-xs font-mono">
                  <div className="bg-slate-900 px-3 py-1.5 font-bold border-b border-slate-800 text-slate-400 flex justify-between items-center">
                    <span>Input</span>
                    <button
                      onClick={() => copySample(ex.input, i)}
                      className="text-blue-400 hover:text-blue-300 font-normal text-[11px] flex items-center space-x-1"
                    >
                      {copiedIndex === i ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedIndex === i ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-950 text-slate-200 overflow-x-auto whitespace-pre">{ex.input}</pre>

                  <div className="bg-slate-900 px-3 py-1.5 font-bold border-t border-b border-slate-800 text-slate-400">
                    Output
                  </div>
                  <pre className="p-3 bg-slate-950 text-slate-200 overflow-x-auto whitespace-pre">{ex.output}</pre>

                  {ex.explanation && (
                    <div className="p-3 bg-slate-900/60 border-t border-slate-800 font-sans text-slate-400 text-xs">
                      <strong className="text-slate-300">Explanation:</strong> {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Code Editor & Submission Console */}
        <div className="space-y-5">
          <div className="cp-card overflow-hidden">
            {/* Editor Bar */}
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 font-medium">Compiler:</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="C++">C++20 (GCC 14)</option>
                  <option value="Python">Python 3.11</option>
                  <option value="Java">Java 21 OpenJDK</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-md text-xs transition border border-slate-700 flex items-center space-x-1"
                >
                  <Play size={12} />
                  <span>{isRunning ? 'Running...' : 'Run Test'}</span>
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-md text-xs transition shadow-md shadow-blue-600/30 flex items-center space-x-1.5"
                >
                  <Send size={12} />
                  <span>{isSubmitting ? 'Judging...' : 'Submit Solution'}</span>
                </button>
              </div>
            </div>

            {/* Code Editor */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={16}
              className="w-full p-4 font-mono text-xs bg-slate-950 text-slate-200 focus:outline-none resize-y leading-relaxed border-none"
              spellCheck="false"
            />

            {/* Custom Input */}
            <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-xs space-y-1.5">
              <label className="font-semibold text-slate-400 block font-mono text-[11px] uppercase">
                Custom Stdin:
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                rows={2}
                placeholder="Custom testcase input..."
                className="w-full p-2 font-mono text-xs bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Test Runner Output */}
          {runResult && (
            <div className="cp-card p-4 space-y-2 text-xs">
              <div className="font-bold text-slate-300 uppercase tracking-wider font-mono text-[11px] flex justify-between">
                <span>Execution Result:</span>
                <span className="text-slate-500">{runResult.time} ms • {runResult.memory} MB</span>
              </div>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-slate-200 overflow-x-auto">
                {runResult.stdout}
              </pre>
            </div>
          )}

          {/* Judge Verdict Box */}
          {(isSubmitting || lastSubmission) && (
            <div className="cp-card p-5 space-y-2 text-xs">
              <div className="font-bold text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                Judge Verdict
              </div>

              {isSubmitting ? (
                <div className="p-3.5 bg-blue-950/40 border border-blue-500/30 text-blue-300 rounded-lg font-mono font-bold flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping"></span>
                  <span>Executing testcases on sandbox workers...</span>
                </div>
              ) : (
                <div
                  className={`p-3.5 rounded-lg border font-mono font-bold text-sm flex items-center justify-between ${
                    lastSubmission.verdict === 'AC'
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-400'
                      : 'bg-red-950/30 border-red-500/40 text-red-400'
                  }`}
                >
                  <span>
                    {lastSubmission.verdict === 'AC'
                      ? '✓ Accepted (AC)'
                      : `✗ ${lastSubmission.verdict} on Test 3`}
                  </span>
                  <span className="text-xs text-slate-400 font-normal">
                    {lastSubmission.time} ms • {lastSubmission.memory} MB
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Submissions History */}
          {submissionHistory.length > 0 && (
            <div className="cp-card overflow-hidden">
              <div className="p-3 border-b border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-wider">
                My Problem Submissions
              </div>
              <table className="cp-table text-xs">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Verdict</th>
                    <th>Time</th>
                    <th>Memory</th>
                  </tr>
                </thead>
                <tbody>
                  {submissionHistory.map((s) => (
                    <tr key={s.id}>
                      <td className="font-mono text-slate-500">{s.id}</td>
                      <td>
                        <span className={s.verdict === 'AC' ? 'verdict-ac' : 'verdict-wa'}>
                          {s.verdict}
                        </span>
                      </td>
                      <td className="font-mono text-slate-300">{s.time} ms</td>
                      <td className="font-mono text-slate-300">{s.memory} MB</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
