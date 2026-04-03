import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteProps) {
  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("product_pages")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { ok: false, error: "Página não encontrada." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, page: data });
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  const { id } = await params;
  const body = await request.json();

  const payload = {
    source_url: typeof body.source_url === "string" ? body.source_url.trim() || null : null,
    title: typeof body.title === "string" ? body.title.trim() : "",
    price: typeof body.price === "string" ? body.price.trim() || null : null,
    description:
      typeof body.description === "string" ? body.description.trim() || null : null,
    image_url: typeof body.image_url === "string" ? body.image_url.trim() || null : null,
    whatsapp_number:
      typeof body.whatsapp_number === "string" ? body.whatsapp_number.trim() : "",
    slug: typeof body.slug === "string" ? body.slug.trim() : "",
  };

  if (!payload.title) {
    return NextResponse.json(
      { ok: false, error: "Digite o nome do produto." },
      { status: 400 }
    );
  }

  if (!payload.whatsapp_number) {
    return NextResponse.json(
      { ok: false, error: "Digite o WhatsApp." },
      { status: 400 }
    );
  }

  if (!payload.slug) {
    return NextResponse.json(
      { ok: false, error: "Digite o slug." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("product_pages")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const isSlugConflict = error.message?.toLowerCase().includes("duplicate");
    return NextResponse.json(
      {
        ok: false,
        error: isSlugConflict
          ? "Esse slug já existe. Tente outro."
          : "Erro ao salvar página.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, page: data });
}
