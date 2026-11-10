import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

let cachedPayload: Promise<Payload> | null = null
export const getPayloadClient = (): Promise<Payload> => {
  // Concurrent requests share initialization instead of opening duplicate pools.
  if (!cachedPayload) cachedPayload = getPayload({config:configPromise}).catch(error=>{cachedPayload=null;throw error})
  return cachedPayload
}
