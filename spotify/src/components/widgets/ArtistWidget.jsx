'use client';

import { useState, useEffect, useRef } from 'react';
import { searchSpotify } from '@/lib/spotify';

function ArtistSearchContent({
    searchTerm,
    setSearchTerm,
    isGameMode,
    isLoading,
    searchResults,
    selectedArtists,
    toggleArtist
}) {
    return (
        <>
            <div className="p-6 border-b border-gray-200 dark:border-white/10">
                <input
                    type="text"
                    placeholder="Search artists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border-none focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    autoFocus={isGameMode}
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
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                            </svg>
                                        </div>
                                    )}
                                    <span className="flex-1 font-bold text-lg">{artist.name}</span>
                                    {isSelected && (
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
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
        </>
    );
}

export default function ArtistWidget({ selectedArtists = [], onArtistSelect, isGameMode = false }) {
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

    if (isGameMode) {
        return (
            <ArtistSearchContent
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isGameMode={isGameMode}
                isLoading={isLoading}
                searchResults={searchResults}
                selectedArtists={selectedArtists}
                toggleArtist={toggleArtist}
            />
        );
    }

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                className="group bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 hover:border-[#1DB954]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(29,185,84,0.15)] hover:-translate-y-1 cursor-pointer relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg width="126" height="120" viewBox="0 0 126 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
                        <path d="M81.3171 69.9409L10.8171 118.941C10.8171 118.941 3.86739 118.893 1.81714 116.94C-0.233114 114.987 0.317139 108.941 0.317139 108.941L54.8171 40.4409L59.3171 17.4409V12.4409L64.8171 7.94092C64.8171 7.94092 98.2648 -12.0581 117.817 12.4409C137.369 36.9399 114.317 61.9409 114.317 61.9409L109.317 66.9409L102.817 64.9409L81.3171 69.9409Z" fill="#C5FFCA" />
                        <path d="M81.3171 69.9409L10.8171 118.941C10.8171 118.941 3.86739 118.893 1.81714 116.94C-0.233114 114.987 0.317139 108.941 0.317139 108.941L54.8171 40.4409M81.3171 69.9409L102.817 64.9409L109.317 66.9409L114.317 61.9409C114.317 61.9409 137.369 36.9399 117.817 12.4409C98.2648 -12.0581 64.8171 7.94092 64.8171 7.94092L59.3171 12.4409V17.4409L54.8171 40.4409M81.3171 69.9409L54.8171 40.4409" stroke="black" strokeWidth="0.5" />
                        <path d="M109.25 66.7495L59.25 12.7495L64.25 8.24951L114.25 61.7495L109.25 66.7495Z" fill="#00E861" stroke="black" strokeWidth="0.5" />
                        <path d="M11.25 118.75L0.75 108.25L3.25 105.25L14.25 116.75L11.25 118.75Z" fill="#00E861" stroke="black" strokeWidth="0.2" />
                    </svg>
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
                    <div className="flex flex-col gap-3 relative z-10">
                        <div className="flex -space-x-4 overflow-hidden py-2 pl-1">
                            {selectedArtists.map((artist, i) => (
                                <div key={artist.id} className="relative transition-transform hover:-translate-y-2 hover:z-10 duration-300">
                                    {artist.images?.[2]?.url ? (
                                        <img
                                            src={artist.images[2].url}
                                            alt={artist.name}
                                            className="w-14 h-14 rounded-full border-4 border-white dark:border-[#121212] shadow-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full border-4 border-white dark:border-[#121212] shadow-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center text-xl">
                                            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {selectedArtists.map(artist => (
                                <span key={artist.id} className="text-xs font-bold text-gray-600 dark:text-gray-400">
                                    {artist.name}{selectedArtists.indexOf(artist) !== selectedArtists.length - 1 ? ',' : ''}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="h-40 rounded-2xl flex flex-col items-center justify-center text-gray-400 gap-3 transition-all bg-gray-50/50 dark:bg-white/5 group-hover:bg-[#1DB954]/10 border-2 border-dashed border-gray-200 dark:border-white/10 group-hover:border-[#1DB954]/50">
                        <div className="w-16 h-16 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-8 h-8 text-gray-400 group-hover:text-[#1DB954] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold group-hover:text-[#1DB954] transition-colors">Add Artists</span>
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

                        <ArtistSearchContent
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            isGameMode={isGameMode}
                            isLoading={isLoading}
                            searchResults={searchResults}
                            selectedArtists={selectedArtists}
                            toggleArtist={toggleArtist}
                        />

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
