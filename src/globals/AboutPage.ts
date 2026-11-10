import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  admin: {
    group: 'Website Content',
  },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'owner' || req.user?.role === 'editor',
  },
  fields: [
    {name:'heroImage',type:'upload',relationTo:'media'},
    {name:'storyImage',type:'upload',relationTo:'media'},
    {
      name: 'heroHeadline',
      type: 'text',
      defaultValue: 'People first.\nGood work\nfollows.',
    },
    {
      name: 'heroIntro',
      type: 'textarea',
      defaultValue: 'We’re Trail9ine Media, an independent Toronto creative agency bringing visual storytelling and marketing together—with a particular focus on restaurants and hospitality.',
    },
    {
      name: 'storyHeading',
      type: 'text',
      defaultValue: 'A little curiosity.\nA lot of care.',
    },
    {
      name: 'storyBody',
      type: 'textarea',
      defaultValue: 'Trail9ine Media is an independent creative marketing agency based in Toronto. Founded in 2025, the agency began with an interest in telling better visual stories for businesses.',
    },
  ],
}
