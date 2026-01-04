import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user?.email) {
          localStorage.setItem('last_active_email', session.user.email);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error);
        // Clear invalid session
        setSession(null);
        setUser(null);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user?.email) {
          localStorage.setItem('last_active_email', session.user.email);
        }
      }
      setLoading(false);
    }).catch((error) => {
      console.error('Failed to get session:', error);
      setSession(null);
      setUser(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const [availableAccounts, setAvailableAccounts] = useState<{ user: User; session: Session }[]>([]);

  useEffect(() => {
    // Load available accounts from localStorage
    const stored = localStorage.getItem('ukkpk_accounts');
    if (stored) {
      setAvailableAccounts(JSON.parse(stored));
    }
  }, []);

  const addAccount = async () => {
    if (session && user) {
      // Save current session
      const currentAccounts = JSON.parse(localStorage.getItem('ukkpk_accounts') || '[]');
      // Check if already exists
      const exists = currentAccounts.some((acc: any) => acc.user.email === user.email);
      if (!exists) {
        const newAccounts = [...currentAccounts, { user, session }];
        localStorage.setItem('ukkpk_accounts', JSON.stringify(newAccounts));
        setAvailableAccounts(newAccounts);
      }
    }
    await signOut();
  };

  const switchAccount = async (targetEmail: string) => {
    const targetAccount = availableAccounts.find(acc => acc.user.email === targetEmail);
    
    if (targetAccount && session && user) {
      // Try to restore session first
      const { error } = await supabase.auth.setSession({
        access_token: targetAccount.session.access_token,
        refresh_token: targetAccount.session.refresh_token,
      });

      if (error) {
        console.error("Failed to switch account:", error);
        toast.error("Sesi telah berakhir. Silakan login kembali.");
        
        // Remove invalid account from storage
        const newAccounts = availableAccounts.filter(acc => acc.user.email !== targetEmail);
        localStorage.setItem('ukkpk_accounts', JSON.stringify(newAccounts));
        setAvailableAccounts(newAccounts);
        
        // Redirect to login to re-authenticate this account
        // We don't sign out the current user, just redirect to add account flow
        navigate("/auth", { state: { email: targetEmail } });
      } else {
        // Success - now update storage to swap accounts
        const currentAccounts = availableAccounts.filter(acc => acc.user.email !== targetEmail);
        const exists = currentAccounts.some(acc => acc.user.email === user.email);
        
        let newAccounts = currentAccounts;
        if (!exists) {
          newAccounts = [...currentAccounts, { user, session }];
        }
        
        localStorage.setItem('ukkpk_accounts', JSON.stringify(newAccounts));
        setAvailableAccounts(newAccounts);
        
        window.location.reload();
      }
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    addAccount,
    switchAccount,
    availableAccounts,
  };
};
