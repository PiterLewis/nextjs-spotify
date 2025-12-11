'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GameModal from '@/components/game/GameModal';
import ArtistWidget from '@/components/widgets/ArtistWidget';
import GenreWidget from '@/components/widgets/GenreWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
import { generatePlaylist } from '@/lib/spotify';

const STEPS = [
    {
        id: 'start',
        position: 5,
        type: 'start',
        label: 'Start',
        icon: null
    },
    {
        id: 'artist',
        position: 25,
        type: 'widget',
        label: 'Artists',
        icon: (
            <svg width="126" height="120" viewBox="0 0 126 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 drop-shadow-lg transition-transform hover:scale-110">
                <path d="M81.3171 69.9409L10.8171 118.941C10.8171 118.941 3.86739 118.893 1.81714 116.94C-0.233114 114.987 0.317139 108.941 0.317139 108.941L54.8171 40.4409L59.3171 17.4409V12.4409L64.8171 7.94092C64.8171 7.94092 98.2648 -12.0581 117.817 12.4409C137.369 36.9399 114.317 61.9409 114.317 61.9409L109.317 66.9409L102.817 64.9409L81.3171 69.9409Z" fill="#C5FFCA" />
                <path d="M81.3171 69.9409L10.8171 118.941C10.8171 118.941 3.86739 118.893 1.81714 116.94C-0.233114 114.987 0.317139 108.941 0.317139 108.941L54.8171 40.4409M81.3171 69.9409L102.817 64.9409L109.317 66.9409L114.317 61.9409C114.317 61.9409 137.369 36.9399 117.817 12.4409C98.2648 -12.0581 64.8171 7.94092 64.8171 7.94092L59.3171 12.4409V17.4409L54.8171 40.4409M81.3171 69.9409L54.8171 40.4409" stroke="black" strokeWidth="0.5" />
                <path d="M109.25 66.7495L59.25 12.7495L64.25 8.24951L114.25 61.7495L109.25 66.7495Z" fill="#00E861" stroke="black" strokeWidth="0.5" />
                <path d="M11.25 118.75L0.75 108.25L3.25 105.25L14.25 116.75L11.25 118.75Z" fill="#00E861" stroke="black" strokeWidth="0.2" />
            </svg>
        ),
        component: ArtistWidget,
        title: 'Choose Your Artists'
    },
    {
        id: 'genre',
        position: 50,
        type: 'widget',
        label: 'Genres',
        icon: (
            <svg width="397" height="438" viewBox="0 0 397 438" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 drop-shadow-lg transition-transform hover:scale-110">
                <path d="M100.417 337.99C87.2502 327.238 6.08417 351.331 1.50132 341.133C-3.08154 330.935 81.8984 284.781 81.8984 284.781L168.993 235.834L278.205 99.7269C278.205 99.7269 280.571 94.2292 280.554 91.3166C280.538 88.404 279.069 83.6488 279.069 83.6488L289.942 75.7437L287.331 77.4848L283.703 73.2314L279.411 72.954L279.934 67.571L285.562 67.0029L285.672 71.6113L289.942 75.7437L294.96 72.0949C294.96 72.0949 296.302 70.6936 298.503 68.5324L293.791 64.0401L289.499 63.7626L290.409 58.6959L296.037 58.1277L296.076 62.0327L300.091 66.6023L298.562 68.4745C301.073 66.0111 304.681 62.5798 308.685 59.1128L303.919 55.2207L299.974 54.8875L300.955 50.5243L306.125 48.9364L306.622 53.8611L310.823 57.2915C319.711 49.8493 329.87 43.0009 334.267 46.0957C340.321 50.3575 335.624 62.7254 329.834 73.4617L334.119 76.3153L338.585 74.7984L339.224 81.1302L334.371 82.3309L333.241 78.1807L328.886 75.6092L329.834 73.4617C324.647 83.0787 318.584 91.3866 318.584 91.3866L315.992 96.7208L321.23 100.003L325.767 99.1901L326.552 105.344L321.166 106.406L319.965 101.553L314.991 98.7817L310.051 108.949L295.245 113.642L186.033 249.75C186.033 249.75 129.774 450.656 118.273 433.909C106.773 417.163 113.585 348.743 100.417 337.99C87.2502 327.238 6.08417 351.331 1.50132 341.133C-3.08154 330.935 81.8984 284.781 81.8984 284.781L168.993 235.834L278.205 99.7269C278.205 99.7269 280.571 94.2292 280.554 91.3166C280.538 88.404 279.069 83.6488 279.069 83.6488L289.942 75.7437L287.331 77.4848L283.703 73.2314L279.411 72.954L279.934 67.571L285.562 67.0029L285.672 71.6113L289.942 75.7437L294.96 72.0949C294.96 72.0949 296.302 70.6936 298.503 68.5324L293.791 64.0401L289.499 63.7626L290.409 58.6959L296.037 58.1277L296.076 62.0327L300.091 66.6023L298.562 68.4745C301.073 66.0111 304.681 62.5798 308.685 59.1128L303.919 55.2207L299.974 54.8875L300.955 50.5243L306.125 48.9364L306.622 53.8611L310.823 57.2915C319.711 49.8493 329.87 43.0009 334.267 46.0957C340.321 50.3575 335.624 62.7254 329.834 73.4617L334.119 76.3153L338.585 74.7984L339.224 81.1302L334.371 82.3309L333.241 78.1807L328.886 75.6092L329.834 73.4617C324.647 83.0787 318.584 91.3866 318.584 91.3866L315.992 96.7208L321.23 100.003L325.767 99.1901L326.552 105.344L321.166 106.406L319.965 101.553L314.991 98.7817L310.051 108.949L295.245 113.642L186.033 249.75C186.033 249.75 129.774 450.656 118.273 433.909C106.773 417.163 113.585 348.743 100.417 337.99Z" fill="black" />
                <path d="M327.445 87.6495L323.573 84.4869L322.308 86.036L326.568 89.5148L327.697 93.665L332.622 93.1679L331.983 86.8361L327.445 87.6495Z" fill="black" />
                <path d="M308.685 59.1128C301.114 65.6677 294.96 72.0949 294.96 72.0949L289.942 75.7437M308.685 59.1128L303.919 55.2207L299.974 54.8875L300.955 50.5243L306.125 48.9364L306.622 53.8611L310.823 57.2915M308.685 59.1128C309.387 58.5051 310.101 57.8963 310.823 57.2915M308.685 59.1128L310.823 57.2915M310.823 57.2915C319.711 49.8493 329.87 43.0008 334.267 46.0957C340.321 50.3575 335.624 62.7254 329.834 73.4617M329.834 73.4617C324.647 83.0787 318.584 91.3866 318.584 91.3866L315.992 96.7208M329.834 73.4617L334.119 76.3153L338.585 74.7984L339.224 81.1302L334.371 82.3309L333.241 78.1807L328.886 75.6092L329.834 73.4617ZM315.992 96.7208L321.23 100.003L325.767 99.1901L326.552 105.344L321.166 106.406L319.965 101.553L314.991 98.7817M315.992 96.7208L314.991 98.7817M314.991 98.7817L310.051 108.949L295.245 113.642L186.033 249.75C186.033 249.75 129.774 450.656 118.273 433.909C106.773 417.163 113.585 348.743 100.417 337.99C87.2502 327.238 6.08417 351.331 1.50132 341.133C-3.08154 330.935 81.8984 284.781 81.8984 284.781L168.993 235.834L278.205 99.7269C278.205 99.7269 280.571 94.2292 280.554 91.3166C280.538 88.404 279.069 83.6488 279.069 83.6488L289.942 75.7437M289.942 75.7437L285.672 71.6113L285.562 67.0029L279.934 67.571L279.411 72.954L283.703 73.2314L287.331 77.4848L289.942 75.7437ZM300.091 66.6023L296.076 62.0327L296.037 58.1277L290.409 58.6959L289.499 63.7626L293.791 64.0401L298.51 68.5387L300.091 66.6023ZM323.573 84.4869L327.445 87.6495L331.983 86.8361L332.622 93.1679L327.697 93.665L326.568 89.5148L322.308 86.036L323.573 84.4869Z" stroke="black" />
                <path d="M54.4802 308.87C54.4802 308.87 41.7523 316.551 38.5897 320.423C34.7947 325.071 94.8723 314.742 94.8723 314.742L91.0772 319.389L122.059 344.69L127.119 338.494C127.119 338.494 133.078 390.484 134.627 391.749C136.176 393.014 175.984 262.846 175.984 262.846C175.984 262.846 168.881 260.327 165.495 257.509C162.109 254.69 158.556 248.615 158.556 248.615L54.4802 308.87Z" fill="#D9D9D9" stroke="black" />
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

        ),
        component: GenreWidget,
        title: 'Pick Your Genres'
    },
    {
        id: 'mood',
        position: 75,
        type: 'widget',
        label: 'Mood',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8">
                <defs>
                    <linearGradient id="mood-gradient-premium" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FCD34D" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#ffffffff" />
                    </linearGradient>
                    <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
                    </filter>
                </defs>
                <g filter="url(#soft-shadow)">
                    <circle cx="12" cy="12" r="10" fill="url(#mood-gradient-premium)" />
                    <path d="M8.5 9.5c.83 0 1.5-.67 1.5-1.5S9.33 6.5 8.5 6.5 7 7.17 7 8s.67 1.5 1.5 1.5zm7 0c.83 0 1.5-.67 1.5-1.5S16.33 6.5 15.5 6.5 14 7.17 14 8s.67 1.5 1.5 1.5zm-3.5 8c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="#FFF" fillOpacity="0.95" />
                </g>
            </svg>
        ),
        component: MoodWidget,
        title: 'Set the Vibe'
    },
    {
        id: 'castle',
        position: 92,
        type: 'finish',
        label: 'Castle',
        icon: null
    }
];

