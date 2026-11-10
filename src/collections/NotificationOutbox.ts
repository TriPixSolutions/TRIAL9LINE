import type { CollectionConfig } from 'payload'

export const NotificationOutbox: CollectionConfig = {
  slug: 'notification-outbox',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['inquiry', 'status', 'attempts', 'nextAttemptAt', 'providerMessageId', 'createdAt'],
    group: 'System & Accounts',
    hidden: ({ user }) => user?.role !== 'owner',
  },
  access: {
    read: ({ req }) => req.user?.role === 'owner' || req.user?.role === 'inquiry_manager',
    create: ({ req }) => req.user?.role === 'owner', // System worker or internal API
    update: ({ req }) => req.user?.role === 'owner' || req.user?.role === 'inquiry_manager',
    delete: ({ req }) => req.user?.role === 'owner',
  },
  fields: [
    {name:'leaseToken',type:'text',admin:{hidden:true}},
    {
      name: 'inquiry',
      type: 'relationship',
      unique: true,
      relationTo: 'inquiries',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing (Leased)', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed (Exhausted)', value: 'failed' },
      ],
      index: true,
    },
    {
      name: 'attempts',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'maxAttempts',
      type: 'number',
      defaultValue: 5,
    },
    {
      name: 'nextAttemptAt',
      type: 'date',
    },
    {
      name: 'leaseExpiresAt',
      type: 'date',
      admin: {
        description: 'Distributed locking lease expiration to prevent concurrent duplicate sends',
      },
    },
    {
      name: 'lastError',
      type: 'text',
    },
    {
      name: 'providerMessageId',
      type: 'text',
    },
  ],
}
