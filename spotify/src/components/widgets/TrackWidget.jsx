'use client';

import { useState, useEffect } from 'react';
import { searchSpotify } from '@/lib/spotify';

export default function TrackWidget({ selectedTracks = [], onTrackSelect }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Debounce 
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (query.length > 2) {
                setIsLoading(true);
                try {
                    const data = await searchSpotify(query, 'track', 5);
                    if (data && data.tracks) {
                        setResults(data.tracks.items);
                    }
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelect = (track) => {
        if (selectedTracks.length >= 5 && !selectedTracks.find(t => t.id === track.id)) return;

        const newSelection = selectedTracks.find(t => t.id === track.id)
            ? selectedTracks.filter(t => t.id !== track.id)
            : [...selectedTracks, track];

        onTrackSelect(newSelection);
        setQuery('');
        setResults([]);
    };

    return (
        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 shadow-xl hover:shadow-[0_0_30px_rgba(29,185,84,0.15)] transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <svg width="32" height="34" viewBox="0 0 321 343" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                        <path d="M0.19464 317.755L117.835 171.628L167.676 221.167L0.19464 317.755Z" fill="white" stroke="black" strokeWidth="0.5" />
                        <path d="M187.695 110.007L125.957 169.858L166.73 215.845L195.086 180.871L243.26 250.315L320.407 26.6666L218.704 150.205L187.695 110.007Z" fill="white" stroke="black" strokeWidth="0.5" />
                        <path d="M32.6945 232.507C37.4055 196.933 95.6939 193.007 95.6939 193.007V49.5068H282.694V193.007C282.694 193.007 310.671 211.804 309.694 229.507C308.959 242.816 307.769 246.898 291.694 258.507C267.778 275.778 230.195 275.007 219.195 275.007C208.195 275.007 196.695 273.507 183.695 262.507C170.694 251.507 171.695 223.007 183.695 212.007C195.695 201.007 225.694 193.007 225.694 193.007V83.5068H151.194V193.007C151.194 193.007 171.026 214.419 170.694 232.507C170.308 253.535 158.694 268.007 140.694 272.507C122.694 277.007 112.194 277.007 87.1939 275.007C62.1938 273.007 27.9166 268.586 32.6945 232.507Z" fill="url(#paint0_linear_190_5)" stroke="black" strokeWidth="0.5" />
                        <defs>
                            <linearGradient id="paint0_linear_190_5" x1="309.719" y1="162.945" x2="32.2444" y2="162.945" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#06B6D4" />
                                <stop offset="0.5" stopColor="#34D399" />
                                <stop offset="1" stopColor="#1DB954" />
                            </linearGradient>
                        </defs>
                    </svg>
                    Añade tus favoritas
                </h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                    {selectedTracks.length}/5
                </span>
            </div>

            <div className="relative mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="busca canciones..."
                    className="w-full bg-white/50 dark:bg-white/5 border-none rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-[#1DB954] transition-all placeholder:text-gray-400"
                />


                {isLoading && (
                    <div className="absolute right-3 top-3.5 animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                )}


                {results.length > 0 && (
                    <div className="absolute z-[100] w-full mt-2 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden max-h-60 overflow-y-auto ring-1 ring-black/5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {results.map((track) => (
                            <button
                                key={track.id}
                                onClick={() => handleSelect(track)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-green-50 dark:hover:bg-white/10 transition-colors text-left group border-b border-gray-50 dark:border-white/5 last:border-0"
                            >
                                <img
                                    src={track.album.images[2]?.url || track.album.images[0]?.url}
                                    alt={track.name}
                                    className="w-10 h-10 rounded-md object-cover shadow-sm group-hover:scale-105 transition-transform"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate text-gray-900 dark:text-white">{track.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{track.artists[0].name}</p>
                                </div>
                                {selectedTracks.find(t => t.id === track.id) && (
                                    <span className="text-green-500">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>


            <div className="flex flex-wrap gap-2">
                {selectedTracks.map((track) => (
                    <div
                        key={track.id}
                        className="flex items-center gap-2 bg-[#1DB954]/10 dark:bg-[#1DB954]/20 text-green-700 dark:text-[#1DB954] px-3 py-1.5 rounded-full text-sm font-bold border border-[#1DB954]/20 dark:border-[#1DB954]/30 animate-in fade-in zoom-in duration-200 shadow-[0_0_10px_rgba(29,185,84,0.1)]"
                    >
                        <span className="max-w-[100px] truncate">{track.name}</span>
                        <button
                            onClick={() => handleSelect(track)}
                            className="hover:text-green-900 dark:hover:text-green-100 transition-colors"
                        >
                            ×
                        </button>
                    </div>
                ))}
                {selectedTracks.length === 0 && (
                    <p className="text-sm text-gray-400 italic w-full text-center py-2">
                        Add songs to guide the mix...
                    </p>
                )}
            </div>
        </div>
    );
}
