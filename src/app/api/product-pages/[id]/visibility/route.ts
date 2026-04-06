import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Props = {
  params: Promise<{ id: string }>;
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

    const body = await request.json();
    const action = String(body.action || "").trim();

    if (!action || !["hide", "show"].includes(action)) {
      return NextResponse.json(
        { ok: false, error: "Ação inválida." },
        { status: 400 }
      );
    }

    const nextStatus = action === "hide" ? "hidden" : "published";

    const { error } = await supabaseAdmin
      .from("product_pages")
      .update({
        status: nextStatus,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, status: nextStatus });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro ao alterar visibilidade." },
      { status: 500 }
    );
  }
}
