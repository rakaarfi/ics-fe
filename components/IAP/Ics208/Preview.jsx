'use client';

import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import FormContainer from '@/components/FormContainer';
import { readBy } from '@/utils/api';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);


export default function Preview({
}) {
    const { id } = useParams();
    const [formData, setFormData] = useState({});
    const [selectedOperationalPeriod, setSelectedOperationalPeriod] = useState(null)
    const [incidentDetails, setIncidentDetails] = useState(null);
    const [safetyOfficerData, setSafetyOfficerData] = useState([]);
    const [preparationData, setPreparationData] = useState({
        is_prepared: false,
        date_prepared: dayjs().format('YYYY-MM-DD'),
        time_prepared: dayjs().format('HH:mm'),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;

    // -------------------------------------------------------------------------
    // Gunakan helper fetchData, readBy di dalam useEffect
    // -------------------------------------------------------------------------
    useEffect(() => {
        const fetchIcs208Data = async () => {
            setLoading(true);
            setError(null);

            try {
                // Ambil detail ICS 208 (main data) - pakai readBy
                const mainData = await readBy({ routeUrl: "ics-208/main/read", id });
                setFormData(mainData);

                if (mainData.site_safety_plan) {
                    const fileData = await fetchFileData(mainData.site_safety_plan);
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        site_safety_plan: fileData
                    }))
                }

                // Fetch additional data in parallel
                const [operationalPeriodResponse, preparationResponse] = await Promise.all([
                    readBy({ routeUrl: "operational-period/read", id: mainData.operational_period_id }),
                    readBy({ routeUrl: "ics-208/preparation/read-by-ics-208-id", id }),
                ])

                // Extracting data
                const preparationData = preparationResponse.length > 0 ? preparationResponse[0] : null;
                setPreparationData(preparationResponse);
                setSelectedOperationalPeriod(operationalPeriodResponse);

                // Find associated incident_id from operational period
                const incidentId = operationalPeriodResponse ? operationalPeriodResponse.incident_id : null;

                // Update FormData with fetched data
                setFormData(prevFormData => ({
                    ...prevFormData,
                    ...mainData, // Spread all main data fields
                    incident_id: incidentId,
                    ...(preparationData && preparationData[0]), // Spread all preparation data fields
                }));
            } catch (error) {
                console.error('Error fetching ICS 208 data:', error);
                setError('Failed to fetch ICS 208 data');
            } finally {
                setLoading(false);
            }
        };

        fetchIcs208Data();
    }, [id]);

    // -------------------------------------------------------------------------
    // Fetch data
    // -------------------------------------------------------------------------
    const fetchIncidentById = async (incidentId) => {
        try {
            const response = await readBy({
                routeUrl: 'incident-data/read',
                id: incidentId
            });
            setIncidentDetails(response);
        } catch (error) {
            setError('Failed to fetch incident data');
        }
    };

    useEffect(() => {
        if (formData.incident_id) {
            fetchIncidentById(formData.incident_id);
        }
    }, [formData.incident_id]);

    const fetchSafetyOfficer = async (SafetyOfficerId) => {
        try {
            const response = await readBy({ routeUrl: "main-section/safety-officer/read", id: SafetyOfficerId });
            setSafetyOfficerData(response);
        } catch (error) {
            console.error('Error fetching Safety Officer data:', error);
            setError('Failed to fetch Safety Officer data');
        }
    };

    useEffect(() => {
        if (preparationData.length > 0 && preparationData[0].safety_officer_id) {
            fetchSafetyOfficer(preparationData[0].safety_officer_id);
        }
    }, [preparationData]);

    const fetchFileData = async (filename) => {
        if (filename) {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/file/get/${filename}`, {
                    responseType: 'blob',
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                }
                );
                return filename;
            } catch (error) {
                console.error('Error fetching map sketch:', error);
                return null;
            }
        }
        return null;
    };

    const isPrepared = preparationData.length > 0 ? preparationData[0].is_prepared : false;
    const preparedDate = preparationData.length > 0 ? preparationData[0].date_prepared : null;
    const preparedTime = preparationData.length > 0 ? preparationData[0].time_prepared : null;

    // -------------------------------------------------------------------------
    // Handle export button click
    // -------------------------------------------------------------------------
    const handleExportButtonClick = async () => {
        try {
            const response = await axios.post(
                `${apiUrl}ics-208/export-docx/${id}`,
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
            link.setAttribute('download', `ics_208_${id}.docx`); // Nama file yang akan diunduh
            document.body.appendChild(link);
            link.click();

            // Hapus elemen <a> setelah unduhan selesai
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error exporting document:', error);
        }
    };

    // -------------------------------------------------------------------------
    // Handle preview button click
    // -------------------------------------------------------------------------
    const handlePreviewButtonClick = async (filename) => {
        try {
            const response = await axios.get(
                `${apiUrl}file/get/${filename}`,
                { responseType: 'blob' }
            );

            // Buat URL objek dari blob
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Buat elemen <a> untuk memicu unduhan
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${filename}`); // Nama file yang akan diunduh
            document.body.appendChild(link);
            link.click();

            // Hapus elemen <a> setelah unduhan selesai
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error exporting document:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    // if (!data) return <p>No data found</p>;

    return (
        <div>
            <FormContainer
                title="ICS 208 - Safety Message/Plan Preview"
                className="max-w-2xl mx-auto p-4 mb-8 bg-white rounded shadow-lg"
            >
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

                {/* Header Section (Section 1, 2) */}
                <div className="header-section">
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
                </div>

                {/* Section 3 */}
                <div className="section-7">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>3. Safety Message/Expanded Safety Message, Safety Plan, Site Safety Plan
                                    </strong>
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert Safety Message/Expanded Safety Message, Safety Plan, Site Safety Plan here */}
                                        {formData.message}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 4 */}
                <div className="section-7">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>4. Site Safety Plan Required? {formData.is_required ? '✓' : '✗'}
                                    </strong>
                                    <br />
                                    {formData.site_safety_plan ? (
                                        <>
                                            <br />
                                            <strong>Site Safety Plan
                                            </strong>
                                            <div
                                                className="border border-gray-300 gap-2 flex flex-col"
                                                style={{ marginTop: '10px', padding: '1rem' }}
                                            >
                                                <span>File Name: {formData.site_safety_plan}</span>
                                                <button
                                                    onClick={() => handlePreviewButtonClick(formData.site_safety_plan)}
                                                    className="px-3 py-2 bg-gray-500 text-white justify-center rounded-lg flex items-center gap-2 w-[10%]"
                                                >
                                                    Download Plan
                                                </button>
                                            </div>
                                        </>
                                    ) : null}
                                    <br />
                                    <strong>Additional Message
                                    </strong>
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {formData.additional_comments}
                                    </div>
                                    <br />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 5 */}
                <div className="footer-section">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>5. Prepared by:</strong>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ marginLeft: '5rem' }}>
                                            {safetyOfficerData?.name || 'Unknown Safety Officer'}
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            Position: Safety Officer
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            Signature: {isPrepared}
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
                </div>

            </FormContainer>
        </div>
    );
}