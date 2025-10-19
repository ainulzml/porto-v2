import CategoryCard from '../components/CategoryCard'
import { getCategoryCounts } from '@/lib/posts'

export default async function CategoriesPage() {
  const categories = await getCategoryCounts()

  return (
    <main className="mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Kategori</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(c => (
          <CategoryCard key={c.category} category={c.category} count={c.count} />
        ))}
      </div>
    </main>
  )
}
