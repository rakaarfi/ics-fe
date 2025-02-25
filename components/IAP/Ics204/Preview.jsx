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
import { TableHead } from '@mui/material';
import { readBy } from '@/utils/api';

dayjs.extend(customParseFormat);


export default function Preview({
}) {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        operational_period_id: null,
        operation_section_chief_id: null,
        prepared_operation_section_chief_id: null,
        resources_unit_leader_id: null,
        is_prepared_ru_leader: false,
        is_prepared_os_chief: false,
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
    const [incidentDetails, setIncidentDetails] = useState(null);
    const [selectedOperationalPeriod, setSelectedOperationalPeriod] = useState(null)
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
    const [preparationRULeaderID, setPreparationRULeaderID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;

    // -------------------------------------------------------------------------
    // Gunakan helper readBy di dalam useEffect
    // -------------------------------------------------------------------------
    useEffect(() => {
        const fetchIcs204Data = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch main data
                const responseData = await readBy({ routeUrl: "ics-204/main/read", id });
                const mainData = responseData;

                // Fetch additional data in parallel
                const [operationalPeriodResponse, preparationOSChiefResponse, preparationRULeaderResponse, personnelsData, equipmentsData] = await Promise.all([
                    readBy({ routeUrl: 'operational-period/read', id: mainData.operational_period_id }),
                    readBy({ routeUrl: 'ics-204/preparation-os-chief/read-by-ics-204-id', id }),
                    readBy({ routeUrl: 'ics-204/preparation-ru-leader/read-by-ics-204-id', id }),
                    fetchPersonnelsData(mainData.id),
                    fetchEquipmentsData(mainData.id),
                ]);

                // Extracting data
                const preparationOSChiefData = preparationOSChiefResponse.length > 0 ? preparationOSChiefResponse[0] : null;
                const preparationRULeaderData = preparationRULeaderResponse.length > 0 ? preparationRULeaderResponse[0] : null;

                setSelectedOperationalPeriod(operationalPeriodResponse);
                setPreparationOSChiefData(preparationOSChiefData);
                setPreparationRULeaderData(preparationRULeaderData);

                // Find associated incident_id from operational period
                const incidentId = operationalPeriodResponse ? operationalPeriodResponse.incident_id : null;

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
                if (preparationRULeaderData) {
                    setPreparationRULeaderID(preparationRULeaderData.resources_unit_leader_id);
                }

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchIcs204Data();
        }
    }, [id]);

    // -------------------------------------------------------------------------
    // Fetch data
    // -------------------------------------------------------------------------
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

    // Fetch Resources Unit Leader
    const fetchRULeader = async (RULeaderId) => {
        try {
            const response = await readBy({
                routeUrl: 'planning-section/resources-unit-leader/read',
                id: RULeaderId
            })
            setRULeaderData(response);
        } catch (error) {
            console.error('Error fetching Resources Unit Leader data:', error);
            setError('Failed to fetch Resources Unit Leader data');
        }
    };

    useEffect(() => {
        if (preparationRULeaderID) { // Check if preparationRULeaderID is defined
            fetchRULeader(preparationRULeaderID);
        }
    }, [preparationRULeaderID]);

    // Fetch Operation Section Chief
    const fetchOSChief = async (OSChiefId) => {
        try {
            const response = await readBy({
                routeUrl: 'main-section/operation-section-chief/read',
                id: OSChiefId
            })
            setOSChiefData(response);
            console.log("Operation Section Chief Data:", response);
            
        } catch (error) {
            console.error('Error fetching Operation Section Chief data:', error);
            setError('Failed to fetch Operation Section Chief data');
        }
    };

    useEffect(() => {
        if (formData.operation_section_chief_id) { // Check if operation_section_chief_id is defined
            fetchOSChief(formData.operation_section_chief_id);
        }
    }, [formData.operation_section_chief_id]);

    const fetchPersonnelsData = async (ics_204_id) => {
        try {
            const response = await readBy({
                routeUrl: 'ics-204/personnel-assigned/read-by-ics-id',
                id: ics_204_id
            });
            return response;
        } catch (error) {
            console.error('Error fetching personnels data:', error);
            throw error;
        }
    };

    const fetchEquipmentsData = async (ics_204_id) => {
        try {
            const response = await readBy({
                routeUrl: 'ics-204/equipment-assigned/read-by-ics-id',
                id: ics_204_id
            });
            return response;
        } catch (error) {
            console.error('Error fetching equipments data:', error);
            throw error;
        }
    };

    const isPreparedOSChief = preparationOSChiefData?.is_prepared ? '✓' : '✗';
    const preparedDateOSChief = preparationOSChiefData?.date_prepared || "N/A";
    const preparedTimeOSChief = preparationOSChiefData?.time_prepared || "N/A";

    const isPreparedRULeader = preparationRULeaderData?.is_prepared ? '✓' : '✗';
    const preparedDateRULeader = preparationRULeaderData?.date_prepared || "N/A";
    const preparedTimeRULeader = preparationRULeaderData?.time_prepared || "N/A";

    // -------------------------------------------------------------------------
    // Handler Export
    // -------------------------------------------------------------------------
    const handleExportButtonClick = async () => {
        try {
            const response = await axios.post(
                `${apiUrl}ics-204/export-docx/${id}`,
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
            link.setAttribute('download', `ics_204_${id}.docx`); // Nama file yang akan diunduh
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
                    <strong style={{ fontSize: '15px', fontWeight: 'bold' }}>3. Operations Personnel</strong>
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
                                        {OSChiefData.name || 'Unknown Operation Section Chief'}
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                        {OSChiefData.mobile_phone || 'Unknown Contact Number'}
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
                                    <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '25%' }}>
                                        Division/Group
                                    </TableCell>
                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                        {formData.division}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5', width: '25%' }}>
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
                                    {RULeaderData && preparationRULeaderData && (
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div style={{ marginLeft: '5rem' }}>
                                                {RULeaderData.name || "N/A"}
                                            </div>
                                            <div style={{ marginLeft: '5rem' }}>
                                                Position: Resources Unit Leader
                                            </div>
                                            <div style={{ marginLeft: '5rem' }}>
                                                Signature: {isPreparedRULeader}
                                            </div>
                                            <div style={{ marginLeft: '5rem' }}>
                                                Prepared Date: {preparedDateRULeader}
                                            </div>
                                            <div style={{ marginLeft: '5rem' }}>
                                                Prepared Time: {preparedTimeRULeader}
                                            </div>
                                        </div>
                                    )}

                                    {OSChiefData && formData.is_prepared_os_chief && (
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div style={{ marginLeft: '5rem' }}>
                                                {OSChiefData.name || "N/A"}
                                            </div>
                                            <div style={{ marginLeft: '5rem' }}>
                                                Position: Operation Section Chief
                                            </div>
                                            <div style={{ marginLeft: '5rem' }}>
                                                Signature: {isPreparedOSChief}
                                            </div>
                                            <div style={{ marginLeft: '5rem' }}>
                                                Prepared Date: {preparedDateOSChief}
                                            </div>
                                            <div style={{ marginLeft: '5rem' }}>
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