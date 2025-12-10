'use client';

import { useState } from 'react';

const DECADES = [
    { label: 'All Time', value: 'all' },
    { label: '2020s', value: '2020' },
    { label: '2010s', value: '2010' },
    { label: '2000s', value: '2000' },
    { label: '1990s', value: '1990' },
    { label: '1980s', value: '1980' },
    { label: '1970s', value: '1970' },
    { label: '1960s', value: '1960' },
];

export default function DecadeWidget({ selectedDecade, onDecadeSelect }) {
    const [isOpen, setIsOpen] = useState(false);

    const currentLabel = DECADES.find(d => d.value === selectedDecade)?.label || 'All Time';

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white dark:bg-white/5 backdrop-blur-lg rounded-2xl p-5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <span>📅</span> Decade
                </h3>
                <div className="h-12 bg-gray-100 dark:bg-black/40 rounded-lg flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-300">
                    {currentLabel}
                </div>
            </div>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-white/10 z-20 overflow-hidden max-h-60 overflow-y-auto">
                        {DECADES.map(decade => (
                            <button
                                key={decade.value}
                                onClick={() => {
                                    onDecadeSelect(decade.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-white/10 ${selectedDecade === decade.value
                                        ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300'
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {decade.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
