import nodemailer from 'nodemailer'
import { getDatabase, generateId } from './sqlite'

export interface EmailSettings {
  id: string
  smtp_host: string | null
  smtp_port: number
  smtp_secure: boolean
  smtp_user: string | null
  smtp_password: string | null
  from_email: string | null
  from_name: string
  reply_to: string | null
  is_configured: boolean
}

export interface NotificationSettings {
  id: string
  notification_type: 'event_registration' | 'contact_form' | 'newsletter_signup' | 'volunteer_form'
  is_enabled: boolean
  send_to_admin: boolean
  send_to_user: boolean
  admin_subject_template: string | null
  user_subject_template: string | null
  admin_body_template: string | null
  user_body_template: string | null
}

export interface EmailRecipient {
  id: string
  email: string
  name: string | null
  notification_types: string[]
  is_active: boolean
}

// Get email settings from database
export function getEmailSettings(): EmailSettings | null {
  try {
    const db = getDatabase()
    const row = db.prepare('SELECT * FROM email_settings WHERE id = ?').get('main') as any
    
    if (!row) return null
    
    return {
      ...row,
      smtp_secure: Boolean(row.smtp_secure),
      is_configured: Boolean(row.is_configured)
    }
  } catch (error) {
    console.error('Error getting email settings:', error)
    return null
  }
}

// Get notification settings for a specific type
export function getNotificationSettings(type: string): NotificationSettings | null {
  try {
    const db = getDatabase()
    const row = db.prepare('SELECT * FROM email_notification_settings WHERE notification_type = ?').get(type) as any
    
    if (!row) return null
    
    return {
      ...row,
      is_enabled: Boolean(row.is_enabled),
      send_to_admin: Boolean(row.send_to_admin),
      send_to_user: Boolean(row.send_to_user)
    }
  } catch (error) {
    console.error('Error getting notification settings:', error)
    return null
  }
}

// Get all active email recipients for a notification type
export function getEmailRecipients(notificationType: string): EmailRecipient[] {
  try {
    const db = getDatabase()
    const rows = db.prepare('SELECT * FROM email_recipients WHERE is_active = 1').all() as any[]
    
    return rows
      .map(row => ({
        ...row,
        notification_types: JSON.parse(row.notification_types || '[]'),
        is_active: Boolean(row.is_active)
      }))
      .filter(recipient => recipient.notification_types.includes(notificationType))
  } catch (error) {
    console.error('Error getting email recipients:', error)
    return []
  }
}

// Create transporter from settings
function createTransporter() {
  const settings = getEmailSettings()
  
  if (!settings || !settings.is_configured) {
    console.warn('Email settings not configured')
    return null
  }

  // Port 465 = SSL/TLS (secure: true)
  // Port 587 = STARTTLS (secure: false, will upgrade)
  // Port 25 = Plain (secure: false)
  const port = settings.smtp_port || 587
  const secure = settings.smtp_secure || port === 465

  const transportConfig: any = {
    host: settings.smtp_host || undefined,
    port: port,
    secure: secure,
    auth: settings.smtp_user ? {
      user: settings.smtp_user,
      pass: settings.smtp_password || ''
    } : undefined,
    // Add TLS options for better compatibility
    tls: {
      // Don't fail on invalid certs (for self-signed certs)
      rejectUnauthorized: false,
      // Minimum TLS version
      minVersion: 'TLSv1.2'
    }
  }

  // For port 587, enable STARTTLS upgrade
  if (port === 587 && !secure) {
    transportConfig.requireTLS = true
  }

  console.log('Creating SMTP transporter:', {
    host: settings.smtp_host,
    port: port,
    secure: secure,
    user: settings.smtp_user ? settings.smtp_user : 'none',
    password: settings.smtp_password ? '***' : 'none'
  })

  return nodemailer.createTransport(transportConfig)
}

// Replace template variables
function replaceTemplateVars(template: string, variables: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value || '')
  }
  return result
}

