import { create } from "zustand";

const getPuter = () =>
  typeof window !== "undefined" && window.puter ? window.puter : null;

export const usePuterStore = create((set, get) => {
  const setError = (msg) => {
    set({
      error: msg,
      isLoading: false,
      auth: {
        user: null,
        isAuthenticated: false,
        signIn: get().auth.signIn,
        signOut: get().auth.signOut,
        refreshUser: get().auth.refreshUser,
        checkAuthStatus: get().auth.checkAuthStatus,
        getUser: get().auth.getUser,
      },
    });
  };

  const checkAuthStatus = async () => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return false;
    }
    set({ isLoading: true, error: null });
    try {
      const isSignedIn = await puter.auth.isSignedIn();
      if (isSignedIn) {
        const user = await puter.auth.getUser();
        set({
          auth: {
            user,
            isAuthenticated: true,
            signIn: get().auth.signIn,
            signOut: get().auth.signOut,
            refreshUser: get().auth.refreshUser,
            checkAuthStatus: get().auth.checkAuthStatus,
            getUser: () => user,
          },
          isLoading: false,
        });
        return true;
      } else {
        set({
          auth: {
            user: null,
            isAuthenticated: false,
            signIn: get().auth.signIn,
            signOut: get().auth.signOut,
            refreshUser: get().auth.refreshUser,
            checkAuthStatus: get().auth.checkAuthStatus,
            getUser: () => null,
          },
          isLoading: false,
        });
        return false;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to check auth status";
      setError(msg);
      return false;
    }
  };

  const signIn = async () => {
    const puter = getPuter();
    if (!puter) return setError("Puter.js not available");
    set({ isLoading: true, error: null });
    try {
      await puter.auth.signIn();
      await checkAuthStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    }
  };

  const signOut = async () => {
    const puter = getPuter();
    if (!puter) return setError("Puter.js not available");
    set({ isLoading: true, error: null });
    try {
      await puter.auth.signOut();
      set({
        auth: {
          user: null,
          isAuthenticated: false,
          signIn: get().auth.signIn,
          signOut: get().auth.signOut,
          refreshUser: get().auth.refreshUser,
          checkAuthStatus: get().auth.checkAuthStatus,
          getUser: () => null,
        },
        isLoading: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign out failed");
    }
  };

  const refreshUser = async () => {
    const puter = getPuter();
    if (!puter) return setError("Puter.js not available");
    set({ isLoading: true, error: null });
    try {
      const user = await puter.auth.getUser();
      set({
        auth: {
          user,
          isAuthenticated: true,
          signIn: get().auth.signIn,
          signOut: get().auth.signOut,
          refreshUser: get().auth.refreshUser,
          checkAuthStatus: get().auth.checkAuthStatus,
          getUser: () => user,
        },
        isLoading: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh user");
    }
  };

  const init = () => {
    const puter = getPuter();
    if (puter) {
      set({ puterReady: true });
      checkAuthStatus();
      return;
    }
    const interval = setInterval(() => {
      if (getPuter()) {
        clearInterval(interval);
        set({ puterReady: true });
        checkAuthStatus();
      }
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      if (!getPuter()) setError("Puter.js failed to load within 10 seconds");
    }, 10000);
  };

  const fsCall = (fnName, ...args) => {
    const puter = getPuter();
    if (!puter) return setError("Puter.js not available");
    return puter.fs[fnName](...args);
  };

  const aiCall = (fnName, ...args) => {
    const puter = getPuter();
    if (!puter) return setError("Puter.js not available");
    return puter.ai[fnName](...args);
  };

  const kvCall = (fnName, ...args) => {
    const puter = getPuter();
    if (!puter) return setError("Puter.js not available");
    return puter.kv[fnName](...args);
  };

  return {
    isLoading: true,
    error: null,
    puterReady: false,
    auth: {
      user: null,
      isAuthenticated: false,
      signIn,
      signOut,
      refreshUser,
      checkAuthStatus,
      getUser: () => get().auth.user,
    },
    fs: {
      write: (path, data) => fsCall("write", path, data),
      read: (path) => fsCall("read", path),
      readDir: (path) => fsCall("readdir", path),
      upload: (files) => fsCall("upload", files),
      delete: (path) => fsCall("delete", path),
    },
    ai: {
      chat: (prompt, imageURL, testMode, options) => aiCall("chat", prompt, imageURL, testMode, options),
      feedback: (path, message) => aiCall("chat", [{ role: "user", content: [{ type: "file", puter_path: path }, { type: "text", text: message }] }], { model: "claude-sonnet-4" }),
      img2txt: (image, testMode) => aiCall("img2txt", image, testMode),
    },
    kv: {
      get: (key) => kvCall("get", key),
      set: (key, value) => kvCall("set", key, value),
      delete: (key) => kvCall("delete", key),
      list: (pattern, returnValues = false) => kvCall("list", pattern, returnValues),
      flush: () => kvCall("flush"),
    },
    init,
    clearError: () => set({ error: null }),
  };
});