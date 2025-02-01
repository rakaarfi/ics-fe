'use client';

import axios from 'axios';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Checkbox, FormControl, FormControlLabel, MenuItem, Select, TableHead } from '@mui/material';
import FormContainer from '@/components/FormContainer';
import { set } from 'date-fns';

const TimePicker = dynamic(
    () => import('@mui/x-date-pickers').then((mod) => mod.TimePicker),
    { ssr: false }
);

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
    const [incidentData, setIncidentData] = useState([]);
    const [safetyOfficerData, setSafetyOfficerData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [approvalData, setApprovalData] = useState({
        safety_officer_id: "",
        is_approved: false,
        date_approved: dayjs().format('YYYY-MM-DD'),
        time_approved: dayjs().format('HH:mm'),
    });
    const [PSChiefData, setPSChiefData] = useState([]);
    const [MULeaderData, setMULeaderData] = useState([]);
    const [preparationData, setPreparationData] = useState({
        is_prepared: false,
        date_prepared: dayjs().format('YYYY-MM-DD'),
        time_prepared: dayjs().format('HH:mm'),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const routeUrl = "ics-206/main";

    useEffect(() => {
        setLoading(true);
        setError(null);

        let operationalPeriodId = null;

        axios
            .get(`http://127.0.0.1:8000/${routeUrl}/read/${id}`)
            .then((response) => {
                setData(response.data);
                setFormData(response.data);
                operationalPeriodId = response.data.operational_period_id;

                // Ambil data operational period
                return axios.get('http://127.0.0.1:8000/operational-period/read');
            })
            .then((response) => {
                setOperationalPeriodData(response.data);

                // Cari operational period dan incident terkait
                const selectedOperationalPeriod = response.data.find(
                    (period) => period.id === operationalPeriodId
                );

                if (selectedOperationalPeriod) {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        incident_id: selectedOperationalPeriod.incident_id,
                    }));
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    // Fetch preparation data
    useEffect(() => {
        const fetchPreparationData = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/ics-206/preparation/read-by-ics-206-id/${id}`
                );
                if (response.data.length > 0) {
                    setPreparationData(response.data);
                }
            } catch (error) {
                console.error('Error fetching preparation data:', error);
            }
        };

        fetchPreparationData();
    }, [id]);

    // Fetch Planning Section Chief data
    useEffect(() => {
        if (preparationData.length > 0 && preparationData[0].medical_unit_leader_id) {
            fetchMULeader(preparationData[0].medical_unit_leader_id);
        }
    }, [preparationData]);

    const fetchMULeader = async (leaderId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/logistic-section/medical-unit-leader/read/${leaderId}`);
            setMULeaderData(response.data);
            console.log("Medical Unit Leader Data:", response.data);
        } catch (error) {
            console.error('Error fetching PS Chief data:', error);
        }
    };

    useEffect(() => {
        const fetchApprovalData = async (ics_206_id) => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/ics-206/approval/read-by-ics-206-id/${ics_206_id}`
                );
                if (response.data.length > 0) {
                    setApprovalData(response.data[0]);
                }
            } catch (error) {
                console.error('Error fetching approval data:', error);
            }
        };

        if (id) {
            fetchApprovalData(id);
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const now = dayjs();
            const payload = {
                ics_202_id: formData.id,
                safety_officer_id: approvalData.safety_officer_id,
                date_approved: now.format('YYYY-MM-DD'),
                time_approved: now.format('HH:mm'),
                is_approved: approvalData.is_approved,
            };
            const response = await axios.post(`http://127.0.0.1:8000/ics-202/approval/create/`, payload);
            console.log('Approval submitted successfully:', response.data);
            alert('Approval submitted successfully!');
        } catch (error) {
            console.error('Error submitting approval:', error);
            alert('Failed to submit approval. Please try again.');
        }
    };


    // Fetch Incident Data
    useEffect(() => {
        const fetchIncidentData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/incident-data/read');
                setIncidentData(response.data);
            } catch (error) {
                setError('Failed to fetch incident data');
            }
        };
        fetchIncidentData();
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

    const fetchSafetyOfficer = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/main-section/safety-officer/read/');
            setSafetyOfficerData(response.data);
        } catch (error) {
            console.error('Error fetching Safety Officer data:', error);
            setError('Failed to fetch Safety Officer data');
        }
    };

    useEffect(() => {
        fetchSafetyOfficer();
    }, []);


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
                                    <strong>3. Medical Aid Stations</strong>:
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert Medical Aid Stations here */}
                                        {/* {formData.objectives} */}
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
                                    <strong>4. Transportation</strong>
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert Transportation here */}
                                        {/* {formData.command_emphasis} */}
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
                                    <strong>5. Hospitals</strong>
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert Hospitals here */}
                                        {/* {formData.situational_awareness} */}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 6 */}
                <div className="section-7">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>6. Special Medical Emergency Procedures
                                    </strong>
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert Special Medical Emergency Procedures
 here */}
                                        {formData.special_medical_procedures}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 7 */}
                <div className="section-7">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>7. Check box if aviation Assets are utilized for rescue. If assets are used, coordinate with Air Operations.
                                    </strong>
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {formData.is_required ? '✓' : '✗'}
                                    </div>
                                    <br />
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
                                        <div style={{ width: '300px', marginLeft: '1rem' }}>
                                            {MULeaderData?.name || 'Unknown'}
                                        </div>
                                        <div style={{ width: '300px', marginLeft: '1rem' }}>
                                            Position: Medical Unit Leader
                                        </div>
                                        <div style={{ width: '100px', marginLeft: '1rem' }}>
                                            Signature: {isPrepared ? '✓' : '✗'}
                                        </div>
                                        <div style={{ width: '300px', marginLeft: '1rem' }}>
                                            Date Prepared: {preparedDate}
                                        </div>
                                        <div style={{ width: '300px', marginLeft: '1rem' }}>
                                            Time Prepared: {preparedTime}
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
                                        <div style={{ width: '300px', marginLeft: '1rem' }}>
                                            <Select
                                                name='safety_officer_id'
                                                className="flex-1 block rounded-md px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                                value={approvalData.safety_officer_id || ''}
                                                onChange={(e) => setApprovalData(prev => ({
                                                    ...prev,
                                                    safety_officer_id: e.target.value
                                                }))}
                                                inputProps={
                                                    {
                                                        name: 'safety_officer_id'
                                                    }
                                                }
                                                variant="standard"
                                                label="Safety Officer"
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>
                                                    <em>Select Safety Officer"</em>
                                                </MenuItem>
                                                {safetyOfficerData.map(officer => (
                                                    <MenuItem key={officer.id} value={officer.id}>
                                                        {officer.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>

                                        <div style={{ width: '300px', marginLeft: '1rem' }}>
                                            Position: Safety Officer
                                        </div>
                                        <div style={{ width: '300px', marginLeft: '1rem' }}>
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
                                        {/* <div style={{ width: '150px', marginLeft: '1rem' }}>
                                            <TextField
                                                required
                                                variant="standard"
                                                type="date"
                                                name="date_approved"
                                                value={approvalData.date_approved}
                                                onChange={(e) => setApprovalData(prev => ({
                                                    ...prev,
                                                    date_approved: e.target.value
                                                }))}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                        <div style={{ width: '150px', marginLeft: '1rem' }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <TimePicker
                                                    ampm={false}
                                                    value={dayjs(approvalData.time_approved, 'HH:mm')}
                                                    onChange={(newValue) => {
                                                        setApprovalData(prev => ({
                                                            ...prev,
                                                            time_approved: newValue.format('HH:mm')
                                                        }));
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </div> */}
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