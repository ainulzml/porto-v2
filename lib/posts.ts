import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export type PostMeta = {
  title: string
  date: string
  excerpt?: string
  slug: string
  category?: string | string[]
  image?: string
  author?: string
  tags?: string[]
}

export async function getPostSlugs(): Promise<string[]> {
  const files = await fs.promises.readdir(postsDirectory)
  return files.filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, ''))
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = await fs.promises.readFile(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  const meta: PostMeta = {
    title: String(data.title || slug),
    date: String(data.date || ''),
    excerpt: String(data.excerpt || ''),
    slug,
    category: data.category || data.categories || undefined,
    image: data.image || undefined,
    author: data.author || undefined,
    tags: data.tags || data.tag || undefined,
  }

  return { meta, contentHtml }
}

export async function getAllPosts() {
  const slugs = await getPostSlugs()
  const posts = await Promise.all(slugs.map(async s => {
    const { meta } = await getPostBySlug(s)
    return meta
  }))
  // sort by date desc
  posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  return posts
}

export async function getTotalPages(perPage: number) {
  const posts = await getAllPosts()
  return Math.max(1, Math.ceil(posts.length / perPage))
}

export async function getPostsPage(page: number, perPage: number) {
  const posts = await getAllPosts()
  const start = (page - 1) * perPage
  return posts.slice(start, start + perPage)
}

export async function getAllCategories() {
  const posts = await getAllPosts()
  const set = new Set<string>()
  posts.forEach(p => {
    const cat = p.category
    if (!cat) return
    if (Array.isArray(cat)) cat.forEach(c => set.add(String(c)))
    else set.add(String(cat))
  })
  return Array.from(set)
}

export async function getPostsByCategory(category: string) {
  const posts = await getAllPosts()
  return posts.filter(p => {
    if (!p.category) return false
    if (Array.isArray(p.category)) return p.category.includes(category)
    return p.category === category
  })
}

export async function getCategoryCounts() {
  const posts = await getAllPosts()
  const counts = new Map<string, number>()
  posts.forEach(p => {
    const cat = p.category
    if (!cat) return
    if (Array.isArray(cat)) {
      cat.forEach(c => counts.set(String(c), (counts.get(String(c)) || 0) + 1))
    } else {
      const key = String(cat)
      counts.set(key, (counts.get(key) || 0) + 1)
    }
  })
  return Array.from(counts.entries()).map(([category, count]) => ({ category, count }))
}
