import { useState, useCallback } from 'react';

export function useCourseProgress(courseId, totalLessons = 1) {
  const storageKey = `cp-progress-${courseId}`;
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const markComplete = useCallback((lessonId) => {
    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) return prev;
      const next = [...prev, lessonId];
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }, [storageKey]);

  const markIncomplete = useCallback((lessonId) => {
    setCompletedLessons(prev => {
      const next = prev.filter(id => id !== lessonId);
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }, [storageKey]);

  const isCompleted = useCallback((lessonId) => completedLessons.includes(lessonId), [completedLessons]);
  const getProgress = useCallback(() => totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0, [completedLessons, totalLessons]);

  return { completedLessons, markComplete, markIncomplete, isCompleted, getProgress };
}