export default function GamePage() {
    const [gameStarted, setGameStarted] = useState(false);
    const [wizardPosition, setWizardPosition] = useState(5);
    const [activeStep, setActiveStep] = useState(null);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [playlistData, setPlaylistData] = useState({
        artists: [],
        genres: [],
        mood: null
    });
    const [generatedTracks, setGeneratedTracks] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isSpanishWizard, setIsSpanishWizard] = useState(false);
    const router = useRouter();

    const handleObjectClick = (step) => {
        setWizardPosition(step.position);

        setTimeout(async () => {
            if (step.type === 'widget') {
                setActiveStep(step);
            } else if (step.type === 'finish') {
                setIsGenerating(true);
                setActiveStep({ id: 'results', title: 'Your Quest Rewards' });
                try {
                    const tracks = await generatePlaylist(playlistData);
                    setGeneratedTracks(tracks || []);
                } catch (error) {
                    console.error("Error generating playlist:", error);
                } finally {
                    setIsGenerating(false);
                }
            }
        }, 1000);
    };

    const handleWidgetComplete = (key, data) => {
        setPlaylistData(prev => ({ ...prev, [key]: data }));
        setCompletedSteps(prev => [...new Set([...prev, activeStep.id])]);
        setActiveStep(null);
    };

    const handleSaveToHistory = () => {
        const newMix = {
            id: Date.now(),
            name: `Quest Mix - ${new Date().toLocaleDateString()}`,
            tracks: generatedTracks,
            mood: playlistData.mood || 'Adventure',
            timestamp: new Date().toLocaleString(),
            saved: false
        };

        const existingHistory = JSON.parse(localStorage.getItem('mix_history') || '[]');
        const updatedHistory = [newMix, ...existingHistory];
        localStorage.setItem('mix_history', JSON.stringify(updatedHistory));

        setIsSaved(true);
        setTimeout(() => {
            router.push('/history');
        }, 1500);
    };

    return (
        <main className="relative w-full h-screen overflow-hidden transition-colors duration-500 font-sans">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0EA5E9] to-[#BAE6FD] dark:from-[#020617] dark:to-[#312E81] transition-colors duration-500 -z-50"></div>

            <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-10 left-0 w-[200%] h-full animate-float-clouds dark:hidden opacity-80">
                    <div className="w-1/2 h-full absolute top-0 left-0 bg-[url('/nubeslight.svg')] bg-repeat-x bg-contain"></div>
                    <div className="w-1/2 h-full absolute top-0 left-1/2 bg-[url('/nubeslight.svg')] bg-repeat-x bg-contain"></div>
                </div>
                <div className="absolute top-10 left-0 w-[200%] h-full animate-float-clouds hidden dark:block opacity-60">
                    <div className="w-1/2 h-full absolute top-0 left-0 bg-[url('/nubesdark.svg')] bg-repeat-x bg-contain"></div>
                    <div className="w-1/2 h-full absolute top-0 left-1/2 bg-[url('/nubesdark.svg')] bg-repeat-x bg-contain"></div>
                </div>
            </div>

            <div
                className="absolute bottom-[10%] md:bottom-[15%] lg:bottom-[20%] xl:bottom-[25%] right-0 z-10 w-full max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl transition-all duration-500 cursor-pointer hover:scale-105"
                onClick={() => gameStarted && handleObjectClick(STEPS[STEPS.length - 1])}
            >
                <img
                    src="/fullcastle.svg"
                    alt="Castle"
                    className="w-full h-auto object-bottom dark:brightness-75 transition-[filter] duration-500"
                />
            </div>

            <div className="absolute bottom-0 left-0 w-full z-20">
                <img
                    src="/BACKGROUND.svg"
                    alt="Ground"
                    className="w-full h-auto object-cover min-h-[100px]"
                />
            </div>

            {gameStarted && (
                <div className="absolute bottom-[15%] md:bottom-[20%] lg:bottom-[25%] left-0 w-full h-32 z-30 px-10">
                    {STEPS.filter(s => s.type === 'widget').map((step) => (
                        <div
                            key={step.id}
                            className={`absolute bottom-0 transform -translate-x-1/2 transition-all duration-300 cursor-pointer hover:scale-125 hover:-translate-y-2 ${completedSteps.includes(step.id) ? 'opacity-50 grayscale' : 'animate-bounce-slow'
                                }`}
                            style={{ left: `${step.position}%` }}
                            onClick={() => handleObjectClick(step)}
                        >
                            {step.icon}
                            {completedSteps.includes(step.id) && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-green-500 font-bold text-xl">✓</div>
                            )}
                        </div>
                    ))}

                    <div
                        className="absolute bottom-0 transform -translate-x-1/2 transition-all duration-1000 ease-in-out z-40"
                        style={{ left: `${wizardPosition}%` }}
                    >
                        <img
                            src={isSpanishWizard ? "/spanishwizard.svg" : "/mimagocutre.svg"}
                            alt="Wizard"
                            className="h-24 md:h-32 w-auto drop-shadow-2xl"
                        />
                        {wizardPosition === 5 && (
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap animate-pulse">
                                Click an item to start!
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!gameStarted && (
                <div className="relative z-50 w-full h-full flex flex-col items-center justify-start pt-20 px-4">
                    <div className="bg-white/80 dark:bg-black/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 max-w-2xl text-center animate-in fade-in zoom-in duration-500">
                        <h1 className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-300 dark:to-orange-500 drop-shadow-sm">
                            Reino de la música
                        </h1>
                        <p className="text-xl text-gray-700 dark:text-gray-200 mb-8 font-medium">
                            Crea tu playlist a través de tu camino musical.
                        </p>

                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/dashboard"
                                className="px-8 py-4 bg-green-500 hover:bg-green-600 text-black font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-green-500/30 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Dashboard
                            </Link>
                            <button
                                onClick={() => setGameStarted(true)}
                                className="px-8 py-4 bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 text-black dark:text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg border border-gray-200 dark:border-white/10"
                            >
                                Start Quest
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <GameModal
                isOpen={!!activeStep}
                onClose={() => setActiveStep(null)}
                title={activeStep?.title}
            >
                {activeStep?.id === 'artist' && (
                    <ArtistWidget
                        isGameMode={true}
                        selectedArtists={playlistData.artists}
                        onArtistSelect={(data) => handleWidgetComplete('artists', data)}
                    />
                )}
                {activeStep?.id === 'genre' && (
                    <GenreWidget
                        isGameMode={true}
                        selectedGenres={playlistData.genres}
                        onGenreSelect={(data) => handleWidgetComplete('genres', data)}
                    />
                )}
                {activeStep?.id === 'mood' && (
                    <MoodWidget
                        isGameMode={true}
                        selectedMood={playlistData.mood}
                        onMoodSelect={(data) => handleWidgetComplete('mood', data)}
                    />
                )}
                {activeStep?.id === 'results' && (
                    <div className="p-4">
                        {isGenerating ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                                <p className="text-gray-500 font-medium">Brewing your musical potion...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Found {generatedTracks.length} magical tracks for you!
                                    </p>
                                    <button
                                        onClick={handleSaveToHistory}
                                        disabled={isSaved}
                                        className={`text-sm font-bold px-4 py-2 rounded-full transition-all ${isSaved
                                            ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                                            : 'bg-green-500 text-black hover:bg-green-600 hover:scale-105'
                                            }`}
                                    >
                                        {isSaved ? 'Saved! Redirecting...' : 'Save to History'}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {generatedTracks.map((track, i) => (
                                        <div key={track.id + i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                            <img
                                                src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
                                                alt={track.name}
                                                className="w-10 h-10 rounded-md shadow-sm"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm truncate text-gray-900 dark:text-white">{track.name}</h4>
                                                <p className="text-xs text-gray-500 truncate">{track.artists?.map(a => a.name).join(', ')}</p>
                                            </div>
                                            {track.preview_url && (
                                                <a
                                                    href={track.preview_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                                                    title="Play Preview"
                                                >
                                                    ▶
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </GameModal>

            {gameStarted && (
                <button
                    onClick={() => setIsSpanishWizard(!isSpanishWizard)}
                    className="absolute top-4 right-4 z-50 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full transition-all shadow-lg border border-white/30"
                    title="Toggle Wizard Skin"
                >
                    <span className="text-xl">🇪🇸</span>
                </button>
            )}
        </main>
    );
}
