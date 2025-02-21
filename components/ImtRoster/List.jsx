'use client'

import React, { useEffect, useState } from 'react';

import Pagination from '../Pagination';
import { handleDelete } from '@/utils/api';
import { SearchQuery } from '../SearchQuery'
import { fetchPaginatedData } from '@/utils/api';
import { useSearchParams } from 'next/navigation';
import { ButtonDelete, ButtonDetail, InputButton } from '../ButtonComponents';
import FormContainer from '../FormContainer';


export default function List() {

    const searchParams = useSearchParams();
    const queryPage = searchParams.get("page") || "1";
    const querySearch = searchParams.get("search") || "";

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(Number(queryPage))
    const [totalPages, setTotalPages] = useState(0);
    const [totalData, setTotalData] = useState(0);
    const [search, setSearch] = useState(querySearch);
    const [error, setError] = useState(null);

    const routeUrl = "roster";
    const responseKey = "read-paginated";

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        fetchPaginatedData({
            routeUrl,
            responseKey,
            currentPage,
            search,
            setData,
            setCurrentPage,
            setTotalPages,
            setTotalData,
            setError,
        });
    }, [currentPage, search]);

    useEffect(() => {
        const params = new URLSearchParams();
        params.set("page", currentPage);
        if (search) {
            params.set("search", search);
        }
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newUrl);
    }, [currentPage, search]);

    return (
        <FormContainer title="IMT Roster List" error={error}>
            <div className="flex flex-row justify-between items-center mb-4">
                <InputButton
                    href="/dashboard/imt-roster/input"
                    text="Input IMT Roster"
                />
                <SearchQuery
                    searchQuery={search}
                    setSearchQuery={setSearch}
                    placeHolder={"Enter keyword..."}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-xs">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">No</th>
                            <th className="border border-gray-300 px-4 py-2">Period From</th>
                            <th className="border border-gray-300 px-4 py-2">Period To</th>
                            <th className="border border-gray-300 px-4 py-2">Remark</th>
                            <th className="border border-gray-300 px-4 py-2" colSpan={2}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.id}>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {index + 1 + (currentPage - 1) * 10}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {item.date_to}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {item.date_from}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {item.remark}
                                </td>
                                <td className="border border-gray-300 px-4 py-4 text-center">
                                    <ButtonDetail href={`/dashboard/imt-roster/detail/${item.id}`} />
                                </td>
                                <td className="border border-gray-300 px-4 py-4 text-center">
                                    <ButtonDelete onClick={() => handleDelete(item.id, routeUrl)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                searchQuery={search}
            />
        </FormContainer>
    )
}
