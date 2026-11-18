import React, { useState } from 'react';
import { X, Copy, Check, Code2, Clock, HardDrive, CheckCircle, AlertCircle, FileCode, Maximize2, Minimize2 } from 'lucide-react';
import { getVerdictColor, getVerdictLabel } from '../utils/helpers';

// VSCode-like Syntax Highlighter Tokenizer
function highlightLine(line) {
  // Check for comments
  const commentIdx = line.indexOf('//');
  if (commentIdx !== -1) {
    const codePart = line.slice(0, commentIdx);
    const commentPart = line.slice(commentIdx);
    return (
      <>
        {tokenizeCode(codePart)}
        <span className="text-emerald-500/80 italic">{commentPart}</span>
      </>
    );
  }
  return tokenizeCode(line);
}

function tokenizeCode(codeStr) {
  if (!codeStr) return null;

  // Regex splitting by:
  // 1. Preprocessors (#include, #define, etc.)
  // 2. String literals ("...")
  // 3. Header paths (<bits/stdc++.h>, etc.)
  // 4. Identifiers and keywords
  // 5. Numbers
  // 6. Operators and delimiters
  const tokenRegex = /(#[a-zA-Z_]+)|("<[^>]*>"|<[a-zA-Z0-9_\.\/]+>)|("(?:\\.|[^"\\])*")|('(?:\\.|[^'\\])*')|(\b(?:return|if|else|while|for|break|continue|switch|case|default|using|namespace|typedef|template|typename|class|struct|public|private|protected|static|constexpr|nullptr|true|false|new|delete|operator)\b)|(\b(?:int|long|double|float|char|bool|void|auto|unsigned|size_t|short|int64_t|ll)\b)|(\b(?:vector|string|pair|map|set|queue|deque|stack|unordered_map|unordered_set|priority_queue|multiset|bitset|cin|cout|endl|min|max|swap|sort|reverse|push_back|emplace_back|pop_back|push|pop|front|back|top|size|empty|begin|end|rbegin|rend|main|ios|ios_base|tie|sync_with_stdio|nullptr)\b)|(\b\d+(?:\.\d+)?\b)|(\s+)|([{}()\[\];,.:+\-*\/%&|^!~=<>?]+)|([a-zA-Z_][a-zA-Z0-9_]*)/g;

  const elements = [];
  let match;
  let lastIndex = 0;
  let keyIdx = 0;

  while ((match = tokenRegex.exec(codeStr)) !== null) {
    const [
      full,
      preproc,
      headerPath,
      strLit,
      charLit,
      keyword,
      typeKw,
      stlFunc,
      number,
      whitespace,
      symbol,
      identifier,
    ] = match;

    if (preproc) {
      elements.push(<span key={keyIdx++} className="text-purple-400 font-bold">{preproc}</span>);
    } else if (headerPath) {
      elements.push(<span key={keyIdx++} className="text-amber-300">{headerPath}</span>);
    } else if (strLit || charLit) {
      elements.push(<span key={keyIdx++} className="text-emerald-300">{strLit || charLit}</span>);
    } else if (keyword) {
      elements.push(<span key={keyIdx++} className="text-pink-400 font-semibold">{keyword}</span>);
    } else if (typeKw) {
      elements.push(<span key={keyIdx++} className="text-sky-400 font-semibold">{typeKw}</span>);
    } else if (stlFunc) {
      elements.push(<span key={keyIdx++} className="text-yellow-300">{stlFunc}</span>);
    } else if (number) {
      elements.push(<span key={keyIdx++} className="text-orange-400">{number}</span>);
    } else if (whitespace) {
      elements.push(whitespace);
    } else if (symbol) {
      elements.push(<span key={keyIdx++} className="text-slate-400">{symbol}</span>);
    } else if (identifier) {
      elements.push(<span key={keyIdx++} className="text-slate-200">{identifier}</span>);
    } else {
      elements.push(full);
    }
  }

  return elements;
}

export default function CodeViewerModal({ submission, onClose }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!submission) return null;

  const code = submission.code || '// No code content available';
  const lines = code.split('\n');

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAC = submission.verdict === 'AC';
  const isQueue = submission.verdict === 'QUEUE' || submission.verdict === 'PENDING';
  const isWrong = ['WA', 'TLE', 'MLE', 'RE', 'CE'].includes(submission.verdict);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className={`bg-[#181824] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col transition-all duration-200 overflow-hidden ${
          isExpanded ? 'w-full h-full max-w-none' : 'w-full max-w-5xl h-[85vh]'
        }`}
      >
        {/* VSCode Titlebar */}
        <div className="bg-[#12121c] border-b border-slate-800 px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
            </div>

            <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <FileCode size={15} className="text-blue-400" />
              <span className="font-bold text-white">
                {submission.problemTitle || `Problem ${submission.problemId}`}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 font-mono">ID: {submission.id}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title={isExpanded ? 'Restore size' : 'Expand full screen'}
            >
              {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Close modal"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Metadata Status Ribbon */}
        <div className="bg-[#161622] border-b border-slate-800/80 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center space-x-4">
            {/* Verdict */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 font-mono text-[11px] uppercase">Verdict:</span>
              {isAC && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle size={13} />
                  <span>Accepted (AC)</span>
                </span>
              )}
              {isQueue && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-400 border border-amber-500/40">
                  <Clock size={13} className="animate-spin" />
                  <span>In Queue</span>
                </span>
              )}
              {isWrong && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/80 text-rose-400 border border-rose-500/40">
                  <AlertCircle size={13} />
                  <span>{getVerdictLabel(submission.verdict)}</span>
                </span>
              )}
            </div>

            {/* Language */}
            <div className="flex items-center space-x-1 text-slate-300 font-mono">
              <span className="text-slate-500 text-[11px] uppercase">Lang:</span>
              <span className="px-2 py-0.5 bg-slate-800/80 rounded border border-slate-700/60 font-semibold text-blue-300">
                {submission.language || 'C++'}
              </span>
            </div>

            {/* Runtime */}
            <div className="flex items-center space-x-1 text-slate-300 font-mono">
              <Clock size={13} className="text-slate-500" />
              <span>{submission.time !== undefined ? `${submission.time} ms` : '—'}</span>
            </div>

            {/* Memory */}
            <div className="flex items-center space-x-1 text-slate-300 font-mono">
              <HardDrive size={13} className="text-slate-500" />
              <span>{submission.memory !== undefined ? `${submission.memory} KB` : '—'}</span>
            </div>

            {/* Tests passed */}
            {submission.passedTests && (
              <div className="text-slate-400 font-mono text-[11px]">
                Passed: <strong className="text-white">{submission.passedTests}</strong>
              </div>
            )}
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition border border-slate-700/80 shadow-sm"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy Source Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Body with VSCode Editor Feel & Line Numbers */}
        <div className="flex-1 overflow-auto bg-[#0d1117] p-4 text-xs font-mono leading-relaxed select-text">
          <div className="table w-full">
            {lines.map((lineText, idx) => (
              <div key={idx} className="table-row hover:bg-slate-800/30 transition-colors">
                {/* Line number gutter */}
                <div className="table-cell pr-4 text-right text-slate-600 select-none w-10 shrink-0 font-mono border-r border-slate-800/70">
                  {idx + 1}
                </div>
                {/* Line content */}
                <div className="table-cell pl-4 whitespace-pre font-mono">
                  {highlightLine(lineText)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#12121c] border-t border-slate-800 px-5 py-2.5 flex items-center justify-between text-[11px] font-mono text-slate-500 shrink-0">
          <span>UTF-8 • {lines.length} lines • {code.length} characters</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md font-semibold transition"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
