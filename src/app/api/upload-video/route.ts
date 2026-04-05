import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

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
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Nenhum vídeo enviado." },
        { status: 400 }
      );
    }

    const extension = file.name.split(".").pop() || "mp4";
    const filePath = `${user.id}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from("product-videos")
      .upload(filePath, buffer, {
        contentType: file.type || "video/mp4",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { ok: false, error: uploadError.message },
        { status: 500 }
      );
    }

    const { data: publicData } = supabaseAdmin.storage
      .from("product-videos")
      .getPublicUrl(filePath);

    return NextResponse.json({
      ok: true,
      url: publicData.publicUrl,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro ao enviar vídeo." },
      { status: 500 }
    );
  }
}
