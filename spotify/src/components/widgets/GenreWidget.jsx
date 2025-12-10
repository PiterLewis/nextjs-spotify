'use client';

import { useState } from 'react';

const AVAILABLE_GENRES = [
    'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient',
    'anime', 'black-metal', 'bluegrass', 'blues', 'bossanova',
    'brazil', 'breakbeat', 'british', 'cantopop', 'chicago-house',
    'children', 'chill', 'classical', 'club', 'comedy',
    'country', 'dance', 'dancehall', 'death-metal', 'deep-house',
    'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub',
    'dubstep', 'edm', 'electro', 'electronic', 'emo',
    'folk', 'forro', 'french', 'funk', 'garage',
    'german', 'gospel', 'goth', 'grindcore', 'groove',
    'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore',
    'hardstyle', 'heavy-metal', 'hip-hop', 'house', 'idm',
    'indian', 'indie', 'indie-pop', 'industrial', 'iranian',
    'j-dance', 'j-idol', 'j-pop', 'j-rock', 'jazz',
    'k-pop', 'kids', 'latin', 'latino', 'malay',
    'mandopop', 'metal', 'metal-misc', 'metalcore', 'minimal-techno',
    'movies', 'mpb', 'new-age', 'new-release', 'opera',
    'pagode', 'party', 'philippines-opm', 'piano', 'pop',
    'pop-film', 'post-dubstep', 'power-pop', 'progressive-house', 'psych-rock',
    'punk', 'punk-rock', 'r-n-b', 'rainy-day', 'reggae',
    'reggaeton', 'road-trip', 'rock', 'rock-n-roll', 'rockabilly',
    'romance', 'sad', 'salsa', 'samba', 'sertanejo',
    'show-tunes', 'singer-songwriter', 'ska', 'sleep', 'songwriter',
    'soul', 'soundtracks', 'spanish', 'study', 'summer',
    'swedish', 'synth-pop', 'tango', 'techno', 'trance',
    'trip-hop', 'turkish', 'work-out', 'world-music'
];

export default function GenreWidget({ selectedGenres = [], onGenreSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredGenres = AVAILABLE_GENRES.filter(genre =>
        genre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleGenre = (genre) => {
        if (selectedGenres.includes(genre)) {
            onGenreSelect(selectedGenres.filter(g => g !== genre));
        } else {
            if (selectedGenres.length >= 5) return; // Max 5 genres
            onGenreSelect([...selectedGenres, genre]);
        }
    };

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                className="group bg-white dark:bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-gray-200 dark:border-white/10 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 cursor-pointer relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-8xl">🎸</span>
                </div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        Genres
                    </h2>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors ${selectedGenres.length > 0 ? 'bg-purple-500 text-white' : 'group-hover:bg-purple-500 group-hover:text-white'}`}>
                        {selectedGenres.length}/5
                    </span>
                </div>

                {selectedGenres.length > 0 ? (
                    <div className="flex flex-wrap gap-2 relative z-10">
                        {selectedGenres.map(genre => (
                            <span key={genre} className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-500/30">
                                {genre}
                            </span>
                        ))}
                    </div>
                ) : (
                    <div className="h-40 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-400 gap-3 group-hover:border-purple-500/30 transition-colors bg-gray-50/50 dark:bg-black/20">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">
                            <span className="text-2xl">+</span>
                        </div>
                        <span className="text-sm font-medium">Add Genres</span>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                            <h3 className="text-2xl font-bold">Select Genres</h3>
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
                                placeholder="Search genres..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border-none focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                autoFocus
                            />
                        </div>

                        <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {filteredGenres.map(genre => {
                                const isSelected = selectedGenres.includes(genre);
                                return (
                                    <button
                                        key={genre}
                                        onClick={() => toggleGenre(genre)}
                                        disabled={!isSelected && selectedGenres.length >= 5}
                                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all text-left flex items-center justify-between ${isSelected
                                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                                            : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
                                            } ${!isSelected && selectedGenres.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {genre}
                                        {isSelected && <span>✓</span>}
                                    </button>
                                );
                            })}
                            {filteredGenres.length === 0 && (
                                <div className="col-span-full text-center py-8 text-gray-500">
                                    No genres found matching "{searchTerm}"
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5 rounded-b-3xl">
                            <span className="text-sm text-gray-500">
                                {selectedGenres.length}/5 selected
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
