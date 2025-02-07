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


export default function Preview() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [formData, setFormData] = useState({
        operational_period_id: null,
        medicalAidStation: [],
        transportation: [],
        hospital: [],
        special_medical_procedures: "",
        is_utilized: false,
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
    const [MULeaderData, setMULeaderData] = useState([]);
    const [preparationData, setPreparationData] = useState({
        is_prepared: false,
        date_prepared: dayjs().format('YYYY-MM-DD'),
        time_prepared: dayjs().format('HH:mm'),
    });
    const [preparationID, setPreparationID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const routeUrl = "ics-206/main";

    const fetchMedicalsData = async (ics_206_id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/ics-206/medical-aid-station/read-by-ics-id/${ics_206_id}`);
            console.log("Medical Aid Station Data:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching medical aid station data:", error);
            throw error;
        }
    };

    const fetchTransportationsData = async (ics_206_id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/ics-206/transportation/read-by-ics-id/${ics_206_id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching transportation data:", error);
            throw error;
        }
    };

    const fetchHospitalsData = async (ics_206_id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/ics-206/hospitals/read-by-ics-id/${ics_206_id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching hospital data:", error);
            throw error;
        }
    };

    useEffect(() => {
        setLoading(true);
        setError(null);

        let operationalPeriodId = null;
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const responseData = await axios.get(`http://127.0.0.1:8000/${routeUrl}/read/${id}`)
                const mainData = responseData.data;

                // Fetch additional data in parallel
                const [operationalPeriodResponse, preparationResponse, medicalsData, transportationsData, hospitalsData] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/operational-period/read'),
                    axios.get(`http://127.0.0.1:8000/ics-206/preparation/read-by-ics-206-id/${id}`),
                    fetchMedicalsData(mainData.id),
                    fetchTransportationsData(mainData.id),
                    fetchHospitalsData(mainData.id),
                ]);

                // Extracting data
                const operationalPeriodData = operationalPeriodResponse.data;
                const preparationData = preparationResponse.data.length > 0 ? preparationResponse.data[0] : null;

                // Find associated incident_id from operational period
                const selectedOperationalPeriod = operationalPeriodData.find(period => period.id === mainData.operational_period_id);
                const incidentId = selectedOperationalPeriod ? selectedOperationalPeriod.incident_id : null;

                // Update FormData with fetched data
                setFormData(prevFormData => ({
                    ...prevFormData,
                    ...mainData, // Spread all main data fields
                    incident_id: incidentId,
                    medicalAidStation: medicalsData.length > 0 ? medicalsData : [{
                        name: "",
                        location: "",
                        number: "",
                        is_paramedic: false,
                    }],
                    transportation: transportationsData.length > 0 ? transportationsData : [{
                        ambulance_service: "",
                        location: "",
                        number: "",
                        is_als: false,
                        is_bls: false,
                    }],
                    hospital: hospitalsData.length > 0 ? hospitalsData : [{
                        name: "",
                        address: "",
                        number: "",
                        air_travel_time: "",
                        ground_travel_time: "",
                        is_trauma_center: false,
                        level_trauma_center: "",
                        is_burn_center: false,
                        is_helipad: false,
                    }],
                    ...(preparationData && {
                        is_prepared: preparationData.is_prepared,
                        medical_unit_leader_id: preparationData.medical_unit_leader_id,
                        date_prepared: preparationData.date_prepared,
                        time_prepared: preparationData.time_prepared,
                    }),
                }));

                // Set state
                setOperationalPeriodData(operationalPeriodData);
                if (preparationData) {
                    setPreparationID(preparationData.id);
                }
            } catch (err) {
                setError("Failed to fetch data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (id) {
            fetchData();
        }
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

    const handleExportButtonClick = async () => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/ics-206/export-docx/${id}`,
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
            link.setAttribute('download', `ics_206_${id}.docx`); // Nama file yang akan diunduh
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
                title="ICS 206 - Medical Plan Preview"
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
                <div className="section-10">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>3. Medical Aid Stations</strong>
                                    <br />
                                    <Table sx={{ marginTop: '10px', border: '1px solid #ccc' }}>
                                        {/* Table Head */}
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Location</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Contact Number(s)/Frequency</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Paramedics on Site?</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        {/* Table Body */}
                                        <TableBody>
                                            {formData.medicalAidStation && formData.medicalAidStation.length > 0 ? (
                                                formData.medicalAidStation.map((medical, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{medical.name}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{medical.location}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{medical.number}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{medical.is_paramedic ? '✓' : '✗'}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} sx={{ border: '1px solid #ccc', textAlign: 'center', height: '24px' }}>
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
                <div className="section-10">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>4. Transportation</strong>
                                    <br />
                                    <Table sx={{ marginTop: '10px', border: '1px solid #ccc' }}>
                                        {/* Table Head */}
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Ambulance Service</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Location</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Contact Number(s)/Frequency</TableCell>
                                                <TableCell colSpan={2} sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Level of Service</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        {/* Table Body */}
                                        <TableBody>
                                            {formData.transportation && formData.transportation.length > 0 ? (
                                                formData.transportation.map((transportation, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{transportation.ambulance_service}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{transportation.location}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{transportation.number}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{transportation.is_als ? '✓' : '✗'} ALS</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{transportation.is_bls ? '✓' : '✗'} BLS</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} sx={{ border: '1px solid #ccc', textAlign: 'center', height: '24px' }}>
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

                {/* Section 5 */}
                <div className="section-10">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>5. Hospitals</strong>
                                    <br />
                                    <Table sx={{ marginTop: '10px', border: '1px solid #ccc' }}>
                                        {/* Table Head */}
                                        <TableHead>
                                            <TableRow>
                                                <TableCell rowSpan={2} sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
                                                <TableCell rowSpan={2} sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Address</TableCell>
                                                <TableCell rowSpan={2} sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Contact Number(s)/Frequency</TableCell>
                                                <TableCell colSpan={2} sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Travel Time</TableCell>
                                                <TableCell rowSpan={2} sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Trauma Center</TableCell>
                                                <TableCell rowSpan={2} sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Burn Center</TableCell>
                                                <TableCell rowSpan={2} sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Helipad</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Air</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Ground</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        {/* Table Body */}
                                        <TableBody>
                                            {formData.hospital && formData.hospital.length > 0 ? (
                                                formData.hospital.map((hospital, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{hospital.name}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{hospital.address}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{hospital.number}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{hospital.air_travel_time}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{hospital.ground_travel_time}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{hospital.is_trauma_center ? '✓' : '✗'} Level {hospital.level_trauma_center}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{hospital.is_burn_center ? '✓' : '✗'}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{hospital.is_helipad ? '✓' : '✗'}</TableCell>
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

                {/* Section 8 */}
                <div className="footer-section">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>8. Prepared by:</strong>
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
                                            Prepared Date: {preparedDate}
                                        </div>
                                        <div style={{ width: '300px', marginLeft: '1rem' }}>
                                            Prepared Time: {preparedTime}
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
                                    <strong>9. Approved By:</strong>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ width: '300px', marginLeft: '1rem' }}>
                                            {safetyOfficerData.find(officer => officer.id === approvalData.safety_officer_id)?.name || 'Unknown'}
                                        </div>
                                        <div style={{ width: '300px', marginLeft: '1rem' }}>
                                            Position: Safety Officer
                                        </div>
                                        <div style={{ width: '100px', marginLeft: '1rem' }}>
                                            Signature: {approvalData.is_approved ? '✓' : '✗'}
                                        </div>
                                        <div style={{ width: '300px', marginLeft: '1rem' }}>
                                            Approved Date: {approvalData.date_approved}
                                        </div>
                                        <div style={{ width: '300px', marginLeft: '1rem' }}>
                                            Approved Time: {approvalData.time_approved}
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