"use client";

import { UserType } from "@/utils/commonInterface/userInterface";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

interface UserContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  setRole: (role: string) => void;
  resetUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    // throw new Error("useUser must be used within a UserProvider");
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({
  children,
  currentUser,
}: {
  children: ReactNode;
  currentUser: UserType | null;
}) => {
  const [user, setUserState] = useState<UserType | null>(currentUser);

  const setUser = (newUser: UserType | null) => setUserState(newUser);

  const setRole = (role: string) => {
    setUserState((prev) => (prev ? { ...prev, role } : prev));
  };

  const resetUser = () => setUserState(null);

  return (
    <UserContext.Provider value={{ user, setUser, setRole, resetUser }}>
      {children}
    </UserContext.Provider>
  );
};
