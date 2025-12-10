'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
    return (
        <header className="w-full bg-white/70 dark:bg-black/50 backdrop-blur-md border-b border-gray-200 dark:border-white/10 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <span className="font-sans-serif font-bold text-xl tracking-tight text-black dark:text-white">
                                Spotify Taste Mixer
                            </span>
                        </Link>
                    </div>


                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                            <Link href="/dashboard" className="hover:text-black dark:hover:text-white transition-colors">
                                Dashboard
                            </Link>
                            <Link href="/history" className="hover:text-black dark:hover:text-white transition-colors">
                                History
                            </Link>
                        </div>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-white/10">
                            <ThemeToggle />
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                                U
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
