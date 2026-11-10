import { describe, it, expect } from 'vitest'
import { inquirySchema, checkRateLimit, generateInquiryReference } from '@/lib/inquiries'

describe('Inquiry Validation & Spam Protection', () => {
  it('validates a correct inquiry submission', () => {
    const validData = {
      fullName: 'Riyan Test',
      businessName: 'Toronto Dining Co',
      email: 'riyan@torontodining.ca',
      phone: '+1 416-555-0199',
      serviceInterest: 'social-media' as const,
      message: 'Looking for a consistent creative partner for our downtown restaurant launch.',
      privacyAcknowledged: true,
      _hp_website: '',
    }

    const result = inquirySchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejects an invalid email address', () => {
    const invalidData = {
      fullName: 'Shamil Test',
      businessName: 'Hospitality Group',
      email: 'not-an-email',
      serviceInterest: 'video-production' as const,
      message: 'Need commercial brand films for 3 venues.',
      privacyAcknowledged: true,
    }

    const result = inquirySchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().email?._errors).toContain('Enter a valid email address.')
    }
  })

  it('requires privacy acknowledgement', () => {
    const unacknowledged = {
      fullName: 'Test User',
      businessName: 'Test Brand',
      email: 'test@example.com',
      serviceInterest: 'photography' as const,
      message: 'Need high-end food photography for winter menu.',
      privacyAcknowledged: false,
    }

    const result = inquirySchema.safeParse(unacknowledged)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.format().privacyAcknowledged?._errors).toContain(
        'Please acknowledge the privacy policy.'
      )
    }
  })

  it('generates a durable inquiry reference in the expected format', () => {
    const ref = generateInquiryReference()
    expect(ref).toMatch(/^INQ-\d{8}-[A-Z0-9]{4}$/)
  })

  it('enforces rate limits per client IP', () => {
    const testIp = '192.168.1.100'
    // First 5 requests should pass
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(testIp, 5, 60000)).toBe(true)
    }
    // 6th request should fail
    expect(checkRateLimit(testIp, 5, 60000)).toBe(false)
  })
})
