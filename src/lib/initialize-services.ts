import type { Payload } from 'payload'
import { seedServices } from './seed-services'
import { seedPortfolioContent } from './seed-portfolio-content'

export async function initializeServices(payload: Payload) {
  try {
    const count = await payload.count({ collection: 'services', overrideAccess: true })
    await seedServices(payload, count.totalDocs ? 'website-designing' : undefined)
    await seedPortfolioContent(payload)
  } catch (error) {
    // Fresh local/test SQLite databases can initialize before Payload creates
    // collection tables. The normal seed command populates them afterwards.
    let current: unknown = error
    while (current) {
      const message = current instanceof Error ? current.message : String(current)
      if (/no such table/i.test(message)) return
      current = typeof current === 'object' && current && 'cause' in current
        ? (current as { cause?: unknown }).cause
        : undefined
    }
    throw error
  }
}
