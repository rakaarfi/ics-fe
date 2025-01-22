'use client'

import React, { useEffect, useState } from 'react'
import FormContainer from '../FormContainer'
import { ButtonDelete, ButtonDetail, InputButton } from '../ButtonComponents'
import { SearchQuery } from '../SearchQuery'
import Pagination from '../Pagination'
import { useSearchParams } from 'next/navigation'
import TableHeader from './TableHeader'
import { fetchData, fetchPaginatedData, handleDelete } from '@/utils/api'

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
    const [incidentData, setIncidentData] = useState([]);

    const routeUrl = "ics-201/main";
    const responseKey = "read-paginated";

    const incident = async () => {
        try {
            const data = await fetchData('incident-data');
            setIncidentData(data);
        } catch (error) {
            console.error('Error fetching incident data:', error);
        }
    };

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
        incident();
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
        <FormContainer title="List ICS 201 Incident Briefing">
            <div className="flex flex-row justify-between items-center mb-4">
                <InputButton
                    href="/dashboard/ics-201/input"
                    text="Input Incident Briefing"
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
                        {data.map((item, index) => {
                            const incidentName = incidentData.find(
                                (incident) => String(incident.id) === String(item.incident_id)
                            )?.name || "Unknown Incident";
                            return (
                                <tr key={item.id}>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {index + 1 + (currentPage - 1) * 10}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {incidentName}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {item.date_initiated}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {item.time_initiated}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {item.map_sketch}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {item.situation_summary}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {item.objectives}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-4">
                                        <ButtonDetail href={`/dashboard/ics-201/detail/${item.id}`} />
                                    </td>
                                    <td className="border border-gray-300 px-4 py-4">
                                        <ButtonDelete
                                            onClick={() => handleDelete(item.id, routeUrl)}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
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
