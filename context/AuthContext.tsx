"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { signOut as parseSignOut, getCurrentUser } from "@/lib/parseAuth";

interface AuthContextValue {
  user: Parse.User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Parse.User | null>(null);
  const [loading, setLoading] = useState(true);

  function refreshUser() {
    initParse();
    setUser(getCurrentUser());
  }

  useEffect(() => {
    initParse();
    setUser(getCurrentUser());
    setLoading(false);
  }, []);

  async function signOut() {
    await parseSignOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
