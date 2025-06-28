'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  const SearchIcon = () => (
    <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.2243" cy="10.3776" r="8.98856" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.476 17.0961L20 20.611" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <>
      <nav className="relative z-50 bg-transparent font-[var(--font-myanmar)] py-20 text-[1.18rem] md:mb-40">
        <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Mobile Layout */}
            <div className="xl:hidden flex items-center justify-between w-full">
              {/* Hamburger Menu */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="text-white hover:text-gray-200 transition-colors duration-200 p-2"
                aria-label="Open menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Center Logo */}
              <Link href="/" className="flex items-center">
                <Image src="/logo.png" alt="Remes" width={150} height={120} className="h-14 w-auto" priority fetchPriority='high' style={{ width: 'auto', height: 'auto' }} />
              </Link>

              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:text-gray-200 transition-colors duration-200 p-2"
                aria-label="Search"
              >
                <SearchIcon />
              </button>
            </div>

            {/* Desktop Layout */}
            <div className="hidden xl:flex items-center w-full">
              {/* Left Navigation */}
              <div className="flex items-center space-x-8 flex-1 justify-start pr-16">
                {[
                  { href: '/', label: t('menu.home') },
                  { href: '/retirement-home', label: t('menu.retirementHome') },
                  { href: '/adapted-stay', label: t('menu.adaptedStay') },
                ].map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative text-xl px-1 transition-colors duration-200 font-[var(--font-myanmar)] ${isActive ? 'text-[#EEDAB8] font-bold' : 'text-white'} group`}
                    >
                      <span className={`inline-block pb-1 ${isActive ? 'border-b-2 border-[#EEDAB8]' : 'group-hover:border-b-2 group-hover:border-[#EEDAB8] border-b-2 border-transparent'}`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Center Logo */}
              <div className="flex-shrink-0 flex justify-center">
                <Link href="/" className="flex items-center">
                  <Image src="/logo.png" alt="Remes" width={219} height={172} style={{width: "100%", height: "auto"}}/>
                </Link>
              </div>

              {/* Right Navigation */}
              <div className="flex items-center space-x-6 flex-1 justify-end pl-16">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-white hover:text-gray-200 transition-colors duration-200 p-2 rounded-full hover:bg-white/10"
                  aria-label="Search"
                >
                  <SearchIcon />
                </button>
                {[
                  { href: '/about', label: t('menu.about') },
                  { href: '/magazine', label: t('menu.magazine') },
                ].map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative text-xl px-1 transition-colors duration-200 font-[var(--font-myanmar)] ${isActive ? 'text-[#EEDAB8] font-bold' : 'text-white'} group`}
                    >
                      <span className={`inline-block pb-1 ${isActive ? 'border-b-2 border-[#EEDAB8]' : 'group-hover:border-b-2 group-hover:border-[#EEDAB8] border-b-2 border-transparent'}`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Full Screen Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <div className="absolute inset-0 bg-[var(--dark-blue)]">
            {/* Close Button */}
            <div className="absolute top-12 left-8 z-20">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-gray-200 transition-colors duration-200 p-2"
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Menu Items */}
            <div className="mt-40 px-8 space-y-2">
              {[
                { href: '/', label: t('menu.home') },
                { href: '/retirement-home', label: t('menu.retirementHome') },
                { href: '/adapted-stay', label: t('menu.adaptedStay') },
                { href: '/about', label: t('menu.about') },
                { href: '/magazine', label: t('menu.magazine') },
              ].map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <div className="relative" key={item.href}>
                    <Link
                      href={item.href}
                      className={`group block text-xl py-2 pl-4 transition-colors duration-200 relative ${isActive ? 'text-[#EEDAB8] font-bold mb-2' : 'text-white font-normal'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className={`relative z-10 ${isActive ? 'inline-block border-b-2 border-[#EEDAB8] pb-1' : ''}`}>
                        {item.label}
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Social Icons */}
            <div className="absolute bottom-8 left-8">
              <p className="text-white text-sm mb-4 opacity-80">Social media</p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-[#EEDAB8] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-[#EEDAB8] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.566-1.35 2.14-2.21z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-[#EEDAB8] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.09.111.105.208.077.32-.085.353-.277 1.136-.314 1.295-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.90-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-[#EEDAB8] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-[#EEDAB8] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center" style={{ backgroundColor: 'rgba(0,10,26,0.92)' }}>
          {/* Close Button */}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-8 left-6 text-white hover:text-gray-200 transition-colors duration-200 p-2"
            aria-label="Close search"
          >
            <CloseIcon />
          </button>

          {/* Centered Search Input */}
          <form className="w-full flex justify-center items-center">
            <div className="relative w-4/5 max-w-md">
              <input
                type="text"
                placeholder="Chercher"
                className="w-full bg-transparent border border-white/60 rounded-none px-4 py-3 text-white placeholder-white/80 focus:outline-none focus:border-[#EEDAB8] transition-colors pr-12"
                autoFocus
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-[#EEDAB8] transition-colors">
                <svg width="24" height="24" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10.2243" cy="10.3776" r="8.98856" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16.476 17.0961L20 20.611" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
