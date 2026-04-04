\"use client\";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(nextPath);
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (data.session) {
        router.push("/admin");
        router.refresh();
      } else {
        setMessage("Conta criada. Agora faça login.");
        setMode("login");
      }
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Erro na autenticação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-6">
      <div className="mb-6 flex gap-3">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
            mode === "login"
              ? "bg-zinc-900 text-white"
              : "border border-[#e4d8c7] bg-white text-zinc-700"
          }`}
        >
          Entrar
        </button>

        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
            mode === "signup"
              ? "bg-zinc-900 text-white"
              : "border border-[#e4d8c7] bg-white text-zinc-700"
          }`}
        >
          Criar conta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="w-full rounded-2xl border border-[#e4d8c7] bg-white px-4 py-3 outline-none transition focus:border-zinc-900"
          />
        </div>

        {message && (
          <div className="rounded-2xl border border-[#ece4d8] bg-white px-4 py-3 text-sm text-zinc-700">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-zinc-900 px-5 py-4 font-medium text-white transition hover:bg-zinc-700 disabled:opacity-60"
        >
          {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Criar conta"}
        </button>
      </form>
    </div>
  );
}
