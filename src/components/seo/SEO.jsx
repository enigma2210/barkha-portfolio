import { Helmet } from 'react-helmet-async';
import { PERSON } from '../../data/siteData';

const DEFAULT_DESCRIPTION = 'Barkha Manral writes and works across Internet governance, digital rights, cybersecurity, AI policy, and public-interest technology.';

function absoluteUrl(pathOrUrl = '/') {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const base = PERSON.website.startsWith('http') ? PERSON.website : `https://${PERSON.website}`;
  return new URL(pathOrUrl, base).toString();
}

export function SEO({
  title = PERSON.nameEn,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image,
  type = 'website',
  article,
}) {
  const pageTitle = title.includes(PERSON.nameEn) ? title : `${title} | ${PERSON.nameEn}`;
  const canonical = absoluteUrl(path);
  const imageUrl = image ? absoluteUrl(image) : undefined;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={PERSON.nameEn} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}

      <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}

      {article?.publishedTime ? <meta property="article:published_time" content={article.publishedTime} /> : null}
      {article?.modifiedTime ? <meta property="article:modified_time" content={article.modifiedTime} /> : null}
      {article?.author ? <meta property="article:author" content={article.author} /> : null}
      {article?.section ? <meta property="article:section" content={article.section} /> : null}
      {(article?.tags || []).map((tag) => (
        <meta property="article:tag" content={tag} key={tag} />
      ))}
    </Helmet>
  );
}
