import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "Student" | "Researcher" | "Journalist" | "Faculty";

export interface UserData {
  fullName: string;
  role: UserRole;
  institution?: string;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(() => {
    const saved = localStorage.getItem("linguistai_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (userData) {
      localStorage.setItem("linguistai_user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("linguistai_user");
    }
  }, [userData]);

  const logout = () => {
    setUserData(null);
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
