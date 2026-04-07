import { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with VOLTEX. Have questions about our products? Need a custom configuration? Our team is here to help.',
  openGraph: {
    title: 'Contact Us | VOLTEX',
    description: 'Get in touch with VOLTEX. Have questions about our products? Need a custom configuration? Our team is here to help.',
    type: 'website',
  },
}

export default function ContactPage() {
  return <ContactClient />
}
