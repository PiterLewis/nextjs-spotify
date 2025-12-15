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
                className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1 cursor-pointer h-full flex flex-col justify-between"
            >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8">
                        <defs>
                            <linearGradient id="clock-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#60A5FA" />
                                <stop offset="1" stopColor="#2563EB" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#clock-gradient)" fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                    </svg>
                    Decade
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
