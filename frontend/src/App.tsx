import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import UserHome from "./pages/UserHome";
import Dashboard from "./pages/Dashboard";
import Health from "./pages/Health";
import Food from "./pages/Food";
import Aqi from "./pages/Aqi";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/PageTransition";

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
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/user-home"
          element={
            <PageTransition>
              <UserHome />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              <Dashboard />
            </PageTransition>
          }
        />
        <Route
          path="/health"
          element={
            <PageTransition>
              <Health />
            </PageTransition>
          }
        />
        <Route
          path="/food"
          element={
            <PageTransition>
              <Food />
            </PageTransition>
          }
        />
        <Route
          path="/aqi"
          element={
            <PageTransition>
              <Aqi />
            </PageTransition>
          }
        />
        <Route
          path="/community"
          element={
            <PageTransition>
              <Community />
            </PageTransition>
          }
        />
        <Route
          path="/profile"
          element={
            <PageTransition>
              <Profile />
            </PageTransition>
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

const App = () => (
  <BrowserRouter>
    <AnimatedRoutes />
  </BrowserRouter>
);

export default App;
