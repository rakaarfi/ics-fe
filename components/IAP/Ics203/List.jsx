'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchData, fetchPaginatedData, handleDelete } from '@/utils/api'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import FormContainer from '@/components/FormContainer';
import { ButtonDelete, ButtonDetail, ButtonPreview, InputButton } from '@/components/ButtonComponents';
import { SearchQuery } from '@/components/SearchQuery';
import TableHeader from './TableHeader';
import Pagination from '@/components/Pagination';

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
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [approvalData, setApprovalData] = useState([]);
    const [incidentCommanderData, setIncidentCommanderData] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });

    const routeUrl = "ics-203/main";
    const responseKey = "read-paginated";

    const incident = async () => {
        try {
            const data = await fetchData('incident-data');
            setIncidentData(data);
        } catch (error) {
            console.error('Error fetching incident data:', error);
        }
    };

    const operationalPeriod = async () => {
        try {
            const data = await fetchData('operational-period');
            setOperationalPeriodData(data);
        } catch (error) {
            console.error('Error fetching operational period data:', error);
        }
    };

    const incidentCommander = async () => {
        try {
            const data = await fetchData('main-section/incident-commander');
            setIncidentCommanderData(data);
        } catch (error) {
            console.error('Error fetching incident commander data:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const isApproved = (itemId) => {
        const approval = approvalData.find(
            (approval) => approval.ics_203_id === itemId
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
        let sortableData = data.map(item => {
            // Temukan data operational period berdasarkan operational_period_id
            const operationalPeriod = operationalPeriodData.find(
                (period) => String(period.id) === String(item.operational_period_id)
            );

            // Temukan nama incident berdasarkan incident_id dari operational period
            const incidentName = operationalPeriod
                ? incidentData.find(incident => String(incident.id) === String(operationalPeriod.incident_id))?.name || "Unknown Incident"
                : "Unknown Incident";

            // Temukan nama incident commander berdasarkan incident_commander_id
            const incidentCommanderName = incidentCommanderData.find(
                commander => String(commander.id) === String(item.incident_commander_id)
            )?.name || "Unknown Incident Commander";

            // Buat object baru yang berisi nilai yang akan diurutkan
            return {
                ...item,
                incident_name: incidentName,
                operational_period_range: operationalPeriod
                    ? `${operationalPeriod.date_from} - ${operationalPeriod.date_to}`
                    : "Unknown Operational Period",
                incident_commander_name: incidentCommanderName,
            };
        });

        // Sorting berdasarkan key yang dipilih
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                let valueA = a[sortConfig.key] || "";
                let valueB = b[sortConfig.key] || "";

                // Jika sorting berdasarkan tanggal, ubah menjadi objek DayJS
                if (sortConfig.key === "operational_period_range") {
                    valueA = operationalPeriodData.find(
                        period => period.id === a.operational_period_id
                    )?.date_from || "";

                    valueB = operationalPeriodData.find(
                        period => period.id === b.operational_period_id
                    )?.date_from || "";

                    // Gunakan dayjs untuk sorting tanggal
                    return sortConfig.direction === "asc"
                        ? dayjs(valueA).isBefore(dayjs(valueB)) ? -1 : 1
                        : dayjs(valueA).isAfter(dayjs(valueB)) ? -1 : 1;
                }

                // Sorting string
                if (typeof valueA === "string" && typeof valueB === "string") {
                    return sortConfig.direction === "asc"
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                }

                // Default sorting untuk angka
                return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
            });
        }
        return sortableData;
    }, [data, sortConfig, incidentData, approvalData, operationalPeriodData, incidentCommanderData]);


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
        incidentCommander();
        operationalPeriod();
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
        <FormContainer title="ICS 203 Organization Assignment List">
            <div className="flex flex-row justify-between items-center mb-4">
                <InputButton
                    href="/dashboard/iap/ics-203/input"
                    text="Input ICS 203"
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
                            const operationalPeriod = operationalPeriodData.find(
                                (period) => String(period.id) === String(item.operational_period_id)
                            );

                            const operationalPeriodRange = operationalPeriod
                                ? `${operationalPeriod.date_from} - ${operationalPeriod.date_to}`
                                : "Unknown Operational Period";

                            const incidentName = operationalPeriod
                                ? incidentData.find(
                                    (incident) => String(incident.id) === String(operationalPeriod.incident_id)
                                )?.name || "Unknown Incident"
                                : "Unknown Incident";

                            const incidentCommanderName = incidentCommanderData.find(
                                (commander) => String(commander.id) === String(item.incident_commander_id)
                            )?.name || "Unknown Incident Commander";
                            return (
                                <tr key={item.id}>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {index + 1 + (currentPage - 1) * 10}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {incidentName}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {operationalPeriodRange}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {incidentCommanderName}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-4">
                                        <ButtonDetail href={`/dashboard/iap/ics-203/detail/${item.id}`} />
                                    </td>
                                    <td className="border border-gray-300 px-4 py-4">
                                        <ButtonPreview href={`/dashboard/iap/ics-203/preview/${item.id}`} />
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
