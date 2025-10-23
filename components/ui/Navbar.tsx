'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  const primaryNavItems = [
    { href: '/', label: t('frontend.menu.home') },
    { href: '/nursing-home', label: t('frontend.menu.nursingHome') },
    { href: '/adapted-stay', label: t('frontend.menu.adaptedStay') },
  ] as const;

  const secondaryNavItems = [
    { href: '/about', label: t('frontend.menu.about') },
    { href: '/magazine', label: t('frontend.menu.magazine') },
  ] as const;

  const mobileNavItems = [...primaryNavItems, ...secondaryNavItems] as const;

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

  // Handle search functionality
  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header>
      <nav className="relative z-50 bg-transparent font-myanmar py-20 text-[1.18rem] md:mb-40">
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
                {primaryNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative text-xl px-1 transition-colors duration-200 font-myanmar ${isActive ? 'text-[#EEDAB8] font-bold' : 'text-white'} group`}
                    >
                      <span className={`inline-block pb-1 transition-all duration-200 ${isActive ? 'border-b-2 border-[#EEDAB8]' : 'group-hover:border-b-2 group-hover:border-[#EEDAB8] border-b-2 border-transparent'}`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Center Logo */}
              <div className="shrink-0 flex justify-center">
                <Link href="/" className="flex items-center">
                  <Image src="/logo.png" alt="Remes" width={219} height={172} style={{ width: "100%", height: "auto" }} />
                </Link>
              </div>

              {/* Right Navigation */}
              <div className="flex items-center space-x-6 flex-1 justify-end pl-16">
                {/* Desktop Search */}
                <div className="relative">
                  {!isSearchOpen ? (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="text-white hover:text-gray-200 transition-colors duration-500 p-2 rounded-full hover:bg-white/10"
                      aria-label="Search"
                    >
                      <SearchIcon />
                    </button>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch(searchQuery);
                      }}
                      className="flex items-center animate-in slide-in-from-right-5 duration-500 ease-out"
                    >
                      <div className="relative max-w-[250px] w-full bg-[#1e4a73] rounded border-white/20 transition-all duration-500 ease-in-out">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Recherche"
                          className="w-full bg-transparent px-4 py-2 text-white placeholder-light-blue2 focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-1"
                          aria-label="Search"
                        >
                          <SearchIcon />
                        </button>
                      </div>
                      <button
                        onClick={() => setIsSearchOpen(false)}
                        className="ml-2 text-white/70 hover:text-white transition-all duration-500 ease-in-out p-1 hover:scale-110"
                        aria-label="Close search"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </form>
                  )}
                </div>
                {secondaryNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative text-xl px-1 transition-colors duration-500 font-myanmar ${isActive ? 'text-[#EEDAB8] font-bold' : 'text-white'} group`}
                    >
                      <span className={`inline-block pb-1 transition-all duration-200 ${isActive ? 'border-b-2 border-[#EEDAB8]' : 'group-hover:border-b-2 group-hover:border-[#EEDAB8] border-b-2 border-transparent'}`}>
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
        <div className="fixed inset-0 z-60 xl:hidden">
          <div className="absolute inset-0 bg-dark-blue">
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
              {mobileNavItems.map((item) => {
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
                <a href="#" className="text-white hover:text-[#EEDAB8] transition-colors" aria-label="Facebook">
                  <svg
                    width={26}
                    height={27}
                    viewBox="0 0 26 27"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_207_2520)">
                      <path
                        d="M12.7759 0.724609C5.72001 0.724609 0 6.44462 0 13.5005C0 19.4918 4.12507 24.5194 9.68972 25.9002V17.4048H7.05534V13.5005H9.68972V11.8181C9.68972 7.46975 11.6577 5.45423 15.9269 5.45423C16.7364 5.45423 18.133 5.61316 18.7044 5.77158V9.3105C18.4029 9.27881 17.879 9.26297 17.2285 9.26297C15.1338 9.26297 14.3243 10.0566 14.3243 12.1197V13.5005H18.4974L17.7804 17.4048H14.3243V26.1828C20.6504 25.4188 25.5522 20.0325 25.5522 13.5005C25.5517 6.44462 19.8317 0.724609 12.7759 0.724609Z"
                        fill="currentColor"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_207_2520">
                        <rect
                          width="25.5517"
                          height="25.5517"
                          fill="currentColor"
                          transform="translate(0 0.724609)"
                        />
                      </clipPath>
                    </defs>
                  </svg>

                </a>
                <a href="#" className="text-white hover:text-[#EEDAB8] transition-colors" aria-label="X">
                  <svg
                    width={26}
                    height={27}
                    viewBox="0 0 26 27"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.8733 2.75195H23.4649L15.6183 11.7201L24.8492 23.9236H17.6215L11.9605 16.5222L5.48304 23.9236H1.88928L10.282 14.3312L1.42676 2.75195H8.83794L13.955 9.51712L19.8733 2.75195ZM18.6127 21.7739H20.6029L7.75655 4.78878H5.62092L18.6127 21.7739Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-[#EEDAB8] transition-colors" aria-label="Instagram">
                  <svg
                    width={27}
                    height={27}
                    viewBox="0 0 27 27"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_207_2522)">
                      <path
                        d="M13.5 3.02526C16.9135 3.02526 17.3178 3.04023 18.6602 3.10012C19.9079 3.15502 20.5816 3.36462 21.0308 3.53929C21.6246 3.76886 22.0538 4.04833 22.498 4.49249C22.9471 4.94164 23.2216 5.36584 23.4512 5.95972C23.6258 6.40887 23.8354 7.08759 23.8903 8.33024C23.9502 9.67769 23.9652 10.0819 23.9652 13.4905C23.9652 16.904 23.9502 17.3083 23.8903 18.6507C23.8354 19.8984 23.6258 20.5721 23.4512 21.0213C23.2216 21.6151 22.9421 22.0443 22.498 22.4885C22.0488 22.9376 21.6246 23.2121 21.0308 23.4417C20.5816 23.6164 19.9029 23.826 18.6602 23.8809C17.3128 23.9407 16.9085 23.9557 13.5 23.9557C10.0864 23.9557 9.68219 23.9407 8.33973 23.8809C7.09209 23.826 6.41836 23.6164 5.96921 23.4417C5.37533 23.2121 4.94614 22.9326 4.50198 22.4885C4.05283 22.0393 3.77835 21.6151 3.54878 21.0213C3.37411 20.5721 3.16451 19.8934 3.10961 18.6507C3.04973 17.3033 3.03475 16.899 3.03475 13.4905C3.03475 10.0769 3.04973 9.6727 3.10961 8.33024C3.16451 7.08259 3.37411 6.40887 3.54878 5.95972C3.77835 5.36584 4.05782 4.93665 4.50198 4.49249C4.95113 4.04334 5.37533 3.76886 5.96921 3.53929C6.41836 3.36462 7.09708 3.15502 8.33973 3.10012C9.68219 3.04023 10.0864 3.02526 13.5 3.02526ZM13.5 0.724609C10.0315 0.724609 9.59735 0.739581 8.23493 0.799468C6.87749 0.859355 5.94426 1.07894 5.13578 1.39335C4.29238 1.72272 3.57873 2.1569 2.87007 2.87055C2.15641 3.57922 1.72224 4.29287 1.39286 5.13128C1.07845 5.94475 0.858866 6.87299 0.79898 8.23043C0.739093 9.59784 0.724121 10.032 0.724121 13.5005C0.724121 16.9689 0.739093 17.4031 0.79898 18.7655C0.858866 20.123 1.07845 21.0562 1.39286 21.8647C1.72224 22.7081 2.15641 23.4217 2.87007 24.1304C3.57873 24.839 4.29238 25.2782 5.13079 25.6026C5.94426 25.917 6.8725 26.1366 8.22994 26.1965C9.59236 26.2564 10.0265 26.2713 13.495 26.2713C16.9634 26.2713 17.3976 26.2564 18.76 26.1965C20.1175 26.1366 21.0507 25.917 21.8592 25.6026C22.6976 25.2782 23.4113 24.839 24.1199 24.1304C24.8286 23.4217 25.2677 22.7081 25.5921 21.8697C25.9065 21.0562 26.1261 20.1279 26.186 18.7705C26.2459 17.4081 26.2609 16.9739 26.2609 13.5055C26.2609 10.037 26.2459 9.60283 26.186 8.24041C26.1261 6.88297 25.9065 5.94974 25.5921 5.14126C25.2777 4.29287 24.8435 3.57922 24.1299 2.87055C23.4212 2.16189 22.7076 1.72272 21.8692 1.39834C21.0557 1.08393 20.1275 0.864345 18.77 0.804458C17.4026 0.739581 16.9684 0.724609 13.5 0.724609Z"
                        fill="currentColor"
                      />
                      <path
                        d="M13.5001 6.9375C9.87695 6.9375 6.9375 9.87695 6.9375 13.5001C6.9375 17.1233 9.87695 20.0627 13.5001 20.0627C17.1233 20.0627 20.0627 17.1233 20.0627 13.5001C20.0627 9.87695 17.1233 6.9375 13.5001 6.9375ZM13.5001 17.7571C11.1495 17.7571 9.24314 15.8507 9.24314 13.5001C9.24314 11.1495 11.1495 9.24314 13.5001 9.24314C15.8507 9.24314 17.7571 11.1495 17.7571 13.5001C17.7571 15.8507 15.8507 17.7571 13.5001 17.7571Z"
                        fill="currentColor"
                      />
                      <path
                        d="M21.854 6.67664C21.854 7.52504 21.1653 8.20874 20.3219 8.20874C19.4735 8.20874 18.7898 7.52005 18.7898 6.67664C18.7898 5.82824 19.4785 5.14453 20.3219 5.14453C21.1653 5.14453 21.854 5.83323 21.854 6.67664Z"
                        fill="currentColor"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_207_2522">
                        <rect
                          width="25.5517"
                          height="25.5517"
                          fill="currentColor"
                          transform="translate(0.724121 0.724609)"
                        />
                      </clipPath>
                    </defs>
                  </svg>

                </a>
                <a href="#" className="text-white hover:text-[#EEDAB8] transition-colors" aria-label="Youtube">
                  <svg width="26" height="27" viewBox="0 0 26 27" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_207_2523)">
                      <path d="M25.3834 8.38939C25.3834 8.38939 25.1339 6.62772 24.3653 5.85418C23.3921 4.83611 22.3042 4.83112 21.8051 4.77123C18.2319 4.51172 12.867 4.51172 12.867 4.51172H12.857C12.857 4.51172 7.49219 4.51172 3.91894 4.77123C3.41988 4.83112 2.33194 4.83611 1.35878 5.85418C0.590229 6.62772 0.345691 8.38939 0.345691 8.38939C0.345691 8.38939 0.0861816 10.4605 0.0861816 12.5266V14.4629C0.0861816 16.529 0.340701 18.6001 0.340701 18.6001C0.340701 18.6001 0.590229 20.3618 1.35379 21.1353C2.32695 22.1534 3.60453 22.1184 4.17346 22.2282C6.21959 22.4229 12.862 22.4828 12.862 22.4828C12.862 22.4828 18.2319 22.4728 21.8051 22.2183C22.3042 22.1584 23.3921 22.1534 24.3653 21.1353C25.1339 20.3618 25.3834 18.6001 25.3834 18.6001C25.3834 18.6001 25.6379 16.534 25.6379 14.4629V12.5266C25.6379 10.4605 25.3834 8.38939 25.3834 8.38939ZM10.222 16.8135V9.63204L17.124 13.2352L10.222 16.8135Z" />
                    </g>
                    <defs>
                      <clipPath id="clip0_207_2523">
                        <rect width="25.5517" height="25.5517" fill="currentColor" transform="translate(0.0861816 0.724609)" />
                      </clipPath>
                    </defs>
                  </svg>

                </a>
                <a href="#" className="text-white hover:text-[#EEDAB8] transition-colors" aria-label="Whatsapp">
                  <svg
                    width={26}
                    height={27}
                    viewBox="0 0 26 27"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.448242 26.2763L2.24431 19.7149C1.13601 17.7942 0.553643 15.617 0.554708 13.3844C0.557902 6.40454 6.23784 0.724609 13.2166 0.724609C16.6033 0.725674 19.7824 2.04478 22.1736 4.43813C24.5637 6.83147 25.8797 10.0127 25.8786 13.3961C25.8754 20.3771 20.1955 26.057 13.2166 26.057C11.098 26.0559 9.0102 25.5247 7.16089 24.5154L0.448242 26.2763ZM7.47177 22.2232C9.25613 23.2825 10.9596 23.917 13.2124 23.9181C19.0126 23.9181 23.7376 19.1974 23.7408 13.394C23.7429 7.57886 19.0403 2.86457 13.2209 2.86244C7.41641 2.86244 2.69466 7.58312 2.69253 13.3855C2.69147 15.7543 3.38562 17.5281 4.55142 19.3837L3.48783 23.2676L7.47177 22.2232ZM19.595 16.4059C19.5162 16.2739 19.3054 16.1951 18.9881 16.0365C18.6719 15.8778 17.1165 15.1124 16.8258 15.007C16.5362 14.9016 16.3254 14.8483 16.1136 15.1656C15.9028 15.4818 15.2959 16.1951 15.1117 16.4059C14.9275 16.6167 14.7423 16.6433 14.4261 16.4847C14.1099 16.3261 13.09 15.9928 11.8816 14.9143C10.9415 14.0754 10.3059 13.0395 10.1217 12.7222C9.93751 12.406 10.1025 12.2346 10.2601 12.077C10.4028 11.9354 10.5763 11.7076 10.7349 11.5223C10.8957 11.3392 10.9479 11.2072 11.0543 10.9953C11.1597 10.7845 11.1076 10.5993 11.0277 10.4406C10.9479 10.2831 10.3155 8.72549 10.0525 8.09202C9.79485 7.47559 9.53401 7.55863 9.34024 7.54905L8.73339 7.5384C8.52258 7.5384 8.17977 7.61718 7.89018 7.93445C7.60059 8.25172 6.78294 9.01614 6.78294 10.5737C6.78294 12.1313 7.9168 13.6357 8.07436 13.8465C8.233 14.0573 10.3048 17.2534 13.4786 18.6236C14.2334 18.9494 14.8232 19.1442 15.2821 19.2901C16.0401 19.5307 16.73 19.4966 17.2751 19.4157C17.883 19.3252 19.1468 18.6502 19.4108 17.9113C19.6748 17.1714 19.6748 16.5379 19.595 16.4059Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Search Modal - Mobile Only */}
      {isSearchOpen && (
        <div className="xl:hidden">
          <div className="fixed inset-0 z-70 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,10,26,0.92)' }}>
            {/* Close Button */}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 left-6 text-white hover:text-gray-200 transition-colors duration-200 p-2"
              aria-label="Close search"
            >
              <CloseIcon />
            </button>

            {/* Centered Search Input */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get('search') as string;
                handleSearch(query);
              }}
              className="w-full flex justify-center items-center"
            >
              <div className="relative w-4/5 max-w-md">
                <input
                  type="text"
                  name="search"
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
        </div>
      )}
    </header>
  );
}
