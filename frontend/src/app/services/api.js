import mockData from "../data/mockData.js";

const { problems, contests, contestStandings, courses, lessons, assignments, submissions, users } =
  mockData;

const delay = (ms = 150) => new Promise((res) => setTimeout(res, ms));

export const api = {
  async getProblems(filters = {}) {
    await delay(150);
    let result = [...problems];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q),
      );
    }
    if (filters.difficulty) {
      result = result.filter((p) => p.difficulty === filters.difficulty);
    }
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter((p) => filters.tags.every((t) => p.tags.includes(t)));
    }
    if (filters.status === "solved") {
      result = result.filter((p) => p.solvedByUser);
    } else if (filters.status === "unsolved") {
      result = result.filter((p) => !p.solvedByUser && !p.attempted);
    } else if (filters.status === "attempted") {
      result = result.filter((p) => p.attempted && !p.solvedByUser);
    }
    return result;
  },

  async getProblem(id) {
    await delay(100);
    return problems.find((p) => p.id === id) || null;
  },

  async getContests(status) {
    await delay(150);
    return status ? contests.filter((c) => c.status === status) : contests;
  },

  async getContest(id) {
    await delay(150);
    const c = contests.find((item) => item.id === id);
    return c ? { ...c, standings: contestStandings } : null;
  },

  async getCourses(filters = {}) {
    await delay(150);
    let result = [...courses];
    if (filters.category && filters.category !== "All") {
      result = result.filter((c) => c.category === filters.category);
    }
    if (filters.difficulty && filters.difficulty !== "All") {
      result = result.filter(
        (c) => c.difficulty.toLowerCase() === filters.difficulty.toLowerCase(),
      );
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(q));
    }
    return result;
  },

  async getCourse(id) {
    await delay(120);
    return courses.find((c) => c.id === id) || null;
  },

  async getLesson(courseId, lessonId) {
    await delay(100);
    return (
      lessons.find((l) => l.id === lessonId && l.courseId === courseId) ||
      lessons.find((l) => l.id === lessonId) ||
      null
    );
  },

  async getAssignments() {
    await delay(150);
    return assignments;
  },

  async getAssignment(id) {
    await delay(100);
    return assignments.find((a) => a.id === id) || null;
  },

  async getProfile(username) {
    await delay(150);
    return users.find((u) => u.username === username) || null;
  },

  async getRankings(filters = {}) {
    await delay(150);
    let result = [...users].sort((a, b) => b.rating - a.rating);
    if (filters.country) {
      result = result.filter((u) => u.country === filters.country);
    }
    return result;
  },

  async getSubmissions(userId) {
    await delay(150);
    return submissions.filter((s) => !userId || s.userId === userId);
  },

  async submitCode(data) {
    await delay(600);
    return {
      id: `sub-${Date.now()}`,
      verdict: "AC",
      time: 85,
      memory: 14.5,
      passedTests: "10/10",
      submittedAt: new Date().toISOString(),
      ...data,
    };
  },

  async enrollCourse(courseId) {
    await delay(200);
    return { success: true, courseId, message: "Enrolled successfully" };
  },

  async registerContest(contestId) {
    await delay(200);
    return { success: true, contestId, message: "Registered successfully" };
  },
};

export default api;
