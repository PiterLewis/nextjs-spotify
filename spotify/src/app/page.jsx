'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const router = useRouter();

  /*useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);
  */
  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (

    <main className="min-h-screen flex flex-col relative overflow-hidden">


      <nav className="w-full p-6 flex justify-between items-center absolute top-0 left-0 z-10">
        <div className="font-bold text-xl tracking-tighter flex items-center gap-2">

          <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-full opacity-20"></div>
          </div>
          <span>Taste Mixer</span>
        </div>

        <ThemeToggle />
      </nav>


      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center z-0 mt-10 sm:mt-0">


        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-spotify-green/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="animate-fade-in relative z-10 max-w-4xl mx-auto">
          <h1 className="mb-6 leading-tight">
            <span className="text-header block !text-black dark:!text-white">
              Discover your
            </span>
            <span className="text-header block bg-linear-to-r from-spotify-green via-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              True Musical DNA
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto font-light">
            Generate unique playlists based on your favorite artists, decades, and moods.
            No boring algorithms, you are in control.
          </p>

          <button
            onClick={handleLogin}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-spotify-green hover:bg-green-500 text-black font-bold text-lg rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(29,185,84,0.5)] cursor-pointer"
          >

            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="transition-transform group-hover:rotate-12">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Login with Spotify
          </button>
        </div>
      </div>


      <footer className="p-6 text-center text-sm text-gray-500 dark:text-gray-400 z-10">
        <p>© 2025 Spotify Taste Mixer • Academic Project</p>
      </footer>

    </main>
  );
}