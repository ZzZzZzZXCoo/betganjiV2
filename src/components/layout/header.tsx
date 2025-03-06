"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Predictions', href: '/predictions' },
  ];
  
  return (
    <header className="bg-primary text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">BetGanji</span>
            </Link>
            <nav className="ml-6 flex space-x-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-primary-dark text-white'
                        : 'text-white/80 hover:bg-primary-dark hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center">
                {session.user?.image && (
                  <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                    <img src={session.user.image} alt={session.user.name || 'User'} />
                  </div>
                )}
                <span className="text-sm mr-4 hidden sm:inline-block">
                  {session.user?.name || session.user?.email}
                </span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-primary-dark hover:text-white"
                  onClick={() => signOut()}
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <Button 
                size="sm" 
                variant="outline" 
                className="border-white/20 text-white hover:bg-primary-dark hover:text-white"
                onClick={() => signIn('google')}
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
