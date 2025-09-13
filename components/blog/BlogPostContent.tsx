import { CalendarIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline'
import { BlogPost } from '@/types/firebase'

interface BlogPostContentProps {
  post: BlogPost
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        {/* Category */}
        <div className="mb-4">
          <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-primary-100 text-primary-800">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center space-x-6 text-gray-600 mb-6">
          <div className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5" />
            <span>{post.authorName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {post.excerpt}
          </p>
        )}

        {/* Featured Image */}
        {post.mainImage && (
          <div className="mb-8">
            <img
              src={post.mainImage}
              alt={post.title}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center space-x-2 mb-8">
            <TagIcon className="h-5 w-5 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div 
          className="rich-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      <style jsx global>{`
        .prose .rich-content {
          line-height: 1.8;
          color: #374151;
        }
        
        .prose .rich-content h1,
        .prose .rich-content h2,
        .prose .rich-content h3,
        .prose .rich-content h4,
        .prose .rich-content h5,
        .prose .rich-content h6 {
          color: #111827;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .prose .rich-content h2 {
          font-size: 1.875rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }
        
        .prose .rich-content h3 {
          font-size: 1.5rem;
        }
        
        .prose .rich-content p {
          margin-bottom: 1.5rem;
        }
        
        .prose .rich-content img {
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          margin: 2rem 0;
        }
        
        .prose .rich-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #6b7280;
          background-color: #f8fafc;
          padding: 1.5rem;
          border-radius: 0.5rem;
        }
        
        .prose .rich-content ul,
        .prose .rich-content ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }
        
        .prose .rich-content li {
          margin-bottom: 0.5rem;
        }
        
        .prose .rich-content code {
          background-color: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          color: #e11d48;
        }
        
        .prose .rich-content pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 2rem 0;
        }
        
        .prose .rich-content pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
        }
        
        .prose .rich-content a {
          color: #3b82f6;
          text-decoration: underline;
          text-decoration-color: #93c5fd;
          text-underline-offset: 2px;
        }
        
        .prose .rich-content a:hover {
          color: #1d4ed8;
          text-decoration-color: #3b82f6;
        }
        
        .prose .rich-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
        }
        
        .prose .rich-content th,
        .prose .rich-content td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          text-align: left;
        }
        
        .prose .rich-content th {
          background-color: #f9fafb;
          font-weight: 600;
        }
      `}</style>
    </article>
  )
}
