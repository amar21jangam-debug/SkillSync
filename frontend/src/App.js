import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import { Toaster } from "sonner";

import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import Onboarding from "./pages/Onboarding";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./pages/Roadmap";
import Practice from "./pages/Practice";
import Performance from "./pages/Performance";
import Contests from "./pages/Contests";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Mentors from "./pages/Mentors";
import Connect from "./pages/Connect";
import Certificates from "./pages/Certificates";
import HowItWorks from "./pages/HowItWorks";

import "@/App.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: { background: "#1F1F1F", border: "1px solid #2A2A2A", color: "#fff", fontFamily: "Outfit, sans-serif" },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="roadmap" element={<Roadmap />} />
            <Route path="practice" element={<Practice />} />
            <Route path="performance" element={<Performance />} />
            <Route path="contests" element={<Contests />} />
            <Route path="groups" element={<Groups />} />
            <Route path="groups/:id" element={<GroupDetail />} />
            <Route path="mentors" element={<Mentors />} />
            <Route path="connect" element={<Connect />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="how-it-works" element={<HowItWorks />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
