'use client'

import { useEffect } from 'react'

export default function YouTubeLoader() {
  useEffect(() => {
    function getSafeYouTubeSrc(rawSrc: string): string | null {
      try {
        const url = new URL(rawSrc, window.location.origin)
        const allowedHosts = new Set([
          'www.youtube.com',
          'youtube.com',
          'youtu.be',
          'www.youtube-nocookie.com'
        ])
        if (url.protocol !== 'https:') return null
        if (!allowedHosts.has(url.hostname)) return null
        return url.toString()
      } catch {
        return null
      }
    }

    function activateThumb(el: HTMLElement) {
      const rawSrc = el.getAttribute('data-yt-src')
      if (!rawSrc) return
      const safeSrc = getSafeYouTubeSrc(rawSrc)
      if (!safeSrc) return
      const iframe = document.createElement('iframe')
      iframe.setAttribute('src', safeSrc)
      iframe.setAttribute('frameborder', '0')
      iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      )
      iframe.setAttribute('allowfullscreen', '')
      iframe.className = 'w-full h-full'
      // wrap iframe in responsive container (16:9)
      const wrapper = document.createElement('div')
      wrapper.style.width = '100%'
      wrapper.style.height = '0'
      wrapper.style.paddingTop = '56.25%'
      wrapper.style.position = 'relative'
      iframe.style.position = 'absolute'
      iframe.style.top = '0'
      iframe.style.left = '0'
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      wrapper.appendChild(iframe)
      el.innerHTML = ''
      el.appendChild(wrapper)
    }

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const thumb = (target.closest && target.closest('.mch-video__thumb')) as HTMLElement | null
      if (thumb) {
        activateThumb(thumb)
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Enter' && e.key !== ' ') return
      const active = document.activeElement as HTMLElement | null
      if (!active) return
      const thumb = (active.closest && active.closest('.mch-video__thumb')) as HTMLElement | null
      if (thumb) {
        e.preventDefault()
        activateThumb(thumb)
      }
    }

    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return null
}
