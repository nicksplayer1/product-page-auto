\
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { slugify } from "@/lib/slugify";

type Props = {
  params: Promise<{ id: string }>;
};

function normalizeImageUrls(value: unknown) {
  return Array.isArray(value)
    ? value.map((item: unknown) => String(item).trim()).filter(Boolean)
    : [];
}

export async function PATCH(request: Request, { params }: Props) {
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

    const { data: existing } = await supabaseAdmin
      .from("product_pages")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Produto não encontrado." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const source_url = String(body.source_url || "").trim() || null;
    const title = String(body.title || "").trim();
    const price = String(body.price || "").trim() || null;
    const description = String(body.description || "").trim() || null;
    const whatsapp_number = String(body.whatsapp_number || "").trim();
    const video_url = String(body.video_url || "").trim() || null;
    const slug = slugify(String(body.slug || title || "").trim());
    const image_urls = normalizeImageUrls(body.image_urls);

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Digite o nome do produto." },
        { status: 400 }
      );
    }

    if (!whatsapp_number) {
      return NextResponse.json(
        { ok: false, error: "Digite o WhatsApp." },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { ok: false, error: "Digite um slug válido." },
        { status: 400 }
      );
    }

    const mainImage = image_urls[0] || null;
    const galleryImages = image_urls.slice(1);

    const { error: updateError } = await supabaseAdmin
      .from("product_pages")
      .update({
        source_url,
        title,
        price,
        description,
        image_url: mainImage,
        video_url,
        whatsapp_number,
        slug,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { ok: false, error: updateError.message },
        { status: 500 }
      );
    }

    const { error: deleteError } = await supabaseAdmin
      .from("product_page_images")
      .delete()
      .eq("product_page_id", id);

    if (deleteError) {
      return NextResponse.json(
        { ok: false, error: deleteError.message },
        { status: 500 }
      );
    }

    if (galleryImages.length > 0) {
      const payload = galleryImages.map((image_url, index) => ({
        product_page_id: id,
        image_url,
        sort_order: index + 1,
      }));

      const { error: insertError } = await supabaseAdmin
        .from("product_page_images")
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
      { ok: false, error: "Erro ao salvar página." },
      { status: 500 }
    );
  }
}
