// src/app/layout.tsx

import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata = {
  title: 'Roster Management System',
  description: 'AI-powered hospital roster management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}