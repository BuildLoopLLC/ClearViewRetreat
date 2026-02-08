'use client'

import { useState, useEffect } from 'react'
import { 
  EnvelopeIcon, 
  PlusIcon, 
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  Cog6ToothIcon,
  BellIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface SmtpSettings {
  smtp_host: string
  smtp_port: number
  smtp_secure: boolean
  smtp_user: string
  smtp_password: string
  from_email: string
  from_name: string
  reply_to: string
  is_configured: boolean
}

interface NotificationSetting {
  id: string
  notification_type: string
  is_enabled: boolean
  send_to_admin: boolean
  send_to_user: boolean
  admin_subject_template: string
  user_subject_template: string
  admin_body_template: string
  user_body_template: string
}

interface EmailRecipient {
  id: string
  email: string
  name: string | null
  notification_types: string[]
  is_active: boolean
}

type TabType = 'smtp' | 'notifications' | 'recipients'

const notificationTypeLabels: Record<string, string> = {
  event_registration: 'Event Registration',
  contact_form: 'Contact Form',
  newsletter_signup: 'Newsletter Signup',
  volunteer_form: 'Volunteer Form'
}

export default function EmailSettingsManager() {
  const [activeTab, setActiveTab] = useState<TabType>('smtp')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testingEmail, setTestingEmail] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  
  const [smtpSettings, setSmtpSettings] = useState<SmtpSettings>({
    smtp_host: '',
    smtp_port: 587,
    smtp_secure: false,
    smtp_user: '',
    smtp_password: '',
    from_email: '',
    from_name: 'Clear View Retreat',
    reply_to: '',
    is_configured: false
  })
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([])
  const [recipients, setRecipients] = useState<EmailRecipient[]>([])
  const [newRecipient, setNewRecipient] = useState({ email: '', name: '', notification_types: ['event_registration', 'contact_form', 'newsletter_signup', 'volunteer_form'] })
  const [showAddRecipient, setShowAddRecipient] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/email-settings')
      const data = await response.json()
      
      if (data.smtp) {
        setSmtpSettings({
          ...smtpSettings,
          ...data.smtp,
          smtp_secure: Boolean(data.smtp.smtp_secure),
          is_configured: Boolean(data.smtp.is_configured),
          // Clear the masked password - user needs to re-enter if they want to change it
          smtp_password: ''
        })
      }
      
      if (data.notifications) {
        setNotificationSettings(data.notifications.map((n: any) => ({
          ...n,
          is_enabled: Boolean(n.is_enabled),
          send_to_admin: Boolean(n.send_to_admin),
          send_to_user: Boolean(n.send_to_user)
        })))
      }
      
      if (data.recipients) {
        setRecipients(data.recipients)
      }
    } catch (error) {
      console.error('Error fetching email settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSmtpSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/email-settings?type=smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpSettings)
      })
      
      if (response.ok) {
        setTestResult({ success: true, message: 'SMTP settings saved successfully!' })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Failed to save SMTP settings' })
    } finally {
      setSaving(false)
      setTimeout(() => setTestResult(null), 3000)
    }
  }

  const testEmailConfiguration = async () => {
    if (!testEmail) {
      setTestResult({ success: false, message: 'Please enter a test email address' })
      return
    }

    // Validate SMTP settings are filled in
    if (!smtpSettings.smtp_host || !smtpSettings.from_email) {
      setTestResult({ success: false, message: 'Please fill in SMTP host and From Email before testing' })
      return
    }
    
    try {
      setTestingEmail(true)
      setTestResult(null)

      // First save the current settings (so the test uses latest config)
      const saveResponse = await fetch('/api/email-settings?type=smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...smtpSettings, is_configured: true })
      })

      if (!saveResponse.ok) {
        setTestResult({ success: false, message: 'Failed to save settings before testing' })
        return
      }

      // Update local state to reflect enabled
      setSmtpSettings(prev => ({ ...prev, is_configured: true }))
      
      // Now send the test email
      const response = await fetch('/api/email-settings?type=test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmail })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setTestResult({ success: true, message: `Test email sent to ${testEmail}! Check your inbox.` })
      } else {
        setTestResult({ success: false, message: result.error || 'Failed to send test email' })
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Error testing email configuration' })
    } finally {
      setTestingEmail(false)
    }
  }

  const updateNotificationSetting = async (notificationType: string, updates: Partial<NotificationSetting>) => {
    const setting = notificationSettings.find(n => n.notification_type === notificationType)
    if (!setting) return
    
    const updatedSetting = { ...setting, ...updates }
    
    try {
      const response = await fetch('/api/email-settings?type=notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSetting)
      })
      
      if (response.ok) {
        setNotificationSettings(prev => 
          prev.map(n => n.notification_type === notificationType ? updatedSetting : n)
        )
      }
    } catch (error) {
      console.error('Error updating notification setting:', error)
    }
  }

  const addRecipient = async () => {
    if (!newRecipient.email) return
    
    try {
      const response = await fetch('/api/email-settings?type=recipient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipient)
      })
      
      if (response.ok) {
        const { id } = await response.json()
        setRecipients(prev => [...prev, { ...newRecipient, id, is_active: true }])
        setNewRecipient({ email: '', name: '', notification_types: ['event_registration', 'contact_form', 'newsletter_signup', 'volunteer_form'] })
        setShowAddRecipient(false)
      }
    } catch (error) {
      console.error('Error adding recipient:', error)
    }
  }

  const updateRecipient = async (id: string, updates: Partial<EmailRecipient>) => {
    const recipient = recipients.find(r => r.id === id)
    if (!recipient) return
    
    const updatedRecipient = { ...recipient, ...updates }
    
    try {
      const response = await fetch(`/api/email-settings?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecipient)
      })
      
      if (response.ok) {
        setRecipients(prev => 
          prev.map(r => r.id === id ? updatedRecipient : r)
        )
      }
    } catch (error) {
      console.error('Error updating recipient:', error)
    }
  }

  const deleteRecipient = async (id: string) => {
    if (!confirm('Are you sure you want to remove this recipient?')) return
    
    try {
      const response = await fetch(`/api/email-settings?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setRecipients(prev => prev.filter(r => r.id !== id))
      }
    } catch (error) {
      console.error('Error deleting recipient:', error)
    }
  }

  const toggleRecipientNotificationType = (recipientId: string, notificationType: string) => {
    const recipient = recipients.find(r => r.id === recipientId)
    if (!recipient) return
    
    const types = [...recipient.notification_types]
    const index = types.indexOf(notificationType)
    
    if (index > -1) {
      types.splice(index, 1)
    } else {
      types.push(notificationType)
    }
    
    updateRecipient(recipientId, { notification_types: types })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-secondary-600">Loading email settings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <EnvelopeIcon className="h-6 w-6 text-primary-600" />
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">Email Notifications</h2>
            <p className="text-secondary-600">Configure email alerts and notification recipients</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('smtp')}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'smtp'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <Cog6ToothIcon className="h-5 w-5" />
            <span>SMTP Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'notifications'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <BellIcon className="h-5 w-5" />
            <span>Notification Types</span>
          </button>
          <button
            onClick={() => setActiveTab('recipients')}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'recipients'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            }`}
          >
            <UserGroupIcon className="h-5 w-5" />
            <span>Recipients</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Test Result Banner */}
        {testResult && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
            testResult.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {testResult.success ? (
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-red-600" />
            )}
            <span className={testResult.success ? 'text-green-800' : 'text-red-800'}>
              {testResult.message}
            </span>
          </div>
        )}

        {/* SMTP Settings Tab */}
        {activeTab === 'smtp' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800 space-y-2">
                  <p>
                    <strong>Important:</strong> You'll need SMTP credentials from an email service provider like Gmail, SendGrid, Mailgun, or your own mail server.
                  </p>
                  <p><strong>Common settings:</strong></p>
                  <ul className="list-disc ml-4 space-y-1">
                    <li><strong>Gmail:</strong> smtp.gmail.com, Port 587, use an <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener" className="underline">App Password</a></li>
                    <li><strong>SendGrid:</strong> smtp.sendgrid.net, Port 587, username: apikey</li>
                    <li><strong>Mailgun:</strong> smtp.mailgun.org, Port 587</li>
                  </ul>
                  <p className="text-xs mt-2"><strong>Port guide:</strong> Use 587 for STARTTLS (recommended), or 465 for SSL.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={smtpSettings.smtp_host || ''}
                  onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  SMTP Port
                </label>
                <select
                  value={smtpSettings.smtp_port}
                  onChange={(e) => {
                    const port = parseInt(e.target.value)
                    setSmtpSettings(prev => ({ 
                      ...prev, 
                      smtp_port: port,
                      // Auto-set secure based on port
                      smtp_secure: port === 465
                    }))
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={587}>587 (STARTTLS - Recommended)</option>
                  <option value={465}>465 (SSL/TLS)</option>
                  <option value={25}>25 (Unencrypted - Not Recommended)</option>
                  <option value={2525}>2525 (Alternative)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  SMTP Username
                </label>
                <input
                  type="text"
                  value={smtpSettings.smtp_user || ''}
                  onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_user: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  SMTP Password / App Password
                </label>
                <input
                  type="password"
                  value={smtpSettings.smtp_password || ''}
                  onChange={(e) => setSmtpSettings(prev => ({ ...prev, smtp_password: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={smtpSettings.is_configured ? "Leave blank to keep current password" : "Enter password"}
                />
                {smtpSettings.is_configured && !smtpSettings.smtp_password && (
                  <p className="text-xs text-gray-500 mt-1">Password is saved. Only enter a new value to change it.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  From Email
                </label>
                <input
                  type="email"
                  value={smtpSettings.from_email || ''}
                  onChange={(e) => setSmtpSettings(prev => ({ ...prev, from_email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="noreply@clearviewretreat.org"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  From Name
                </label>
                <input
                  type="text"
                  value={smtpSettings.from_name || ''}
                  onChange={(e) => setSmtpSettings(prev => ({ ...prev, from_name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Clear View Retreat"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Reply-To Email (optional)
                </label>
                <input
                  type="email"
                  value={smtpSettings.reply_to || ''}
                  onChange={(e) => setSmtpSettings(prev => ({ ...prev, reply_to: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="info@clearviewretreat.org"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smtpSettings.is_configured}
                  onChange={(e) => setSmtpSettings(prev => ({ ...prev, is_configured: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-secondary-900">Enable Email Notifications</span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={saveSmtpSettings}
                disabled={saving}
                className="btn-primary px-6 py-2 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save SMTP Settings'}
              </button>
              
              <div className="flex items-center space-x-2">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Test email address"
                />
                <button
                  onClick={testEmailConfiguration}
                  disabled={testingEmail}
                  className="btn flex items-center space-x-2 disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                  <span>{testingEmail ? 'Sending...' : 'Send Test'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <p className="text-secondary-600 mb-4">
              Configure which events trigger email notifications and who receives them.
            </p>

            {notificationSettings.map((setting) => (
              <div 
                key={setting.notification_type} 
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">
                      {notificationTypeLabels[setting.notification_type] || setting.notification_type}
                    </h3>
                    <p className="text-sm text-secondary-600">
                      {setting.notification_type === 'event_registration' && 'When someone registers for an event'}
                      {setting.notification_type === 'contact_form' && 'When someone submits the contact form'}
                      {setting.notification_type === 'newsletter_signup' && 'When someone subscribes to the newsletter'}
                      {setting.notification_type === 'volunteer_form' && 'When someone submits the volunteer form'}
                    </p>
                  </div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-sm text-secondary-600">
                      {setting.is_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={setting.is_enabled}
                        onChange={(e) => updateNotificationSetting(setting.notification_type, { is_enabled: e.target.checked })}
                        className="sr-only"
                      />
                      <div className={`w-10 h-6 rounded-full transition-colors ${
                        setting.is_enabled ? 'bg-primary-600' : 'bg-gray-300'
                      }`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          setting.is_enabled ? 'translate-x-4' : ''
                        }`} />
                      </div>
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setting.send_to_admin}
                      onChange={(e) => updateNotificationSetting(setting.notification_type, { send_to_admin: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-secondary-700">Send notification to admins</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setting.send_to_user}
                      onChange={(e) => updateNotificationSetting(setting.notification_type, { send_to_user: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-secondary-700">Send confirmation to user</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recipients Tab */}
        {activeTab === 'recipients' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-secondary-600">
                Manage which administrators receive email notifications.
              </p>
              <button
                onClick={() => setShowAddRecipient(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Recipient</span>
              </button>
            </div>

            {/* Add Recipient Form */}
            {showAddRecipient && (
              <div className="border border-primary-200 bg-primary-50 rounded-lg p-6">
                <h4 className="font-semibold text-secondary-900 mb-4">Add New Recipient</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={newRecipient.email}
                      onChange={(e) => setNewRecipient(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="admin@clearviewretreat.org"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Name (optional)
                    </label>
                    <input
                      type="text"
                      value={newRecipient.name}
                      onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Admin Name"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Notification Types
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(notificationTypeLabels).map(([type, label]) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newRecipient.notification_types.includes(type)}
                          onChange={(e) => {
                            setNewRecipient(prev => ({
                              ...prev,
                              notification_types: e.target.checked
                                ? [...prev.notification_types, type]
                                : prev.notification_types.filter(t => t !== type)
                            }))
                          }}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-secondary-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={addRecipient}
                    className="btn-primary"
                  >
                    Add Recipient
                  </button>
                  <button
                    onClick={() => {
                      setShowAddRecipient(false)
                      setNewRecipient({ email: '', name: '', notification_types: ['event_registration', 'contact_form', 'newsletter_signup', 'volunteer_form'] })
                    }}
                    className="btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Recipients List */}
            {recipients.length === 0 ? (
              <div className="text-center py-12 text-secondary-500">
                <EnvelopeIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No email recipients configured.</p>
                <p className="text-sm">Add recipients to start receiving email notifications.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recipients.map((recipient) => (
                  <div 
                    key={recipient.id} 
                    className={`border rounded-lg p-4 ${
                      recipient.is_active ? 'border-gray-200' : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-medium text-secondary-900">
                            {recipient.name || recipient.email}
                          </span>
                          {recipient.name && (
                            <span className="text-sm text-secondary-500">({recipient.email})</span>
                          )}
                          {!recipient.is_active && (
                            <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                              Disabled
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(notificationTypeLabels).map(([type, label]) => (
                            <button
                              key={type}
                              onClick={() => toggleRecipientNotificationType(recipient.id, type)}
                              className={`px-2 py-1 text-xs rounded transition-colors ${
                                recipient.notification_types.includes(type)
                                  ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={recipient.is_active}
                            onChange={(e) => updateRecipient(recipient.id, { is_active: e.target.checked })}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-secondary-600">Active</span>
                        </label>
                        <button
                          onClick={() => deleteRecipient(recipient.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