// Default email templates
const defaultTemplates = {
  event_registration: {
    admin_subject: 'New Event Registration: {{eventTitle}}',
    admin_body: `
      <h2>New Event Registration</h2>
      <p>A new registration has been submitted for <strong>{{eventTitle}}</strong>.</p>
      
      <h3>Registrant Details</h3>
      <ul>
        <li><strong>Name:</strong> {{userName}}</li>
        <li><strong>Email:</strong> {{userEmail}}</li>
        <li><strong>Phone:</strong> {{userPhone}}</li>
        <li><strong>Special Requests:</strong> {{specialRequests}}</li>
      </ul>
      
      <p>View all registrations in the <a href="{{adminUrl}}">admin dashboard</a>.</p>
    `,
    user_subject: 'Registration Confirmed: {{eventTitle}}',
    user_body: `
      <h2>Your Registration is Confirmed!</h2>
      <p>Dear {{userName}},</p>
      <p>Thank you for registering for <strong>{{eventTitle}}</strong>!</p>
      <p>We're excited to have you join us. You'll receive more details as the event approaches.</p>
      
      <h3>Event Details</h3>
      <ul>
        <li><strong>Event:</strong> {{eventTitle}}</li>
        <li><strong>Date:</strong> {{eventDate}}</li>
      </ul>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      
      <p>Blessings,<br>Clear View Retreat</p>
    `
  },
  contact_form: {
    admin_subject: 'New Contact Form: {{subject}}',
    admin_body: `
      <h2>New Contact Form Submission</h2>
      
      <h3>Contact Details</h3>
      <ul>
        <li><strong>Name:</strong> {{firstName}} {{lastName}}</li>
        <li><strong>Email:</strong> {{email}}</li>
        <li><strong>Phone:</strong> {{phone}}</li>
        <li><strong>Subject:</strong> {{subject}}</li>
      </ul>
      
      <h3>Message</h3>
      <p>{{message}}</p>
      
      <p><em>Newsletter opt-in: {{newsletterOptIn}}</em></p>
    `,
    user_subject: 'We received your message',
    user_body: `
      <h2>Thank You for Contacting Us</h2>
      <p>Dear {{firstName}},</p>
      <p>We've received your message and will get back to you within 24 hours.</p>
      
      <p>Your message:</p>
      <blockquote>{{message}}</blockquote>
      
      <p>Blessings,<br>Clear View Retreat</p>
    `
  },
  newsletter_signup: {
    admin_subject: 'New Newsletter Subscriber',
    admin_body: `
      <h2>New Newsletter Subscriber</h2>
      <p>A new user has subscribed to the newsletter:</p>
      <ul>
        <li><strong>Email:</strong> {{email}}</li>
        <li><strong>Name:</strong> {{firstName}} {{lastName}}</li>
        <li><strong>Source:</strong> {{source}}</li>
      </ul>
    `,
    user_subject: 'Welcome to Clear View Retreat Newsletter',
    user_body: `
      <h2>Welcome to Our Newsletter!</h2>
      <p>Dear {{firstName}},</p>
      <p>Thank you for subscribing to the Clear View Retreat newsletter!</p>
      <p>You'll receive updates about upcoming retreats, ministry news, and special events.</p>
      
      <p>Blessings,<br>Clear View Retreat</p>
    `
  },
  volunteer_form: {
    admin_subject: 'New Volunteer Interest',
    admin_body: `
      <h2>New Volunteer Interest</h2>
      
      <h3>Contact Details</h3>
      <ul>
        <li><strong>Name:</strong> {{firstName}} {{lastName}}</li>
        <li><strong>Email:</strong> {{email}}</li>
        <li><strong>Phone:</strong> {{phone}}</li>
      </ul>
      
      <h3>Message</h3>
      <p>{{message}}</p>
    `,
    user_subject: 'Thank you for your interest in volunteering',
    user_body: `
      <h2>Thank You for Your Interest in Volunteering!</h2>
      <p>Dear {{firstName}},</p>
      <p>We've received your volunteer inquiry and are excited about your interest in serving with us.</p>
      <p>Someone from our team will be in touch soon to discuss opportunities.</p>
      
      <p>Blessings,<br>Clear View Retreat</p>
    `
  }
}

