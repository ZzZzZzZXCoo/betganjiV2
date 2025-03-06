import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Header } from '@/components/layout/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BetGanji - Soccer Match Predictions',
  description: 'AI-powered soccer match prediction app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              {children}
            </main>
            <footer className="bg-white border-t border-slate-200 py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-slate-500">
                  &copy; {new Date().getFullYear()} BetGanji. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
