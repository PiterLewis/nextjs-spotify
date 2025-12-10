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

export default function MoodWidget({ selectedMood, onMoodSelect }) {
    const [isOpen, setIsOpen] = useState(false);

    const currentMood = MOODS.find(m => m.value === selectedMood) || MOODS[0];

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white dark:bg-white/5 backdrop-blur-lg rounded-2xl p-5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <span>{currentMood.icon}</span> Mood
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
                        {MOODS.map(mood => (
                            <button
                                key={mood.value}
                                onClick={() => {
                                    onMoodSelect(mood.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-white/10 flex items-center gap-2 ${selectedMood === mood.value
                                        ? 'bg-yellow-50 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-300'
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <span>{mood.icon}</span>
                                {mood.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
