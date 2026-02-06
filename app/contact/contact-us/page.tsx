import SubpageLayout from '@/components/ui/SubpageLayout'
import SubpageContent from '@/components/ui/SubpageContent'

export default function ContactUsPage() {
  return (
    <SubpageLayout
      title="Get in Touch"
      subtitle="Send us a message or reach out with your questions"
      breadcrumbs={[
        { name: 'Contact', href: '/contact' }
      ]}
    >
      <div className="max-w-4xl mx-auto">

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200 mb-16">
          <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
            Send Us a Message
          </h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Your last name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a topic</option>
                <option value="retreat-booking">Retreat Booking</option>
                <option value="general-inquiry">General Inquiry</option>
                <option value="volunteer">Volunteer Opportunities</option>
                <option value="prayer">Prayer Request</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Tell us how we can help you..."
              ></textarea>
            </div>
            <div className="flex items-center">
              <input
                id="newsletter"
                name="newsletter"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="newsletter" className="ml-2 block text-sm text-secondary-700">
                I would like to receive updates about retreats and ministry news
              </label>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
            <h3 className="text-xl font-display font-semibold text-secondary-900 mb-6">
              Office Hours
            </h3>
            <div className="space-y-3 text-secondary-600">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-secondary-200">
            <h3 className="text-xl font-display font-semibold text-secondary-900 mb-6">
              Response Time
            </h3>
            <div className="space-y-3 text-secondary-600">
              <p>We typically respond to all inquiries within 24 hours during business days.</p>
              <p>For urgent matters, please call our main number at (555) 123-4567.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8">
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-4">
              Ready to Plan Your Retreat?
            </h3>
            <p className="text-secondary-600 mb-6 max-w-2xl mx-auto">
              We're excited to help you create a meaningful retreat experience for your family or group. 
              Let's start planning your perfect getaway today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/events"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                View Retreat Options
              </a>
              <a
                href="/contact/location"
                className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Visit Our Location
              </a>
            </div>
          </div>
        </div>
      </div>
    </SubpageLayout>
  )
}