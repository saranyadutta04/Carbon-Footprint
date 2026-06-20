import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Eco Carbon',
  description: 'Track and reduce your personal carbon footprint securely.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The "dark" class strictly enforces the dark theme across the entire application
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-900 text-slate-50 min-h-screen flex flex-col antialiased selection:bg-blue-500/30`}>
        
        {/* Semantic Header & Global Navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link 
              href="/" 
              className="text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
              aria-label="Eco Carbon Home"
            >
              Eco<span className="text-blue-500">Carbon</span>
            </Link>
            
            <nav aria-label="Main Navigation">
              <ul className="flex items-center space-x-6 text-sm font-medium">
                <li>
                  <Link 
                    href="/dashboard" 
                    className="text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/log" 
                    className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-sm"
                  >
                    + Log Activity
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Semantic Main Element - Entry point for screen readers to skip navigation */}
        <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        
      </body>
    </html>
  );
}
