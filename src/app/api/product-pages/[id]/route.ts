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

function normalizeOptional(value: unknown) {
  const text = String(value || "").trim();
  return text || null;
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

    const source_url = normalizeOptional(body.source_url);
    const title = String(body.title || "").trim();
    const price = normalizeOptional(body.price);
    const description = normalizeOptional(body.description);
    const whatsapp_number = String(body.whatsapp_number || "").trim();
    const video_url = normalizeOptional(body.video_url);
    const website_url = normalizeOptional(body.website_url);
    const shopee_url = normalizeOptional(body.shopee_url);
    const mercadolivre_url = normalizeOptional(body.mercadolivre_url);
    const instagram_url = normalizeOptional(body.instagram_url);
    const custom_button_label = normalizeOptional(body.custom_button_label);
    const custom_button_url = normalizeOptional(body.custom_button_url);
    const theme = String(body.theme || "clean").trim() || "clean";
    const slug = slugify(String(body.slug || title || "").trim());
    const image_urls = normalizeImageUrls(body.image_urls);

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Digite o nome do produto." },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { ok: false, error: "Digite um slug válido." },
        { status: 400 }
      );
    }

    if (!whatsapp_number && !website_url && !shopee_url && !mercadolivre_url && !instagram_url && !custom_button_url) {
      return NextResponse.json(
        { ok: false, error: "Preencha ao menos uma forma de ação: WhatsApp ou algum link." },
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
        website_url,
        shopee_url,
        mercadolivre_url,
        instagram_url,
        custom_button_label,
        custom_button_url,
        theme,
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
