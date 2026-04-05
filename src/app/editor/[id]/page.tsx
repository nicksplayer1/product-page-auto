\
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import EditorLiveShell from "@/components/editor-live-shell";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditorPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("product_pages")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const { data: galleryRows } = await supabase
    .from("product_page_images")
    .select("image_url, sort_order")
    .eq("product_page_id", id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const imageUrls = [
    data.image_url,
    ...((galleryRows || []).map((row) => row.image_url)),
  ].filter(Boolean) as string[];

  return <EditorLiveShell product={data} imageUrls={imageUrls} />;
}
