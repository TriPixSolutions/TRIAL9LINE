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
    {name:'homeProjectLimit',type:'number',label:'Selected work: maximum projects',defaultValue:4,min:1,max:12,required:true,admin:{description:'Home-enabled published projects appear in Home order, up to this number.'}},
    {name:'heroImage',type:'upload',relationTo:'media',label:'Hero image (optional)'},
    {
      name: 'heroEyebrow',
      type: 'text',
      defaultValue: 'TORONTO · CREATIVE & MARKETING STUDIO',
    },
    {
      name: 'heroHeadline',
      type: 'text',
      defaultValue: 'Creative marketing\nfor brands\nthat grow.',
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
  ],
}
