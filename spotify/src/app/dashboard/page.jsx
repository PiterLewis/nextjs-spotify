'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('favorite_tracks');
        if (saved) setFavorites(JSON.parse(saved));

        // Check for restored mix from History page
        const restored = localStorage.getItem('restore_mix');
        if (restored) {
            setPlaylist(JSON.parse(restored));
            localStorage.removeItem('restore_mix');
        }
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

            // Save to History
            if (tracks.length > 0 && !append) {
                const newEntry = {
                    id: Date.now(),
                    timestamp: new Date().toLocaleString(),
                    name: `Mix ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                    tracks: tracks,
                    mood: preferences.mood,
                    saved: false
                };
                const history = JSON.parse(localStorage.getItem('mix_history') || '[]');
                const updated = [newEntry, ...history].slice(0, 50);
                localStorage.setItem('mix_history', JSON.stringify(updated));
            }
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

    const [playingTrackId, setPlayingTrackId] = useState(null);
    const [audioPlayer, setAudioPlayer] = useState(null);

    useEffect(() => {
        return () => {
            if (audioPlayer) audioPlayer.pause();
        };
    }, [audioPlayer]);

    const handlePreview = (track) => {
        if (playingTrackId === track.id) {
            audioPlayer.pause();
            setPlayingTrackId(null);
        } else {
            if (audioPlayer) audioPlayer.pause();
            if (track.preview_url) {
                const audio = new Audio(track.preview_url);
                audio.play();
                audio.onended = () => setPlayingTrackId(null);
                setAudioPlayer(audio);
                setPlayingTrackId(track.id);
            } else {
                alert("No preview available for this track ");
            }
        }
    };

    const handleExport = (format) => {
        if (playlist.length === 0) return;

        let content, type, extension;
        if (format === 'json') {
            content = JSON.stringify(playlist, null, 2);
            type = 'application/json';
            extension = 'json';
        } else {
            const headers = "Name,Artist,Album,Release Date\n";
            const rows = playlist.map(t => `"${t.name}","${t.artists.map(a => a.name).join(', ')}","${t.album.name}","${t.album.release_date}"`).join("\n");
            content = headers + rows;
            type = 'text/csv';
            extension = 'csv';
        }

        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mi-playlist.${extension}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleShare = () => {
        if (playlist.length === 0) return;
        const text = `Mira mi nueva Playlist! \n\n${playlist.slice(0, 5).map(t => `• ${t.name} - ${t.artists[0].name}`).join('\n')}\n\n...and ${playlist.length - 5} more!`;
        navigator.clipboard.writeText(text);
        alert("Resumen copiado al portapapeles!");
    };

    return (
        <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="col-span-1 lg:col-span-12 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-spotify-green to-green-300">Welcome to Your Taste Mixer</h1>
                    <p className="text-gray-400">Mix your favorite elements to create the perfect playlist.</p>
                </div>

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

                <div className="relative z-30">
                    <TrackWidget
                        selectedTracks={preferences.tracks}
                        onTrackSelect={tracks => setPreferences(p => ({ ...p, tracks }))}
                    />
                </div>

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
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                            <svg className="w-4 h-4 text-white animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                                <circle cx="12" cy="12" r="3" strokeWidth={2} />
                            </svg>
                        </div>
                        Your Mix
                    </h2>
                    {playlist.length > 0 && (
                        <div className="flex items-center gap-1">
                            <button
                                className="p-2 text-gray-500 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors cursor-default"
                                title="Statistics (Disabled)"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setIsExportOpen(!isExportOpen)}
                                    className={`p-2 rounded-lg transition-colors ${isExportOpen ? 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10'}`}
                                    title="Export"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                                {isExportOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsExportOpen(false)}></div>
                                        <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-[#282828] rounded-xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100">
                                            <button
                                                onClick={() => { handleExport('json'); setIsExportOpen(false); }}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5 text-sm transition-colors"
                                            >
                                                JSON
                                            </button>
                                            <button
                                                onClick={() => { handleExport('csv'); setIsExportOpen(false); }}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5 text-sm transition-colors"
                                            >
                                                CSV
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button onClick={handleShare} className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors" title="Share">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </button>

                            <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1"></div>

                            <button
                                onClick={() => setPlaylist([])}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Clear Playlist"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>

                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors"
                                title="Add Song"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                            <div key={`${track.id}-${idx}`} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#282828] transition-colors group relative">
                                <div className="relative">
                                    <img
                                        src={track.album.images[2]?.url || track.album.images[0]?.url}
                                        alt={track.name}
                                        className="w-12 h-12 rounded-md shadow-sm object-cover"
                                    />
                                    <button
                                        onClick={() => handlePreview(track)}
                                        className={`absolute inset-0 bg-black/40 flex items-center justify-center rounded-md transition-opacity ${playingTrackId === track.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                    >
                                        {playingTrackId === track.id ? '⏸️' : '▶️'}
                                    </button>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-medium truncate ${playingTrackId === track.id ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>{track.name}</h3>
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
