"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLogged(!!session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLogged(!!session);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);
  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.push("/");
    router.refresh();
  };
  if (!isLogged) return null;
  return (
    <button
      onClick={handleLogout}
      title="Cerrar sesión"
      className="ml-2 p-2 rounded-full bg-gradient-to-tr from-pink-500 to-blue-500 hover:from-blue-500 hover:to-pink-500 transition shadow-lg border-2 border-white/20"
      aria-label="Cerrar sesión"
      disabled={loading}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    </button>
  );
}
