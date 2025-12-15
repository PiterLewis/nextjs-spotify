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
                className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1 cursor-pointer h-full flex flex-col justify-between group"
            >
                <div>
                    <h3 className="text-lg font-bold mb-1 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                        <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                            </svg>
                        </span>
                        Decade
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 pl-1">Time travel</p>
                </div>

                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 mt-4">
                    {currentLabel}
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-sm shadow-2xl border border-gray-200 dark:border-white/10 animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                            <h3 className="text-lg font-bold">Select Decade</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {DECADES.map(decade => (
                                <button
                                    key={decade.value}
                                    onClick={() => {
                                        onDecadeSelect(decade.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-4 py-4 text-left text-sm font-medium transition-all rounded-xl flex items-center justify-between ${selectedDecade === decade.value
                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105'
                                        : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    <span className="font-bold text-lg">{decade.label}</span>
                                    {selectedDecade === decade.value && (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
