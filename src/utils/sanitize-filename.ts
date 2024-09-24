export function sanitizeFilename(filename: string): string {
  const normalized = filename.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const forbiddenChars = /[/\\?%*:|"<>]/g;
  return normalized.replace(forbiddenChars, '-');
}
