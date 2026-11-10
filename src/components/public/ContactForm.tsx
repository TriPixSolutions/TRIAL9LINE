'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { inquirySchema, type InquiryInput } from '@/lib/inquiries'
import { Arrow } from './Studio'
const serviceMap: Record<string, InquiryInput['serviceInterest']> = {
  'social-media-marketing': 'social-media', 'social-media': 'social-media',
  'content-creation-video-production': 'video-production', 'video-production': 'video-production',
  'food-commercial-photography': 'photography', photography: 'photography',
  'branding-graphic-design': 'branding-design', 'branding-design': 'branding-design',
  'paid-advertising-digital-marketing': 'digital-marketing', 'digital-marketing': 'digital-marketing',
}
export function ContactForm({ initialService = 'not-sure' }: { initialService?: string }) {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { fullName: '', businessName: '', email: '', phone: '', serviceInterest: serviceMap[initialService] || 'not-sure', message: '', privacyAcknowledged: false, _hp_website: '', idempotencyKey: '' },
  })
  useEffect(() => { setValue('idempotencyKey', crypto.randomUUID()) }, [setValue])
  const submit = async (data: InquiryInput) => {
    if (state === 'submitting') return
    setState('submitting'); setError('')
    try {
      const response = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.error || 'Your inquiry couldn’t be sent. Your details are still here—please try again.')
      setState('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your inquiry couldn’t be sent. Your details are still here—please try again.')
      setState('error')
    }
  }
  const errorText = (name: keyof InquiryInput) => errors[name] ? <span id={name + '-error'} className="field-error">{errors[name]?.message}</span> : null
  const inputProps = (name: keyof InquiryInput) => ({ 'aria-invalid': !!errors[name], 'aria-describedby': errors[name] ? name + '-error' : undefined })
  return <div className="contact-form">
    {state === 'success' ? <div className="form-status" role="status"><h2>Good things start here.</h2><p>Thanks for telling us about your project. Your inquiry has been received.</p><button onClick={() => { reset(); setValue('idempotencyKey', crypto.randomUUID()); setState('idle') }}>Send another inquiry</button></div> : <>
      <div className="form-intro"><h2>A little about your project.</h2><p>Fields marked * are required.</p></div>
      {state === 'error' && <div className="form-status is-error" role="alert">{error}</div>}
      <form onSubmit={handleSubmit(submit)} noValidate aria-busy={state === 'submitting'}>
        <div hidden aria-hidden="true"><label htmlFor="website">Leave this field blank</label><input id="website" tabIndex={-1} autoComplete="off" {...register('_hp_website')} /></div>
        <div className="form-fields">
          <div className="form-field"><label htmlFor="fullName">Full name *</label><input id="fullName" autoComplete="name" placeholder="Your name" {...register('fullName')} {...inputProps('fullName')} />{errorText('fullName')}</div>
          <div className="form-field"><label htmlFor="businessName">Business / company *</label><input id="businessName" autoComplete="organization" placeholder="Your business" {...register('businessName')} {...inputProps('businessName')} />{errorText('businessName')}</div>
          <div className="form-field"><label htmlFor="email">Email address *</label><input id="email" type="email" autoComplete="email" placeholder="you@company.com" {...register('email')} {...inputProps('email')} />{errorText('email')}</div>
          <div className="form-field"><label htmlFor="phone">Phone number <span>(optional)</span></label><input id="phone" type="tel" autoComplete="tel" placeholder="Your phone number" {...register('phone')} />{errorText('phone')}</div>
          <div className="form-field full"><label htmlFor="serviceInterest">What can we help with? *</label><select id="serviceInterest" {...register('serviceInterest')} {...inputProps('serviceInterest')}>
            <option value="not-sure">Let’s figure it out together</option><option value="social-media">Social Media Marketing</option><option value="video-production">Content Creation & Video Production</option><option value="photography">Food & Commercial Photography</option><option value="branding-design">Branding & Graphic Design</option><option value="digital-marketing">Paid Advertising & Digital Marketing</option>
          </select>{errorText('serviceInterest')}</div>
          <div className="form-field full"><label htmlFor="message">Tell us about your project *</label><textarea id="message" rows={4} placeholder="A little about your business, your plans and what you need." {...register('message')} {...inputProps('message')} />{errorText('message')}</div>
        </div>
        <div className="form-privacy"><input id="privacyAcknowledged" type="checkbox" {...register('privacyAcknowledged')} {...inputProps('privacyAcknowledged')} /><label htmlFor="privacyAcknowledged">I’ve read the <a href="/privacy">Privacy Policy</a> and understand how my inquiry details will be used.</label></div>
        {errorText('privacyAcknowledged')}
        <button className="studio-action form-submit" disabled={state === 'submitting'} type="submit"><span>{state === 'submitting' ? 'Sending…' : 'Send inquiry'}</span><Arrow diagonal /></button>
      </form>
    </>}
  </div>
}
