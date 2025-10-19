import { getPostBySlug } from '@/lib/posts'
import Sidebar from '../components/Sidebar'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  const slugs = await (await import('@/lib/posts')).getPostSlugs()
  return slugs.map(s => ({ slug: s }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { meta } = await (await import('@/lib/posts')).getPostBySlug(params.slug)
  const title = `${meta.title} - Porto`
  const description = meta.excerpt || `Artikel ${meta.title}`
  const url = `https://your-site.example.com/blog/${meta.slug}`
  const image = meta.image || '/og-default.png'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [image],
      type: 'article',
      publishedTime: meta.date,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = params
  const { meta, contentHtml } = await getPostBySlug(slug)
  const categories = await (await import('@/lib/posts')).getCategoryCounts()
  const all = await (await import('@/lib/posts')).getAllPosts()
  const recent = all.slice(0, 5).map(p => ({ title: p.title, slug: p.slug }))

  const cats = Array.isArray(meta.category) ? meta.category : meta.category ? [meta.category] : []

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": meta.title,
    "description": meta.excerpt,
    "image": meta.image || '/og-default.png',
    "author": {
      "@type": "Person",
      "name": meta.author || 'Unknown'
    },
    "datePublished": meta.date,
    "mainEntityOfPage": `https://your-site.example.com/blog/${meta.slug}`
  }

  return (
    <main className="mx-auto py-12 px-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <LinkBack />
          <header className="mb-6">
            <h1 className="text-4xl font-bold mb-2">{meta.title}</h1>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">{meta.date}</div>
              <div className="flex gap-2">
                {cats.map(c => (
                  <a key={c} href={`/blog/categories/${encodeURIComponent(c)}`} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{c}</a>
                ))}
              </div>
            </div>
          </header>

          <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </section>

        <aside>
          <Sidebar categories={categories} recent={recent} />
        </aside>
      </div>
    </main>
  )
}

function LinkBack() {
  return (
    <div className="mb-4">
      <a href="/blog" className="text-sky-600 hover:underline">← Kembali ke Blog</a>
    </div>
  )
}
