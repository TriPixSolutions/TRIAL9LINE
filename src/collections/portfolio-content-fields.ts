import type { Condition, Field } from 'payload'
import { resolveProjectVideo } from '../lib/project-video'

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
const videoMimeTypes = ['video/mp4', 'video/webm']

const selected = (section: string): Condition => (data) => {
  const value = String(data?.portfolioCategory || '')
  if (section === 'content-production') return ['content-production', 'video-production', 'content-creation'].includes(value)
  return value === section
}

function upload(name: string, label: string, kind: 'image' | 'video'): Field {
  return {
    name,
    label,
    type: 'upload',
    relationTo: 'media',
    filterOptions: { mimeType: { in: kind === 'image' ? imageMimeTypes : videoMimeTypes } },
  }
}

function imageLink(name: string): Field {
  return {
    name,
    type: 'text',
    label: 'Or paste an image link',
    admin: { description: 'Upload is recommended. Use a secure public image URL only when needed.' },
  }
}

function videoLink(): Field {
  return {
    name: 'videoUrl',
    type: 'text',
    label: 'Or paste an Instagram, YouTube, Vimeo or video link',
    validate: (value: string | null | undefined) => !value || resolveProjectVideo(value) !== null || 'Use a valid Instagram, YouTube, Vimeo, MP4 or WebM link.',
  }
}

function metric(name: string, label: string): Field {
  return { name, label, type: 'number', min: 0, admin: { className: 'studio-metric-input' } }
}

export const portfolioContentFields: Field[] = [
  {
    name: 'contentVideos',
    type: 'array',
    label: 'Videos & reels',
    labels: { singular: 'Video', plural: 'Videos' },
    admin: {
      condition: selected('content-production'),
      description: 'Add the finished videos in display order. No thumbnail is needed—the original player appears in the portfolio grid.',
    },
    fields: [
      { name: 'title', type: 'text', required: true, label: 'Video title' },
      {
        name: 'format',
        type: 'select',
        required: true,
        defaultValue: 'portrait',
        label: 'Format',
        options: [
          { label: 'Instagram reel · 9:16', value: 'portrait' },
          { label: 'Landscape film · 16:9', value: 'landscape' },
        ],
      },
      upload('videoFile', 'Upload a video', 'video'),
      videoLink(),
      { name: 'caption', type: 'text', label: 'Short caption (optional)' },
    ],
  },
  {
    name: 'marketingReports',
    type: 'array',
    label: 'Campaign reports',
    labels: { singular: 'Campaign report', plural: 'Campaign reports' },
    admin: {
      condition: selected('performance-marketing'),
      description: 'Add a campaign screenshot and the confirmed Meta Ads figures. Leave a metric empty if it should not be shown.',
    },
    fields: [
      { name: 'campaignName', type: 'text', required: true, label: 'Campaign name' },
      upload('reportImage', 'Upload Meta Ads screenshot', 'image'),
      imageLink('reportImageUrl'),
      { name: 'period', type: 'text', label: 'Reporting period' },
      { name: 'spend', type: 'text', label: 'Amount spent', admin: { description: 'Include the currency, for example CAD 1,250.' } },
      {
        type: 'group',
        label: 'Results',
        admin: { className: 'studio-results-fields' },
        fields: [
          metric('reach', 'Reach'),
          metric('impressions', 'Impressions'),
          metric('clicks', 'Link clicks'),
          metric('leads', 'Leads'),
          { name: 'ctr', type: 'number', min: 0, label: 'CTR (%)' },
        ],
      },
      { name: 'summary', type: 'text', label: 'Result highlight (optional)' },
    ],
  },
  {
    name: 'foodPhotos',
    type: 'array',
    label: 'Food photography',
    labels: { singular: 'Photo', plural: 'Photos' },
    admin: {
      condition: selected('food-photography'),
      description: 'Upload finished photographs in the order they should appear in the grid.',
    },
    fields: [
      upload('photo', 'Upload a photo', 'image'),
      imageLink('photoUrl'),
      { name: 'title', type: 'text', label: 'Dish or photo title' },
      { name: 'description', type: 'text', label: 'Short description (optional)' },
    ],
  },
  {
    name: 'designPosters',
    type: 'array',
    label: 'Posters & designs',
    labels: { singular: 'Design', plural: 'Designs' },
    admin: {
      condition: selected('creative-designs'),
      description: 'Upload each poster separately. The public page automatically builds the responsive poster grid.',
    },
    fields: [
      upload('poster', 'Upload a poster or design', 'image'),
      imageLink('posterUrl'),
      { name: 'title', type: 'text', label: 'Design title' },
      { name: 'description', type: 'text', label: 'Short description (optional)' },
    ],
  },
]
