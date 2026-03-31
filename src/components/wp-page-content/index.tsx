import React from 'react'
import { sanitizeHtml } from '@/lib/sanitizeHtml'

interface WpPageContentProps {
  title: string
  content: string
}

export default function WpPageContent({ title, content }: WpPageContentProps) {
  return (
    <div>
      {/* Hero */}
      <section className="bg-dark py-20 text-paper">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif-display text-4xl font-bold tracking-tight md:text-5xl">
              {title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-paper py-16">
        <div className="ffc-container">
          <div className="mx-auto max-w-3xl">
            <div
              className="wp-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
