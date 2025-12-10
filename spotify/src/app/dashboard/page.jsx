'use client';

import { useState, useEffect } from 'react';
import { generatePlaylist, searchSpotify } from '@/lib/spotify';
import ArtistWidget from '@/components/widgets/ArtistWidget';
import GenreWidget from '@/components/widgets/GenreWidget';
import TrackWidget from '@/components/widgets/TrackWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
import PopularityWidget from '@/components/widgets/PopularityWidget';

export default function Dashboard() {
    const [preferences, setPreferences] = useState({
        artists: [],
        tracks: [],
        genres: [],
        decade: 'all',
        mood: 'happy',
        popularity: 'mainstream'
    });
    const [playlist, setPlaylist] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Manual Add Track State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('favorite_tracks');
        if (saved) setFavorites(JSON.parse(saved));
    }, []);

    // Debounce search for manual add
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.length > 2) {
                setIsSearching(true);
                try {
                    const data = await searchSpotify(searchQuery, 'track', 5);
                    if (data && data.tracks) {
                        setSearchResults(data.tracks.items);
                    }
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleGenerate = async (append = false) => {
        setIsGenerating(true);
        try {
            const tracks = await generatePlaylist(preferences);
            setPlaylist(prev => append ? [...prev, ...tracks] : tracks);
        } catch (error) {
            console.error("Error generating playlist:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const removeTrack = (id) => {
        setPlaylist(prev => prev.filter(t => t.id !== id));
    };

    const toggleFavorite = (track) => {
        const isFav = favorites.some(f => f.id === track.id);
        let newFavs;
        if (isFav) {
            newFavs = favorites.filter(f => f.id !== track.id);
        } else {
            newFavs = [...favorites, track];
        }
        setFavorites(newFavs);
        localStorage.setItem('favorite_tracks', JSON.stringify(newFavs));
    };

    const handleAddTrack = (track) => {
        if (playlist.some(t => t.id === track.id)) return;
        setPlaylist(prev => [...prev, track]);
    };

    return (
        <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="col-span-1 lg:col-span-12 mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-spotify-green to-green-300">Welcome to Your Taste Mixer</h1>
                <p className="text-gray-400">Mix your favorite elements to create the perfect playlist.</p>
            </div>

            {/* Left Column: Widgets */}
            <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ArtistWidget
                        selectedArtists={preferences.artists}
                        onArtistSelect={artists => setPreferences(p => ({ ...p, artists }))}
                    />
                    <GenreWidget
                        selectedGenres={preferences.genres}
                        onGenreSelect={genres => setPreferences(p => ({ ...p, genres }))}
                    />
                </div>

                <TrackWidget
                    selectedTracks={preferences.tracks}
                    onTrackSelect={tracks => setPreferences(p => ({ ...p, tracks }))}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DecadeWidget
                        selectedDecade={preferences.decade}
                        onDecadeSelect={decade => setPreferences(p => ({ ...p, decade }))}
                    />
                    <MoodWidget
                        selectedMood={preferences.mood}
                        onMoodSelect={mood => setPreferences(p => ({ ...p, mood }))}
                    />
                    <PopularityWidget
                        selectedPopularity={preferences.popularity}
                        onPopularitySelect={popularity => setPreferences(p => ({ ...p, popularity }))}
                    />
                </div>

                <button
                    onClick={() => handleGenerate(false)}
                    disabled={isGenerating}
                    className="w-full py-4 bg-green-500 hover:bg-green-600 text-black font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                            GENERATING...
                        </>
                    ) : (
                        'GENERATE MIX'
                    )}
                </button>
            </div>

            {/* Right Column: Playlist */}
            <div className="lg:col-span-5 bg-white dark:bg-[#181818] rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-[#282828] h-[calc(100vh-120px)] sticky top-24 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-green-500">💿</span> Your Mix
                    </h2>
                    {playlist.length > 0 && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPlaylist([])}
                                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="text-sm text-green-500 hover:text-green-400 font-medium"
                            >
                                + Add Song
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {playlist.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8 opacity-50">
                            <div className="w-32 h-32 rounded-full border-4 border-current mb-4 flex items-center justify-center animate-pulse-slow">
                                <div className="w-8 h-8 bg-current rounded-full"></div>
                            </div>
                            <p className="text-lg font-medium">Empty Queue</p>
                            <p className="text-sm">Select your vibe and hit generate to start the music.</p>
                        </div>
                    ) : (
                        playlist.map((track, idx) => (
                            <div key={`${track.id}-${idx}`} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#282828] transition-colors group">
                                <img
                                    src={track.album.images[2]?.url || track.album.images[0]?.url}
                                    alt={track.name}
                                    className="w-12 h-12 rounded-md shadow-sm object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium truncate text-gray-900 dark:text-white">{track.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {track.artists.map(a => a.name).join(', ')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => toggleFavorite(track)}
                                        className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#3E3E3E] transition-colors ${favorites.some(f => f.id === track.id) ? 'text-green-500' : 'text-gray-400'
                                            }`}
                                    >
                                        ♥
                                    </button>
                                    <button
                                        onClick={() => removeTrack(track.id)}
                                        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Track Modal */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                            <h3 className="text-2xl font-bold">Add Song to Playlist</h3>
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 border-b border-gray-200 dark:border-white/10">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for a song..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 rounded-xl bg-gray-100 dark:bg-white/5 border-none focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    autoFocus
                                />
                                <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
                                {isSearching && (
                                    <div className="absolute right-3 top-3.5 animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                                )}
                            </div>
                        </div>

                        <div className="p-2 overflow-y-auto flex-1 custom-scrollbar">
                            {searchResults.length > 0 ? (
                                searchResults.map(track => {
                                    const isAdded = playlist.some(t => t.id === track.id);
                                    return (
                                        <button
                                            key={track.id}
                                            onClick={() => handleAddTrack(track)}
                                            disabled={isAdded}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left group ${isAdded
                                                ? 'bg-green-50 dark:bg-green-900/20 cursor-default'
                                                : 'hover:bg-gray-100 dark:hover:bg-white/5'
                                                }`}
                                        >
                                            <img
                                                src={track.album.images[2]?.url || track.album.images[0]?.url}
                                                alt={track.name}
                                                className="w-12 h-12 rounded-md object-cover shadow-sm"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-bold text-sm truncate ${isAdded ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                                    {track.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{track.artists[0].name}</p>
                                            </div>
                                            {isAdded ? (
                                                <span className="text-green-500 font-bold text-sm px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                                                    ADDED
                                                </span>
                                            ) : (
                                                <span className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xl">+</span>
                                            )}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    {searchQuery.length > 2 ? 'No songs found' : 'Type to search...'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
