export default function Loading() {
    return (
        <div className="fixed inset-0 bg-[#000000] z-[9999] flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1DB954]/10 rounded-full blur-[120px] animate-pulse-slow"></div>

            <div className="relative z-10 flex flex-col items-center gap-8">

                <div className="relative">
                    <div className="absolute inset-0 bg-green-500/30 blur-2xl rounded-full animate-pulse"></div>
                    <div className="w-24 h-24 bg-[#121212] rounded-full flex items-center justify-center border border-white/10 relative z-10 shadow-2xl">
                        <svg className="w-12 h-12 text-[#1DB954] animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>

                    <div className="absolute inset-0 animate-spin-reverse-slow">
                        <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-white tracking-tight animate-pulse">
                        Loading Experience
                    </h2>
                    <p className="text-gray-400 text-sm tracking-widest uppercase">
                        Preparing your stage...
                    </p>
                </div>

                <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-gradient-to-r from-[#1DB954] to-emerald-400 w-1/2 animate-shimmer-slide rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
