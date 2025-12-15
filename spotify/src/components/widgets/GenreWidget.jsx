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

function GenreSearchContent({
    searchTerm,
    setSearchTerm,
    isGameMode,
    filteredGenres,
    selectedGenres,
    toggleGenre
}) {
    return (
        <>
            <div className="p-6 border-b border-gray-200 dark:border-white/10">
                <input
                    type="text"
                    placeholder="Search genres..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border-none focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    autoFocus={isGameMode}
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
        </>
    );
}

export default function GenreWidget({ selectedGenres = [], onGenreSelect, isGameMode = false }) {
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

    if (isGameMode) {
        return (
            <GenreSearchContent
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isGameMode={isGameMode}
                filteredGenres={filteredGenres}
                selectedGenres={selectedGenres}
                toggleGenre={toggleGenre}
            />
        );
    }

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                className="group bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1 cursor-pointer relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg width="397" height="438" viewBox="0 0 397 438" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-35 h-35">
                        <path d="M100.417 337.99C87.2502 327.238 6.08417 351.331 1.50132 341.133C-3.08154 330.935 81.8984 284.781 81.8984 284.781L168.993 235.834L278.205 99.7269C278.205 99.7269 280.571 94.2292 280.554 91.3166C280.538 88.404 279.069 83.6488 279.069 83.6488L289.942 75.7437L287.331 77.4848L283.703 73.2314L279.411 72.954L279.934 67.571L285.562 67.0029L285.672 71.6113L289.942 75.7437L294.96 72.0949C294.96 72.0949 296.302 70.6936 298.503 68.5324L293.791 64.0401L289.499 63.7626L290.409 58.6959L296.037 58.1277L296.076 62.0327L300.091 66.6023L298.562 68.4745C301.073 66.0111 304.681 62.5798 308.685 59.1128L303.919 55.2207L299.974 54.8875L300.955 50.5243L306.125 48.9364L306.622 53.8611L310.823 57.2915C319.711 49.8493 329.87 43.0009 334.267 46.0957C340.321 50.3575 335.624 62.7254 329.834 73.4617L334.119 76.3153L338.585 74.7984L339.224 81.1302L334.371 82.3309L333.241 78.1807L328.886 75.6092L329.834 73.4617C324.647 83.0787 318.584 91.3866 318.584 91.3866L315.992 96.7208L321.23 100.003L325.767 99.1901L326.552 105.344L321.166 106.406L319.965 101.553L314.991 98.7817L310.051 108.949L295.245 113.642L186.033 249.75C186.033 249.75 129.774 450.656 118.273 433.909C106.773 417.163 113.585 348.743 100.417 337.99Z" fill="black" />
                        <path d="M327.445 87.6495L323.573 84.4869L322.308 86.036L326.568 89.5148L327.697 93.665L332.622 93.1679L331.983 86.8361L327.445 87.6495Z" fill="black" />
                        <path d="M308.685 59.1128C301.114 65.6677 294.96 72.0949 294.96 72.0949L289.942 75.7437M308.685 59.1128L303.919 55.2207L299.974 54.8875L300.955 50.5243L306.125 48.9364L306.622 53.8611L310.823 57.2915M308.685 59.1128C309.387 58.5051 310.101 57.8963 310.823 57.2915M308.685 59.1128L310.823 57.2915M310.823 57.2915C319.711 49.8493 329.87 43.0008 334.267 46.0957C340.321 50.3575 335.624 62.7254 329.834 73.4617M329.834 73.4617C324.647 83.0787 318.584 91.3866 318.584 91.3866L315.992 96.7208M329.834 73.4617L334.119 76.3153L338.585 74.7984L339.224 81.1302L334.371 82.3309L333.241 78.1807L328.886 75.6092L329.834 73.4617ZM315.992 96.7208L321.23 100.003L325.767 99.1901L326.552 105.344L321.166 106.406L319.965 101.553L314.991 98.7817M315.992 96.7208L314.991 98.7817M314.991 98.7817L310.051 108.949L295.245 113.642L186.033 249.75C186.033 249.75 129.774 450.656 118.273 433.909C106.773 417.163 113.585 348.743 100.417 337.99C87.2502 327.238 6.08417 351.331 1.50132 341.133C-3.08154 330.935 81.8984 284.781 81.8984 284.781L168.993 235.834L278.205 99.7269C278.205 99.7269 280.571 94.2292 280.554 91.3166C280.538 88.404 279.069 83.6488 279.069 83.6488L289.942 75.7437L287.331 77.4848L283.703 73.2314L279.411 72.954L279.934 67.571L285.562 67.0029L285.672 71.6113L289.942 75.7437ZM300.091 66.6023L296.076 62.0327L296.037 58.1277L290.409 58.6959L289.499 63.7626L293.791 64.0401L298.51 68.5387L300.091 66.6023ZM323.573 84.4869L327.445 87.6495L331.983 86.8361L332.622 93.1679L327.697 93.665L326.568 89.5148L322.308 86.036L323.573 84.4869Z" stroke="black" />
                        <path d="M54.4802 308.87C54.4802 308.87 41.7523 316.551 38.5897 320.423C34.7947 325.071 94.8723 314.742 94.8723 314.742L91.0772 319.389L122.059 344.69L127.119 338.494C127.119 338.494 133.078 390.484 134.627 391.749C136.176 393.014 175.984 262.846 175.984 262.846C168.881 260.327 165.495 257.509C162.109 254.69 158.556 248.615 158.556 248.615L54.4802 308.87Z" fill="#D9D9D9" stroke="black" />
                        <path d="M94.1365 318.014L105.522 304.073L129.533 323.68C129.533 323.68 127.496 326.031 127.461 327.798C127.426 329.566 129.61 331.49 129.61 331.49L122.02 340.785L94.1365 318.014Z" fill="black" stroke="black" />
                        <path d="M118.392 297.798L126.645 287.692L145.234 302.872L136.981 312.979L118.392 297.798Z" fill="black" />
                        <path d="M131.951 281.195L136.078 276.141L154.667 291.322L150.54 296.375L131.951 281.195Z" fill="black" />
                        <path d="M144.92 265.313L148.752 260.62L167.342 275.8L163.51 280.493L144.92 265.313Z" fill="black" />
                        <path d="M118.392 297.798L126.645 287.692L145.234 302.872L136.981 312.979L118.392 297.798Z" stroke="black" />
                        <path d="M131.951 281.195L136.078 276.141L154.667 291.322L150.54 296.375L131.951 281.195Z" stroke="black" />
                        <path d="M144.92 265.313L148.752 260.62L167.342 275.8L163.51 280.493L144.92 265.313Z" stroke="black" />
                        <path d="M101.14 320.506C101.14 320.506 278.339 109.52 282.039 98.9849C284.803 91.1145 290.358 79.3115 290.358 79.3115" stroke="white" />
                        <circle cx="290.358" cy="79.3112" r="2" transform="rotate(39.2358 290.358 79.3112)" fill="#D9D9D9" />
                        <circle cx="313.452" cy="96.8796" r="2" transform="rotate(39.2358 313.452 96.8796)" fill="#D9D9D9" />
                        <circle cx="301.537" cy="70.3654" r="2" transform="rotate(39.2358 301.537 70.3654)" fill="#D9D9D9" />
                        <circle cx="312.083" cy="62.1935" r="2" transform="rotate(39.2358 312.083 62.1935)" fill="#D9D9D9" />
                        <circle cx="325.25" cy="72.9464" r="2" transform="rotate(39.2358 325.25 72.9464)" fill="#D9D9D9" />
                        <circle cx="319.351" cy="84.9132" r="2" transform="rotate(39.2358 319.351 84.9132)" fill="#D9D9D9" />
                        <path d="M103.463 322.403L283.801 102.36L301.537 70.3654M106.562 324.933L286.512 104.574L311.451 62.9683M110.047 327.78L289.997 107.421L324.231 73.4048M112.371 329.677L292.321 109.318L318.964 84.597M115.856 332.524L294.644 111.216L313.136 97.2672" stroke="white" />
                    </svg>

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
                            <span key={genre} className="px-3 py-1.5 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 rounded-full text-sm font-bold border border-purple-200 dark:border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                                {genre}
                            </span>
                        ))}
                    </div>
                ) : (
                    <div className="h-40 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-400 gap-3 group-hover:border-purple-500/30 transition-colors bg-gray-50/50 dark:bg-white/5">
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

                        <GenreSearchContent
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            isGameMode={isGameMode}
                            filteredGenres={filteredGenres}
                            selectedGenres={selectedGenres}
                            toggleGenre={toggleGenre}
                        />

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
