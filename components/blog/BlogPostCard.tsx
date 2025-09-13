import Link from 'next/link'
import { DocumentTextIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline'
import { BlogPost } from '@/types/firebase'
import SecureImage from '@/components/ui/SecureImage'

interface BlogPostCardProps {
  post: BlogPost
  featured?: boolean
}

export default function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  const cardClasses = featured 
    ? "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    : "bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"

  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className={cardClasses}>
        {/* Featured Image */}
        {post.mainImage ? (
          <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
            <SecureImage
              src={post.mainImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              fallbackIcon={DocumentTextIcon}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
          </div>
        ) : (
          <div className={`${featured ? 'h-64' : 'h-48'} bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center`}>
            <DocumentTextIcon className="h-16 w-16 text-primary-400" />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Category */}
          <div className="mb-3">
            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h3 className={`font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 mb-3 ${
            featured ? 'text-2xl' : 'text-xl'
          }`}>
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className={`text-gray-600 mb-4 line-clamp-3 ${
            featured ? 'text-lg' : 'text-base'
          }`}>
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <UserIcon className="h-4 w-4" />
              <span>{post.authorName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
