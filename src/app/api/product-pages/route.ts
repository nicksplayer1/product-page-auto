import { NextResponse } from "next/server";
import { slugify } from "@/lib/slugify";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
    }

    const body = await request.json();
    const source_url = String(body.source_url || "").trim() || null;
    const title = String(body.title || "").trim();
    const price = String(body.price || "").trim() || null;
    const description = String(body.description || "").trim() || null;
    const whatsapp_number = String(body.whatsapp_number || "").trim();

    const rawImageUrls: unknown[] = Array.isArray(body.image_urls) ? (body.image_urls as unknown[]) : [];
    const image_urls = rawImageUrls
      .map((item: unknown) => String(item).trim())
      .filter((item: string) => Boolean(item));

    if (!title) {
      return NextResponse.json({ ok: false, error: "Digite o nome do produto." }, { status: 400 });
    }

    if (!whatsapp_number) {
      return NextResponse.json({ ok: false, error: "Digite o WhatsApp." }, { status: 400 });
    }

    const slug = `${slugify(title)}-${Date.now()}`;
    const mainImage = image_urls[0] || null;
    const extraImages = image_urls.slice(1);

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
          mode: source_url ? "auto" : "manual",
        },
      ])
      .select("id, slug")
      .single();

    if (error || !data) {
      return NextResponse.json({ ok: false, error: error?.message || "Erro ao criar página." }, { status: 500 });
    }

    if (extraImages.length > 0) {
      const { error: imagesError } = await supabaseAdmin
        .from("product_page_images")
        .insert(
          extraImages.map((image_url: string, index: number) => ({
            product_page_id: data.id,
            image_url,
            sort_order: index + 1,
          }))
        );

      if (imagesError) {
        return NextResponse.json({ ok: false, error: imagesError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, id: data.id, slug: data.slug });
  } catch {
    return NextResponse.json({ ok: false, error: "Erro ao criar página." }, { status: 500 });
  }
}
