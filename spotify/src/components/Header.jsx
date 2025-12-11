'use client';

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { useState } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                            <Link href="/game" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors" title="Enter Kingdom">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </Link>
                        </div>

                        <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-white/10">
                            <ThemeToggle />
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                                U
                            </div>


                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
                            >
                                {isMenuOpen ? (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black/95 backdrop-blur-xl">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <Link
                            href="/dashboard"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/history"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                            History
                        </Link>
                        <Link
                            href="/game"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-amber-600 dark:text-amber-400 hover:bg-gray-100 dark:hover:bg-white/10 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Kingdom
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
