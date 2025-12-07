import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useAdmin = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setUserRole(data.role);
          // Check if role is one of the admin types
          const adminRoles = ['admin', 'admin_jurnalistik', 'admin_radio'];
          setIsAdmin(adminRoles.includes(data.role));
        } else {
          setIsAdmin(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkAdminRole();
    }
  }, [user, authLoading]);

  return { isAdmin, userRole, loading: loading || authLoading };
};
