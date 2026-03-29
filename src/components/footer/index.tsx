'use client'

import React from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { FaFacebookF } from 'react-icons/fa'

const Footer: React.FC = () => {
  const currentYear = React.useMemo(() => new Date().getFullYear(), [])

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-12 px-4 md:px-6 lg:px-8">
        {/* Column 1: About MCHS */}
        <div className="space-y-6 px-4 sm:px-0">
          <h3 className="text-[28px] text-white">About MCHS</h3>
          <p className="text-gray-300 leading-relaxed">
            The Mitchell County Historical Society is dedicated to preserving, protecting, and
            sharing the rich history and cultural heritage of Mitchell County, North Carolina. We
            are located in the Historic Mitchell County Courthouse in Bakersville.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-6 px-4 sm:px-0">
          <h3 className="text-[28px] text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              { name: 'Home', href: '/' },
              { name: 'About Us', href: '/about' },
              { name: 'McBee Museum', href: '/museum' },
              { name: 'Membership', href: '/membership' },
              { name: 'Apple Butter Festival', href: '/apple-butter-festival' },
              { name: 'Contact Us', href: '/contact' },
              { name: 'Online Store', href: 'https://store.mitchellnchistory.org/' },
            ].map((link) => (
              <li key={link.name}>
                {link.href.startsWith('http') ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#8b6914] transition-all text-[16px] font-[500]"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="hover:text-[#8b6914] transition-all text-[16px] font-[500]"
                  >
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <h4 className="text-[28px] text-white">Policies</h4>
            <ul className="space-y-1 text-sm">
              {[
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Cookie Policy', href: '/cookie-policy' },
                { name: 'Terms of Service', href: '/terms-of-service' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-[#8b6914] transition-all text-[16px] font-[500]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 3: Contact Us */}
        <div className="space-y-6 px-4 sm:px-0">
          <h3 className="text-[28px] text-white">Contact Us</h3>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="w-10 h-10 text-[#8b6914] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-[500] text-[22px]">E-mail</p>
                <a
                  href="mailto:mitchellnchistory@gmail.com"
                  className="font-[500] text-[15px] hover:text-[#8b6914] transition-colors break-all"
                >
                  mitchellnchistory@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-10 h-10 text-[#8b6914] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-[500] text-[22px]">Call Us</p>
                <a
                  href="tel:8286884371"
                  className="font-[500] text-[16px] hover:text-[#8b6914] transition-colors"
                >
                  (828) 688-4371
                </a>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=11+N+Mitchell+Ave+Bakersville+NC+28705"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open address in Google Maps"
              className="flex items-start gap-3 hover:opacity-80 transition-opacity"
            >
              <MapPin className="w-10 h-10 text-[#8b6914] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-[500] text-[22px]">Address</p>
                <p className="font-[500] text-[16px]">
                  11 N Mitchell Ave, Room 101
                  <br />
                  Historic Mitchell County Courthouse
                  <br />
                  Bakersville, NC 28705
                </p>
              </div>
            </a>

            <div className="flex items-start gap-3">
              <Clock className="w-10 h-10 text-[#8b6914] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-[500] text-[22px]">Office Hours</p>
                <p className="font-[500] text-[16px]">Tuesday – Friday, 10:00 AM – 4:00 PM</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <a
                href="https://www.facebook.com/mitchellnchistory.org"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="bg-[#8b6914] p-2 rounded-full hover:opacity-80 transition-opacity"
              >
                <FaFacebookF className="w-6 h-6 text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 py-6 px-4 border-t border-gray-800 text-center text-[18px] font-[500] w-full">
        <p>
          © {currentYear} Mitchell County Historical Society. All Rights Reserved. | A project of{' '}
          <a
            href="https://freeforcharity.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-[#8b6914] hover:text-[#8b6914] transition-colors"
          >
            Free For Charity
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
