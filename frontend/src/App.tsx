import { BrowserRouter, Route, Routes } from "react-router-dom";
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

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user-home" element={<UserHome />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/health" element={<Health />} />
      <Route path="/food" element={<Food />} />
      <Route path="/aqi" element={<Aqi />} />
      <Route path="/community" element={<Community />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
