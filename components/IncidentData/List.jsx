'use client'

import { fetchPaginatedData, handleDelete } from '@/utils/api';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { ButtonDelete, ButtonDetail, InputButton } from '../ButtonComponents';
import Pagination from '../Pagination';
import { SearchQuery } from '../SearchQuery';
import TableHeader from './TableHeader';
import FormContainer from '../FormContainer';

export default function List() {

    const searchParams = useSearchParams();
    const queryPage = searchParams.get("page") || "1";
    const querySearch = searchParams.get("search") || "";

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(Number(queryPage));
    const [totalPages, setTotalPages] = useState(0);
    const [totalData, setTotalData] = useState(0);
    const [search, setSearch] = useState(querySearch);
    const [error, setError] = useState(null);

    const routeUrl = "incident-data";
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
        <FormContainer title="Incident Data List" error={error}>
            <div className="flex flex-row justify-between items-center mb-4">
                <InputButton
                    href="/dashboard/incident-data/input"
                    text="Input Incident Data"
                />
                <SearchQuery
                    searchQuery={search}
                    setSearchQuery={setSearch}
                    placeHolder={"Enter keyword..."}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-xs">
                    <TableHeader />
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.id}>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {index + 1 + (currentPage - 1) * 10}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {item.no}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {item.name}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {item.date_incident}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {item.time_incident}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {item.timezone}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {item.location}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {item.description}
                                </td>
                                <td className="border border-gray-300 px-4 py-4">
                                    <ButtonDetail href={`/dashboard/incident-data/detail/${item.id}`} />
                                </td>
                                <td className="border border-gray-300 px-4 py-4">
                                    <ButtonDelete
                                        onClick={() => handleDelete(item.id, routeUrl)}
                                    />
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
        </FormContainer >
    )
}
