// Verified authors who get the 1BTC badge
export const VERIFIED_AUTHORS = ['1btc.news (@1btcnews)', '1btc.chat'];

export function isVerifiedAuthor(author: string | undefined): boolean {
  return author ? VERIFIED_AUTHORS.includes(author) : false;
}

// Calculate reading time (assumes ~200 words per minute)
export function getReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

// Format date for display
export function formatDate(timestamp: string | number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
