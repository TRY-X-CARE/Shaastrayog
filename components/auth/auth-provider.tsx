"use client";

import {
  SessionProvider,
  useSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from "next-auth/react";
import { toast } from "sonner";
import { createContext, useContext } from "react";

export type User = {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isUserLoggedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isUserLoggedIn: false,
  signIn: async () => {},
  signOut: () => {},
});

const AuthProviderInner = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }
    : null;

  const isLoading = status === "loading";
  const isUserLoggedIn = !!user;

  const signIn = async (email: string, password: string) => {
    const result = await nextAuthSignIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      throw new Error(result.error);
    }
  };

  const signOut = () => {
    nextAuthSignOut({ redirect: false }).then(() => {
      toast.success("Sign out successful!");
      window.location.reload();
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isUserLoggedIn, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider>
    <AuthProviderInner>{children}</AuthProviderInner>
  </SessionProvider>
);

export const useAuth = () => useContext(AuthContext);
