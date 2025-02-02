'use client';

import axios from 'axios';
import dayjs from 'dayjs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import FormContainer from '@/components/FormContainer';
import { Checkbox, FormControl, FormControlLabel, MenuItem, Select, TableHead, InputLabel, TextField } from '@mui/material';

dayjs.extend(customParseFormat);


export default function Preview({
}) {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [formData, setFormData] = useState({
        operational_period_id: null,
        operation_section_chief_id: null, // Untuk Operations Personnel
        prepared_operation_section_chief_id: null, // Untuk Prepared by
        resources_unit_leader_id: null,
        is_prepared_ru_leader: false,
        is_prepared_os_chief: false, // Jika OS Chief yang prepared
        branch_director_name: "",
        branch_director_number: "",
        division_supervisor_name: "",
        division_supervisor_number: "",
        branch: "",
        division: "",
        staging_area: "",
        work_assignment: "",
        special_instructions: "",
        radio_channel_number: "",
        frequency: "",
        communication_mode: "",
        mobile_phone: "",
        equipmentAssigned: [],
        personnelAssigned: [],
        idsToDeletePersonnels: [],
        idsToDeleteEquipments: [],
    });
    const [incidentData, setIncidentData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [OSChiefData, setOSChiefData] = useState([]);
    const [RULeaderData, setRULeaderData] = useState([]);
    const [preparationOSChiefData, setPreparationOSChiefData] = useState({
        is_prepared: false,
        date_prepared: dayjs().format('YYYY-MM-DD'),
        time_prepared: dayjs().format('HH:mm'),
    });
    const [preparationRULeaderData, setPreparationRULeaderData] = useState({
        is_prepared: false,
        date_prepared: dayjs().format('YYYY-MM-DD'),
        time_prepared: dayjs().format('HH:mm'),
    });
    const [operationSectionChiefNumber, setOperationSectionChiefNumber] = useState("");
    const [preparationOSChiefID, setPreparationOSChiefID] = useState(null);
    const [preparationRULeaderID, setPreparationRULeaderID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const routeUrl = "ics-204/main";

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch main data
                const responseData = await axios.get(`http://127.0.0.1:8000/${routeUrl}/read/${id}`);
                const mainData = responseData.data;

                // Fetch additional data in parallel
                const [operationalPeriodResponse, preparationOSChiefResponse, preparationRULeaderResponse, personnelsData, equipmentsData] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/operational-period/read'),
                    axios.get(`http://127.0.0.1:8000/ics-204/preparation-os-chief/read-by-ics-204-id/${id}`),
                    axios.get(`http://127.0.0.1:8000/ics-204/preparation-ru-leader/read-by-ics-204-id/${id}`),
                    fetchPersonnelsData(mainData.id),
                    fetchEquipmentsData(mainData.id),
                ]);

                // Extracting data
                const operationalPeriodData = operationalPeriodResponse.data;
                const preparationOSChiefData = preparationOSChiefResponse.data.length > 0 ? preparationOSChiefResponse.data[0] : null;
                const preparationRULeaderData = preparationRULeaderResponse.data.length > 0 ? preparationRULeaderResponse.data[0] : null;

                setPreparationOSChiefID(preparationOSChiefData ? preparationOSChiefData.id : null);
                setPreparationRULeaderID(preparationRULeaderData ? preparationRULeaderData.id : null);
                setPreparationOSChiefData(preparationOSChiefData);
                setPreparationRULeaderData(preparationRULeaderData);
                console.log("Preparation RULeader Data:", preparationRULeaderData);
                console.log("Preparation OS Chief Data:", preparationOSChiefData);

                // Find associated incident_id from operational period
                const selectedOperationalPeriod = operationalPeriodData.find(period => period.id === mainData.operational_period_id);
                const incidentId = selectedOperationalPeriod ? selectedOperationalPeriod.incident_id : null;

                // Update FormData with fetched data
                setFormData(prevFormData => ({
                    ...prevFormData,
                    ...mainData, // Spread all main data fields
                    incident_id: incidentId,
                    equipmentAssigned: equipmentsData.length > 0 ? equipmentsData : [{
                        kind: "",
                        quantity: "",
                        type_specification: "",
                        number: "",
                        location: "",
                        remarks: "",
                    }],
                    personnelAssigned: personnelsData.length > 0 ? personnelsData : [{
                        name: "",
                        number: "",
                        location: "",
                        equipment_tools_remarks: ""
                    }],
                    ...(preparationOSChiefData && {
                        is_prepared_os_chief: preparationOSChiefData.is_prepared,
                        operation_section_chief_id: preparationOSChiefData.operation_section_chief_id,
                        date_prepared: preparationOSChiefData.date_prepared,
                        time_prepared: preparationOSChiefData.time_prepared,
                    }),
                    ...(preparationRULeaderData && {
                        is_prepared_ru_leader: preparationRULeaderData.is_prepared,
                        resources_unit_leader_id: preparationRULeaderData.resources_unit_leader_id,
                        date_prepared: preparationRULeaderData.date_prepared,
                        time_prepared: preparationRULeaderData.time_prepared,
                    })
                }));

                // Set state
                setOperationalPeriodData(operationalPeriodData);
                if (preparationOSChiefData) {
                    setPreparationOSChiefID(preparationOSChiefData.id);
                }
                if (preparationRULeaderData) {
                    setPreparationRULeaderID(preparationRULeaderData.id);
                }

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchPersonnelsData = async (ics_204_id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/ics-204/personnel-assigned/read-by-ics-id/${ics_204_id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching personnels data:', error);
            throw error;
        }
    };

    const fetchEquipmentsData = async (ics_204_id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/ics-204/equipment-assigned/read-by-ics-id/${ics_204_id}`);
            console.log("Equipments Data:", response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching equipments data:', error);
            throw error;
        }
    };

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

    const fetchRULeader = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/planning-section/resources-unit-leader/read/');
            setRULeaderData(response.data);
            // console.log("Resources Unit Leader Data:", response.data);
        } catch (error) {
            console.error('Error fetching Resources Unit Leader data:', error);
            setError('Failed to fetch Resources Unit Leader data');
        }
    };

    useEffect(() => {
        fetchRULeader();
    }, []);

    const fetchOSChief = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/main-section/operation-section-chief/read/');
            setOSChiefData(response.data);
            // console.log("Operation Section Chief Data:", response.data);
        } catch (error) {
            console.error('Error fetching Operation Section Chief data:', error);
            setError('Failed to fetch Operation Section Chief data');
        }
    };

    useEffect(() => {
        fetchOSChief();
    }, []);

    const isPreparedOSChief = preparationOSChiefData?.is_prepared ? '✓' : '✗';
    const preparedDateOSChief = preparationOSChiefData?.date_prepared || "N/A";
    const preparedTimeOSChief = preparationOSChiefData?.time_prepared || "N/A";

    const isPreparedRULeader = preparationRULeaderData?.is_prepared ? '✓' : '✗';
    const preparedDateRULeader = preparationRULeaderData?.date_prepared || "N/A";
    const preparedTimeRULeader = preparationRULeaderData?.time_prepared || "N/A";

    const preparedByOSChief = preparationOSChiefData && OSChiefData.find((chief) => chief.id === preparationOSChiefID);
    const preparedByRULeader = preparationRULeaderData && RULeaderData.find((leader) => leader.id === preparationRULeaderID);

    const incidentDetails = incidentData.find(
        (incident) => incident.id === formData.incident_id
    );

    const selectedOperationalPeriod = operationalPeriodData.find(
        (period) => period.id === formData.operational_period_id
    );

    const handleExportButtonClick = async () => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/ics-203/export-docx/${id}`,
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

    useEffect(() => {
        if (formData.operation_section_chief_id) {
            // Cari chief yang sesuai berdasarkan operation_section_chief_id
            const selectedChief = OSChiefData.find(chief => chief.id === parseInt(formData.operation_section_chief_id, 10));
            if (selectedChief) {
                // Update operationSectionChiefNumber dengan mobile_phone dari chief yang dipilih
                setOperationSectionChiefNumber(selectedChief.mobile_phone);
            } else {
                // Reset jika tidak ada chief yang dipilih
                setOperationSectionChiefNumber("");
            }
        } else {
            // Reset jika operation_section_chief_id kosong
            setOperationSectionChiefNumber("");
        }
    }, [formData.operation_section_chief_id, OSChiefData]);

    useEffect(() => {
        if (formData.is_prepared_os_chief) {
            // Jika OS Chief disiapkan, otomatis gunakan yang dipilih di Operations Personnel
            setFormData(prev => ({
                ...prev,
                prepared_operation_section_chief_id: prev.operation_section_chief_id || ""
            }));
        } else {
            // Jika hanya Resources Unit Leader yang prepared, kosongkan OS Chief di "Prepared by"
            setFormData(prev => ({
                ...prev,
                prepared_operation_section_chief_id: ""
            }));
        }
    }, [formData.is_prepared_os_chief, formData.operation_section_chief_id]);

    useEffect(() => {
        if (!formData.is_prepared_os_chief) {
            // Jika Operation Section Chief tidak menjadi "Prepared by", hapus dari state
            setFormData(prev => ({
                ...prev,
                operation_section_chief_id: null
            }));
        }
    }, [formData.is_prepared_os_chief]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    // if (!data) return <p>No data found</p>;

    return (
        <div>
            <FormContainer title="ICS 204 - Assignment List Preview">
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
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: '#e5e5e5', border: '4px solid black', padding: '16px' }}>
                    {/* Judul di atas */}
                    <strong style={{ marginBottom: '10px', fontSize: '1.2rem' }}>3. Operations Personnel</strong>

                    {/* Container untuk dua tabel */}
                    <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                        {/* Tabel Pertama */}
                        <Table sx={{ width: '50%', borderCollapse: 'collapse' }}>
                            <TableHead>
                                <TableRow sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                                    <TableCell></TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Contact Number</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '30%' }}>
                                        Operation Section Chief
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                        {OSChiefData.find(chief => chief.id === formData.operation_section_chief_id)?.name || 'Unknown Operation Section Chief'}
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                        {operationSectionChiefNumber}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                                        Branch Director
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                        {formData.branch_director_name}
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                        {formData.branch_director_number}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                                        Division/Group Supervisor
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                        {formData.division_supervisor_name}
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                        {formData.division_supervisor_number}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        {/* Tabel Kedua */}
                        <Table sx={{ width: '50%', borderCollapse: 'collapse' }}>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '25%' }}>
                                        Branch
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                        {formData.branch}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '25%'  }}>
                                        Division/Group
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                        {formData.division}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '25%'  }}>
                                        Staging Area
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                        {formData.staging_area}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Section 4 */}
                <div className="section-10">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>4. Personnel Assigned</strong>
                                    <br />
                                    <Table sx={{ marginTop: '10px', border: '1px solid #ccc' }}>
                                        {/* Table Head */}
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Contact Number</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Reporting Location</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Special Equipment, Tools, and Remarks</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        {/* Table Body */}
                                        <TableBody>
                                            {formData.personnelAssigned && formData.personnelAssigned.length > 0 ? (
                                                formData.personnelAssigned.map((personnelAssigned, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{personnelAssigned.name}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{personnelAssigned.number}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{personnelAssigned.location}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{personnelAssigned.equipment_tools_remarks}</TableCell>
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

                {/* Section 5 */}
                <div className="section-10">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>5. Equipment & Materials Assigned</strong>
                                    <br />
                                    <Table sx={{ marginTop: '10px', border: '1px solid #ccc' }}>
                                        {/* Table Head */}
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Kind</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Quantity</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Type(Specification)</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Contact Number</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Reporting Location</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Remarks</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        {/* Table Body */}
                                        <TableBody>
                                            {formData.equipmentAssigned && formData.equipmentAssigned.length > 0 ? (
                                                formData.equipmentAssigned.map((equipmentAssigned, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{equipmentAssigned.kind}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{equipmentAssigned.quantity}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{equipmentAssigned.type_specification}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{equipmentAssigned.number}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{equipmentAssigned.location}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{equipmentAssigned.remarks}</TableCell>
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
                                    <strong>6. Work Assignment
                                    </strong>
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert Work Assignment
 here */}
                                        {formData.work_assignment}
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
                                    <strong>7. Special Instruction
                                    </strong>
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert Special Instruction
 here */}
                                        {formData.special_instructions}
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
                                    <strong>8. Communications (radio and/or contact numbers needed for this assignment)
                                    </strong>
                                    <br />
                                    <br />
                                    <strong>Radio Communication Channel Number
                                    </strong>
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {formData.radio_channel_number}
                                    </div>
                                    <br />
                                    <strong>Frequency
                                    </strong>
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {formData.frequency}
                                    </div>
                                    <br />
                                    <strong>Communication Mode
                                    </strong>
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {formData.communication_mode}
                                    </div>
                                    <br />
                                    <strong>Mobile Phone Number
                                    </strong>
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {formData.mobile_phone}
                                    </div>
                                    <br />
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
                                <strong>9. Prepared by:</strong>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {preparedByRULeader && (
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div style={{ width: '300px', marginLeft: '1rem' }}>
                                                {preparedByRULeader.name || "N/A"}
                                            </div>
                                            <div style={{ width: '300px', marginLeft: '1rem' }}>
                                                Position: Resources Unit Leader
                                            </div>
                                            <div style={{ width: '100px', marginLeft: '1rem' }}>
                                                Signature: {isPreparedRULeader}
                                            </div>
                                            <div style={{ width: '300px', marginLeft: '1rem' }}>
                                                Prepared Date: {preparedDateRULeader}
                                            </div>
                                            <div style={{ width: '300px', marginLeft: '1rem' }}>
                                                Prepared Time: {preparedTimeRULeader}
                                            </div>
                                        </div>
                                    )}

                                    {preparedByOSChief && (
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div style={{ width: '300px', marginLeft: '1rem' }}>
                                                {preparedByOSChief.name || "N/A"}
                                            </div>
                                            <div style={{ width: '300px', marginLeft: '1rem' }}>
                                                Position: Operation Section Chief
                                            </div>
                                            <div style={{ width: '100px', marginLeft: '1rem' }}>
                                                Signature: {isPreparedOSChief}
                                            </div>
                                            <div style={{ width: '300px', marginLeft: '1rem' }}>
                                                Prepared Date: {preparedDateOSChief}
                                            </div>
                                            <div style={{ width: '300px', marginLeft: '1rem' }}>
                                                Prepared Time: {preparedTimeOSChief}
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </FormContainer>
        </div>
    );
}