import { useAuth } from "@/integrations/supabase/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useIsAdmin = () => {
  const { user } = useAuth();

  const { data: isAdmin, isLoading, error, refetch } = useQuery({
    queryKey: ["isAdmin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await (supabase as any)
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error && error.code !== "PGRST116") throw error; // ignore no rows
      return !!data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60,
  });

  return { isAdmin: !!isAdmin, loading: isLoading, error, refetch };
};
