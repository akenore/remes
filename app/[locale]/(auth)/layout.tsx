import type { Metadata } from "next";
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export const metadata: Metadata = {
  title: "Authentication - Remes Admin",
  description: "Sign in to access Remes admin portal",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with branding and language switcher */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-gray-700 font-semibold">Remes</span>
        </div>
        
        {/* Language Switcher */}
        <LanguageSwitcher />
      </div>
      
      {children}
    </div>
  );
} 