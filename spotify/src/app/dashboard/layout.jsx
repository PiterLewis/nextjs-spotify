'use client';

import Header from '@/components/Header';

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-black dark:text-white selection:bg-green-500 selection:text-black transition-colors duration-300">
            <Header />
            {children}
        </div>
    );
}
