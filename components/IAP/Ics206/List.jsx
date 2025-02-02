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
import MedicalAidStations from './MedicalAidStations';
import axios from 'axios';

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
    const [medicalAidStationsData, setMedicalAidStationsData] = useState([]);
    const [transportationsData, setTransportationsData] = useState([]);
    const [hospitalsData, setHospitalsData] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc'
    });

    const routeUrl = "ics-206/main";
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

    const approval = async () => {
        try {
            const data = await fetchData('ics-206/approval');
            setApprovalData(data);
        } catch (error) {
            console.error('Error fetching approval data:', error);
        }
    }

    const medicalAidStations = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/ics-206/medical-aid-station/read/');
            setMedicalAidStationsData(response.data);
        } catch (error) {
            console.error('Error fetching operation section chief data:', error);
        }
    };

    const transportations = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/ics-206/transportation/read/');
            setTransportationsData(response.data);
            console.log("Transportation Data:", response.data);
        } catch (error) {
            console.error('Error fetching operation section chief data:', error);
        }
    };

    const hospitals = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/ics-206/hospitals/read/');
            setHospitalsData(response.data);
        } catch (error) {
            console.error('Error fetching operation section chief data:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const isApproved = (itemId) => {
        const approval = approvalData.find(
            (approval) => approval.ics_206_id === itemId
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

            const medicalAidStationsName = medicalAidStationsData.find(
                (medical) => String(medical.ics_206_id) === String(item.id)
            )?.name || "Unknown Medical Aid Stations";

            const tranportationName = transportationsData.find(
                (transportation) => String(transportation.ics_206_id) === String(item.id)
            )?.ambulance_service || "Unknown Transportation";

            const hospitalName = hospitalsData.find(
                (hospital) => String(hospital.ics_206_id) === String(item.id)
            )?.name || "Unknown Hospital";

            // Buat object baru yang berisi nilai yang akan diurutkan
            return {
                ...item,
                incident_name: incidentName,
                operational_period_range: operationalPeriod
                    ? `${operationalPeriod.date_from} - ${operationalPeriod.date_to}`
                    : "Unknown Operational Period",
                medical_aid_station_name: medicalAidStationsName,
                transportation_name: tranportationName,
                hospital_name: hospitalName
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

                switch (sortConfig.key) {
                    case 'approved':
                        valueA = isApproved(a.id);
                        valueB = isApproved(b.id);
                        break;
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
    }, [data, sortConfig, incidentData, operationalPeriodData, approvalData, medicalAidStationsData, transportationsData, hospitalsData]);


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
        approval();
        incident();
        operationalPeriod();
        transportations();
        medicalAidStations();
        hospitals();
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
        <FormContainer title="ICS 206 - Medical Plan List">
            <div className="flex flex-row justify-between items-center mb-4">
                <InputButton
                    href="/dashboard/iap/ics-206/input"
                    text="Input ICS 206"
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

                            const medicalAidStationsName = medicalAidStationsData.find(
                                (medical) => String(medical.ics_206_id) === String(item.id)
                            )?.name || "Unknown Medical Aid Stations";

                            const tranportationName = transportationsData.find(
                                (transportation) => String(transportation.ics_206_id) === String(item.id)
                            )?.ambulance_service || "Unknown Transportation";

                            const hospitalName = hospitalsData.find(
                                (hospital) => String(hospital.ics_206_id) === String(item.id)
                            )?.name || "Unknown Hospital";

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
                                        {medicalAidStationsName}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {tranportationName}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {hospitalName}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {item.special_medical_procedures}
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
                                            <ButtonPreview href={`/dashboard/iap/ics-206/preview/${item.id}`} />
                                        ) : (
                                            <ButtonDetail href={`/dashboard/iap/ics-206/detail/${item.id}`} />
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
