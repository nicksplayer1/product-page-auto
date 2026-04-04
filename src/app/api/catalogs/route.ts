import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Não autenticado." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim() || null;
    const slug = slugify(String(body.slug || name || "").trim());

    if (!name) {
      return NextResponse.json(
        { ok: false, error: "Digite o nome do catálogo." },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { ok: false, error: "Digite um slug válido." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("catalogs")
      .insert([
        {
          user_id: user.id,
          name,
          slug,
          description,
        },
      ])
      .select("id, slug")
      .single();

    if (error || !data) {
      const message =
        error?.code === "23505"
          ? "Esse slug já existe. Escolha outro."
          : error?.message || "Erro ao criar catálogo.";

      return NextResponse.json(
        { ok: false, error: message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
      slug: data.slug,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro ao criar catálogo." },
      { status: 500 }
    );
  }
}
