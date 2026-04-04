import Link from "next/link";
import CatalogCreateForm from "@/components/catalog-create-form";

export default function CreateCatalogPage() {
  return (
    <main className="min-h-screen bg-[#fcfaf7] px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-[#ece4d8] bg-white/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur md:p-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-[#f0e7db] bg-[#fbf8f3] p-5">
          <div>
            <h1 className="text-3xl font-bold">Criar catálogo</h1>
            <p className="mt-2 text-zinc-600">
              Organize seus produtos em links separados.
            </p>
          </div>

          <Link
            href="/catalogos"
            className="rounded-2xl border border-[#e4d8c7] bg-white px-5 py-3 text-sm font-medium transition hover:bg-[#faf6ef]"
          >
            Voltar
          </Link>
        </div>

        <CatalogCreateForm />
      </div>
    </main>
  );
}
