'use client';

import { useState, useEffect, useRef } from 'react';
import { searchSpotify } from '@/lib/spotify';

export default function ArtistWidget({ selectedArtists = [], onArtistSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const debounceTimeout = useRef(null);

    useEffect(() => {
        if (searchTerm.length < 2) {
            setSearchResults([]);
            return;
        }

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        setIsLoading(true);
        debounceTimeout.current = setTimeout(async () => {
            try {
                const data = await searchSpotify(searchTerm, 'artist', 5);
                if (data && data.artists) {
                    setSearchResults(data.artists.items);
                }
            } catch (error) {
                console.error('Error searching artists:', error);
            } finally {
                setIsLoading(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(debounceTimeout.current);
    }, [searchTerm]);

    const toggleArtist = (artist) => {
        const isSelected = selectedArtists.some(a => a.id === artist.id);
        if (isSelected) {
            onArtistSelect(selectedArtists.filter(a => a.id !== artist.id));
        } else {
            if (selectedArtists.length >= 5) return;
            onArtistSelect([...selectedArtists, artist]);
        }
    };

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                className="group bg-white dark:bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-gray-200 dark:border-white/10 hover:border-green-500/50 dark:hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 cursor-pointer relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-8xl">🎤</span>
                </div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        Artists
                    </h2>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors ${selectedArtists.length > 0 ? 'bg-green-500 text-black' : 'group-hover:bg-green-500 group-hover:text-black'}`}>
                        {selectedArtists.length}/5
                    </span>
                </div>

                {selectedArtists.length > 0 ? (
                    <div className="flex flex-wrap gap-2 relative z-10">
                        {selectedArtists.map(artist => (
                            <div key={artist.id} className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300 rounded-full text-sm font-medium border border-green-200 dark:border-green-500/30">
                                {artist.images?.[2]?.url && (
                                    <img src={artist.images[2].url} alt={artist.name} className="w-4 h-4 rounded-full" />
                                )}
                                <span>{artist.name}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-40 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-400 gap-3 group-hover:border-green-500/30 transition-colors bg-gray-50/50 dark:bg-black/20">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                            <span className="text-2xl">+</span>
                        </div>
                        <span className="text-sm font-medium">Add Artists</span>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                            <h3 className="text-2xl font-bold">Select Artists</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 border-b border-gray-200 dark:border-white/10">
                            <input
                                type="text"
                                placeholder="Search artists..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border-none focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                autoFocus
                            />
                        </div>

                        <div className="p-6 overflow-y-auto min-h-[300px]">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {searchResults.map(artist => {
                                        const isSelected = selectedArtists.some(a => a.id === artist.id);
                                        return (
                                            <button
                                                key={artist.id}
                                                onClick={() => toggleArtist(artist)}
                                                disabled={!isSelected && selectedArtists.length >= 5}
                                                className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all text-left flex items-center gap-4 ${isSelected
                                                    ? 'bg-green-500 text-black shadow-lg shadow-green-500/25'
                                                    : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
                                                    } ${!isSelected && selectedArtists.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {artist.images?.[2]?.url ? (
                                                    <img src={artist.images[2].url} alt={artist.name} className="w-10 h-10 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">🎤</div>
                                                )}
                                                <span className="flex-1 font-bold text-lg">{artist.name}</span>
                                                {isSelected && <span>✓</span>}
                                            </button>
                                        );
                                    })}
                                    {searchTerm.length >= 2 && searchResults.length === 0 && !isLoading && (
                                        <div className="text-center py-8 text-gray-500">
                                            No artists found matching "{searchTerm}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5 rounded-b-3xl">
                            <span className="text-sm text-gray-500">
                                {selectedArtists.length}/5 selected
                            </span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:opacity-90 transition-opacity"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
