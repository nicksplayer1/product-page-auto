import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const product_page_id = String(body.product_page_id || "").trim();
    const button_type = String(body.button_type || "").trim();
    const destination_url = String(body.destination_url || "").trim() || null;

    if (!product_page_id || !button_type) {
      return NextResponse.json(
        { ok: false, error: "Dados inválidos." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("product_page_clicks")
      .insert([
        {
          product_page_id,
          button_type,
          destination_url,
        },
      ]);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro ao registrar clique." },
      { status: 500 }
    );
  }
}
