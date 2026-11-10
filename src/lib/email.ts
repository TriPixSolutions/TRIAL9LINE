import { Resend } from 'resend'

export interface InquiryEmailPayload {
  reference: string
  fullName: string
  businessName: string
  email: string
  phone?: string | null
  serviceInterest: string
  message: string
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function sendInquiryNotification(payload: InquiryEmailPayload, idempotencyKey?: string): Promise<{
  success: boolean
  providerMessageId?: string
  error?: string
}> {
  const apiKey = process.env.RESEND_API_KEY
  const sender = process.env.RESEND_SENDER_EMAIL || 'TRAIL9INE MEDIA <inquiries@trail9ine.com>'
  const recipient = process.env.BUSINESS_NOTIFICATION_EMAIL || 'inquiries@trail9ine.com'
  const adminBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const subject = `[New Inquiry] ${payload.businessName} (${payload.reference})`
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1c1e; line-height: 1.5;">
      <div style="background: linear-gradient(135deg, #682568, #27234D); padding: 24px; border-radius: 8px 8px 0 0; color: #FAF9FC;">
        <span style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.8;">TRAIL9INE MEDIA — Inquiry Notification</span>
        <h1 style="margin: 8px 0 0 0; font-size: 24px; font-weight: 700;">${escapeHtml(payload.businessName)}</h1>
        <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">Ref: ${escapeHtml(payload.reference)}</p>
      </div>

      <div style="background: #ffffff; padding: 24px; border: 1px solid #eeedf0; border-top: none; border-radius: 0 0 8px 8px;">
        <h3 style="margin-top: 0; font-size: 16px; color: #4e0a50; border-bottom: 1px solid #eeedf0; padding-bottom: 8px;">Contact Information</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #686273; width: 140px;">Full Name:</td>
            <td style="padding: 6px 0; font-weight: 600;">${escapeHtml(payload.fullName)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #686273;">Business / Brand:</td>
            <td style="padding: 6px 0; font-weight: 600;">${escapeHtml(payload.businessName)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #686273;">Email:</td>
            <td style="padding: 6px 0;"><a href="mailto:${escapeHtml(payload.email)}" style="color: #682568; text-decoration: none;">${escapeHtml(payload.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #686273;">Phone:</td>
            <td style="padding: 6px 0;">${escapeHtml(payload.phone || 'Not provided')}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #686273;">Service Interest:</td>
            <td style="padding: 6px 0; font-weight: 600;">${escapeHtml(payload.serviceInterest)}</td>
          </tr>
        </table>

        <h3 style="font-size: 16px; color: #4e0a50; border-bottom: 1px solid #eeedf0; padding-bottom: 8px;">Project Message</h3>
        <div style="background: #f4f3f6; padding: 16px; border-radius: 6px; font-size: 14px; white-space: pre-wrap; color: #1a1c1e;">
${escapeHtml(payload.message)}
        </div>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eeedf0; text-align: center;">
          <a href="${adminBaseUrl}/admin/collections/inquiries" style="display: inline-block; background: #682568; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 14px;">
            Open in Staff Dashboard →
          </a>
        </div>
      </div>
    </div>
  `

  if (!apiKey && (process.env.NODE_ENV === 'production' || process.env.EMAIL_SIMULATION !== 'true')) return {success:false,error:'Email delivery is not configured.'}
  if (!apiKey) {
    // Development fallback: explicitly logged test transport
    const mockId = `mock_resend_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    console.log(`[Email Simulation - Development Mode]
      To: ${recipient}
      Reply-To: ${payload.email}
      Subject: ${subject}
      Mock ID: ${mockId}
    `)
    return {
      success: true,
      providerMessageId: mockId,
    }
  }

  try {
    const resend = new Resend(apiKey)
    const request = resend.fetchRequest.bind(resend)
    // Keep each network dispatch bounded on hosting with a hard request timeout.
    resend.fetchRequest = function<T>(path: string, options = {}) {
      return request<T>(path, {...options, signal: AbortSignal.timeout(8000)})
    }
    const result = await resend.emails.send({
      from: sender,
      to: recipient,
      replyTo: payload.email,
      subject,
      html,
    }, idempotencyKey ? {idempotencyKey} : undefined)

    if (result.error) {
      return {
        success: false,
        error: result.error.message,
      }
    }

    return {
      success: true,
      providerMessageId: result.data?.id,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      success: false,
      error: message,
    }
  }
}
