import fs from 'fs/promises';
import path from 'path';

const src = path.resolve('assets/js/articles.js');
const temp = path.resolve('.temp_arts.mjs');
const out = path.resolve('data/legacyArticles.json');

async function extract() {
  const txt = await fs.readFile(src, 'utf8');
  const start = txt.indexOf('const ARTS =');
  if (start === -1) throw new Error('ARTS object not found');
  const braceStart = txt.indexOf('{', start);
  // find matching closing brace
  let i = braceStart;
  let depth = 0;
  for (; i < txt.length; i++) {
    const ch = txt[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  if (depth !== 0) throw new Error('Unable to find matching closing brace for ARTS');
  const objectString = txt.slice(braceStart, i + 1);
  const moduleContent = 'export default ' + objectString + '\n';
  await fs.writeFile(temp, moduleContent, 'utf8');

  // dynamic import
  const { default: ARTS } = await import('file://' + temp);
  await fs.unlink(temp).catch(() => {});

  // Convert entries to array
  const articles = Object.values(ARTS).map((a) => ({
    id: a.id || null,
    title: a.title || null,
    date: a.date || null,
    category: a.cat || a.category || null,
    tag: a.tag || null,
    body: a.body || a.content || null
  }));

  await fs.writeFile(out, JSON.stringify(articles, null, 2), 'utf8');
  console.log('Written', articles.length, 'articles to', out);
}

extract().catch((err) => {
  console.error(err);
  process.exit(1);
});
