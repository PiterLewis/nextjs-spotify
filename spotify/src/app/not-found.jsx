'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-spotify-black dark:bg-spotify-white text-white flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-green-500 selection:text-black">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-[#1DB954]/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

            <div className="relative z-10 max-w-2xl w-full bg-white/5 dark:bg-spotify-black backdrop-blur-2xl rounded-[3rem] p-8 md:p-16 border border-white/10 shadow-2xl text-center transform hover:scale-[1.01] transition-transform duration-500">

                <div className="mb-8 flex justify-center relative">
                    <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
                    <div className="w-32 h-32 bg-spotify-black rounded-full flex items-center justify-center border border-white/10 relative z-10 shadow-xl group">
                        <img src="/mimagocutre.svg" alt="Wizard" className="w-20 h-20 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                    </div>
                </div>

                <h1 className="text-8xl md:text-9xl font-black mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#1DB954] via-emerald-400 to-cyan-500">
                    404
                </h1>

                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white tracking-tight">
                    Track Not Found
                </h2>

                <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                    Looks like the music stopped here. The page you are looking for has been skipped or removed from the playlist.
                </p>

                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-spotify-green hover:bg-[#1ed760] text-black font-bold text-lg rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(29,185,84,0.3)] hover:shadow-[0_0_30px_rgba(29,185,84,0.5)]"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Return to Stage</span>
                </Link>
            </div>


            <div className="absolute top-10 left-10 w-24 h-24 border border-spotify-green/5 rounded-full animate-spin-slow opacity-20"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 border border-spotify-green/5 rounded-full animate-spin-reverse-slow opacity-20"></div>
        </div>
    );
}
