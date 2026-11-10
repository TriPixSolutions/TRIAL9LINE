/** Validate deployment settings without returning or logging their values.
 * @param {Record<string, string | undefined>} env
 * @returns {string[]}
 */
export function deploymentErrors(env) {
  const errors = []
  if (!/^mongodb(\+srv)?:\/\//.test(env.DATABASE_URI || '') || /<[^>]+>|YOUR_CLUSTER|DATABASE_USER|URL_ENCODED_PASSWORD/i.test(env.DATABASE_URI || '')) errors.push('DATABASE_URI must be a complete MongoDB Atlas connection string; local SQLite is not a production database.')
  for (const key of ['PAYLOAD_SECRET', 'WORKER_AUTH_SECRET']) {
    const value = env[key] || ''
    if (value.length < 32 || /placeholder|replace_with|local-dev|development-secret|change[-_ ]?me/i.test(value)) errors.push(key + ' must be a unique secret of at least 32 characters.')
  }
  try {
    const url = new URL(env.NEXT_PUBLIC_SERVER_URL || '')
    if (url.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error()
  } catch { errors.push('NEXT_PUBLIC_SERVER_URL must be the HTTPS origin of the deployed site.') }
  for (const key of ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']) if (!env[key]?.trim()) errors.push(key + ' is required for persistent media uploads.')
  if (env.PAYLOAD_SCHEMA_PUSH === 'true') errors.push('PAYLOAD_SCHEMA_PUSH must be false in production.')
  if (env.EMAIL_SIMULATION === 'true') errors.push('EMAIL_SIMULATION must be false in production.')
  return errors
}
