import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/lib/posts";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "Post não encontrado",
    };
  }

  return {
    title: `${post.title} | Atual Supermercados`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="text-red-600 hover:text-red-700 font-medium mb-6 inline-block transition-colors"
          >
            ← Voltar para o blog
          </Link>

          <article className="bg-white border border-gray-200 rounded-lg p-8 md:p-12">
            <time className="text-sm text-gray-500">
              {new Date(post.date).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6">
              {post.title}
            </h1>
            <div className="flex items-center mb-8 pb-8 border-b border-gray-200">
              <span className="text-gray-600">Por {post.author}</span>
            </div>
            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </div>
      </div>
    </div>
  );
}
