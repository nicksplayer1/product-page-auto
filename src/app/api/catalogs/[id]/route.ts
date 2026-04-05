import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { slugify } from "@/lib/slugify";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
    }

    const body = await request.json();
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim() || null;
    const slugInput = String(body.slug || "").trim();

    if (!name) {
      return NextResponse.json({ ok: false, error: "Digite o nome do catálogo." }, { status: 400 });
    }

    const slug = slugify(slugInput || name);

    if (!slug) {
      return NextResponse.json({ ok: false, error: "Digite um slug válido." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("catalogs")
      .update({ name, description, slug })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erro ao salvar catálogo." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const { id } = await params;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
    }

    const { error: deleteItemsError } = await supabaseAdmin
      .from("catalog_items")
      .delete()
      .eq("catalog_id", id);

    if (deleteItemsError) {
      return NextResponse.json({ ok: false, error: deleteItemsError.message }, { status: 500 });
    }

    const { error: deleteCatalogError } = await supabaseAdmin
      .from("catalogs")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteCatalogError) {
      return NextResponse.json({ ok: false, error: deleteCatalogError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erro ao apagar catálogo." }, { status: 500 });
  }
}
