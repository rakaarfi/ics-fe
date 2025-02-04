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
import { MainSection, PlanningSection, LogisticSection, FinanceSection, OperationSectionList, boldItems } from '@/components/ImtRoster/inputFields';

const TimePicker = dynamic(
    () => import('@mui/x-date-pickers').then((mod) => mod.TimePicker),
    { ssr: false }
);

dayjs.extend(customParseFormat);


export default function Preview({
}) {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [formData, setFormData] = useState({
        operational_period_id: null,
        special_instructions: "",
        radioChannel: [
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
    });
    const [incidentData, setIncidentData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [CULeaderData, setCULeaderData] = useState([]);
    const [preparationData, setPreparationData] = useState({
        is_prepared: false,
        date_prepared: dayjs().format('YYYY-MM-DD'),
        time_prepared: dayjs().format('HH:mm'),
    });
    const [preparationID, setPreparationID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const routeUrl = "ics-205/main";

    useEffect(() => {
        setLoading(true);
        setError(null);

        let operationalPeriodId = null;

        // Ambil data detail
        axios
            .get(`http://127.0.0.1:8000/${routeUrl}/read/${id}`)
            .then((response) => {
                setFormData(response.data);
                operationalPeriodId = response.data.operational_period_id;

                return axios.get('http://127.0.0.1:8000/operational-period/read');
            })
            .then((response) => {
                setOperationalPeriodData(response.data);

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

        if (id) {
            axios.get(`http://127.0.0.1:8000/ics-205/preparation/read-by-ics-205-id/${id}`)
                .then((response) => {
                    if (response.data.length > 0) {
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            is_prepared: response.data[0].is_prepared,
                            communication_unit_leader_id: response.data[0].communication_unit_leader_id,
                            date_prepared: response.data[0].date_prepared,
                            time_prepared: response.data[0].time_prepared
                        }));
                        setPreparationID(response.data[0].id);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching Preparation data:', error);
                    setError('Failed to fetch Preparation data');
                });
        }

    }, [id]);

    // Fetch preparation data
    useEffect(() => {
        const fetchPreparationData = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/ics-205/preparation/read-by-ics-205-id/${id}`
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

    const fetchIncidentData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/incident-data/read');
            setIncidentData(response.data);

        } catch (error) {
            console.error('Error fetching incident data:', error);
            setError('Failed to fetch incident data');
        }
    };

    useEffect(() => {
        fetchIncidentData();
    }, []);

    const fetchCULeader = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/logistic-section/communication-unit-leader/read/');
            setCULeaderData(response.data);
            console.log("Communication Unit Leader Data:", response.data);

        } catch (error) {
            console.error('Error fetching Communication Unit Leader Data:', error);
            setError('Failed to fetch Communication Unit Leader Data');
        }
    };

    useEffect(() => {
        fetchCULeader();
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
                `http://127.0.0.1:8000/ics-205/export-docx/${id}`,
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
                                        {/* <TableBody>
                                            {formData.personnelAssigned && formData.personnelAssigned.length > 0 ? (
                                                formData.personnelAssigned.map((personnelAssigned, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{personnelAssigned.channel_number}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{personnelAssigned.channel_name}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{personnelAssigned.frequency}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{personnelAssigned.mode}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{personnelAssigned.functions}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{personnelAssigned.assignment}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{personnelAssigned.remarks}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={9} sx={{ border: '1px solid #ccc', textAlign: 'center', height: '24px' }}>
                                                        No data available
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody> */}
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
                                    <div style={{ width: '300px', marginLeft: '1rem' }}>
                                        {CULeaderData.find((CULeader) => CULeader.id === preparationID)?.name || "N/A"}
                                    </div>
                                    <div style={{ width: '300px', marginLeft: '1rem' }}>
                                        Position: Communication Unit Leader
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
            </FormContainer>
        </div>
    );
}