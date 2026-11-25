import type { Field } from 'payload'
import { resolveProjectVideo } from '../lib/project-video'

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
const videoMimeTypes = ['video/mp4', 'video/webm']

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
    label: 'Or paste an Instagram, YouTube or Vimeo link',
    admin: { description: 'Choose one: upload the video above, or paste its public link here.' },
    validate: (value: string | null | undefined) => !value || resolveProjectVideo(value) !== null || 'Use a valid Instagram, YouTube, Vimeo, MP4 or WebM link.',
  }
}

function instagramPostLink(): Field {
  return {
    name: 'instagramUrl',
    type: 'text',
    label: 'Or paste an Instagram post link',
    admin: { description: 'Choose one: upload the poster above, paste a direct image URL, or paste the Instagram post link.' },
    validate: (value: string | null | undefined) => {
      const source = resolveProjectVideo(value)
      return !value || source?.kind === 'instagram' || 'Use a valid Instagram post link.'
    },
  }
}

function metric(name: string, label: string): Field {
  return { name, label, type: 'number', min: 0, admin: { className: 'studio-metric-input' } }
}

function subcategory(label = 'Subcategory', description = 'Choose a category, or create a new one here. It becomes a clickable filter on the public page.'): Field {
  return {
    name: 'subcategory',
    type: 'relationship',
    relationTo: 'categories',
    label,
    admin: {
      description,
    },
  }
}

export const portfolioContentFields: Field[] = [
  {
    name: 'contentVideos',
    type: 'array',
    label: 'Videos & reels',
    labels: { singular: 'Video', plural: 'Videos' },
    admin: {
      className: 'studio-category-fields studio-content-videos',
      description: 'Add a video in either of two ways: upload the file, or paste its Instagram/YouTube/Vimeo link.',
    },
    fields: [
      { name: 'title', type: 'text', required: true, label: 'Video title' },
      subcategory(),
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
      { name: 'displayOrder', type: 'number', label: 'Display order', admin: { description: 'Optional. Lower numbers appear first.' } },
    ],
  },
  {
    name: 'marketingReports',
    type: 'array',
    label: 'Campaign reports',
    labels: { singular: 'Campaign report', plural: 'Campaign reports' },
    admin: {
      className: 'studio-category-fields studio-marketing-reports',
      description: 'Add a campaign screenshot and the confirmed Meta Ads figures. Leave a metric empty if it should not be shown.',
    },
    fields: [
      { name: 'campaignName', type: 'text', required: true, label: 'Campaign name' },
      subcategory(),
      { name: 'isIllustrative', type: 'checkbox', defaultValue: false, label: 'Illustrative / demo data', admin: { description: 'Turn this on for sample figures. The public page will show a clear disclaimer.' } },
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
      { name: 'displayOrder', type: 'number', label: 'Display order', admin: { description: 'Optional. Lower numbers appear first.' } },
    ],
  },
  {
    name: 'foodPhotos',
    type: 'array',
    label: 'Food photography',
    labels: { singular: 'Photo', plural: 'Photos' },
    admin: {
      className: 'studio-category-fields studio-food-photos',
      description: 'Upload each finished photograph. The website aligns the gallery automatically and shows the complete image by default.',
    },
    fields: [
      upload('photo', 'Upload a photo', 'image'),
      subcategory(),
      imageLink('photoUrl'),
      {
        name: 'photoShape',
        type: 'select',
        defaultValue: 'auto',
        label: 'Photo shape',
        admin: { description: 'Auto reads the uploaded photo. Choose a shape only for pasted image links.' },
        options: [
          { label: 'Auto · use original photo', value: 'auto' },
          { label: 'Tall · 2:3', value: 'portrait-2-3' },
          { label: 'Tall · 3:5', value: 'portrait-3-5' },
          { label: 'Portrait · 3:4', value: 'portrait-3-4' },
          { label: 'Portrait · 4:5', value: 'portrait-4-5' },
        ],
      },
      {
        name: 'photoFit',
        type: 'select',
        defaultValue: 'full',
        label: 'Image display',
        options: [
          { label: 'Show the full photo', value: 'full' },
          { label: 'Fill the frame (may crop)', value: 'cover' },
        ],
      },
      {
        name: 'photoPosition',
        type: 'select',
        defaultValue: 'center',
        label: 'Crop focus',
        admin: { condition: (_, siblingData) => siblingData?.photoFit === 'cover' },
        options: [
          { label: 'Centre', value: 'center' },
          { label: 'Top', value: 'top' },
          { label: 'Bottom', value: 'bottom' },
        ],
      },
      { name: 'title', type: 'text', label: 'Dish or photo title' },
      { name: 'description', type: 'text', label: 'Short description (optional)' },
      { name: 'displayOrder', type: 'number', label: 'Display order', admin: { description: 'Optional. Lower numbers appear first.' } },
    ],
  },
  {
    name: 'designPosters',
    type: 'array',
    label: 'Posters & designs',
    labels: { singular: 'Design', plural: 'Designs' },
    admin: {
      className: 'studio-category-fields studio-design-posters',
      description: 'Add each creative by uploading its image or pasting the original Instagram post link.',
    },
    fields: [
      upload('poster', 'Upload a poster or design', 'image'),
      subcategory('Restaurant / brand', 'Choose the restaurant. Three creatives with the same brand appear together in one row.'),
      imageLink('posterUrl'),
      instagramPostLink(),
      { name: 'title', type: 'text', label: 'Design title' },
      { name: 'description', type: 'text', label: 'Short description (optional)' },
      { name: 'displayOrder', type: 'number', label: 'Display order', admin: { description: 'Optional. Lower numbers appear first.' } },
    ],
  },
]
