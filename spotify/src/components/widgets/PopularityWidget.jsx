'use client';

import { useState } from 'react';

const POPULARITY_LEVELS = [
    {
        label: 'Mainstream',
        value: 'mainstream',
        icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>,
        range: [80, 100]
    },
    {
        label: 'Popular',
        value: 'popular',
        icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
        range: [50, 80]
    },
    {
        label: 'Underground',
        value: 'underground',
        icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
        range: [0, 50]
    },
];

export default function PopularityWidget({ selectedPopularity, onPopularitySelect }) {
    const [isOpen, setIsOpen] = useState(false);

    const currentLevel = POPULARITY_LEVELS.find(p => p.value === selectedPopularity) || POPULARITY_LEVELS[0];

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 hover:border-pink-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:-translate-y-1 cursor-pointer h-full flex flex-col justify-between group"
            >
                <div>
                    <h3 className="text-lg font-bold mb-1 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                        <span className="p-2 rounded-xl bg-pink-500/10 text-pink-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </span>
                        Popularity
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 pl-1">Chart status</p>
                </div>

                <div className="flex items-center gap-3 mt-4">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{currentLevel.icon}</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{currentLevel.label}</span>
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-sm shadow-2xl border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                            <h3 className="text-lg font-bold">Select Popularity</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 space-y-2">
                            {POPULARITY_LEVELS.map(level => (
                                <button
                                    key={level.value}
                                    onClick={() => {
                                        onPopularitySelect(level.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-4 py-4 text-left text-sm font-medium transition-all rounded-xl flex items-center gap-4 ${selectedPopularity === level.value
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/25 scale-105'
                                        : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    <span className="p-2 bg-white/20 rounded-full">{level.icon}</span>
                                    <span className="font-bold text-lg">{level.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
