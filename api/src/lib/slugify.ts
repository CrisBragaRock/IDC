import { db } from '../db';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}

export async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  let slug = base;
  let counter = 2;
  for (;;) {
    const { rows } = await db.query('SELECT id FROM ideas WHERE slug = $1', [slug]);
    if (!rows[0]) return slug;
    slug = `${base}-${counter++}`;
  }
}
