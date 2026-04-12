import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import UserHome from "./pages/UserHome";
import Dashboard from "./pages/Dashboard";
import Health from "./pages/Health";
import Food from "./pages/Food";
import Aqi from "./pages/Aqi";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Analysis from "./pages/Analysis";
import InstantAlert from "./pages/InstantAlert";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/PageTransition";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./lib/authContext";
import { supabase } from "./utils/supabase";

type HealthRecord = {
  id?: number | string;
  heart_rate?: number | null;
  bp?: string | number | null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
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
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/index.html"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <Register />
            </PageTransition>
          }
        />
        <Route
          path="/user-home"
          element={
            <ProtectedRoute>
              <PageTransition>
                <UserHome />
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
        <Route
          path="/health"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Health />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/food"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Food />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/aqi"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Aqi />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Community />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Profile />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Settings />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <PageTransition>
                <About />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Analysis />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/instant-alert"
          element={
            <ProtectedRoute>
              <PageTransition>
                <InstantAlert />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pricing"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Pricing />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [recordsError, setRecordsError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchHealthRecords = async () => {
      const { data, error } = await supabase.from("health_records").select("*");

      if (!active) return;
      if (error) {
        setRecordsError(error.message);
        setHealthRecords([]);
        return;
      }

      setRecordsError("");
      setHealthRecords((data ?? []) as HealthRecord[]);
    };

    void fetchHealthRecords();

    return () => {
      active = false;
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <section className="mx-4 mt-4 rounded-xl border border-border/60 bg-card/70 p-3 text-sm text-foreground">
          <p className="font-semibold">Health Records (Supabase)</p>
          {recordsError ? <p className="mt-1 text-xs text-health-rose">{recordsError}</p> : null}
          {!recordsError && !healthRecords.length ? <p className="mt-1 text-xs text-muted-foreground">No records found.</p> : null}
          {!recordsError && healthRecords.length ? (
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              {healthRecords.map((record, index) => (
                <p key={record.id ?? index}>
                  HR: {record.heart_rate ?? "N/A"} | BP: {record.bp ?? "N/A"}
                </p>
              ))}
            </div>
          ) : null}
        </section>
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
