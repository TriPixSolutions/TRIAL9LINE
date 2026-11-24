import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  admin: {
    group: 'Website Content',
  },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'owner' || req.user?.role === 'editor',
  },
  fields: [
    {name:'homeProjectLimit',type:'number',label:'Selected work: maximum projects',defaultValue:4,min:1,max:12,required:true,admin:{hidden:true}},
    {name:'heroImage',type:'upload',relationTo:'media',label:'Hero image (optional)'},
    {
      name: 'heroEyebrow',
      type: 'text',
      defaultValue: 'TORONTO · CREATIVE & MARKETING STUDIO',
    },
    {
      name: 'heroHeadline',
      type: 'text',
      defaultValue: 'Creative work\nthat moves brands.',
    },
    {
      name: 'heroIntro',
      type: 'textarea',
      defaultValue: 'Give your brand a presence people feel. We bring creative content, social media and digital marketing together to make it happen.',
    },
    {
      name: 'agencyIntroHeading',
      type: 'text',
      defaultValue: 'You bring the character.\nWe bring it into focus.',
    },
    {
      name: 'agencyIntroBody',
      type: 'textarea',
      defaultValue: 'We’re Trail9ine Media—a Toronto agency bringing creative production and marketing together. We help restaurants and ambitious brands build a presence that feels distinctive and consistent.',
    },
    {
      name: 'featuredClients',
      type: 'array',
      label: 'Clients shown near the top of the homepage',
      labels: { singular: 'Client', plural: 'Clients' },
      maxRows: 12,
      admin: { description: 'Add client names in the order they should appear. No logo upload is required.' },
      fields: [{ name: 'name', type: 'text', required: true, label: 'Client name' }],
    },
  ],
}