// Send email notification
export async function sendNotification(
  notificationType: 'event_registration' | 'contact_form' | 'newsletter_signup' | 'volunteer_form',
  variables: Record<string, string>,
  userEmail?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const emailSettings = getEmailSettings()
    
    if (!emailSettings || !emailSettings.is_configured) {
      console.warn('Email not configured, skipping notification')
      return { success: false, error: 'Email not configured' }
    }

    const notificationSettings = getNotificationSettings(notificationType)
    const transporter = createTransporter()
    
    if (!transporter) {
      return { success: false, error: 'Could not create email transporter' }
    }

    // Get templates (use custom if available, otherwise defaults)
    const templates = defaultTemplates[notificationType]
    const adminSubject = notificationSettings?.admin_subject_template || templates.admin_subject
    const adminBody = notificationSettings?.admin_body_template || templates.admin_body
    const userSubject = notificationSettings?.user_subject_template || templates.user_subject
    const userBody = notificationSettings?.user_body_template || templates.user_body

    const sendToAdmin = notificationSettings?.send_to_admin ?? true
    const sendToUser = notificationSettings?.send_to_user ?? (notificationType === 'event_registration')

    // Send admin notifications
    if (sendToAdmin) {
      const recipients = getEmailRecipients(notificationType)
      
      for (const recipient of recipients) {
        try {
          await transporter.sendMail({
            from: `"${emailSettings.from_name}" <${emailSettings.from_email}>`,
            to: recipient.email,
            replyTo: emailSettings.reply_to || userEmail || emailSettings.from_email || undefined,
            subject: replaceTemplateVars(adminSubject, variables),
            html: replaceTemplateVars(adminBody, variables)
          })
        } catch (error) {
          console.error(`Failed to send admin email to ${recipient.email}:`, error)
        }
      }
    }

    // Send user confirmation email
    if (sendToUser && userEmail) {
      try {
        await transporter.sendMail({
          from: `"${emailSettings.from_name}" <${emailSettings.from_email}>`,
          to: userEmail,
          replyTo: emailSettings.reply_to || emailSettings.from_email || undefined,
          subject: replaceTemplateVars(userSubject, variables),
          html: replaceTemplateVars(userBody, variables)
        })
      } catch (error) {
        console.error(`Failed to send user email to ${userEmail}:`, error)
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error sending notification:', error)
    return { success: false, error: error.message }
  }
}

// Test email configuration
export async function testEmailConfig(testEmail: string): Promise<{ success: boolean; error?: string }> {
  try {
    const emailSettings = getEmailSettings()
    
    if (!emailSettings) {
      return { success: false, error: 'Email settings not found. Please save your settings first.' }
    }

    if (!emailSettings.smtp_host) {
      return { success: false, error: 'SMTP host is not configured' }
    }

    if (!emailSettings.from_email) {
      return { success: false, error: 'From email is not configured' }
    }

    // Debug: Check if password exists (don't log the actual password)
    console.log('Email settings loaded:', {
      host: emailSettings.smtp_host,
      port: emailSettings.smtp_port,
      secure: emailSettings.smtp_secure,
      user: emailSettings.smtp_user,
      hasPassword: !!emailSettings.smtp_password && emailSettings.smtp_password !== '********',
      passwordLength: emailSettings.smtp_password?.length || 0,
      fromEmail: emailSettings.from_email
    })

    if (!emailSettings.smtp_password || emailSettings.smtp_password === '********') {
      return { success: false, error: 'SMTP password not found in database. Please re-enter and save your password.' }
    }

    const transporter = createTransporter()
    
    if (!transporter) {
      return { success: false, error: 'Could not create email transporter. Check your SMTP settings.' }
    }

    console.log('Attempting to send test email to:', testEmail)
    console.log('Using SMTP host:', emailSettings.smtp_host)
    
    // First verify the connection
    try {
      console.log('Verifying SMTP connection...')
      await transporter.verify()
      console.log('SMTP connection verified successfully')
    } catch (verifyError: any) {
      console.error('SMTP verification failed:', verifyError)
      return { 
        success: false, 
        error: `Could not connect to SMTP server: ${verifyError.message}` 
      }
    }
    
    await transporter.sendMail({
      from: `"${emailSettings.from_name || 'Clear View Retreat'}" <${emailSettings.from_email}>`,
      to: testEmail,
      subject: 'Test Email - Clear View Retreat',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from Clear View Retreat admin panel.</p>
        <p>If you received this, your email configuration is working correctly!</p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Sent from: ${emailSettings.smtp_host}<br>
          Time: ${new Date().toISOString()}
        </p>
      `
    })

    console.log('Test email sent successfully')
    return { success: true }
  } catch (error: any) {
    console.error('Test email failed:', error)
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack?.split('\n').slice(0, 5).join('\n')
    })
    
    // Provide more helpful error messages
    let errorMessage = error.message
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed. Check your SMTP username and password.'
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Connection refused. Check your SMTP host and port.'
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Connection timed out. Check your SMTP host and port.'
    } else if (error.code === 'ESOCKET') {
      errorMessage = `Socket error: ${error.message}. This usually means the server rejected the connection. Check if your host and port are correct.`
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = `Host not found: ${error.hostname || 'unknown'}. Check your SMTP host is correct.`
    } else if (error.code === 'ECONNRESET') {
      errorMessage = 'Connection reset by server. The server may not support this connection type.'
    } else if (error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' || error.code === 'CERT_HAS_EXPIRED') {
      errorMessage = 'SSL certificate error. The server\'s certificate may be invalid or self-signed.'
    }
    
    return { success: false, error: errorMessage }
  }
}

// Initialize default notification settings
export function initializeNotificationSettings() {
  const db = getDatabase()
  
  const notificationTypes = ['event_registration', 'contact_form', 'newsletter_signup', 'volunteer_form']
  
  for (const type of notificationTypes) {
    const existing = db.prepare('SELECT id FROM email_notification_settings WHERE notification_type = ?').get(type)
    
    if (!existing) {
      const templates = defaultTemplates[type as keyof typeof defaultTemplates]
      db.prepare(`
        INSERT INTO email_notification_settings 
        (id, notification_type, is_enabled, send_to_admin, send_to_user, admin_subject_template, user_subject_template, admin_body_template, user_body_template)
        VALUES (?, ?, 1, 1, ?, ?, ?, ?, ?)
      `).run(
        generateId(),
        type,
        type === 'event_registration' ? 1 : 0,
        templates.admin_subject,
        templates.user_subject,
        templates.admin_body,
        templates.user_body
      )
    }
  }
}

