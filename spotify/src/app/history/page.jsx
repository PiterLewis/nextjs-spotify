'use client';
import { useState } from 'react';

export default function HistoryPanel({ history, onRestore, onDiscard, onSaveToSpotify }) {
    const [isOpen, setIsOpen] = useState(false);
    const [savingId, setSavingId] = useState(null);

    const handleSave = async (entry) => {
        setSavingId(entry.id);
        try {
            await onSaveToSpotify(entry);
        } catch (e) {
            console.error(e);
        } finally {
            setSavingId(null);
        }
    };

    return (
        <>
            {/* Botón flotante o en la UI para abrir historial */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 z-40 bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-3 rounded-full shadow-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
            >
                <span>📜 History</span>
                <span className="bg-green-500 text-black text-xs px-2 py-0.5 rounded-full">
                    {history.length}
                </span>
            </button>

            {/* Panel Lateral (Drawer) */}
            <div className={`fixed inset-y-0 left-0 z-50 w-full md:w-96 bg-white dark:bg-[#121212] shadow-2xl transform transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            Mix History
                        </h2>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">✕</button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                        {history.length === 0 ? (
                            <div className="text-center text-gray-500 mt-10">
                                <p>No mixes generated yet.</p>
                                <p className="text-sm mt-2">Generate some music to build your stack!</p>
                            </div>
                        ) : (
                            history.map((entry, index) => (
                                <div key={entry.id} className="bg-gray-50 dark:bg-[#181818] rounded-xl p-4 border border-gray-200 dark:border-gray-800 relative group">
                                    {/* Etiqueta de "Latest" para el primero */}
                                    {index === 0 && (
                                        <span className="absolute -top-2 -right-2 bg-green-500 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                            NEWEST
                                        </span>
                                    )}

                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg">{entry.name}</h3>
                                            <p className="text-xs text-gray-500">{entry.timestamp}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {entry.mood} • {entry.tracks.length} tracks
                                            </p>
                                        </div>
                                    </div>

                                    {/* Preview pequeña de 3 portadas */}
                                    <div className="flex -space-x-2 mb-4 overflow-hidden py-1">
                                        {entry.tracks.slice(0, 4).map((t, i) => (
                                            <img
                                                key={i}
                                                src={t.album.images[2]?.url || t.album.images[0]?.url}
                                                className="w-8 h-8 rounded-full border-2 border-white dark:border-[#181818]"
                                            />
                                        ))}
                                    </div>

                                    {/* Botonera de Acciones */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => onRestore(entry)}
                                            className="col-span-2 py-2 text-sm bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-lg font-medium transition-colors"
                                        >
                                            Load to Player
                                        </button>
                                        <button
                                            onClick={() => handleSave(entry)}
                                            disabled={entry.saved || savingId === entry.id}
                                            className={`py-2 text-sm rounded-lg font-bold transition-all ${entry.saved
                                                ? 'bg-green-500/20 text-green-500 cursor-default'
                                                : 'bg-green-500 hover:bg-green-600 text-black'
                                                }`}
                                        >
                                            {savingId === entry.id ? 'Saving...' : entry.saved ? 'Saved ✓' : 'Save to Spotify'}
                                        </button>
                                        <button
                                            onClick={() => onDiscard(entry.id)}
                                            className="py-2 text-sm bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 rounded-lg font-medium transition-colors"
                                        >
                                            Discard
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}