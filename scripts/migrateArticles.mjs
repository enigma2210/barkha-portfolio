import fs from 'fs/promises';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

const LEGACY = path.resolve('data/legacyArticles.json');

function stripHtml(html = '') {
  return String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildExcerpt(html, fallback = '') {
  const text = stripHtml(html || fallback);
  return text.length > 180 ? `${text.slice(0, 180).trim()}...` : text;
}

function parseDate(d) {
  if (!d) return null;
  const t = Date.parse(d);
  if (Number.isNaN(t)) return new Date().toISOString();
  return new Date(t).toISOString();
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY) in env. Aborting.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });

  const raw = await fs.readFile(LEGACY, 'utf8');
  const items = JSON.parse(raw);

  const author = 'Barkha Manral';
  const results = [];

  for (const it of items) {
    const slug = (it.id || it.title || '').toString().trim();
    const content = it.body || '';
    const excerpt = buildExcerpt(content, it.title || '');
    const category = it.category || it.cat || '';
    const tags = it.tag ? [it.tag] : [];
    const published_at = parseDate(it.date);

    // check existing
    const { data: existing, error: selErr } = await supabase
      .from('articles')
      .select('id,slug')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle();

    if (selErr) {
      console.error('Select error for', slug, selErr.message || selErr);
      results.push({ slug, status: 'error', error: selErr.message || selErr });
      continue;
    }

    if (existing) {
      console.log('Skipping existing article:', slug);
      results.push({ slug, status: 'skipped' });
      continue;
    }

    const row = {
      title: it.title || slug,
      slug,
      excerpt,
      content,
      cover_image: null,
      author,
      category,
      tags,
      published: true,
      published_at
    };

    const { data: ins, error: insErr } = await supabase
      .from('articles')
      .insert(row)
      .select();

    if (insErr) {
      console.error('Insert failed for', slug, insErr.message || insErr);
      results.push({ slug, status: 'error', error: insErr.message || insErr });
    } else {
      console.log('Inserted', slug);
      results.push({ slug, status: 'inserted', id: ins?.[0]?.id });
    }
  }

  console.log('\nSummary:');
  console.table(results);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
