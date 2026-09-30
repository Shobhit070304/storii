import { useState, useEffect } from "react";

const BACKEND_URL = (import.meta.env.BACKEND_URL || "").replace(/\/+$/, "");
const API_BASE = BACKEND_URL ? `${BACKEND_URL}/api` : "/api";

export const auth = {
  getToken() {
    return localStorage.getItem("token");
  },
  getUser() {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  setSession(token, user) {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  },
  clear() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

async function request(path, options = {}) {
  const token = auth.getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Request failed (${res.status})`);
  }
  return json.data !== undefined ? json.data : json;
}

export const api = {
  getQuestions(params) {
    const q = new URLSearchParams();
    if (params?.category && params.category !== "all") q.set("category", params.category);
    if (params?.q) q.set("q", params.q);
    if (params?.sort) q.set("sort", params.sort);
    return request(`/questions${q.toString() ? `?${q}` : ""}`);
  },

  getQuestion(id) {
    return request(`/questions/${id}`);
  },

  createQuestion(data) {
    return request("/questions", { method: "POST", body: data });
  },

  getAnswers(questionId) {
    return request(`/questions/${questionId}/experiences`);
  },

  createAnswer(questionId, data) {
    return request(`/questions/${questionId}/experiences`, {
      method: "POST",
      body: data,
    });
  },

  getContributions() {
    return request("/users/me/contributions");
  },

  getStats() {
    return request("/stats");
  },

  async loginGoogle(credential) {
    const res = await request("/auth/google", {
      method: "POST",
      body: { credential },
    });
    if (res.token) {
      auth.setSession(res.token, res.user);
    }
    return res;
  },

  async logout() {
    try {
      await request("/auth/logout", { method: "POST" });
    } finally {
      auth.clear();
    }
  },
};

// Minimal, straightforward data-fetching hooks
export function useQuestions(params) {
  const [questions, setQuestions] = useState();
  useEffect(() => {
    api
      .getQuestions(params)
      .then((data) => setQuestions(Array.isArray(data) ? data : []))
      .catch(() => setQuestions([]));
  }, [params?.category, params?.q, params?.sort]);
  return questions;
}

export function useQuestion(id) {
  const [question, setQuestion] = useState();
  useEffect(() => {
    if (!id) return;
    api
      .getQuestion(id)
      .then(setQuestion)
      .catch(() => setQuestion(null));
  }, [id]);
  return question;
}

export function useAnswers(questionId) {
  const [answers, setAnswers] = useState();
  useEffect(() => {
    if (!questionId) return;
    api
      .getAnswers(questionId)
      .then((data) => setAnswers(Array.isArray(data) ? data : []))
      .catch(() => setAnswers([]));
  }, [questionId]);
  return answers;
}

export function useStats() {
  const [stats, setStats] = useState({ questions: 0, experiences: 0, contributors: 0 });
  useEffect(() => {
    api
      .getStats()
      .then((data) => data && setStats(data))
      .catch(() => {});
  }, []);
  return stats;
}

export function useMyContributions() {
  const [data, setData] = useState({ questions: [], answers: [] });
  useEffect(() => {
    api
      .getContributions()
      .then((res) => res && setData(res))
      .catch(() => {});
  }, []);
  return data;
}
