/**
 * Formats a price in PHP cents to a readable PHP currency string
 * @param priceInCents - Price in PHP cents (e.g., 100000 = ₱1,000.00)
 * @returns Formatted string with ₱ symbol (e.g., "₱1,000.00")
 */
export function formatPhpPrice(priceInCents: number | bigint): string {
  const price = Number(priceInCents) / 100;
  return `₱${price.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Parses a PHP price string to cents
 * @param priceString - Price as string (e.g., "1000.00" or "1000")
 * @returns Price in cents as number
 */
export function parsePhpPriceToCents(priceString: string): number {
  const price = Number.parseFloat(priceString);
  return Math.round(price * 100);
}
