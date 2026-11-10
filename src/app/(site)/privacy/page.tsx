import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Privacy Policy', description: 'How inquiry information is used by Trail9ine Media.' }
export default function PrivacyPage() {
  return <article className="studio-container prose-page"><h1>Privacy policy.</h1>
    <p>When you contact Trail9ine Media, we collect the information you choose to submit: your name, business name, email, optional phone number, service interest and project message.</p>
    <h2>Why we collect it</h2><p>Your information helps us review your inquiry, respond to you and discuss a potential project. Submitting this form does not subscribe you to marketing emails.</p>
    <h2>How inquiries are handled</h2><p>Submissions are recorded in our inquiry system for authorised staff. An email notification may also be sent through our transactional email provider. Inquiry information should not include sensitive information that is unnecessary for discussing your project.</p>
    <h2>Questions about your information</h2><p>Use our contact page to ask about the information you have submitted or to request its correction or deletion.</p>
  </article>
}
