'use client';

import { useState, useEffect } from 'react';
import AdminGuard from '@/components/ui/admin/AdminGuard';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale(); // Add locale to force re-render when language changes
  const tLayout = useTranslations('admin.layout');
  const tNav = useTranslations('admin.navigation');
  const tPageHeaders = useTranslations('admin.pageHeaders');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigation = [
    {
      name: tNav('dashboard'),
      href: '/admin',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      ),
    },
    {
      name: tNav('posts'),
      href: '/admin/posts',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: tNav('categories'),
      href: '/admin/categories',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      name: tNav('homeSlider'),
      href: '/admin/home-slider',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: tNav('medicalEquipment'),
      href: '/admin/medical-equipment',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      name: tNav('testimonials'),
      href: '/admin/testimonials',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      name: tNav('settings'),
      href: '/admin/settings',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const getCurrentPageTitle = () => {
    if (pathname === '/admin') return tPageHeaders('dashboard');
    if (pathname === '/admin/posts') return tPageHeaders('posts');
    if (pathname === '/admin/posts/add') return tPageHeaders('addNewPost');
    if (pathname.startsWith('/admin/posts/edit')) return tPageHeaders('editPost');
    if (pathname === '/admin/categories') return tPageHeaders('categories');
    if (pathname === '/admin/home-slider') return tPageHeaders('homeSlider');
    if (pathname === '/admin/home-slider/add') return tPageHeaders('addNewSlide');
    if (pathname.startsWith('/admin/home-slider/edit')) return tPageHeaders('editSlide');
    if (pathname === '/admin/medical-equipment') return tPageHeaders('medicalEquipment');
    if (pathname === '/admin/medical-equipment/add') return tPageHeaders('addNewEquipment');
    if (pathname.startsWith('/admin/medical-equipment/edit')) return tPageHeaders('editEquipment');
    if (pathname === '/admin/testimonials') return tPageHeaders('testimonials');
    if (pathname === '/admin/testimonials/add') return tPageHeaders('addNewTestimonial');
    if (pathname.startsWith('/admin/testimonials/edit')) return tPageHeaders('editTestimonial');
    if (pathname === '/admin/settings') return tPageHeaders('settings');
    return tPageHeaders('dashboard');
  };

  return (
    <AdminGuard key={locale}>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        <div className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ease-in-out ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
          {/* Backdrop with reduced opacity */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-40 transition-opacity duration-300 ease-in-out"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar panel */}
          <div className={`fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
            <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <h1 className="text-lg font-bold text-gray-900">{tLayout('brand')}</h1>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">{tLayout('closeSidebar')}</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 px-4 py-4">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={`${item.href}-${locale}`}
                      href={item.href}
                      className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                        ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}>
                        {item.icon}
                      </div>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col bg-white border-r border-gray-200 shadow-sm">
            <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <h1 className="text-lg font-bold text-gray-900">{tLayout('brand')}</h1>
              </div>
            </div>
            <nav className="flex-1 px-4 py-4">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={`${item.href}-${locale}`}
                      href={item.href}
                      className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                        ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <div className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}>
                        {item.icon}
                      </div>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top navigation */}
          <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between items-center">
                {/* Mobile menu button and title */}
                <div className="flex items-center lg:hidden">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <span className="sr-only">{tLayout('openMainMenu')}</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <h1 className="ml-3 text-lg font-semibold text-gray-900">{tLayout('brand')}</h1>
                </div>

                {/* Desktop page title - show current page */}
                <div className="hidden lg:block">
                  <h2 className="text-lg font-medium text-gray-900">
                    {getCurrentPageTitle()}
                  </h2>
                </div>

                {/* User info and actions */}
                <div className="flex items-center space-x-4">
                  {/* Language Switcher */}
                  <LanguageSwitcher />

                  {/* User welcome message */}
                  <div className="hidden sm:flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-700">
                          {(user?.name || user?.email)?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">{user?.name || user?.email?.split('@')[0]}</span>
                      </span>
                    </div>
                  </div>

                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm"
                  >
                    <svg className="h-4 w-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">{tLayout('logout')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}