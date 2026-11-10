import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'createdAt'],
    group: 'System & Accounts',
    hidden: ({ user }) => user?.role !== 'owner',
  },
  access: {
    // Only owners can create users; allow initial creation if no users exist
    create: async ({ req }) => {
      if (!req.user) {
        const users = await req.payload.find({
          collection: 'users',
          limit: 1,
        })
        return users.totalDocs === 0
      }
      return req.user.role === 'owner'
    },
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'owner') return true
      return { id: { equals: req.user.id } }
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'owner') return true
      return { id: { equals: req.user.id } }
    },
    delete: ({ req }) => req.user?.role === 'owner',
  },
  hooks: { beforeChange: [async ({data, operation, req}) => {
    if (operation === 'create' && !req.user) {
      const existing = await req.payload.count({collection:'users', overrideAccess:true, req})
      if (existing.totalDocs === 0) data.role = 'owner'
    }
    return data
  }] },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Owner (Full Access & Staff Management)', value: 'owner' },
        { label: 'Editor (Portfolio & Content Only)', value: 'editor' },
        { label: 'Inquiry Manager (Inquiries & Lead Management)', value: 'inquiry_manager' },
      ],
      access: {
        update: ({ req }) => req.user?.role === 'owner',
      },
    },
  ],
}
