'use client';

import { useState, useEffect } from 'react';
import { searchSpotify } from '@/lib/spotify';

export default function TrackWidget({ selectedTracks = [], onTrackSelect }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Debounce search
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
        <div className="bg-white dark:bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="text-xl">🎵</span> Favorite Tracks
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
                    placeholder="Search for a song..."
                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                />
                <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>

                {isLoading && (
                    <div className="absolute right-3 top-3.5 animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                )}

                {/* Search Results Dropdown */}
                {results.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden max-h-60 overflow-y-auto ring-1 ring-black/5">
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

            {/* Selected Tracks Chips */}
            <div className="flex flex-wrap gap-2">
                {selectedTracks.map((track) => (
                    <div
                        key={track.id}
                        className="flex items-center gap-2 bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full text-sm font-medium border border-green-100 dark:border-green-500/30 animate-in fade-in zoom-in duration-200"
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
