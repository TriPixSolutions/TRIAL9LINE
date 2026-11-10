import {verifyWebhook} from '@/lib/webhook-signature'
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export async function POST(req: NextRequest) {
  try {
    const raw=await req.text()
    const secret=process.env.RESEND_WEBHOOK_SECRET
    if(!secret||!verifyWebhook(raw,req.headers,secret))return NextResponse.json({error:'Invalid webhook signature'},{status:401})
    const body=JSON.parse(raw)
    const payload=await getPayloadClient()

    // Resend webhook payload shape
    const type = body?.type // e.g. "email.delivered", "email.bounced", "email.complained"
    const emailId = body?.data?.email_id

    if (!emailId || !type) {
      return NextResponse.json({ message: 'Ignored: No email_id or type' }, { status: 200 })
    }

    const matchingInquiries = await payload.find({
      collection: 'inquiries',
      where: {
        providerMessageId: { equals: emailId },
      },
      limit: 1,
    })

    if (matchingInquiries.docs.length === 0) {
      return NextResponse.json({ message: 'No matching inquiry for message id' }, { status: 200 })
    }

    const inquiry = matchingInquiries.docs[0]
    let newStatus: 'delivered' | 'bounced' | 'failed' | null = null

    if (type === 'email.delivered') {
      newStatus = 'delivered'
    } else if (type === 'email.bounced') {
      newStatus = 'bounced'
    } else if (type === 'email.complained') {
      newStatus = 'failed'
    }

    if (newStatus) {
      await payload.update({
        collection: 'inquiries',
        id: inquiry.id,
        data: {
          emailStatus: newStatus,
        },
      })
    }

    return NextResponse.json({ received: true, statusUpdatedTo: newStatus })
  } catch (error: unknown) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 })
  }
}
