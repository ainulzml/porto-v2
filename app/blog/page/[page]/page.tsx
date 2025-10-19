import Link from 'next/link'
import { getPostsPage, getTotalPages, getCategoryCounts, getAllPosts } from '@/lib/posts'
import BlogCard from '../../components/BlogCard'
import Sidebar from '../../components/Sidebar'

const PER_PAGE = 5

type Props = { params: { page: string } }

export async function generateStaticParams() {
  const total = await getTotalPages(PER_PAGE)
  return Array.from({ length: total }).map((_, i) => ({ page: String(i + 1) }))
}

export default async function BlogPageNumber({ params }: Props) {
  const pageNum = parseInt(params.page, 10) || 1
  const total = await getTotalPages(PER_PAGE)
  if (pageNum < 1 || pageNum > total) {
    return (
      <main className="mx-auto py-12 px-4 max-w-4xl">
        <h1>Halaman tidak ditemukan</h1>
      </main>
    )
  }

  const posts = await getPostsPage(pageNum, PER_PAGE)
  const categories = await getCategoryCounts()
  const all = await getAllPosts()
  const recent = all.slice(0, 5).map(p => ({ title: p.title, slug: p.slug }))

  return (
    <main className="mx-auto py-12 px-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-6">Blog - Halaman {pageNum}</h1>

          <div className="grid gap-6">
            {posts.map(p => (
              <BlogCard key={p.slug} title={p.title} date={p.date} excerpt={p.excerpt} slug={p.slug} category={p.category} />
            ))}
          </div>

          <div className="mt-10">
            <Pagination current={pageNum} total={total} />
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
