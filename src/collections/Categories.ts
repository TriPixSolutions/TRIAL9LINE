import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'displayOrder', 'active'],
    group: 'Portfolio',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'owner' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'owner' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'owner' || req.user?.role === 'editor',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly slug (e.g. video, social, photo, campaigns)',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order of appearance in public filter bar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show this category in public portfolio filters',
      },
    },
  ],
}
