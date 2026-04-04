import Link from "next/link";
import AuthForm from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#fcfaf7] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-[#ece4d8] bg-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur md:p-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[#f0e7db] bg-[#fbf8f3] p-5">
          <div>
            <h1 className="text-3xl font-bold">Entrar na sua conta</h1>
            <p className="mt-2 text-zinc-600">
              Cada usuário verá apenas suas próprias páginas e produtos.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]"
          >
            Voltar ao início
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <AuthForm />

          <div className="rounded-[24px] border border-[#ece4d8] bg-[#fbf8f3] p-6">
            <h2 className="text-2xl font-bold">O que muda agora</h2>

            <div className="mt-5 space-y-4 text-zinc-700">
              <div className="rounded-2xl border border-[#ece4d8] bg-white p-4">
                Cada pessoa terá suas próprias páginas.
              </div>
              <div className="rounded-2xl border border-[#ece4d8] bg-white p-4">
                O admin mostrará só os produtos da conta logada.
              </div>
              <div className="rounded-2xl border border-[#ece4d8] bg-white p-4">
                O catálogo mostrará só os produtos publicados da conta logada.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
