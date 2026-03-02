import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Home } from "./pages/Home";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { UserProvider, useUser } from "./context/UserContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { userData } = useUser();
  if (!userData) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.02 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="w-full"
  >
    {children}
  </motion.div>
);

export default function App() {
  const location = useLocation();

  return (
    <UserProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Landing />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </UserProvider>
  );
}
