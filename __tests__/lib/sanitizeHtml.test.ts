import { sanitizeHtml } from '@/lib/sanitizeHtml'

describe('sanitizeHtml', () => {
  it('strips <script> tags', () => {
    const result = sanitizeHtml('<p>Hello</p><script>alert("xss")</script>')
    expect(result).not.toContain('<script>')
    expect(result).toContain('<p>Hello</p>')
  })

  it('strips onerror attributes', () => {
    const result = sanitizeHtml('<img src="test.jpg" onerror="alert(1)" alt="test" />')
    expect(result).not.toContain('onerror')
    expect(result).toContain('src="test.jpg"')
  })

  it('strips javascript: URLs from links', () => {
    const result = sanitizeHtml('<a href="javascript:alert(1)">click</a>')
    expect(result).not.toContain('javascript:')
  })

  it('allows safe HTML tags', () => {
    const result = sanitizeHtml(
      '<p>Text</p><h1>Title</h1><h2>Sub</h2><figure><img src="img.jpg" alt="alt" /><figcaption>Cap</figcaption></figure>'
    )
    expect(result).toContain('<p>')
    expect(result).toContain('<h1>')
    expect(result).toContain('<h2>')
    expect(result).toContain('<figure>')
    expect(result).toContain('<figcaption>')
    expect(result).toContain('<img')
  })

  it('allows YouTube iframes', () => {
    const result = sanitizeHtml(
      '<iframe src="https://www.youtube.com/embed/abc123" width="560" height="315"></iframe>'
    )
    expect(result).toContain('<iframe')
    expect(result).toContain('youtube.com')
  })

  it('strips src from iframes with disallowed domains', () => {
    const result = sanitizeHtml('<iframe src="https://evil.com/page"></iframe>')
    expect(result).not.toContain('evil.com')
  })

  it('adds rel="noopener noreferrer" to target="_blank" links', () => {
    const result = sanitizeHtml('<a href="https://example.com" target="_blank">link</a>')
    expect(result).toContain('rel="noopener noreferrer"')
  })

  it('normalizes relative wp-content URLs on images', () => {
    const result = sanitizeHtml('<img src="../wp-content/uploads/photo.jpg" alt="photo" />')
    expect(result).toContain('src="https://mitchellnchistory.org/wp-content/uploads/photo.jpg"')
  })

  it('normalizes protocol-relative URLs on links', () => {
    const result = sanitizeHtml('<a href="//mitchellnchistory.org/page">link</a>')
    expect(result).toContain('href="https://mitchellnchistory.org/page"')
  })

  it('preserves srcset and sizes attributes', () => {
    const result = sanitizeHtml(
      '<img src="img.jpg" srcset="img-2x.jpg 2x" sizes="(max-width: 600px) 100vw" alt="test" />'
    )
    expect(result).toContain('srcset=')
    expect(result).toContain('sizes=')
  })

  it('strips PayPal tracking pixels', () => {
    const result = sanitizeHtml(
      '<img src="//www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" alt="" />'
    )
    expect(result).not.toContain('paypal.com')
    expect(result).not.toContain('<img')
  })

  it('rewrites WordPress date permalinks to article routes', () => {
    const result = sanitizeHtml(
      '<a href="https://mitchellnchistory.org/2019/03/11/joshua-of-the-mountains/">link</a>'
    )
    expect(result).toContain('href="/articles/joshua-of-the-mountains/"')
    expect(result).not.toContain('/2019/')
  })

  it('rewrites relative WordPress date permalinks', () => {
    const result = sanitizeHtml('<a href="/2020/01/15/some-article/">link</a>')
    expect(result).toContain('href="/articles/some-article/"')
  })

  it('does not normalize protocol-relative URLs from other domains', () => {
    const result = sanitizeHtml('<a href="//mitchellnchistory.org.evil.com/malicious">link</a>')
    expect(result).not.toContain('https://mitchellnchistory.org.evil.com')
    expect(result).toContain('//mitchellnchistory.org.evil.com')
  })
})
