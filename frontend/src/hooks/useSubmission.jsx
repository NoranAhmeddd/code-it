import { useState, useCallback } from 'react';

const VERDICTS = [
  { verdict: 'AC', weight: 60 },
  { verdict: 'WA', weight: 20 },
  { verdict: 'TLE', weight: 10 },
  { verdict: 'RE', weight: 5 },
  { verdict: 'MLE', weight: 3 },
  { verdict: 'CE', weight: 2 },
];

function pickVerdict() {
  const total = VERDICTS.reduce((s, v) => s + v.weight, 0);
  let r = Math.random() * total;
  for (const v of VERDICTS) { r -= v.weight; if (r <= 0) return v.verdict; }
  return 'AC';
}

export function useSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [lastSubmission, setLastSubmission] = useState(null);
  const [runResult, setRunResult] = useState(null);
  const [submissionHistory, setSubmissionHistory] = useState([]);

  const submitCode = useCallback(async (problemId, code, language, problemTitle = '') => {
    setIsSubmitting(true);
    const delay = 1500 + Math.random() * 1500;
    await new Promise(r => setTimeout(r, delay));
    const verdict = pickVerdict();
    const sub = {
      id: `sub-${Date.now()}`,
      problemId,
      problemTitle,
      verdict,
      language,
      time: verdict === 'AC' ? Math.floor(50 + Math.random() * 750) : verdict === 'TLE' ? 2000 : Math.floor(100 + Math.random() * 500),
      memory: Math.floor(10 + Math.random() * 40),
      code,
      submittedAt: new Date().toISOString(),
      passedTests: verdict === 'AC' ? '10/10' : `${Math.floor(Math.random() * 9)}/10`,
    };
    setLastSubmission(sub);
    setSubmissionHistory(prev => [sub, ...prev]);
    setIsSubmitting(false);
    return sub;
  }, []);

  const runCode = useCallback(async (problemId, code, language, customInput = '') => {
    setIsRunning(true);
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    const result = {
      stdout: customInput ? `Output for input:\n${customInput}\n\n42` : '42',
      stderr: '',
      exitCode: 0,
      time: Math.floor(50 + Math.random() * 200),
      memory: Math.floor(8 + Math.random() * 20),
    };
    setRunResult(result);
    setIsRunning(false);
    return result;
  }, []);

  return { submitCode, runCode, isSubmitting, isRunning, lastSubmission, runResult, submissionHistory };
}
