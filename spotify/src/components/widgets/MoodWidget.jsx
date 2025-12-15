'use client';

import { useState } from 'react';

const MOODS = [
    {
        label: 'Happy',
        value: 'happy',
        icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
        label: 'Sad',
        value: 'sad',
        icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
        label: 'Energetic',
        value: 'energetic',
        icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    {
        label: 'Calm',
        value: 'calm',
        icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    },
    {
        label: 'Romantic',
        value: 'romantic',
        icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
    },
    {
        label: 'Focus',
        value: 'focus',
        icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
    },
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
                className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 hover:border-yellow-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] hover:-translate-y-1 cursor-pointer h-full flex flex-col justify-between group"
            >
                <div>
                    <h3 className="text-lg font-bold mb-1 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                        <span className="p-2 rounded-xl bg-yellow-500/10 text-yellow-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                            </svg>
                        </span>
                        Mood
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 pl-1">Vibe check</p>
                </div>

                <div className="flex items-center gap-3 mt-4">
                    <span className="text-4xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{currentMood.icon}</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{currentMood.label}</span>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-sm shadow-2xl border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                            <h3 className="text-lg font-bold">Select Mood</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <MoodSelectionContent
                            selectedMood={selectedMood}
                            onMoodSelect={onMoodSelect}
                            isGameMode={isGameMode}
                            setIsOpen={setIsOpen}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
