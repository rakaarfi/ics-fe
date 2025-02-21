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
import { Checkbox, FormControl, FormControlLabel, MenuItem, Select } from '@mui/material';

import FormContainer from '@/components/FormContainer';
import { fetchData, readBy } from '@/utils/api';

dayjs.extend(customParseFormat);


export default function ToBeApproved() {
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
    const [incidentData, setIncidentData] = useState([]);
    const [incidentCommanderData, setIncidentCommanderData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
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
    const routeUrl = "ics-202/main";

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
    // Fetch data Incident & Planning Section Chief & 
    // Preparation & Incident Commander
    // -------------------------------------------------------------------------

    // Fetch Planning Section Chief data
    useEffect(() => {
        if (preparationData.planning_section_chief_id) {
            fetchPSChief(preparationData.planning_section_chief_id);
        }
    }, [preparationData]);

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

    // Check if the preparation data is available and extract its properties
    const isPrepared = preparationData ? preparationData.is_prepared : false;
    const preparedDate = preparationData ? preparationData.date_prepared : null;
    const preparedTime = preparationData ? preparationData.time_prepared : null;

    // Find the selected operational period based on the operational_period_id from formData
    const selectedOperationalPeriod = operationalPeriodData.find(
        (period) => period.id === formData.operational_period_id
    );

    // Fetch data Incident Commander
    const fetchIncidentCommander = async () => {
        try {
            const response = await fetchData('main-section/incident-commander')
            setIncidentCommanderData(response)
        } catch (error) {
            console.error('Error fetching incident commander data:', error);
            setError('Failed to fetch incident commander data');
        }
    };

    useEffect(() => {
        fetchIncidentCommander();
    }, []);

    // -------------------------------------------------------------------------
    // Submit data (POST)
    // -------------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const now = dayjs();
            const payload = {
                ics_202_id: formData.id,
                incident_commander_id: approvalData.incident_commander_id,
                date_approved: now.format('YYYY-MM-DD'),
                time_approved: now.format('HH:mm'),
                is_approved: approvalData.is_approved,
            };
            const response = await axios.post(`${apiUrl}ics-202/approval/create/`, payload);
            console.log('Approval submitted successfully:', response.data);
            alert('Approval submitted successfully!');
        } catch (error) {
            console.error('Error submitting approval:', error);
            alert('Failed to submit approval. Please try again.');
        }
    };

    return (
        <div>
            <FormContainer
                title="To Be Approved"
                className="max-w-2xl mx-auto p-4 mb-8 bg-white rounded shadow-lg"
            >
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


                {/* Footer Section (Section 10) */}
                <div className="footer-section">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>10. Approved by:</strong>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ marginLeft: '5rem' }}>
                                            <Select
                                                name='incident_commander_id'
                                                className="flex-1 block rounded-md px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                                value={approvalData.incident_commander_id || ''}
                                                onChange={(e) => setApprovalData(prev => ({
                                                    ...prev,
                                                    incident_commander_id: e.target.value
                                                }))}
                                                inputProps={
                                                    {
                                                        name: 'incident_commander_id'
                                                    }
                                                }
                                                variant="standard"
                                                label="Incident Commander"
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>
                                                    <em>Select Incident Commander</em>
                                                </MenuItem>
                                                {incidentCommanderData.map(commander => (
                                                    <MenuItem key={commander.id} value={commander.id}>
                                                        {commander.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>

                                        <div style={{ marginLeft: '5rem' }}>
                                            Position: Incident Commander
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            <FormControl>
                                                {/* Checkbox Signature */}
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            name="is_approved"
                                                            checked={approvalData.is_approved}
                                                            onChange={(e) => setApprovalData(prev => ({
                                                                ...prev,
                                                                is_approved: e.target.checked
                                                            }))}
                                                        />
                                                    }
                                                    label="Signature"
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit Approval
                    </button>
                </div>
            </FormContainer>
        </div>
    );
}