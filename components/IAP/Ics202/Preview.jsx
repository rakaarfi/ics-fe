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
import FormContainer from '@/components/FormContainer';
import { readBy } from '@/utils/api';

dayjs.extend(customParseFormat);


export default function Preview() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [formData, setFormData] = useState({
        operational_period_id: "",
        objectives: "",
        command_emphasis: "",
        situational_awareness: "",
        is_required: false,
        safety_plan_location: "",
        ics_203: false,
        ics_204: false,
        ics_205: false,
        ics_205a: false,
        ics_206: false,
        ics_207: false,
        ics_208: false,
        map_chart: false,
        weather_tides_currents: false,
    });
    const [incidentDetails, setIncidentDetails] = useState(null);
    const [selectedOperationalPeriod, setSelectedOperationalPeriod] = useState(null)
    const [ICData, setICData] = useState([]);
    const [approvalData, setApprovalData] = useState({
        incident_commander_id: "",
        is_approved: false,
        date_approved: dayjs().format('YYYY-MM-DD'),
        time_approved: dayjs().format('HH:mm'),
    });
    const [PSChiefData, setPSChiefData] = useState([]);
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

    // -------------------------------------------------------------------------
    // Gunakan helper readBy, fetchData di dalam useEffect
    // -------------------------------------------------------------------------
    useEffect(() => {
        const fetchIcs202Data = async () => {
            setLoading(true);
            setError(null);

            try {
                // Ambil detail ICS 202 (main data) - pakai readBy
                const mainData = await readBy({ routeUrl: "ics-202/main/read", id });
                setData(mainData);
                setFormData(mainData);

                // Kalau ada id, baru fetch preparation data - pakai readBy
                if (id) {
                    const prepResponse = await readBy({
                        routeUrl: 'ics-202/preparation/read-by-ics-202-id',
                        id
                    });
                    if (prepResponse && prepResponse.length > 0) {
                        setPreparationData(prepResponse[0]);
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

        fetchIcs202Data();
    }, [id]);

    // -------------------------------------------------------------------------
    // Fetch data
    // -------------------------------------------------------------------------
    // Fetch Planning Section Chief by planning_section_chief_id
    const fetchPSChief = async (chiefId) => {
        try {
            const response = await readBy({
                routeUrl: 'planning-section/planning-section-chief/read',
                id: chiefId
            });
            setPSChiefData(response);
        } catch (error) {
            console.error('Error fetching Planning Section Chief data:', error);
            setError(`Error fetching Planning Section Chief data`)
        }
    };

    useEffect(() => {
        if (preparationData.planning_section_chief_id) {
            fetchPSChief(preparationData.planning_section_chief_id);
        }
    }, [preparationData]);

    // Fetch Incident Commander
    const fetchIC = async (incindentId) => {
        try {
            const response = await readBy({
                routeUrl: 'main-section/incident-commander/read',
                id: incindentId
            });
            setICData(response);
        } catch (error) {
            console.error('Error fetching Incident Commander data:', error);
            setError(`Error fetching Incident Commander data`)
        }
    }

    useEffect(() => {
        if (approvalData.incident_commander_id) {
            fetchIC(approvalData.incident_commander_id)
        };
    }, [approvalData]);

    // Fetch Approval by ics_202_id
    useEffect(() => {
        const fetchApprovalData = async (ics_202_id) => {
            try {
                const response = await readBy({
                    routeUrl: 'ics-202/approval/read-by-ics-202-id',
                    id: ics_202_id
                });
                if (response && response.length > 0) {
                    setApprovalData(response[0]);
                }
            } catch (error) {
                console.error('Error fetching approval data:', error);
                setError(`Error fetching approval data`)
            }
        };

        if (id) {
            fetchApprovalData(id);
        }
    }, [id]);

    // Fetch Operational Period by operational_period_id
    const fetchOperationalPeriodById = async (operationalId) => {
        try {
            const response = await readBy({
                routeUrl: 'operational-period/read',
                id: operationalId
            })
            setSelectedOperationalPeriod(response);
            if (response) {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    incident_id: response.incident_id,
                }));
            }
        } catch (error) {
            setError('Failed to fetch operational period data');
        }
    };

    useEffect(() => {
        if (formData.operational_period_id) {
            fetchOperationalPeriodById(formData.operational_period_id);
        }
    }, [formData.operational_period_id]);

    // Fetch Incident Data by incident_id
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

    const isPrepared = preparationData ? preparationData.is_prepared : false;
    const preparedDate = preparationData ? preparationData.date_prepared : null;
    const preparedTime = preparationData ? preparationData.time_prepared : null;

    // --------------------------------------------------------------------------
    // Handle Export
    // --------------------------------------------------------------------------
    const handleExportButtonClick = async () => {
        try {
            const response = await axios.post(
                `${apiUrl}ics-202/export-docx/${id}`,
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
            link.setAttribute('download', `ics_202_${id}.docx`); // Nama file yang akan diunduh
            document.body.appendChild(link);
            link.click();

            // Hapus elemen <a> setelah unduhan selesai
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error exporting document:', error);
            setError(error.message)
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className='text-red-500'>Error: {error}</div>;
    }

    if (!incidentDetails) {
        return <div>Incident not found</div>;
    }

    return (
        <div>
            <FormContainer
                title="ICS 202 - Incident Objectives Preview"
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
                <div className="section-4">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>3. Objectives</strong>:
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert Objectives here */}
                                        {formData.objectives}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 4 */}
                <div className="section-5">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>4. Command Emphasis</strong>
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert Situation Summary and Health and Safety Briefing here */}
                                        {formData.command_emphasis}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 5 */}
                <div className="section-7">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>5. Situational Awareness</strong>
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert Situation Awareness here */}
                                        {formData.situational_awareness}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 6 and 7 */}
                <div className="section-7">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>6. Site Safety Plan Required?</strong>
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {formData.is_required ? 'Yes' : 'No'}
                                    </div>
                                    <br />
                                    <strong>7. Approved Site Safety Plan(s) Located at:</strong>
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {formData.safety_plan_location}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 8 */}
                <div className="section-7">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>8. Incident Action Plan (the items checked below are included in this Incident Action Plan):</strong>
                                    <br />
                                    {/* ICS Forms */}
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '150px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                            <div>
                                                <span>ICS 203: </span>
                                                {formData.ics_203 ? '✓' : '✗'}
                                            </div>
                                            <div>
                                                <span>ICS 204: </span>
                                                {formData.ics_204 ? '✓' : '✗'}
                                            </div>
                                            <div>
                                                <span>ICS 205: </span>
                                                {formData.ics_205 ? '✓' : '✗'}
                                            </div>
                                            <div>
                                                <span>ICS 205A: </span>
                                                {formData.ics_205a ? '✓' : '✗'}
                                            </div>
                                            <div>
                                                <span>ICS 206: </span>
                                                {formData.ics_206 ? '✓' : '✗'}
                                            </div>
                                            <div>
                                                <span>ICS 207: </span>
                                                {formData.ics_207 ? '✓' : '✗'}
                                            </div>
                                            <div>
                                                <span>ICS 208: </span>
                                                {formData.ics_208 ? '✓' : '✗'}
                                            </div>
                                            <div>
                                                <span>Map/Chart: </span>
                                                {formData.map_chart ? '✓' : '✗'}
                                            </div>
                                            <div>
                                                <span>Weather/Tides/Currents: </span>
                                                {formData.weather_tides_currents ? '✓' : '✗'}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 9 */}
                <div className="footer-section">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>9. Prepared by:</strong>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ marginLeft: '5rem' }}>
                                            {PSChiefData?.name || 'Unknown'}
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            Position: Planning Section Chief
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
                </div>

                {/* Approved By */}
                <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                    <TableBody>
                        <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                            <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                <strong>10. Approved by:</strong>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div style={{ marginLeft: '5rem' }}>
                                        {ICData?.name || 'Unknown'}
                                    </div>
                                    <div style={{ marginLeft: '5rem' }}>
                                        Position: Incident Commander
                                    </div>
                                    <div style={{ marginLeft: '5rem' }}>
                                        Signature: {approvalData.is_approved ? '✓' : '✗'}
                                    </div>
                                    <div style={{ marginLeft: '5rem' }}>
                                        Approved Date: {approvalData.date_approved}
                                    </div>
                                    <div style={{ marginLeft: '5rem' }}>
                                        Approved Time: {approvalData.time_approved}
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