import { redirect } from 'next/navigation';

export default function RootNotFoundPage() {
  // Redirect to the default locale
  redirect('/en/not-found');
} 