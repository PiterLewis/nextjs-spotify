'use client';
import { useState, useEffect } from 'react';
import { savePlaylistToSpotify } from '@/lib/spotify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [savingId, setSavingId] = useState(null);
    const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }
    const router = useRouter();

    useEffect(() => {
        const saved = localStorage.getItem('mix_history');
        if (saved) {
            setHistory(JSON.parse(saved));
        }
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleRestore = (entry) => {
        localStorage.setItem('restore_mix', JSON.stringify(entry.tracks));
        router.push('/dashboard');
    };

    const handleDiscard = (id) => {
        if (!window.confirm("Are you sure you want to delete this mix?")) return;
        const updated = history.filter(h => h.id !== id);
        setHistory(updated);
        localStorage.setItem('mix_history', JSON.stringify(updated));
        showToast('Mix deleted', 'success');
    };

    const handleSaveToSpotify = async (entry) => {
        setSavingId(entry.id);
        try {
            await savePlaylistToSpotify(entry.tracks, entry.name);

            // Update local state to show saved status
            const updated = history.map(h =>
                h.id === entry.id ? { ...h, saved: true } : h
            );
            setHistory(updated);
            localStorage.setItem('mix_history', JSON.stringify(updated));
            showToast('Playlist saved to Spotify successfully!', 'success');
        } catch (e) {
            console.error(e);
            showToast(`Error saving: ${e.message}. Try logging in again.`, 'error');
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#000000] text-black dark:text-white p-6 md:p-12 font-sans selection:bg-green-500 selection:text-black transition-colors duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#1DB954]/5 rounded-full blur-[120px] pointer-events-none"></div>

            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-top-5 duration-300 flex items-center gap-3 font-bold backdrop-blur-xl border border-gray-200 dark:border-white/10 ${toast.type === 'success' ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-500/20 text-red-700 dark:text-red-400'
                    }`}>
                    <span>
                        {toast.type === 'success' ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                    </span>
                    {toast.message}
                </div>
            )}

            <div className="max-w-7xl mx-auto relative z-10">

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-gray-200 dark:border-white/10 pb-8">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#1DB954] via-emerald-400 to-cyan-500">
                            Your Mix History
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Relive your past generations and save them for later.</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="px-8 py-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 backdrop-blur-md text-black dark:text-white shadow-lg hover:shadow-green-900/20"
                    >
                        <span>Back to Dashboard</span>
                    </Link>
                </div>


                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-4xl mb-6 text-gray-400 border border-gray-200 dark:border-white/10">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">No mixes yet</h2>
                        <p className="text-gray-500 dark:text-gray-400">Go to the dashboard and start mixing!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {history.map((entry, index) => (
                            <div
                                key={entry.id}
                                className="group bg-white dark:bg-[#121212]/60 backdrop-blur-xl hover:bg-gray-50 dark:hover:bg-[#181818]/80 rounded-[2rem] p-5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-white/5 flex flex-col"
                            >

                                <div className="aspect-square w-full bg-gray-100 dark:bg-[#181818] rounded-2xl mb-5 overflow-hidden relative shadow-2xl border border-gray-100 dark:border-white/5">
                                    {index === 0 && (
                                        <div className="absolute top-3 right-3 z-10 bg-[#1DB954] text-black text-xs font-black px-3 py-1 rounded-full shadow-lg">
                                            NEW
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 h-full w-full">
                                        {entry.tracks.slice(0, 4).map((t, i) => (
                                            <img
                                                key={i}
                                                src={t.album.images[1]?.url || t.album.images[0]?.url}
                                                className="w-full h-full object-cover opacity-90 dark:opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                                alt="Album Art"
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleRestore(entry)}
                                        className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm"
                                    >
                                        <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(29,185,84,0.4)] transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                            <svg className="w-8 h-8 text-black fill-current ml-1" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </button>
                                </div>


                                <div className="flex-1 mb-6">
                                    <h3 className="text-xl font-bold mb-2 truncate text-black dark:text-white group-hover:text-[#1DB954] transition-colors font-[var(--font-outfit)]">
                                        {entry.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="capitalize px-2.5 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-lg text-xs font-medium">{entry.mood}</span>
                                        <span>•</span>
                                        <span>{entry.tracks.length} tracks</span>
                                        <span>•</span>
                                        <span>{entry.timestamp.split(',')[0]}</span>
                                    </div>
                                </div>


                                <div className="grid grid-cols-2 gap-3 mt-auto">
                                    <button
                                        onClick={() => handleSaveToSpotify(entry)}
                                        disabled={entry.saved || savingId === entry.id}
                                        className={`col-span-2 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${entry.saved
                                            ? 'bg-green-500/10 text-green-600 dark:text-green-500 cursor-default border border-green-500/20'
                                            : 'bg-black dark:bg-white text-white dark:text-black hover:bg-[#1DB954] hover:text-black hover:shadow-[0_0_20px_rgba(29,185,84,0.4)] hover:scale-[1.02] active:scale-[0.98]'
                                            }`}
                                    >
                                        {savingId === entry.id ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                Saving...
                                            </>
                                        ) : entry.saved ? (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Saved to Spotify
                                            </>
                                        ) : (
                                            <>Save to Spotify</>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleRestore(entry)}
                                        className="py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/5 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        Edit / Play
                                    </button>
                                    <button
                                        onClick={() => handleDiscard(entry.id)}
                                        className="py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 text-red-600 dark:text-red-400 rounded-xl font-medium text-sm transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}