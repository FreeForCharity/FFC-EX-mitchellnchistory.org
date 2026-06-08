/**
 * Test Configuration for Template Customization
 *
 * This file contains all content-specific values used in E2E tests.
 * When customizing this template for a new organization, update these
 * values to match your content instead of modifying individual test files.
 *
 * This makes it easy to:
 * 1. Identify what needs to change when using the template
 * 2. Keep tests working with customized content
 * 3. Maintain a single source of truth for test expectations
 */

export const testConfig = {
  /**
   * Mission Section Configuration
   * Used in: tests/mission-section.spec.ts
   */
  missionSection: {
    sectionId: 'mission',
    heading: 'Our Mission',
    text: 'To light the past, enlighten the present, and illuminate the future.',
  },

  /**
   * Events Section Configuration
   * Used in: tests/events.spec.ts
   *
   * The featured event on the homepage rotates based on which Mitchell County
   * festival is nearest to today's date, so test assertions target the stable
   * section heading and the "See All Events" link rather than a specific
   * festival name.
   */
  events: {
    sectionId: 'events',
    heading: 'Events & Festivals',
    festivalLinkText: 'See All Events',
    festivalLinkHref: '/events/',
    descriptionText: 'Mitchell County',
  },

  /**
   * Social Media Links Configuration
   * Used in: tests/social-links.spec.ts
   */
  socialLinks: {
    facebook: {
      url: 'facebook.com/mitchellnchistory.org',
      ariaLabel: 'Facebook',
    },
  },

  /**
   * Copyright Configuration
   * Used in: tests/copyright.spec.ts
   */
  copyright: {
    text: 'Mitchell County Historical Society. All Rights Reserved.',
    linkUrl: 'https://freeforcharity.org',
    linkText: 'Free For Charity',
  },

  /**
   * Google Tag Manager Configuration
   * Used in: tests/google-tag-manager.spec.ts
   */
  googleTagManager: {
    id: 'GTM-TQ5H8HPR',
  },

  /**
   * Logo Configuration
   * Used in: tests/logo.spec.ts
   */
  logo: {
    headerAlt: 'Mitchell County Historical Society',
    heroAlt:
      'Historic Mitchell County courthouse, railroad, mountain landscape, and portrait montage',
  },

  /**
   * Cookie Consent Configuration
   * Used in: tests/cookie-consent.spec.ts
   */
  cookieConsent: {
    bannerHeading: 'We Value Your Privacy',
    modalHeading: 'Cookie Preferences',
    buttons: {
      acceptAll: 'Accept All',
      declineAll: 'Decline All',
      customize: 'Customize',
      savePreferences: 'Save Preferences',
      cancel: 'Cancel',
    },
  },
}
