import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { slugify } from "@/lib/slugify";

function normalizeImageUrls(value: unknown) {
  return Array.isArray(value)
    ? value.map((item: unknown) => String(item).trim()).filter(Boolean)
    : [];
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

    const source_url = String(body.source_url || "").trim() || null;
    const title = String(body.title || "").trim();
    const price = String(body.price || "").trim() || null;
    const description = String(body.description || "").trim() || null;
    const whatsapp_number = String(body.whatsapp_number || "").trim();
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

    const mainImage = image_urls[0] || null;
    const galleryImages = image_urls.slice(1);
    const slug = `${slugify(title)}-${Date.now()}`;

    const { data, error } = await supabaseAdmin
      .from("product_pages")
      .insert([
        {
          user_id: user.id,
          source_url,
          title,
          price,
          description,
          image_url: mainImage,
          whatsapp_number,
          slug,
          status: "draft",
          mode: "auto",
        },
      ])
      .select("id")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { ok: false, error: error?.message || "Erro ao criar página." },
        { status: 500 }
      );
    }

    if (galleryImages.length > 0) {
      const payload = galleryImages.map((image_url, index) => ({
        product_page_id: data.id,
        image_url,
        sort_order: index + 1,
      }));

      const { error: imageError } = await supabaseAdmin
        .from("product_page_images")
        .insert(payload);

      if (imageError) {
        return NextResponse.json(
          { ok: false, error: imageError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro ao criar página." },
      { status: 500 }
    );
  }
}
