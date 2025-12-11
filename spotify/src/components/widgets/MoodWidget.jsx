'use client';

import { useState } from 'react';

const MOODS = [
    { label: 'Happy', value: 'happy', icon: '😊' },
    { label: 'Sad', value: 'sad', icon: '😢' },
    { label: 'Energetic', value: 'energetic', icon: '⚡' },
    { label: 'Calm', value: 'calm', icon: '😌' },
    { label: 'Romantic', value: 'romantic', icon: '❤️' },
    { label: 'Focus', value: 'focus', icon: '🧠' },
];

function MoodSelectionContent({ selectedMood, onMoodSelect, isGameMode, setIsOpen }) {
    return (
        <div className="grid grid-cols-2 gap-3 p-4">
            {MOODS.map(mood => (
                <button
                    key={mood.value}
                    onClick={() => {
                        onMoodSelect(mood.value);
                        if (!isGameMode && setIsOpen) setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm font-medium transition-all rounded-xl flex items-center gap-2 ${selectedMood === mood.value
                        ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/25 scale-105'
                        : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
                        }`}
                >
                    <span className="text-2xl">{mood.icon}</span>
                    <span className="font-bold">{mood.label}</span>
                </button>
            ))}
        </div>
    );
}

export default function MoodWidget({ selectedMood, onMoodSelect, isGameMode = false }) {
    const [isOpen, setIsOpen] = useState(false);

    const currentMood = MOODS.find(m => m.value === selectedMood) || MOODS[0];

    if (isGameMode) {
        return (
            <MoodSelectionContent
                selectedMood={selectedMood}
                onMoodSelect={onMoodSelect}
                isGameMode={isGameMode}
                setIsOpen={null}
            />
        );
    }

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white dark:bg-white/5 backdrop-blur-lg rounded-2xl p-5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
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
                    Mood
                </h3>
                <div className="h-12 bg-gray-100 dark:bg-black/40 rounded-lg flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-300">
                    {currentMood.label}
                </div>
            </div>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-white/10 z-20 overflow-hidden">
                        <MoodSelectionContent
                            selectedMood={selectedMood}
                            onMoodSelect={onMoodSelect}
                            isGameMode={isGameMode}
                            setIsOpen={setIsOpen}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
