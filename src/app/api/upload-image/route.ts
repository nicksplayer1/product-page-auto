import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function sanitizeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
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

    const formData = await request.formData();
    const files = formData.getAll("files").filter((item) => item instanceof File) as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    const uploaded: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeName = sanitizeFileName(file.name || "imagem");
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

      const { error } = await supabaseAdmin.storage
        .from("product-images")
        .upload(path, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (error) {
        return NextResponse.json(
          { ok: false, error: error.message },
          { status: 500 }
        );
      }

      const { data } = supabaseAdmin.storage
        .from("product-images")
        .getPublicUrl(path);

      uploaded.push(data.publicUrl);
    }

    return NextResponse.json({
      ok: true,
      urls: uploaded,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro ao enviar imagem." },
      { status: 500 }
    );
  }
}
