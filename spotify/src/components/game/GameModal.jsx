'use client';

export default function GameModal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 relative overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar bg-white dark:bg-gray-900">
                    {children}
                </div>
            </div>
        </div>
    );
}
