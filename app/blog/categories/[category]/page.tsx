import Link from 'next/link'
import { getPostsByCategory, getAllCategories, getCategoryCounts, getAllPosts } from '@/lib/posts'
import Sidebar from '../../components/Sidebar'
import BlogCard from '../../components/BlogCard'

type Props = { params: { category: string } }

export async function generateStaticParams() {
  const cats = await getAllCategories()
  return cats.map(c => ({ category: c }))
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  const cat = params.category
  return {
    title: `Kategori: ${cat} - Blog`,
    description: `Artikel dalam kategori ${cat}`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = params
  const posts = await getPostsByCategory(category)
  const categories = await getCategoryCounts()
  const all = await getAllPosts()
  const recent = all.slice(0, 5).map(p => ({ title: p.title, slug: p.slug }))

  return (
    <main className="mx-auto py-12 px-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">Kategori: {category}</h1>
          <Link href="/blog" className="text-sky-600 hover:underline mb-4 inline-block">← Kembali ke Blog</Link>

          <div className="grid gap-4">
            {posts.map(p => (
              <BlogCard key={p.slug} title={p.title} date={p.date} excerpt={p.excerpt} slug={p.slug} category={p.category} />
            ))}
          </div>
        </section>

        <aside>
          <Sidebar categories={categories} recent={recent} />
        </aside>
      </div>
    </main>
  )
}
