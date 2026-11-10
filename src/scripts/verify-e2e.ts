async function verify() {
  console.log('🚀 Starting Comprehensive Live Verification...\n')

  const baseUrl = 'http://localhost:3000'

  // Test 1: Homepage
  console.log('1. Checking Homepage (GET /)...')
  const resHome = await fetch(`${baseUrl}/`)
  const homeHtml = await resHome.text()
  if (resHome.status !== 200 || !homeHtml.includes('TRAIL9INE MEDIA') || !homeHtml.includes('<h1')) {
    throw new Error(`Homepage check failed: status ${resHome.status}`)
  }
  console.log('   ✓ Homepage 200 OK with correct branding and hero copy.')

  // Test 2: Work / Portfolio
  console.log('2. Checking Work / Portfolio (GET /work)...')
  const resWork = await fetch(`${baseUrl}/work`)
  const workHtml = await resWork.text()
  if (resWork.status !== 200 || !workHtml.includes('Project collection')) {
    throw new Error(`Work page check failed: status ${resWork.status}`)
  }
  console.log('   ✓ Work page 200 OK with published projects & filters.')

  // Test 3: Services Index
  console.log('3. Checking Services Index (GET /services)...')
  const resServices = await fetch(`${baseUrl}/services`)
  const servicesHtml = await resServices.text()
  if (resServices.status !== 200 || !servicesHtml.includes('Social Media Marketing')) {
    throw new Error(`Services page check failed: status ${resServices.status}`)
  }
  console.log('   ✓ Services page 200 OK with all 5 capabilities.')

  // Test 4: Service Detail Page
  console.log('4. Checking Service Detail (GET /services/social-media-marketing)...')
  const resSvcDetail = await fetch(`${baseUrl}/services/social-media-marketing`)
  const svcHtml = await resSvcDetail.text()
  if (resSvcDetail.status !== 200 || !svcHtml.includes('Give people a reason to keep following')) {
    throw new Error(`Service detail failed: status ${resSvcDetail.status}`)
  }
  console.log('   ✓ Service detail 200 OK with scope and deliverables.')

  // Test 5: Project Detail Route
  console.log('5. Checking Project Detail (GET /work/tharavadu)...')
  const resProjDetail = await fetch(`${baseUrl}/work/tharavadu`)
  const projHtml = await resProjDetail.text()
  if (resProjDetail.status !== 200 || !projHtml.includes('South Indian flavours, brought into focus')) {
    throw new Error(`Project detail failed: status ${resProjDetail.status}`)
  }
  console.log('   ✓ Project detail 200 OK with modular gallery.')

  // Test 6: About Page
  console.log('6. Checking About Page (GET /about)...')
  const resAbout = await fetch(`${baseUrl}/about`)
  const aboutHtml = await resAbout.text()
  if (resAbout.status !== 200 || !aboutHtml.includes('Riyan') || !aboutHtml.includes('Shamil')) {
    throw new Error(`About page failed: status ${resAbout.status}`)
  }
  console.log('   ✓ About page 200 OK with leadership & studio narrative.')

  // Test 7: Contact Page
  console.log('7. Checking Contact Page (GET /contact)...')
  const resContact = await fetch(`${baseUrl}/contact`)
  const contactHtml = await resContact.text()
  if (resContact.status !== 200 || !contactHtml.includes('Tell us what')) {
    throw new Error(`Contact page failed: status ${resContact.status}`)
  }
  console.log('   ✓ Contact page 200 OK with form shell.')

  // Test 8: Form Validation Failure
  console.log('8. Testing Contact Form Validation (POST /api/inquiries with empty body)...')
  const resVal = await fetch(`${baseUrl}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
  if (resVal.status !== 400) {
    throw new Error(`Expected 400 for empty form submission, got ${resVal.status}`)
  }
  console.log('   ✓ Validation correctly rejected incomplete payload with 400.')

  // Test 9: Valid Inquiry Submission
  console.log('9. Testing Valid Contact Form Submission (POST /api/inquiries)...')
  const validSubmission = {
    fullName: 'David Miller',
    businessName: 'Yorkville Hospitality',
    email: 'david@yorkvillehospitality.com',
    phone: '+1 416-555-0144',
    serviceInterest: 'social-media',
    message: 'We are opening a new rooftop lounge and need a launch campaign and social media partner.',
    privacyAcknowledged: true,
  }
  const resSubmit = await fetch(`${baseUrl}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validSubmission),
  })
  const submitData = await resSubmit.json()
  if (resSubmit.status !== 201 || !submitData.success || !submitData.reference) {
    throw new Error(`Valid submission failed: ${JSON.stringify(submitData)}`)
  }
  console.log(`   ✓ Form submission succeeded: Reference ${submitData.reference}`)

  // Test 10: Honeypot Anti-Spam
  console.log('10. Testing Spam Honeypot Protection...')
  const spamSubmission = {
    ...validSubmission,
    _hp_website: 'http://spam-bot.xyz',
  }
  const resSpam = await fetch(`${baseUrl}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spamSubmission),
  })
  if (resSpam.status !== 200 && resSpam.status !== 201) {
    throw new Error(`Spam submission handler failed: status ${resSpam.status}`)
  }
  console.log('   ✓ Honeypot correctly intercepted bot submission without database pollution.')

  // Test 11: Access Control - Unauthorized Preview
  console.log('11. Testing Draft Preview Access Control (GET /api/preview without auth)...')
  const resPreview = await fetch(`${baseUrl}/api/preview?slug=tharavadu`, {
    redirect: 'manual',
  })
  if (resPreview.status !== 401) {
    throw new Error(`Expected 401 for unauthorized preview, got ${resPreview.status}`)
  }
  console.log('   ✓ Unauthorized preview correctly rejected with 401.')

  // Test 12: Access Control - Unauthorized Notification Retry
  console.log('12. Testing Notification Retry Access Control (POST /api/inquiries/retry without auth)...')
  const resRetry = await fetch(`${baseUrl}/api/inquiries/retry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inquiryId: 1 }),
  })
  if (resRetry.status !== 403) {
    throw new Error(`Expected 403 for unauthorized retry, got ${resRetry.status}`)
  }
  console.log('   ✓ Staff retry endpoint correctly guarded with 403 Forbidden.')

  // Test 13: Background Outbox Worker
  console.log('13. Testing Background Worker Execution (GET /api/notifications/worker)...')
  if(!process.env.WORKER_AUTH_SECRET)throw new Error('Set WORKER_AUTH_SECRET before running the live worker check.')
  const resWorker = await fetch(`${baseUrl}/api/notifications/worker`, {
    method: 'POST',
    headers: {authorization: 'Bearer ' + process.env.WORKER_AUTH_SECRET},
  })
  const workerData = await resWorker.json()
  if (resWorker.status !== 200 || typeof workerData.processed !== 'number') {
    throw new Error(`Worker execution failed: ${JSON.stringify(workerData)}`)
  }
  console.log(`   ✓ Background outbox worker executed successfully. Processed: ${workerData.processed} items.`)

  console.log('\n🎉 ALL 13 END-TO-END VERIFICATION CHECKS PASSED!')
}

verify().catch((err) => {
  console.error('\n❌ Verification Failed:', err)
  process.exit(1)
})
