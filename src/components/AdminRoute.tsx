import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/integrations/supabase/AuthProvider";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { session, loading } = useAuth();
  const { isAdmin, loading: loadingRole } = useIsAdmin();
  const location = useLocation();

  if (loading || loadingRole) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-6 w-6 rounded-full border-2 border-primary border-b-transparent" aria-label="Carregando" />
      </main>
    );
  }

  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!isAdmin) return <Navigate to="/app" replace />;

  return <>{children}</>;
};

export default AdminRoute;
