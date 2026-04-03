import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: NextRequest, { params }: RouteProps) {
  const { id } = await params;

  const { data: currentPage, error: currentError } = await supabaseAdmin
    .from("product_pages")
    .select("id, title, slug, whatsapp_number")
    .eq("id", id)
    .single();

  if (currentError || !currentPage) {
    return NextResponse.json(
      { ok: false, error: "Página não encontrada." },
      { status: 404 }
    );
  }

  if (!currentPage.title || !currentPage.slug || !currentPage.whatsapp_number) {
    return NextResponse.json(
      { ok: false, error: "Preencha título, slug e WhatsApp antes de publicar." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("product_pages")
    .update({ status: "published" })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, error: "Erro ao publicar página." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, page: data });
}
