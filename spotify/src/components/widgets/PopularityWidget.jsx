'use client';

import { useState } from 'react';

const POPULARITY_LEVELS = [
    { label: 'Mainstream', value: 'mainstream', icon: '🔥', range: [80, 100] },
    { label: 'Popular', value: 'popular', icon: '⭐', range: [50, 80] },
    { label: 'Underground', value: 'underground', icon: '💎', range: [0, 50] },
];

export default function PopularityWidget({ selectedPopularity, onPopularitySelect }) {
    const [isOpen, setIsOpen] = useState(false);

    const currentLevel = POPULARITY_LEVELS.find(p => p.value === selectedPopularity) || POPULARITY_LEVELS[0];

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white dark:bg-white/5 backdrop-blur-lg rounded-2xl p-5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <span>📊</span> Popularity
                </h3>
                <div className="h-12 bg-gray-100 dark:bg-black/40 rounded-lg flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-300">
                    {currentLevel.label}
                </div>
            </div>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-white/10 z-20 overflow-hidden">
                        {POPULARITY_LEVELS.map(level => (
                            <button
                                key={level.value}
                                onClick={() => {
                                    onPopularitySelect(level.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-white/10 flex items-center gap-2 ${selectedPopularity === level.value
                                        ? 'bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-300'
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <span>{level.icon}</span>
                                {level.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
