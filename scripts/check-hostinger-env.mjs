import {deploymentErrors} from './deployment-env.mjs'
const errors = deploymentErrors(process.env)
if (errors.length) {
  console.error('Configure these settings in Hostinger before deployment:')
  for (const error of errors) console.error(' - ' + error)
  process.exitCode = 1
} else {
  console.log('Deployment environment format validated. Database connectivity still requires a live check.')
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_WEBHOOK_SECRET) console.warn('Email delivery/webhook credentials are incomplete. Inquiries can be stored, but live notification delivery is not ready.')
}
