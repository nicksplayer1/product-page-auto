import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import EditorLiveShell from "@/components/editor-live-shell";

type Props = {
  params: Promise<{ id: string }>;
};

function getButtonLabel(buttonType: string) {
  switch (buttonType) {
    case "whatsapp":
      return "WhatsApp";
    case "website":
      return "Site";
    case "shopee":
      return "Shopee";
    case "mercadolivre":
      return "Mercado Livre";
    case "instagram":
      return "Instagram";
    case "custom":
      return "Botão personalizado";
    case "copy_link":
      return "Copiar link";
    case "share":
      return "Compartilhar";
    default:
      return buttonType;
  }
}

export default async function EditorPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/editor/${id}`);
  }

  const { data: product, error } = await supabaseAdmin
    .from("product_pages")
    .select("id, source_url, title, price, description, image_url, video_url, whatsapp_number, website_url, shopee_url, mercadolivre_url, instagram_url, custom_button_label, custom_button_url, theme, slug, status")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !product) {
    notFound();
  }

  const { data: imageRows } = await supabaseAdmin
    .from("product_page_images")
    .select("image_url, sort_order")
    .eq("product_page_id", id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const imageUrls = [
    product.image_url,
    ...((imageRows || []).map((row) => row.image_url)),
  ].filter(Boolean) as string[];

  const { data: clickRows } = await supabaseAdmin
    .from("product_page_clicks")
    .select("button_type, created_at")
    .eq("product_page_id", id);

  const now = Date.now();
  const last7DaysLimit = now - 7 * 24 * 60 * 60 * 1000;

  const totalClicks = clickRows?.length || 0;
  const last7DaysClicks =
    clickRows?.filter((row) => {
      const ts = new Date(row.created_at).getTime();
      return ts >= last7DaysLimit;
    }).length || 0;

  const countsMap = new Map<string, number>();

  for (const row of clickRows || []) {
    const current = countsMap.get(row.button_type) || 0;
    countsMap.set(row.button_type, current + 1);
  }

  const byButton = Array.from(countsMap.entries())
    .map(([buttonType, total]) => ({
      buttonType,
      label: getButtonLabel(buttonType),
      total,
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <EditorLiveShell
      product={product}
      imageUrls={imageUrls}
      analytics={{
        totalClicks,
        last7DaysClicks,
        byButton,
      }}
    />
  );
}
