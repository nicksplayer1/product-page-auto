import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Props = {
  params: Promise<{ id: string }>;
};

type Item = {
  product_page_id: string;
  sort_order: number;
};

export async function POST(request: Request, { params }: Props) {
  const { id } = await params;

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

    const { data: catalog } = await supabaseAdmin
      .from("catalogs")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!catalog) {
      return NextResponse.json(
        { ok: false, error: "Catálogo não encontrado." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const items = Array.isArray(body.items) ? (body.items as Item[]) : [];

    const { error: deleteError } = await supabaseAdmin
      .from("catalog_items")
      .delete()
      .eq("catalog_id", id);

    if (deleteError) {
      return NextResponse.json(
        { ok: false, error: deleteError.message },
        { status: 500 }
      );
    }

    if (items.length > 0) {
      const payload = items.map((item) => ({
        catalog_id: id,
        product_page_id: item.product_page_id,
        sort_order: Number(item.sort_order) || 0,
      }));

      const { error: insertError } = await supabaseAdmin
        .from("catalog_items")
        .insert(payload);

      if (insertError) {
        return NextResponse.json(
          { ok: false, error: insertError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro ao salvar catálogo." },
      { status: 500 }
    );
  }
}
