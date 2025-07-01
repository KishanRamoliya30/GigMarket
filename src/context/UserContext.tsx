"use client"
import { UserType } from "@/utils/commonInterface/userInterface";
import { createContext, ReactNode, useContext } from "react";

export const UserContext = createContext<UserType | null>(null);

export function UserProvider({ children, user }: { children: ReactNode; user: UserType }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
