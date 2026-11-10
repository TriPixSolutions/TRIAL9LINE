import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'fullName', 'businessName', 'serviceInterest', 'leadStatus', 'emailStatus', 'createdAt'],
    group: 'Inquiries & Leads',
  },
  access: {
    // Public cannot read inquiries; editors cannot read inquiries; only owner and inquiry_manager
    read: ({ req }) => req.user?.role === 'owner' || req.user?.role === 'inquiry_manager',
    create: ({ req }) => req.user?.role === 'owner', // Public submissions use the validated server endpoint
    update: ({ req }) => req.user?.role === 'owner' || req.user?.role === 'inquiry_manager',
    delete: ({ req }) => req.user?.role === 'owner',
  },
  fields: [
    {name:'retryNotification',type:'ui',admin:{components:{Field:'/src/components/admin/InquiryRetry#InquiryRetry'}}},
    {
      name: 'reference',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Auto-generated durable inquiry reference code',
      },
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'businessName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'serviceInterest',
      type: 'select',
      required: true,
      options: [
        { label: 'Social Media Marketing', value: 'social-media' },
        { label: 'Content Creation & Video Production', value: 'video-production' },
        { label: 'Food & Commercial Photography', value: 'photography' },
        { label: 'Branding & Graphic Design', value: 'branding-design' },
        { label: 'Paid Advertising & Digital Marketing', value: 'digital-marketing' },
        { label: 'Not sure yet', value: 'not-sure' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'privacyAcknowledged',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'leadStatus',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Closed', value: 'closed' },
        { label: 'Spam', value: 'spam' },
      ],
    },
    {
      name: 'emailStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Provider Accepted', value: 'provider_accepted' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Failed', value: 'failed' },
        { label: 'Bounced', value: 'bounced' },
      ],
    },
    {
      name: 'privateNotes',
      type: 'textarea',
      admin: {
        description: 'Internal staff notes (visible to authorized staff only)',
      },
    },
    {
      name: 'notificationAttempts',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'lastNotificationError',
      type: 'text',
    },
    {
      name: 'lastNotificationAttemptAt',
      type: 'date',
    },
    {
      name: 'providerMessageId',
      type: 'text',
    },
    {
      name: 'idempotencyKey',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
      },
    },
  ],
}
