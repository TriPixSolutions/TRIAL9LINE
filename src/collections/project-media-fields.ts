import type { Field } from 'payload'
import { galleryLayouts } from '../lib/project-presentation'
import { resolveProjectVideo } from '../lib/project-video'

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
const videoMimeTypes = ['video/mp4', 'video/webm']
const showFor = (...types: string[]) => (_data: unknown, row: { blockType?: string }) =>
  types.includes(row?.blockType ?? '')
const videoSection = showFor('video', 'videoResults')
const resultsSection = showFor('videoResults')
const imageSection = showFor('wideImage', 'captionedImage', 'textBlock')
const pairSection = showFor('imagePair')

function upload(name: string, label: string, kind: 'image' | 'video' = 'image'): Field {
  return {
    name, label, type: 'upload', relationTo: 'media',
    filterOptions: { mimeType: { in: kind === 'image' ? imageMimeTypes : videoMimeTypes } },
  }
}

function imageLink(name: string, label: string): Field {
  return { name, label, type: 'text' }
}

function videoLink(): Field {
  return {
    name: 'videoUrl', label: 'Video link', type: 'text',
    validate: (value: string | null | undefined) =>
      !value || resolveProjectVideo(value) !== null || 'Use a YouTube, Instagram, Vimeo, MP4 or WebM link.',
    admin: { description: 'Use a public video link. If you upload a video, the uploaded file takes priority.' },
  }
}

function videoShape(): Field {
  return {
    name: 'videoShape', label: 'Video shape', type: 'select', defaultValue: 'auto',
    options: [
      { label: 'Automatic', value: 'auto' },
      { label: 'Tall reel (9:16)', value: 'portrait' },
      { label: 'Wide video (16:9)', value: 'landscape' },
    ],
  }
}

function count(name: string, label: string): Field {
  return {
    name, label, type: 'number', min: 0,
    admin: { className: 'studio-metric-input' },
    validate: (value: number | null | undefined) =>
      value == null || (Number.isSafeInteger(value) && value >= 0) || 'Enter a whole number of zero or more.',
  }
}

export const projectCoverFields: Field[] = [
  upload('coverImage', 'Works thumbnail'),
  upload('bannerImage', 'Project page banner'),
  {
    type: 'collapsible', label: 'Use an image link', admin: { initCollapsed: true },
    fields: [imageLink('coverImageUrl', 'Thumbnail link'), imageLink('bannerImageUrl', 'Banner link')],
  },
]

export const projectGalleryField: Field = {
  name: 'gallery', type: 'array', label: 'Page sections',
  labels: { singular: 'Section', plural: 'Sections' },
  admin: { description: 'Add sections in the order you want them to appear. Drag to move a section.' },
  fields: [
    { name: 'blockType', type: 'select', label: 'Section type', required: true, defaultValue: 'wideImage', options: galleryLayouts, admin: { className: 'studio-section-type' } },
    { name: 'heading', type: 'text', label: 'Heading', admin: { className: 'studio-section-heading', condition: showFor('textBlock', 'video', 'videoResults', 'mediaGrid') } },
    {
      type: 'group', label: 'Photo', admin: { condition: imageSection },
      fields: [upload('mediaItem', 'Upload or choose a photo'), {
        type: 'collapsible', label: 'Use a photo link', admin: { initCollapsed: true },
        fields: [imageLink('imageUrl', 'Photo link')],
      }],
    },
    {
      type: 'group', label: 'Photos', admin: { condition: pairSection },
      fields: [upload('mediaLeft', 'Left photo'), upload('mediaRight', 'Right photo')],
    },
    {
      type: 'collapsible', label: 'Use photo links', admin: { condition: pairSection, initCollapsed: true },
      fields: [imageLink('imageLeftUrl', 'Left photo link'), imageLink('imageRightUrl', 'Right photo link')],
    },
    {
      name: 'stripImages', type: 'array', label: 'Tall photos', admin: { condition: showFor('portraitStrip') },
      fields: [upload('media', 'Upload or choose a photo'), imageLink('url', 'Photo link (optional)'), { name: 'caption', type: 'text' }],
    },
    {
      type: 'group', label: 'Video', admin: { className: 'studio-video-fields', condition: videoSection },
      fields: [
        upload('videoFile', 'Upload or choose a video', 'video'), videoLink(), videoShape(),
        upload('videoPoster', 'Video thumbnail'),
        { type: 'collapsible', label: 'Use a thumbnail link', admin: { initCollapsed: true }, fields: [imageLink('videoPosterUrl', 'Thumbnail link')] },
      ],
    },
    {
      name: 'imageRatio', type: 'select', defaultValue: 'landscape', label: 'Photo shape',
      options: [{ label: 'Wide (16:9)', value: 'landscape' }, { label: 'Cinema (21:9)', value: 'cinematic' }, { label: 'Square (1:1)', value: 'square' }],
      admin: { condition: imageSection },
    },
    { name: 'caption', type: 'text', label: 'Caption under the media', admin: { className: 'studio-section-caption', condition: showFor('wideImage', 'captionedImage', 'imagePair', 'textBlock', 'video', 'videoResults') } },
    { name: 'body', type: 'textarea', label: 'Story', admin: { className: 'studio-section-story', condition: showFor('textBlock', 'videoResults') } },
    {
      type: 'group', label: 'Results', admin: { className: 'studio-results-fields', condition: resultsSection },
      fields: [
        {
          name: 'videoSide', label: 'Video position', type: 'select', defaultValue: 'left',
          options: [{ label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }],
        },
        { name: 'resultClient', type: 'text', label: 'Client name for this video', admin: { description: 'Leave empty to use the project client.' } },
        { name: 'reportingPeriod', type: 'text', label: 'Date range (optional)', admin: { description: 'For example, September 2026 or First 30 days.' } },
        count('views', 'Views'),
        count('saves', 'Saves'),
        count('shares', 'Shares'),
        count('reach', 'Reach'),
        { name: 'growth', label: 'Growth (%)', type: 'number' },
        {
          name: 'extraMetrics', type: 'array', label: 'More results (optional)', maxRows: 6,
          fields: [{ name: 'label', type: 'text', required: true, label: 'What did you measure?' }, { name: 'value', type: 'text', required: true, label: 'Value' }],
        },
      ],
    },
    {
      name: 'gridItems', type: 'array', label: 'Photos and reels', admin: { condition: showFor('mediaGrid') },
      labels: { singular: 'Photo or reel', plural: 'Photos and reels' },
      fields: [
        {
          name: 'kind', type: 'select', label: 'Item type', defaultValue: 'photo', required: true,
          options: [{ label: 'Photo or poster', value: 'photo' }, { label: 'Reel or video', value: 'video' }],
        },
        { name: 'title', type: 'text', label: 'Title' },
        upload('media', 'Photo or video thumbnail'),
        imageLink('url', 'Photo or thumbnail link (optional)'),
        {
          type: 'group', label: 'Video', admin: { condition: (_data, row) => row?.kind === 'video' },
          fields: [upload('videoFile', 'Upload or choose a video', 'video'), videoLink(), videoShape()],
        },
        { name: 'caption', type: 'text', label: 'Caption' },
      ],
    },
  ],
}
