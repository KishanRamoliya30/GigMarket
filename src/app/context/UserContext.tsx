"use client";

import { createContext, useContext, useState } from "react";
import { LoginUser } from "../utils/interfaces";

interface UserContextType extends LoginUser {
  setUser: (user: LoginUser) => void;
  setRole: (role: string) => void;
  resetUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
};

export const UserProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: LoginUser;
}) => {
  const [user, setUserState] = useState(initialUser);

  const setRole = (role: string) => setUserState((u) => ({ ...u, role }));
  const resetUser = () =>
    setUserState({ _id: "", email: "", isAdmin: false, role: "" });
  const setUser = (user: LoginUser) =>
    setUserState(user);
  return (
    <UserContext.Provider value={{ ...user, setRole, resetUser,setUser }}>
      {children}
    </UserContext.Provider>
  );
};
