import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: Props) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("product_pages")
    .update({
      status: "published",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, slug, status")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Erro ao publicar." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    id: data.id,
    slug: data.slug,
    status: data.status,
  });
}
