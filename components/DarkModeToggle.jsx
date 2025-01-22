'use client';

import { useEffect, useState } from 'react';

const DarkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Periksa mode awal dari localStorage atau sistem
        const savedMode = localStorage.getItem('theme');
        if (savedMode) {
            setIsDarkMode(savedMode === 'dark');
            document.documentElement.classList.toggle('dark', savedMode === 'dark');
        } else {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(systemPrefersDark);
            document.documentElement.classList.toggle('dark', systemPrefersDark);
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode ? 'dark' : 'light';
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('theme', newMode);
        document.documentElement.classList.toggle('dark', !isDarkMode);
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
    );
};

export default DarkModeToggle;
