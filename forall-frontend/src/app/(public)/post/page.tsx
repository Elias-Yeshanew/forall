// src/app/(public)/post/page.tsx
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PostForm } from '@/components/forms/PostForm'

export default function PostPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-12">
        <PostForm />
      </main>
      <Footer />
    </div>
  )
}
