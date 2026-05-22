import { absoluteImageUrl, localImageSrc } from '@/lib/imageUrl'

describe('imageUrl helpers', () => {
  describe('absoluteImageUrl', () => {
    it('passes through https:// URLs unchanged', () => {
      expect(absoluteImageUrl('https://cdn.example.com/foo.jpg')).toBe(
        'https://cdn.example.com/foo.jpg'
      )
    })

    it('upgrades http:// to https:// to avoid mixed content', () => {
      expect(absoluteImageUrl('http://cdn.example.com/foo.jpg')).toBe(
        'https://cdn.example.com/foo.jpg'
      )
    })

    it('prefixes protocol-relative // with https:', () => {
      expect(absoluteImageUrl('//cdn.example.com/foo.jpg')).toBe('https://cdn.example.com/foo.jpg')
    })

    it('prefixes a root-relative path with siteUrl', () => {
      expect(absoluteImageUrl('/wp-content/uploads/foo.jpg')).toBe(
        'https://mitchellnchistory.org/wp-content/uploads/foo.jpg'
      )
    })

    it('prefixes a bare path with siteUrl + leading slash', () => {
      expect(absoluteImageUrl('wp-content/uploads/foo.jpg')).toBe(
        'https://mitchellnchistory.org/wp-content/uploads/foo.jpg'
      )
    })
  })

  describe('localImageSrc', () => {
    it('passes https:// through', () => {
      expect(localImageSrc('https://cdn.example.com/foo.jpg')).toBe(
        'https://cdn.example.com/foo.jpg'
      )
    })

    it('upgrades http:// to https://', () => {
      expect(localImageSrc('http://cdn.example.com/foo.jpg')).toBe(
        'https://cdn.example.com/foo.jpg'
      )
    })

    it('prefixes protocol-relative // with https:', () => {
      expect(localImageSrc('//cdn.example.com/foo.jpg')).toBe('https://cdn.example.com/foo.jpg')
    })

    it('returns a path under the base path for relative URLs', () => {
      // basePath defaults to '' in the jest env (no NEXT_PUBLIC_BASE_PATH)
      expect(localImageSrc('/wp-content/uploads/foo.jpg')).toBe('/wp-content/uploads/foo.jpg')
    })
  })
})
