import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fcfaf7] px-6 py-10 text-zinc-900">
      <section className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[32px] border border-[#ece4d8] bg-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur">
          <div className="grid gap-10 px-8 py-12 md:grid-cols-2 md:px-12 md:py-16">
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit rounded-full border border-[#ece4d8] bg-[#f9f5ef] px-4 py-2 text-sm font-medium text-zinc-700">
                Ferramenta de páginas de produto
              </span>

              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
                Crie páginas de produto bonitas e prontas para vender
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-600">
                Cole um link, preencha os dados, revise sua página e publique um
                link limpo para divulgar no WhatsApp, Instagram ou anúncios.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/create"
                  className="rounded-2xl bg-zinc-900 px-6 py-3 font-medium text-white transition hover:bg-zinc-700"
                >
                  Criar página automática
                </Link>

                <Link
                  href="/admin"
                  className="rounded-2xl border border-[#e4d8c7] bg-[#fbf8f3] px-6 py-3 font-medium text-zinc-800 transition hover:bg-white"
                >
                  Minhas páginas
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-full rounded-[28px] border border-[#ece4d8] bg-[#fbf8f3] p-6 shadow-sm">
                <div className="rounded-2xl border border-[#ece4d8] bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Exemplo de página
                  </p>

                  <h2 className="mt-3 text-2xl font-bold">
                    Organizador Dobrável Premium
                  </h2>

                  <p className="mt-3 text-3xl font-semibold">R$ 79,90</p>

                  <p className="mt-4 text-sm leading-7 text-zinc-600">
                    Visual limpo, botão de compra no WhatsApp e link próprio para
                    divulgar com rapidez.
                  </p>

                  <div className="mt-6 rounded-2xl border border-dashed border-[#e4d8c7] bg-[#f9f5ef] p-8 text-center text-sm text-zinc-500">
                    Galeria de imagens do produto
                  </div>

                  <button className="mt-6 w-full rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white">
                    Comprar pelo WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
