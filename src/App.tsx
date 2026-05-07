import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Home from "./pages/Home.tsx";
import Result from "./pages/Result.tsx";
import NotFound from "./pages/NotFound.tsx";
import Academy from "./pages/Academy.tsx";
import TopicDetail from "./pages/TopicDetail.tsx";
import Refine from "./pages/Refine.tsx";
import Auth from "./pages/Auth.tsx";
import Challenges from "./pages/Challenges.tsx";
import Profile from "./pages/Profile.tsx";
import Mentor from "./pages/Mentor.tsx";
import { AuthProvider } from "@/hooks/useAuth";
import { RequireAuth } from "@/components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
            <Route path="/explain" element={<RequireAuth><Index /></RequireAuth>} />
            <Route path="/refine" element={<RequireAuth><Refine /></RequireAuth>} />
            <Route path="/result" element={<RequireAuth><Result /></RequireAuth>} />
            <Route path="/academy" element={<RequireAuth><Academy /></RequireAuth>} />
            <Route path="/academy/:id" element={<RequireAuth><TopicDetail /></RequireAuth>} />
            <Route path="/mentor" element={<RequireAuth><Mentor /></RequireAuth>} />
            <Route path="/challenges" element={<RequireAuth><Challenges /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
