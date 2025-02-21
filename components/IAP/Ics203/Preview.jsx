'use client';

import axios from 'axios';
import dayjs from 'dayjs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import TableHead from '@mui/material/TableHead';
import FormContainer from '@/components/FormContainer';
import useFetchDynamicOptions from '@/components/ImtRoster/useFetchDynamicOptions';
import { MainSection, PlanningSection, LogisticSection, FinanceSection, OperationSectionList } from '@/components/ImtRoster/inputFields';
import { fetchData, readBy, readById } from '@/utils/api';

dayjs.extend(customParseFormat);


export default function Preview({
    initialData = {},
}) {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const { dynamicOptions } = useFetchDynamicOptions();
    const [formData, setFormData] = useState({
        operational_period_id: null,
        incident_commander_id: null,
        deputy_incident_commander_id: null,
        safety_officer_id: null,
        public_information_officer_id: null,
        liaison_officer_id: null,
        legal_officer_id: null,
        human_capital_officer_id: null,
        operation_section_chief_id: null,
        planning_section_chief_id: null,
        situation_unit_leader_id: null,
        resources_unit_leader_id: null,
        documentation_unit_leader_id: null,
        demobilization_unit_leader_id: null,
        environmental_unit_leader_id: null,
        technical_specialist_id: null,
        logistic_section_chief_id: null,
        communication_unit_leader_id: null,
        medical_unit_leader_id: null,
        food_unit_leader_id: null,
        facility_unit_leader_id: null,
        supply_unit_leader_id: null,
        transportation_unit_leader_id: null,
        finance_section_chief_id: null,
        procurement_unit_leader_id: null,
        compensation_claim_unit_leader_id: null,
        cost_unit_leader_id: null,
        time_unit_leader_id: null,
        is_prepared: false,
        resources_unit_leader_id: null,
        date_prepared: "",
        time_prepared: "",
    });
    const [incidentData, setIncidentData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [RULeaderData, setRULeaderData] = useState([]);
    const [preparationData, setPreparationData] = useState({
        is_prepared: false,
        date_prepared: dayjs().format('YYYY-MM-DD'),
        time_prepared: dayjs().format('HH:mm'),
    });
    const [preparationID, setPreparationID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;

    // routeUrl yang merepresentasikan endpoint ICS-203 main
    const routeUrl = "ics-203/main";

    // -------------------------------------------------------------------------
    // Gunakan helper readById, fetchData, readByIcs203Id di dalam useEffect
    // -------------------------------------------------------------------------
    useEffect(() => {
        const fetchIcs203Data = async () => {
            setLoading(true);
            setError(null);

            try {
                // Ambil detail ICS 202 (main data) - pakai readById
                const mainData = await readById({ routeUrl, id });
                setFormData(mainData);

                // Simpan ID operational period untuk pemakaian berikutnya
                const operationalPeriodId = mainData.operational_period_id;

                // Ambil semua data operational period - pakai fetchData
                const allOperationalPeriods = await fetchData('operational-period');
                setOperationalPeriodData(allOperationalPeriods);

                // Cari operational period yang sesuai
                const selectedOperationalPeriod = allOperationalPeriods.find(
                    (period) => period.id === operationalPeriodId
                );
                if (selectedOperationalPeriod) {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        incident_id: selectedOperationalPeriod.incident_id,
                    }));
                }

                // Kalau ada id, baru fetch preparation data - pakai readBy
                if (id) {
                    const prepResponse = await readBy({
                        routeUrl: 'ics-203/preparation/read-by-ics-203-id',
                        id
                    });
                    if (prepResponse && prepResponse.length > 0) {
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            is_prepared: prepResponse[0].is_prepared,
                            resources_unit_leader_id: prepResponse[0].resources_unit_leader_id,
                            date_prepared: prepResponse[0].date_prepared,
                            time_prepared: prepResponse[0].time_prepared
                        }));
                        setPreparationID(prepResponse[0].id);
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchIcs203Data();
    }, [id, routeUrl]);

    // -------------------------------------------------------------------------
    // Fetch data Incident & Resources Unit Leader
    // -------------------------------------------------------------------------

    // Fetch preparation data
    useEffect(() => {
        const fetchPreparationData = async () => {
            try {
                const response = await readBy({
                    routeUrl: 'ics-203/preparation/read-by-ics-203-id',
                    id
                })
                if (response && response.length > 0) {
                    setPreparationData(response);
                }
            } catch (error) {
                console.error('Error fetching preparation data:', error);
            }
        };

        fetchPreparationData();
    }, [id]);

    const fetchIncidentData = async () => {
        try {
            const response = await fetchData('incident-data');
            setIncidentData(response);
        } catch (error) {
            console.error('Error fetching incident data:', error);
            setError('Failed to fetch incident data');
        }
    };

    useEffect(() => {
        fetchIncidentData();
    }, []);

    const fetchRULeader = async () => {
        try {
            const response = await fetchData('planning-section/resources-unit-leader');
            setRULeaderData(response);
            console.log("Resources Unit Leader Data:", response);
        } catch (error) {
            console.error('Error fetching Resources Unit Leader data:', error);
            setError('Failed to fetch Resources Unit Leader data');
        }
    };

    useEffect(() => {
        fetchRULeader();
    }, []);


    const isPrepared = preparationData.length > 0 ? preparationData[0].is_prepared : false;
    const preparedDate = preparationData.length > 0 ? preparationData[0].date_prepared : null;
    const preparedTime = preparationData.length > 0 ? preparationData[0].time_prepared : null;

    const incidentDetails = incidentData.find(
        (incident) => incident.id === formData.incident_id
    );

    const selectedOperationalPeriod = operationalPeriodData.find(
        (period) => period.id === formData.operational_period_id
    );

    const handleExportButtonClick = async () => {
        try {
            const response = await axios.post(
                `${apiUrl}ics-203/export-docx/${id}`,
                {},
                {
                    responseType: 'blob', // Penting untuk menangani file biner
                }
            );

            // Buat URL objek dari blob
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Buat elemen <a> untuk memicu unduhan
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ics_203_${id}.docx`); // Nama file yang akan diunduh
            document.body.appendChild(link);
            link.click();

            // Hapus elemen <a> setelah unduhan selesai
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error exporting document:', error);
        }
    };

    const findIdByName = (name, options = []) => {
        if (!Array.isArray(options)) {
            return "";
        }
        const foundOption = options.find(option => option.name === name);
        return foundOption ? foundOption.id : "";
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    // if (!data) return <p>No data found</p>;

    return (
        <div>
            <FormContainer title="ICS 203 - Organization Assignment Preview">
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-[#FF700A] hover:bg-[#FFA05C] text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2"
                        onClick={handleExportButtonClick}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Export to Word
                    </button>
                </div>
                {/* Header Section */}
                <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                    <TableBody>
                        <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                            <TableCell sx={{ padding: '1rem' }}>
                                <strong>1. Incident Name:</strong>
                                <div
                                    className="border border-gray-300"
                                    style={{ height: '70px', marginTop: '10px', padding: '1rem' }}
                                >
                                    {incidentDetails?.name || 'Unknown Incident'}
                                </div>
                            </TableCell>
                            <TableCell sx={{ padding: '1rem' }}>
                                <strong>2. Operational Period:</strong>
                                <br />
                                {selectedOperationalPeriod ? (
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '70px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        <span className="mr-4">Date From: {selectedOperationalPeriod.date_from}</span>
                                        <span className="mr-4">Date To: {selectedOperationalPeriod.date_to}</span>
                                        <br />
                                        <span className="mr-4">Time From: {selectedOperationalPeriod.time_from}</span>
                                        <span>Time To: {selectedOperationalPeriod.time_to}</span>
                                    </div>
                                ) : (
                                    'Unknown Operational Period'
                                )}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Incident Commander and Command Staff */}
                <Table sx={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>3. Incident Commander(s) and Command Staff</TableCell>
                        </TableRow>
                    </TableHead>
                    {MainSection.map((section, index) => (
                        <TableBody key={section.id || index}>
                            <TableRow key={section.id || index}>
                                <TableCell sx={{ minWidth: '250px', maxWidth: '300px', fontWeight: 'bold', padding: '12px', paddingLeft: '30px' }}>
                                    {section.label}
                                </TableCell>
                                <TableCell sx={{ minWidth: '300px', maxWidth: '600px', padding: '12px' }}>
                                    {(dynamicOptions[section.name] || []).find((option) =>
                                        option.id === formData[section.name])?.name || "N/A"}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ))}
                </Table>

                {/* Operations Section */}
                <Table sx={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>4. Operations Section</TableCell>
                        </TableRow>
                    </TableHead>
                    {OperationSectionList.map((section, index) => (
                        <TableBody key={section.id || index}>
                            <TableRow key={section.id || index}>
                                <TableCell sx={{ minWidth: '250px', maxWidth: '300px', fontWeight: 'bold', padding: '12px', paddingLeft: '30px' }}>
                                    {section.label}
                                </TableCell>
                                <TableCell sx={{ minWidth: '300px', maxWidth: '600px', padding: '12px' }}>
                                    {(dynamicOptions[section.name] || []).find((option) =>
                                        option.id === formData[section.name])?.name || "N/A"}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ))}
                </Table>

                {/* Planning Section */}
                <Table sx={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>5. Planning Section</TableCell>
                        </TableRow>
                    </TableHead>
                    {PlanningSection.map((section, index) => (
                        <TableBody key={section.id || index}>
                            <TableRow key={section.id || index}>
                                <TableCell sx={{ minWidth: '250px', maxWidth: '300px', fontWeight: 'bold', padding: '12px', paddingLeft: '30px' }}>
                                    {section.label}
                                </TableCell>
                                <TableCell sx={{ minWidth: '300px', maxWidth: '600px', padding: '12px' }}>
                                    {(dynamicOptions[section.name] || []).find((option) =>
                                        option.id === formData[section.name])?.name || "N/A"}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ))}
                </Table>

                {/* Logistics Section */}
                <Table sx={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>6. Logistics Section</TableCell>
                        </TableRow>
                    </TableHead>
                    {LogisticSection.map((section, index) => (
                        <TableBody key={section.id || index}>
                            <TableRow key={section.id || index}>
                                <TableCell sx={{ minWidth: '250px', maxWidth: '300px', fontWeight: 'bold', padding: '12px', paddingLeft: '30px' }}>
                                    {section.label}
                                </TableCell>
                                <TableCell sx={{ minWidth: '300px', maxWidth: '600px', padding: '12px' }}>
                                    {(dynamicOptions[section.name] || []).find((option) =>
                                        option.id === formData[section.name])?.name || "N/A"}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ))}
                </Table>

                {/* Finance Section */}
                <Table sx={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>7. Finance Section</TableCell>
                        </TableRow>
                    </TableHead>
                    {FinanceSection.map((section, index) => (
                        <TableBody key={section.id || index}>
                            <TableRow key={section.id || index}>
                                <TableCell sx={{ minWidth: '250px', maxWidth: '300px', fontWeight: 'bold', padding: '12px', paddingLeft: '30px' }}>
                                    {section.label}
                                </TableCell>
                                <TableCell sx={{ minWidth: '300px', maxWidth: '600px', padding: '12px' }}>
                                    {(dynamicOptions[section.name] || []).find((option) =>
                                        option.id === formData[section.name])?.name || "N/A"}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ))}
                </Table>

                {/* Prepared By */}
                <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                    <TableBody>
                        <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                            <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                <strong>8. Prepared by:</strong>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div style={{ marginLeft: '5rem' }}>
                                        {RULeaderData.find((RULeader) => RULeader.id === preparationID)?.name || "N/A"}
                                    </div>
                                    <div style={{ marginLeft: '5rem' }}>
                                        Position: Resources Unit Leader
                                    </div>
                                    <div style={{ marginLeft: '5rem' }}>
                                        Signature: {isPrepared ? '✓' : '✗'}
                                    </div>
                                    <div style={{ marginLeft: '5rem' }}>
                                        Prepared Date: {preparedDate}
                                    </div>
                                    <div style={{ marginLeft: '5rem' }}>
                                        Prepared Time: {preparedTime}
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </FormContainer>
        </div>
    );
}