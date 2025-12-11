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
        <div className="min-h-screen bg-white dark:bg-[#121212] text-black dark:text-white p-6 md:p-12 font-sans selection:bg-green-500 selection:text-black transition-colors duration-300">

            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-top-5 duration-300 flex items-center gap-3 font-bold ${toast.type === 'success' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                    }`}>
                    <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
                    {toast.message}
                </div>
            )}

            <div className="max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-gray-200 dark:border-white/10 pb-8">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-black mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-700 dark:from-green-400 dark:to-emerald-600">
                            Your Mix History
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Relive your past generations and save them for later.</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="px-8 py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 backdrop-blur-md text-gray-900 dark:text-white"
                    >
                        <span>Back to Dashboard</span>
                    </Link>
                </div>


                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-4xl mb-6">
                            🕸️
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No mixes yet</h2>
                        <p className="text-gray-500 dark:text-gray-400">Go to the dashboard and start mixing!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {history.map((entry, index) => (
                            <div
                                key={entry.id}
                                className="group bg-white dark:bg-[#181818] hover:bg-gray-50 dark:hover:bg-[#202020] rounded-3xl p-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-900/10 border border-gray-200 dark:border-white/5 flex flex-col"
                            >

                                <div className="aspect-square w-full bg-gray-200 dark:bg-[#282828] rounded-2xl mb-5 overflow-hidden relative shadow-lg">
                                    {index === 0 && (
                                        <div className="absolute top-3 right-3 z-10 bg-green-500 text-black text-xs font-black px-3 py-1 rounded-full shadow-lg">
                                            NEW
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 h-full w-full">
                                        {entry.tracks.slice(0, 4).map((t, i) => (
                                            <img
                                                key={i}
                                                src={t.album.images[1]?.url || t.album.images[0]?.url}
                                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                                alt="Album Art"
                                            />
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleRestore(entry)}
                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]"
                                    >
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                                            <svg className="w-8 h-8 text-black fill-current ml-1" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </button>
                                </div>


                                <div className="flex-1 mb-6">
                                    <h3 className="text-xl font-bold mb-1 truncate text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                        {entry.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="capitalize px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded-md">{entry.mood}</span>
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
                                        className={`col-span-2 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${entry.saved
                                            ? 'bg-green-500/10 text-green-600 dark:text-green-500 cursor-default border border-green-500/20'
                                            : 'bg-black dark:bg-white text-white dark:text-black hover:bg-green-500 hover:text-black dark:hover:bg-green-400 dark:hover:text-black hover:scale-[1.02] active:scale-[0.98]'
                                            }`}
                                    >
                                        {savingId === entry.id ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                Saving...
                                            </>
                                        ) : entry.saved ? (
                                            <>✓ Saved to Spotify</>
                                        ) : (
                                            <>Save to Spotify</>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleRestore(entry)}
                                        className="py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-300 transition-colors"
                                    >
                                        Edit / Play
                                    </button>
                                    <button
                                        onClick={() => handleDiscard(entry.id)}
                                        className="py-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-medium text-sm transition-colors"
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