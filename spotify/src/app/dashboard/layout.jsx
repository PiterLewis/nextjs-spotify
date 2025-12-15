'use client';

import Header from '@/components/Header';

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white selection:bg-green-500 selection:text-black transition-colors duration-300 relative overflow-x-hidden">
            <Header />
            {children}
        </div>
    );
}
