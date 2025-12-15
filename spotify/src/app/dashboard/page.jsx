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
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableTrack } from '@/components/SortableTrack';

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

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const saved = localStorage.getItem('favorite_tracks');
        if (saved) setFavorites(JSON.parse(saved));

        const restored = localStorage.getItem('restore_mix');
        if (restored) {
            setPlaylist(JSON.parse(restored));
            localStorage.removeItem('restore_mix');
        }
    }, []);

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
        let newFavs;
        if (favorites.some(f => f.id === track.id)) {
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
                alert("No preview available for this track");
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
        a.download = `my-playlist.${extension}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleShare = () => {
        if (playlist.length === 0) return;
        const text = `Check out my new Playlist! \n\n${playlist.slice(0, 5).map(t => `• ${t.name} - ${t.artists[0].name}`).join('\n')}\n\n...and ${playlist.length - 5} more!`;
        navigator.clipboard.writeText(text);
        alert("Summary copied to clipboard!");
    };

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setPlaylist((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    return (
        <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Ambient Background */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#1DB954]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

            <div className="col-span-1 lg:col-span-12 mb-12 flex justify-between items-end relative z-10">
                <div className="max-w-3xl">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter leading-tight">
                        <span className="block text-black dark:text-white">Design Your</span>
                        <span className="bg-gradient-to-r from-[#1DB954] via-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                            Perfect Atmosphere
                        </span>
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-light max-w-2xl">
                        Blend your favorite artists, genres, and moods to create a sonic experience that is uniquely yours.
                    </p>
                </div>
            </div>


            <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ArtistWidget
                        preferences={preferences}
                        setPreferences={setPreferences}
                    />
                    <GenreWidget
                        preferences={preferences}
                        setPreferences={setPreferences}
                    />
                </div>

                <TrackWidget
                    preferences={preferences}
                    setPreferences={setPreferences}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DecadeWidget
                        preferences={preferences}
                        setPreferences={setPreferences}
                    />
                    <MoodWidget
                        preferences={preferences}
                        setPreferences={setPreferences}
                    />
                    <PopularityWidget
                        preferences={preferences}
                        setPreferences={setPreferences}
                    />
                </div>

                <button
                    onClick={() => handleGenerate(false)}
                    disabled={isGenerating}
                    className="w-full py-5 bg-gradient-to-r from-[#1DB954] via-[#1ed760] to-[#1DB954] bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-black font-[var(--font-outfit)] font-black text-xl tracking-[0.15em] rounded-full transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(29,185,84,0.4)] hover:shadow-[0_0_50px_rgba(29,185,84,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 relative z-20 group border-2 border-[#1DB954]/50 hover:border-[#1DB954]"
                >
                    {isGenerating ? (
                        <>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                            <span className="tracking-[0.2em]">BREWING...</span>
                        </>
                    ) : (
                        <>
                            <span>GENERATE MIX</span>
                            <svg className="w-6 h-6 transition-transform group-hover:rotate-12 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </>
                    )}
                </button>
            </div>


            <div className="lg:col-span-5 bg-white/80 dark:bg-[#121212]/60 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl border border-gray-200 dark:border-white/5 h-[calc(100vh-120px)] sticky top-24 flex flex-col relative z-20 transition-all duration-300">
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
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-center p-8">
                            <div className="w-40 h-40 rounded-full border-4 border-[#1DB954]/20 mb-6 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-[#1DB954]/5 rounded-full blur-xl"></div>
                                <div className="w-20 h-20 bg-[#1DB954]/20 rounded-full flex items-center justify-center animate-pulse">
                                    <svg className="w-10 h-10 text-[#1DB954]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-xl font-bold mb-2 text-black dark:text-white">Your queue is empty</p>
                            <p className="text-sm max-w-xs mx-auto opacity-70">Select your vibe from the widgets on the left and hit generate to start the magic.</p>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={playlist}
                                strategy={verticalListSortingStrategy}
                            >
                                {playlist.map((track, idx) => (
                                    <SortableTrack key={track.id} id={track.id}>
                                        <div className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all border border-transparent hover:border-black/5 dark:hover:border-white/5 relative cursor-grab active:cursor-grabbing">
                                            <div className="relative shrink-0">
                                                <img
                                                    src={track.album.images[2]?.url || track.album.images[0]?.url}
                                                    alt={track.name}
                                                    className="w-14 h-14 rounded-xl shadow-lg object-cover"
                                                />
                                                <button
                                                    onClick={() => handlePreview(track)}
                                                    className={`absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl transition-opacity ${playingTrackId === track.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                                >
                                                    {playingTrackId === track.id ? (
                                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`font-bold truncate text-base ${playingTrackId === track.id ? 'text-[#1DB954]' : 'text-gray-900 dark:text-white'}`}>{track.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate font-medium">
                                                    {track.artists.map(a => a.name).join(', ')}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => toggleFavorite(track)}
                                                    className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors ${favorites.some(f => f.id === track.id) ? 'text-[#1DB954]' : 'text-gray-400'
                                                        }`}
                                                >
                                                    <svg className="w-5 h-5" fill={favorites.some(f => f.id === track.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => removeTrack(track.id)}
                                                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </SortableTrack>
                                ))}
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            </div>


            {isSearchOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                            <h3 className="text-2xl font-bold">Add Song to Playlist</h3>
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
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
                                <span className="absolute left-3 top-3.5 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
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
                                            onClick={() => {
                                                if (!isAdded) {
                                                    handleAddTrack(track);
                                                    setIsSearchOpen(false);
                                                    setSearchQuery('');
                                                }
                                            }}
                                            disabled={isAdded}
                                            className={`w-full p-3 rounded-xl flex items-center gap-4 transition-all ${isAdded ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                        >
                                            <img src={track.album.images[2]?.url} alt={track.name} className="w-12 h-12 rounded-lg object-cover" />
                                            <div className="flex-1 text-left">
                                                <h4 className="font-bold text-sm truncate">{track.name}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{track.artists[0].name}</p>
                                            </div>
                                            {isAdded && (
                                                <span className="text-green-500 text-xs font-bold">Added</span>
                                            )}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    {searchQuery ? "No results found" : "Start typing to search..."}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
