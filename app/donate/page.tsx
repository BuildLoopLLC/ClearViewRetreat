'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  HeartIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function DonatePage() {
  const [donationData, setDonationData] = useState({
    amount: '',
    customAmount: '',
    frequency: 'one-time',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    anonymous: false,
    comments: ''
  })
  
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setDonationData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setError('')

    try {
      // Here you would integrate with your payment processor
      // For now, we'll just simulate a successful donation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setSuccess(true)
    } catch (err: any) {
      setError('Donation failed: ' + err.message)
    } finally {
      setProcessing(false)
    }
  }

  const presetAmounts = [25, 50, 100, 250, 500, 1000]

  if (success) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">Thank You!</h1>
          <p className="text-secondary-600 mb-8">
            Your generous donation helps us continue our mission of spiritual growth and community support. 
            You will receive a confirmation email with your tax-deductible receipt.
          </p>
          <div className="space-y-4">
            <Link
              href="/events"
              className="btn-primary inline-flex items-center"
            >
              View Events
            </Link>
            <Link
              href="/about"
              className="btn-outline inline-flex items-center ml-4"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link
              href="/"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900 flex items-center">
                <HeartIcon className="h-6 w-6 mr-2 text-primary-600" />
                Make a Donation
              </h1>
              <p className="text-secondary-600">Support our mission and help us grow</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">Donation Information</h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Donation Amount */}
                <div>
                  <h3 className="text-lg font-medium text-secondary-900 mb-4">Donation Amount</h3>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setDonationData(prev => ({ ...prev, amount: amount.toString(), customAmount: '' }))}
                        className={`p-3 text-center border rounded-lg font-medium transition-colors ${
                          donationData.amount === amount.toString()
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  
                  <div>
                    <label htmlFor="customAmount" className="block text-sm font-medium text-secondary-700 mb-2">
                      Custom Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="customAmount"
                        name="customAmount"
                        value={donationData.customAmount}
                        onChange={(e) => {
                          setDonationData(prev => ({ ...prev, customAmount: e.target.value, amount: '' }))
                        }}
                        className="input w-full pl-7"
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Donation Frequency */}
                <div>
                  <h3 className="text-lg font-medium text-secondary-900 mb-4">Donation Frequency</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="frequency"
                        value="one-time"
                        checked={donationData.frequency === 'one-time'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <span className="text-sm text-secondary-700">One-time donation</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="frequency"
                        value="monthly"
                        checked={donationData.frequency === 'monthly'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <span className="text-sm text-secondary-700">Monthly donation</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="frequency"
                        value="yearly"
                        checked={donationData.frequency === 'yearly'}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <span className="text-sm text-secondary-700">Yearly donation</span>
                    </label>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-secondary-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={donationData.firstName}
                        onChange={handleInputChange}
                        className="input w-full"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={donationData.lastName}
                        onChange={handleInputChange}
                        className="input w-full"
                        required
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
                        value={donationData.email}
                        onChange={handleInputChange}
                        className="input w-full"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={donationData.phone}
                        onChange={handleInputChange}
                        className="input w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-medium text-secondary-900 mb-4">Payment Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-secondary-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={donationData.cardNumber}
                        onChange={handleInputChange}
                        className="input w-full"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-secondary-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={donationData.expiryDate}
                          onChange={handleInputChange}
                          className="input w-full"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-secondary-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={donationData.cvv}
                          onChange={handleInputChange}
                          className="input w-full"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="cardholderName" className="block text-sm font-medium text-secondary-700 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        id="cardholderName"
                        name="cardholderName"
                        value={donationData.cardholderName}
                        onChange={handleInputChange}
                        className="input w-full"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Options */}
                <div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="anonymous"
                      name="anonymous"
                      checked={donationData.anonymous}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <label htmlFor="anonymous" className="text-sm text-secondary-700">
                      Make this donation anonymous
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="comments" className="block text-sm font-medium text-secondary-700 mb-2">
                      Comments (Optional)
                    </label>
                    <textarea
                      id="comments"
                      name="comments"
                      value={donationData.comments}
                      onChange={handleInputChange}
                      rows={3}
                      className="textarea w-full"
                      placeholder="Any special instructions or comments..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={processing || (!donationData.amount && !donationData.customAmount)}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing Donation...' : 'Complete Donation'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Why Donate?</h3>
              <div className="space-y-4 text-sm text-secondary-600">
                <p>
                  Your generous donation helps us continue our mission of spiritual growth, 
                  community support, and transformative experiences.
                </p>
                <p>
                  <strong>Your support enables us to:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Organize retreats and spiritual workshops</li>
                  <li>Support community outreach programs</li>
                  <li>Maintain our facilities and grounds</li>
                  <li>Provide scholarships for those in need</li>
                  <li>Develop new programs and services</li>
                </ul>
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <p className="text-primary-800 font-medium">
                    All donations are tax-deductible and directly support our mission.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
