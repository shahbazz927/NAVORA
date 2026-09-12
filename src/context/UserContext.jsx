import { createContext, useContext, useEffect, useState, useCallback } from 'react';

/* eslint-disable react-refresh/only-export-components */

const STORAGE_KEY = 'novera-state-v1';
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days — shared-device hygiene

const UserContext = createContext(null);

// F6: block __proto__/constructor/prototype pollution; F1/F2: TTL + stream allow-list
function safeParse(raw) {
  return JSON.parse(raw, (k, v) => (k === '__proto__' || k === 'constructor' || k === 'prototype' ? undefined : v));
}

function sanitizeState(obj) {
  if (!obj || typeof obj !== 'object') return {};
  // Cap chatHistory to prevent quota DoS (F9)
  if (Array.isArray(obj.chatHistory) && obj.chatHistory.length > 100) obj.chatHistory = obj.chatHistory.slice(-100);
  // Allow-list streams on load — prevents forged eligibility (F2)
  const ALLOWED = new Set(['mpc','bipc','commerce','arts','other','not_sure','class10','class12','graduate','parent','science_pcm','science_pcb']);
  if (obj.answers?.stream && !ALLOWED.has(String(obj.answers.stream).toLowerCase())) delete obj.answers.stream;
  if (obj.answers?.streamV2 && !ALLOWED.has(String(obj.answers.streamV2).toLowerCase())) delete obj.answers.streamV2;
  return obj;
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = safeParse(raw);
    // Support both legacy {..state} and new {v,ts,data} envelope
    if (parsed && typeof parsed === 'object' && 'data' in parsed && 'ts' in parsed) {
      if (Date.now() - (parsed.ts || 0) > TTL_MS) {
        try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
        return {};
      }
      return sanitizeState(parsed.data || {});
    }
    return sanitizeState(parsed);
  } catch {
    // ignore
  }
  return {};
}

export function UserProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try {
      // versioned envelope with timestamp — enables TTL expiry (F1) and future migrations
      const payload = { v: 1, ts: Date.now(), data: state };
      // Enforce cap before write (F9)
      if (payload.data?.chatHistory?.length > 100) payload.data.chatHistory = payload.data.chatHistory.slice(-100);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // quota exceeded — attempt to trim and retry once
      try {
        const trimmed = { ...state, chatHistory: (state.chatHistory || []).slice(-30) };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, ts: Date.now(), data: trimmed }));
      } catch {
        // ignore
      }
    }
  }, [state]);

  const setUserType = useCallback((userType) => {
    setState((prev) => ({ ...prev, userType }));
  }, []);

  const setOnboardingData = useCallback((onboardingData) => {
    setState((prev) => ({ ...prev, onboardingData }));
  }, []);

  const setAnswers = useCallback((answers) => {
    setState((prev) => ({ ...prev, answers }));
  }, []);

  const setRecommendation = useCallback((recommendation) => {
    setState((prev) => ({ ...prev, recommendation }));
  }, []);

  const setComparisonItems = useCallback((comparisonItems) => {
    setState((prev) => ({ ...prev, comparisonItems }));
  }, []);

  const addChatMessage = useCallback((message) => {
    setState((prev) => ({
      ...prev,
      chatHistory: [...(prev.chatHistory || []), message],
    }));
  }, []);

  const setChatHistory = useCallback((chatHistory) => {
    setState((prev) => ({ ...prev, chatHistory }));
  }, []);

  const setUser = useCallback((user) => {
    setState((prev) => ({ ...prev, user }));
  }, []);

  const reset = useCallback(() => {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
    setState({});
  }, []);

  const value = {
    userType: state.userType ?? null,
    onboardingData: state.onboardingData ?? {},
    answers: state.answers ?? {},
    recommendation: state.recommendation ?? null,
    comparisonItems: state.comparisonItems ?? [],
    chatHistory: state.chatHistory ?? [],
    user: state.user ?? null,
    setUser,
    setUserType,
    setOnboardingData,
    setAnswers,
    setRecommendation,
    setComparisonItems,
    addChatMessage,
    setChatHistory,
    reset,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}