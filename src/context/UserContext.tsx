"use client";

import { UserProfile, UserType } from "@/utils/commonInterface/userInterface";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

interface PaymentInfo {
  gigId: string;
  gigTitle: string;
  gigDescription: string;
  amount: number;
  refId: string;
}

interface UserContextType {
  user: UserType | null;
  paymentInfo: PaymentInfo;
  setPaymentInfo: (info: PaymentInfo) => void;
  redirectUrl: string;
  setRedirectUrl: (url: string) => void;
  setUser: (user: UserType | null) => void;
  setUserProfile: (user: UserProfile) => void;
  setRole: (role: string) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  resetUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
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
  const [paymentInfo, setPaymentState] = useState<PaymentInfo>({
    gigId: "",
    gigTitle: "",
    gigDescription: "",
    amount: 0,
    refId: "",
  })
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [unreadCount, setUnreadCountState] = useState<number>(0);
  const setUser = (newUser: UserType | null) => setUserState({ ...user, ...(newUser as UserType) });
  const setUserProfile = (newProfile: UserProfile) => {
    if (!user || !user._id) return;
    setUserState({
      ...user,
      profile: newProfile,
    } as UserType);
  };

  const setRole = (role: string) => {
    setUserState((prev) => (prev ? { ...prev, role } : prev));
  };

  const setPaymentInfo = (info: PaymentInfo) => {
    setPaymentState(info);
  }

  const setUnreadCount = (count: number) => {
    setUnreadCountState(count);
  }

  const resetUser = () => setUserState(null);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        paymentInfo,
        setPaymentInfo,
        setRole,
        resetUser,
        redirectUrl,
        setRedirectUrl,
        setUserProfile,
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
