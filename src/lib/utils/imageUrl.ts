const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';

export function resolveImageUrl(value?: string | null): string {
  const img = value?.trim() ?? '';
  if (!img) return '';
  if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('/')) return `${API_URL}${img}`;
  if (looksLikeBase64(img)) return `data:image/jpeg;base64,${img.replace(/\s/g, '')}`;
  return img;
}

export function fromDataOrUrl(data?: string | null, contentType?: string | null, url?: string | null): string {
  const resolved = resolveImageUrl(url);
  if (resolved) return resolved;
  const imgData = data?.trim() ?? '';
  if (!imgData) return '';
  if (imgData.startsWith('/') || imgData.startsWith('http') || imgData.startsWith('data:')) return resolveImageUrl(imgData);
  return `data:${contentType || 'image/jpeg'};base64,${imgData}`;
}

function looksLikeBase64(value: string): boolean {
  const c = value.replace(/\s/g, '');
  if (c.length < 128) return false;
  return (c.startsWith('/9j/') || c.startsWith('iVBOR') || c.startsWith('R0lGOD') || c.startsWith('UklGR')) && /^[A-Za-z0-9+/]+={0,2}$/.test(c);
}
