export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-secondary-900 mb-6">
            Our <span className="text-primary-600">Blog</span>
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
            Insights, stories, and spiritual guidance from our retreat experiences and community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder for blog posts */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Coming Soon
              </h3>
              <p className="text-secondary-600">
                Our blog content will be available here soon. Check back for spiritual insights and retreat stories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
