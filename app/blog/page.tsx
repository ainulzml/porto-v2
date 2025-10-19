import Link from 'next/link'
import { getPostsPage, getTotalPages, getCategoryCounts, getAllPosts } from '@/lib/posts'
import BlogCard from './components/BlogCard'
import CategoryCard from './components/CategoryCard'
import Sidebar from './components/Sidebar'

export async function generateMetadata() {
  return {
    title: 'Blog - Porto',
    description: 'Kumpulan tulisan dan artikel tentang pengembangan, proyek, dan catatan.'
  }
}

const PER_PAGE = 5

export default async function BlogPage() {
  const page = 1
  const posts = await getPostsPage(page, PER_PAGE)
  const totalPages = await getTotalPages(PER_PAGE)
  const categories = await getCategoryCounts()
  const all = await getAllPosts()
  const recent = all.slice(0, 5).map(p => ({ title: p.title, slug: p.slug }))

  return (
    <main className="mx-auto py-12 px-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-6">Blog</h1>

          <div className="grid gap-6">
            {posts.map(p => (
              <BlogCard key={p.slug} title={p.title} date={p.date} excerpt={p.excerpt} slug={p.slug} category={p.category} />
            ))}
          </div>

          <div className="mt-10">
            <Pagination current={page} total={totalPages} />
          </div>
        </section>

        <aside>
          <Sidebar categories={categories} recent={recent} />
        </aside>
      </div>
    </main>
  )
}

function Pagination({ current, total }: { current: number; total: number }) {
  if (total <= 1) return null
  return (
    <nav className="mt-8 flex gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const num = i + 1
        const href = num === 1 ? `/blog` : `/blog/page/${num}`
        return (
          <Link key={num} href={href} className={`px-3 py-1 rounded ${num === current ? 'bg-sky-600 text-white' : 'bg-gray-100'}`}>
            {num}
          </Link>
        )
      })}
    </nav>
  )
}
