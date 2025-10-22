import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import { UserManagementDashboard } from "./components/UserManagement/UserManagementDashboard";
import { UserProfileManagement } from "./components/UserManagement/UserProfileManagement";
import RequestDocument from "./pages/Documents/RequestDocument";
import MyRequests from "./pages/Documents/MyRequests";
import MyDocuments from "./pages/Documents/MyDocuments";
import DocumentRequestsQueue from "./pages/Documents/DocumentRequestsQueue";
import TemplateManager from "./pages/Documents/TemplateManager";
import TeamsDirectory from "./pages/Teams/TeamsDirectory";
import TeamDetail from "./pages/Teams/TeamDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user-management" 
                element={
                  <ProtectedRoute requiredRoles={['admin', 'hr']}>
                    <UserManagementDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfileManagement />
                  </ProtectedRoute>
                } 
              />
              <Route path="/documents/request" element={<ProtectedRoute><RequestDocument /></ProtectedRoute>} />
              <Route path="/documents/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
              <Route path="/documents/my-documents" element={<ProtectedRoute><MyDocuments /></ProtectedRoute>} />
              <Route path="/documents/queue" element={<ProtectedRoute requiredRoles={['admin', 'hr']}><DocumentRequestsQueue /></ProtectedRoute>} />
              <Route path="/documents/templates" element={<ProtectedRoute requiredRoles={['admin']}><TemplateManager /></ProtectedRoute>} />
              <Route path="/teams" element={<ProtectedRoute><TeamsDirectory /></ProtectedRoute>} />
              <Route path="/teams/:teamId" element={<ProtectedRoute><TeamDetail /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
