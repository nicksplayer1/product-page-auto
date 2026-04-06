import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { slugify } from "@/lib/slugify";

type Props = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, { params }: Props) {
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

    const { data: product, error: productError } = await supabaseAdmin
      .from("product_pages")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { ok: false, error: "Produto não encontrado." },
        { status: 404 }
      );
    }

    const copiedTitle = `${product.title} - Cópia`;
    const newSlug = `${slugify(copiedTitle)}-${Date.now()}`;

    const { data: newProduct, error: insertError } = await supabaseAdmin
      .from("product_pages")
      .insert([
        {
          user_id: user.id,
          source_url: product.source_url,
          title: copiedTitle,
          price: product.price,
          description: product.description,
          image_url: product.image_url,
          video_url: product.video_url,
          whatsapp_number: product.whatsapp_number,
          website_url: product.website_url,
          shopee_url: product.shopee_url,
          mercadolivre_url: product.mercadolivre_url,
          instagram_url: product.instagram_url,
          custom_button_label: product.custom_button_label,
          custom_button_url: product.custom_button_url,
          theme: product.theme || "clean",
          slug: newSlug,
          status: "draft",
          mode: product.mode || "auto",
        },
      ])
      .select("id")
      .single();

    if (insertError || !newProduct) {
      return NextResponse.json(
        { ok: false, error: insertError?.message || "Erro ao duplicar produto." },
        { status: 500 }
      );
    }

    const { data: galleryRows } = await supabaseAdmin
      .from("product_page_images")
      .select("image_url, sort_order")
      .eq("product_page_id", id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if ((galleryRows || []).length > 0) {
      const payload = (galleryRows || []).map((row) => ({
        product_page_id: newProduct.id,
        image_url: row.image_url,
        sort_order: row.sort_order,
      }));

      const { error: galleryError } = await supabaseAdmin
        .from("product_page_images")
        .insert(payload);

      if (galleryError) {
        return NextResponse.json(
          { ok: false, error: galleryError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      id: newProduct.id,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro ao duplicar produto." },
      { status: 500 }
    );
  }
}
