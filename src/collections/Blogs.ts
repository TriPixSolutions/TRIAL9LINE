import type { CollectionConfig } from 'payload'
import { manageContent } from '../lib/access'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'published', 'updatedAt'] },
  access: {
    read: ({ req }) => ['owner', 'editor'].includes(String(req.user?.role)) || { published: { equals: true } },
    create: manageContent, update: manageContent, delete: manageContent,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, required: true, validate: (s: unknown) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(s ?? '')) || 'Use lowercase words separated by hyphens.' },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'body', type: 'textarea', required: true, admin: { description: 'Separate paragraphs with a blank line. Start section headings with ## followed by a space.' } },
    { name: 'source', type: 'text', label: 'Further reading (HTTPS URL)', validate: (value: unknown) => !value || (URL.canParse(String(value)) && new URL(String(value)).protocol === 'https:') || 'Enter a complete HTTPS URL.' },
    { name: 'metaTitle', type: 'text' }, { name: 'metaDescription', type: 'textarea' },
    { name: 'keywords', type: 'text', label: 'Keywords (comma-separated)' },
    { name: 'published', type: 'checkbox', defaultValue: false },
  ],
}
