// src/components/Navigation.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [darkMode, setDarkMode] = useState(false);
  
  const navigation = [
    { name: 'GitHub Repos', href: '/repos' },
    { name: 'Social Feed', href: '/social' },
    { name: 'Blog', href: '/blog' },
    { name: 'Playground', href: '/playground' },
    { name: 'NOSTR', href: '/nostr' },
  ];

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              ogerly.dev
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setDarkMode(!darkMode);
              document.documentElement.classList.toggle('dark');
            }}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}