import { importMap } from '../importMap'
import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { NotFoundPage } from '@payloadcms/next/views'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = (): Metadata => ({
  title: 'Not Found — TRAIL9INE MEDIA Staff',
})

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config: configPromise, importMap, params, searchParams })

export default NotFound
