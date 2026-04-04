import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params;

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
    const slug = String(body.slug || "").trim();

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

    if (!slug) {
      return NextResponse.json({ ok: false, error: "Digite o slug." }, { status: 400 });
    }

    const mainImage = image_urls[0] || null;
    const extraImages = image_urls.slice(1);

    const { error: updateError } = await supabaseAdmin
      .from("product_pages")
      .update({
        source_url,
        title,
        price,
        description,
        image_url: mainImage,
        whatsapp_number,
        slug,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 });
    }

    const { error: deleteImagesError } = await supabaseAdmin
      .from("product_page_images")
      .delete()
      .eq("product_page_id", id);

    if (deleteImagesError) {
      return NextResponse.json({ ok: false, error: deleteImagesError.message }, { status: 500 });
    }

    if (extraImages.length > 0) {
      const { error: insertImagesError } = await supabaseAdmin
        .from("product_page_images")
        .insert(
          extraImages.map((image_url: string, index: number) => ({
            product_page_id: id,
            image_url,
            sort_order: index + 1,
          }))
        );

      if (insertImagesError) {
        return NextResponse.json({ ok: false, error: insertImagesError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erro ao salvar alterações." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from("product_pages")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
