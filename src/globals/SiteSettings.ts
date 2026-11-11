import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Website Content',
  },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'owner',
  },
  fields: [
    {name:'migrationCompletedAt',type:'date',admin:{hidden:true},access:{read:({req})=>req.user?.role==='owner'}},
    {
      name: 'siteTitle',
      type: 'text',
      defaultValue: 'TRAIL9INE MEDIA',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Creative production and marketing for restaurants and ambitious brands.',
      required: true,
    },
    {
      name: 'contactEmail',
      type: 'text',
      defaultValue: 'inquiries@trail9ine.com',
      required: true,
    },
    {
      name: 'inquiryNotificationEmail',
      type: 'email',
      label: 'Inquiry notification email',
      access: { read: ({ req }) => req.user?.role === 'owner' },
      admin: { description: 'New inquiry notifications go to this inbox. Leave blank to use the hosting configuration.' },
    },
    {
      name: 'location',
      type: 'text',
      defaultValue: 'Toronto, Ontario, Canada',
      required: true,
    },
    {
      name: 'instagramUrl',
      type: 'text',
      defaultValue: 'https://instagram.com/trail9ine',
    },
    {
      name: 'linkedinUrl',
      type: 'text',
    },
  ],
}
