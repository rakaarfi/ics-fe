'use client'

import React, { useEffect, useState } from 'react'
import FormContainer from '../FormContainer'
import { ButtonDelete, ButtonDetail, ButtonPreview, InputButton } from '../ButtonComponents'
import { SearchQuery } from '../SearchQuery'
import Pagination from '../Pagination'
import { useSearchParams } from 'next/navigation'
import TableHeader from './TableHeader'
import { fetchData, fetchPaginatedData, handleDelete } from '@/utils/api'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);


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
    const [approvalData, setApprovalData] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });

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

    const approval = async () => {
        try {
            const data = await fetchData('ics-201/approval');
            setApprovalData(data);
            console.log("Approval Data:", data);

        } catch (error) {
            console.error('Error fetching approval data:', error);
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const isApproved = (itemId) => {
        const approval = approvalData.find(
            (approval) => approval.ics_201_id === itemId
        );
        return approval ? approval.is_approved : false;
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = React.useMemo(() => {
        let sortableData = [...data];
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                let valueA, valueB;

                switch (sortConfig.key) {
                    case 'incident':
                        valueA = incidentData.find(incident => incident.id === a.incident_id)?.name || '';
                        valueB = incidentData.find(incident => incident.id === b.incident_id)?.name || '';
                        break;
                    case 'approved':
                        valueA = isApproved(a.id);
                        valueB = isApproved(b.id);
                        break;
                    default:
                        valueA = a[sortConfig.key];
                        valueB = b[sortConfig.key];
                }

                if (valueA < valueB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (valueA > valueB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig, incidentData, approvalData]);

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
        approval();
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
        <FormContainer title="ICS 201 - Incident Briefing List">
            <div className="flex flex-row justify-between items-center mb-4">
                <InputButton
                    href="/dashboard/ics-201/input"
                    text="Input ICS 201"
                />
                <SearchQuery
                    searchQuery={search}
                    setSearchQuery={setSearch}
                    placeHolder={"Enter keyword..."}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-xs">
                    <TableHeader
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                    />
                    <tbody>
                        {sortedData.map((item, index) => {
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
                                        {item.time_initiated ? dayjs(item.time_initiated, 'HH:mm:ss').format('HH:mm') : 'N/A'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {item.situation_summary}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {item.objectives}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {isApproved(item.id) ? (
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                Approved
                                            </span>
                                        ) : (
                                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                Not Approved
                                            </span>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-4">
                                        {isApproved(item.id) ? (
                                            <ButtonPreview href={`/dashboard/ics-201/preview/${item.id}`} />
                                        ) : (
                                            <ButtonDetail href={`/dashboard/ics-201/detail/${item.id}`} />
                                        )}
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
