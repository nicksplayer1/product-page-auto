export function formatPrice(value: string | null | undefined) {
  if (!value) return "Consulte o preço";

  const raw = String(value).trim();
  if (!raw) return "Consulte o preço";

  if (/r\$/i.test(raw)) {
    return raw;
  }

  const normalized = raw
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");

  const numberValue = Number(normalized);

  if (Number.isFinite(numberValue)) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numberValue);
  }

  return raw;
}
