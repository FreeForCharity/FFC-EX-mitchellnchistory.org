'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiMenu } from 'react-icons/fi'
import { RxCross2 } from 'react-icons/rx'
import { motion, AnimatePresence } from 'framer-motion'
import { assetPath } from '@/lib/assetPath'

interface MenuItem {
  label: string
  path: string
}

const menuItems: MenuItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Museum', path: '/museum' },
  { label: 'Membership', path: '/membership' },
  { label: 'Festival', path: '/apple-butter-festival' },
  { label: 'Contact', path: '/contact' },
]

const Header: React.FC = () => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <header
      id="header"
      className={`w-full bg-white shadow-sm fixed top-0 left-0 right-0 z-50 flex items-center transition-all duration-300 ${
        isScrolled ? 'h-[55px]' : 'h-[80px]'
      }`}
    >
      <div className="w-full">
        <div className="mx-auto max-w-[1080px]">
          <div className="flex items-center px-2 transition-all duration-300">
            {/* Logo */}
            <div
              className={`transition-all duration-300 ${isScrolled ? 'w-[110px]' : 'w-[150px]'}`}
            >
              <Link href="/" onClick={handleLinkClick} className="block">
                <img
                  src={assetPath('/Images/mchs-logo.webp')}
                  alt="Mitchell County Historical Society"
                  className={`transition-all duration-300 ${isScrolled ? 'h-7' : 'h-11'}`}
                />
              </Link>
            </div>

            <div className="flex items-center justify-end sm:pl-[50px] md:pl-[70px] w-full">
              {/* Desktop Menu */}
              <nav className="hidden lg:block transition-all duration-300">
                <ul className="flex items-center space-x-[1px] font-navbar font-[600]">
                  {menuItems.map((item) => (
                    <li key={item.path} className="relative py-6">
                      <Link
                        href={item.path}
                        onClick={handleLinkClick}
                        className={`flex items-center px-3 py-2 text-[14px] transition-colors duration-200 ${
                          isActive(item.path)
                            ? 'text-[#2c5f2d]'
                            : 'text-gray-600 hover:text-gray-500'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-[#2c5f2d]"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? (
                  <RxCross2 className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`lg:hidden absolute left-0 w-full overflow-hidden z-40 ${
              isScrolled ? 'top-[53px]' : 'top-[77px]'
            }`}
          >
            <div
              className={`max-w-[700px] mx-auto px-6 py-4 bg-white border-t-[3px] border-[#2c5f2d] shadow-[0_2px_5px_rgba(0,0,0,0.1)] max-h-[80vh] overflow-auto`}
            >
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={handleLinkClick}
                      className={`block px-4 py-2 rounded-lg text-sm font-[600] ${
                        isActive(item.path)
                          ? 'bg-green-50 text-[#2c5f2d]'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
