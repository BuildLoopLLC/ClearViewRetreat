'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'

export default function Contact() {
  const { getContentValue, loading } = useWebsiteContent('contact')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-secondary-900 mb-6">
              {getContentValue('title')}
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              {getContentValue('subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-8">
              Send us a Message
            </h3>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-xl p-8 text-center"
              >
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-green-800 mb-2">Message Sent!</h4>
                <p className="text-green-700">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="retreat-booking">Retreat Booking</option>
                      <option value="custom-event">Custom Event</option>
                      <option value="pricing">Pricing Information</option>
                      <option value="partnership">Partnership Opportunities</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="textarea"
                    placeholder="Tell us about your needs, questions, or how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-display font-semibold text-secondary-900 mb-6">
                Contact Information
              </h3>
              <p className="text-lg text-secondary-600 leading-relaxed mb-8">
                We're here to help you plan the perfect retreat experience. 
                Reach out to us through any of these channels.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <MapPinIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-1">Address</h4>
                  <p className="text-secondary-600">
                    {getContentValue('address')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <PhoneIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-1">Phone</h4>
                  <a
                    href={`tel:${getContentValue('phone')}`}
                    className="text-secondary-600 hover:text-primary-600 transition-colors duration-200"
                  >
                    {getContentValue('phone')}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <EnvelopeIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-1">Email</h4>
                  <a
                    href={`mailto:${getContentValue('email')}`}
                    className="text-secondary-600 hover:text-primary-600 transition-colors duration-200"
                  >
                    {getContentValue('email')}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-1">Office Hours</h4>
                  <p className="text-secondary-600">
                    {getContentValue('hours')}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8">
              <h4 className="text-xl font-display font-semibold text-secondary-900 mb-4">
                Emergency Contact
              </h4>
              <p className="text-secondary-700 mb-4">
                For urgent matters outside of office hours, please call our emergency line:
              </p>
              <a
                href="tel:+1-555-999-8888"
                className="text-lg font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                (555) 999-8888
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
