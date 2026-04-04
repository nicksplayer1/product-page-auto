\"use client\";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef] disabled:opacity-60"
    >
      {loading ? "Saindo..." : "Sair"}
    </button>
  );
}
