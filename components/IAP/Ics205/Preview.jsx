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
import { readBy } from '@/utils/api';

dayjs.extend(customParseFormat);


export default function Preview({
}) {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        operational_period_id: null,
        communication_unit_leader_id: null,
        special_instructions: "",
        radioChannel: [],
    });
    const [selectedOperationalPeriod, setSelectedOperationalPeriod] = useState(null)
    const [incidentDetails, setIncidentDetails] = useState(null);
    const [CULeaderData, setCULeaderData] = useState([]);
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
    // Gunakan helper readBy di dalam useEffect
    // -------------------------------------------------------------------------
    useEffect(() => {
        const fetchIcs205Data = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch main data
                const responseData = await readBy({ routeUrl: "ics-205/main/read", id });
                const mainData = responseData;

                // Fetch additional data in parallel
                const [operationalPeriodResponse, preparationResponse, radioChannelsData] = await Promise.all([
                    readBy({ routeUrl: 'operational-period/read', id: mainData.operational_period_id }),
                    readBy({ routeUrl: "ics-205/preparation/read-by-ics-205-id", id }),
                    fetchRadioChannelsData(mainData.id),
                ]);

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
                    radioChannel: radioChannelsData.length > 0 ? radioChannelsData : [
                        {
                            channel_number: "",
                            channel_name: "",
                            type_specification: "",
                            frequency: "",
                            mode: "",
                            functions: "",
                            assignment: "",
                            remarks: "",
                        },
                    ],
                    ...(preparationData && {
                        is_prepared: preparationData.is_prepared,
                        communication_unit_leader_id: preparationData.communication_unit_leader_id,
                        date_prepared: preparationData.date_prepared,
                        time_prepared: preparationData.time_prepared,
                    }),
                }));
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchIcs205Data();
        }
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

    const fetchCULeader = async (CULeaderId) => {
        try {
            const response = await readBy({
                routeUrl: 'logistic-section/communication-unit-leader/read',
                id: CULeaderId
            })
            setCULeaderData(response);
        } catch (error) {
            console.error('Error fetching Communication Unit Leader data:', error);
            setError('Failed to fetch Communication Unit Leader data');
        }
    };

    useEffect(() => {
        if (formData.communication_unit_leader_id) {
            fetchCULeader(formData.communication_unit_leader_id);
        }
    }, [formData.communication_unit_leader_id]);

    const fetchRadioChannelsData = async (ics_205_id) => {
        try {
            const response = await readBy({
                routeUrl: 'ics-205/radio-channel/read-by-ics-id',
                id: ics_205_id
            });
            return response;
        } catch (err) {
            console.error("Error fetching radio channels:", err);
            setError("Failed to fetch radio channels");
            return [];
        }
    };

    const isPrepared = preparationData.length > 0 ? preparationData[0].is_prepared : false;
    const preparedDate = preparationData.length > 0 ? preparationData[0].date_prepared : null;
    const preparedTime = preparationData.length > 0 ? preparationData[0].time_prepared : null;

    // -------------------------------------------------------------------------
    // Handler Export
    // -------------------------------------------------------------------------
    const handleExportButtonClick = async () => {
        try {
            const response = await axios.post(
                `${apiUrl}ics-205/export-docx/${id}`,
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
            link.setAttribute('download', `ics_205_${id}.docx`); // Nama file yang akan diunduh
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
            <FormContainer title="ICS 205 - Radio Communication Plan Preview">
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

                {/* Section 3 */}
                <div className="section-10">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>3. Basic Radio Use</strong>
                                    <br />
                                    <Table sx={{ marginTop: '10px', border: '1px solid #ccc' }}>
                                        {/* Table Head */}
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Channel Number</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Channel Name</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Radio Frequency</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Mode</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Function</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Assignment</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Remarks</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        {/* Table Body */}
                                        <TableBody>
                                            {formData.radioChannel && formData.radioChannel.length > 0 ? (
                                                formData.radioChannel.map((radioChannel, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{radioChannel.channel_number}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{radioChannel.channel_name}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{radioChannel.frequency}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{radioChannel.mode}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{radioChannel.functions}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{radioChannel.assignment}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{radioChannel.remarks}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={9} sx={{ border: '1px solid #ccc', textAlign: 'center', height: '24px' }}>
                                                        No data available
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
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
                                    <strong>4. Special Instructions
                                    </strong>
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert Special Instructions here */}
                                        {formData.special_instructions}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Prepared By */}
                <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                    <TableBody>
                        <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                            <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                <strong>5. Prepared by:</strong>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div style={{ marginLeft: '5rem' }}>
                                        {CULeaderData?.name || "N/A"}
                                    </div>
                                    <div style={{ marginLeft: '5rem' }}>
                                        Position: Communication Unit Leader
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