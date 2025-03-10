"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export const SearchQuery = ({ searchQuery, setSearchQuery, placeHolder }) => {
    const [localSearch, setLocalSearch] = useState(searchQuery);
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(localSearch); // Perbarui state di parent
        const params = new URLSearchParams();
        params.set("search", localSearch);
        params.set("page", 1); // Reset ke halaman pertama saat pencarian dilakukan
        router.push(`?${params.toString()}`); // Perbarui URL tanpa reload
    };

    return (
        <form onSubmit={handleSearch} className="flex justify-center mt-4">
            <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={placeHolder}
                className="border border-gray-300 rounded px-4 py-2 w-[100%] mx-1"
            />
            <button
                type="submit"
                className="bg-[#4F4789] text-white px-4 py-2 rounded-lg mx-1"
            >
                Find
            </button>
        </form>
    );
};
