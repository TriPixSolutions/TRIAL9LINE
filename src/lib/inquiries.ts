import { z } from 'zod'

export const inquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Please complete this field.').max(200, 'Please keep this under 200 characters.'),
  businessName: z.string().trim().min(2, 'Please complete this field.').max(200, 'Please keep this under 200 characters.'),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().max(80).optional(),
  serviceInterest: z.enum([
    'social-media',
    'video-production',
    'photography',
    'branding-design',
    'digital-marketing',
    'not-sure',
  ], {
    error: 'Please select a service interest.',
  }),
  message: z.string().trim().min(10, 'Please tell us a bit more about your project.').max(10000, 'Please keep your message under 10,000 characters.'),
  privacyAcknowledged: z.boolean().refine(val => val === true, {
    message: 'Please acknowledge the privacy policy.',
  }),
  // Honeypot field - must be empty
  _hp_website: z.string().optional(),
  idempotencyKey: z.string().max(100).optional(),
})

export type InquiryInput = z.infer<typeof inquirySchema>

// Simple in-memory rate limiting map for edge/serverless runtime
const submissionRateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(clientIp: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now()
  if(submissionRateLimitMap.size>10000) for(const [key,value] of submissionRateLimitMap) if(value.resetAt<now) submissionRateLimitMap.delete(key)
  const current = submissionRateLimitMap.get(clientIp)

  if (!current || now > current.resetAt) {
    submissionRateLimitMap.set(clientIp, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (current.count >= limit) {
    return false
  }

  current.count++
  return true
}

// Generate human-readable durable reference code (e.g. INQ-20261109-8F2A)
export function generateInquiryReference(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `INQ-${dateStr}-${randomChars}`
}
