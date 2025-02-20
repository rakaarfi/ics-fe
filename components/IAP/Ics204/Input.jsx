'use client';

import { ButtonSubmit } from '@/components/ButtonComponents';
import FormContainer from '@/components/FormContainer';
import React, { useEffect, useState } from 'react'
import PersonnelAssigned from './PersonnelAssigned';
import EquipmentAssigned from './EquipmentAssigned';
import axios from 'axios';
import dayjs from 'dayjs';


export default function Input() {
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
        equipmentAssigned: [
            {
                kind: "",
                quantity: "",
                type_specification: "",
                number: "",
                location: "",
                remarks: "",
            },
        ],
        personnelAssigned: [
            {
                name: "",
                number: "",
                location: "",
                equipment_tools_remarks: ""
            },
        ],
    });
    const [incidentData, setIncidentData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [OSChiefData, setOSChiefData] = useState([]);
    const [RULeaderData, setRULeaderData] = useState([]);
    const [operationSectionChiefNumber, setOperationSectionChiefNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const hostName = document.location.hostname;
    const apiUrl = `http://${hostName}:8000/api/`;

    const handleIncidentChange = (e) => {
        const incident_id = parseInt(e.target.value, 10);
        if (!incident_id) return;

        setLoading(true);
        setError(null);
        setOperationalPeriodData([]);
        setFormData((prevState) => ({
            ...prevState,
            incident_id,
            operational_period_id: "",
        }));

        axios.get(`${apiUrl}operational-period/read-by-incident/${incident_id}`)
            .then((response) => {
                setOperationalPeriodData(response.data);
            })
            .catch(() => setError('Failed to fetch operational period data'))
            .finally(() => setLoading(false));
    };


    const handleOperationalPeriodChange = (e) => {
        const operational_period_id = parseInt(e.target.value, 10);
        setFormData(prevState => ({
            ...prevState,
            operational_period_id
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Functions to handle changes in child components
    const handleEquipmentsChange = (index, updates) => {
        setFormData(prevData => {
            const newEquipments = [...prevData.equipmentAssigned];
            newEquipments[index] = { ...newEquipments[index], ...updates };
            return { ...prevData, equipmentAssigned: newEquipments };
        });
    };

    const handlePersonnelsChange = (index, updates) => {
        setFormData(prevData => {
            const newPersonnels = [...prevData.personnelAssigned];
            newPersonnels[index] = { ...newPersonnels[index], ...updates };
            return { ...prevData, personnelAssigned: newPersonnels };
        });
    };

    // Functions to add/remove rows in child components
    const addEquipmentsRow = () => {
        setFormData(prevData => ({
            ...prevData,
            equipmentAssigned: [...prevData.equipmentAssigned, {
                kind: "",
                quantity: "",
                type_specification: "",
                number: "",
                location: "",
                remarks: "",
            },],
        }));
    };

    const removeEquipmentsRow = (index) => {
        setFormData(prevData => ({
            ...prevData,
            equipmentAssigned: prevData.equipmentAssigned.filter((_, i) => i !== index),
        }));
    };

    const addPersonnelsRow = () => {
        setFormData(prevData => ({
            ...prevData,
            personnelAssigned: [...prevData.personnelAssigned, {
                name: "",
                number: "",
                location: "",
                equipment_tools_remarks: ""
            },],
        }));
    };

    const removePersonnelsRow = (index) => {
        setFormData(prevData => ({
            ...prevData,
            personnelAssigned: prevData.personnelAssigned.filter((_, i) => i !== index),
        }));
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validasi data sebelum mengirim
            if (!formData.operational_period_id) {
                alert("Please select an Operational Period.");
                return;
            }

            // Validasi minimal salah satu select terisi
            if (!formData.is_prepared_os_chief && !formData.is_prepared_ru_leader) {
                setError("Please select at least one of Operation Section Chief or Resources Unit Leader.");
                return;
            } else {
                setError(null); // Reset error jika valid
            }

            // Validasi Operation Section Chief Number harus terisi
            if (!operationSectionChiefNumber) {
                setError("Please select an Operational Period.");
                return;
            } else {
                setError(null); // Reset error jika valid
            }

            const mainPayload = {
                operational_period_id: formData.operational_period_id,
                operation_section_chief_id: formData.operation_section_chief_id,
                branch_director_name: formData.branch_director_name,
                branch_director_number: formData.branch_director_number,
                division_supervisor_name: formData.division_supervisor_name,
                division_supervisor_number: formData.division_supervisor_number,
                branch: formData.branch,
                division: formData.division,
                staging_area: formData.staging_area,
                work_assignment: formData.work_assignment,
                special_instructions: formData.special_instructions,
                radio_channel_number: formData.radio_channel_number,
                frequency: formData.frequency,
                communication_mode: formData.communication_mode,
                mobile_phone: formData.mobile_phone,
            };
            const response = await axios.post(`${apiUrl}ics-204/main/create`, mainPayload);
            const ics_204_id = response.data.id;

            const now = dayjs();
            // Payload untuk OS Chief
            if (formData.is_prepared_os_chief) {
                const preparedOSChiefPayload = {
                    ics_204_id: ics_204_id,
                    operation_section_chief_id: formData.operation_section_chief_id,
                    date_prepared: now.format('YYYY-MM-DD'),
                    time_prepared: now.format('HH:mm'),
                    is_prepared: formData.is_prepared_os_chief,
                };
                await axios.post(`${apiUrl}ics-204/preparation-os-chief/create/`, preparedOSChiefPayload);
            }

            // Payload untuk RU Leader
            if (formData.is_prepared_ru_leader) {
                const preparedRULeaderPayload = {
                    ics_204_id: ics_204_id,
                    resources_unit_leader_id: formData.resources_unit_leader_id,
                    date_prepared: now.format('YYYY-MM-DD'),
                    time_prepared: now.format('HH:mm'),
                    is_prepared: formData.is_prepared_ru_leader,
                };
                await axios.post(`${apiUrl}ics-204/preparation-ru-leader/create/`, preparedRULeaderPayload);
            }

            const personnelPayloads = {
                datas: formData.personnelAssigned.map(row => ({
                    ics_204_id: ics_204_id,
                    name: row.name,
                    number: row.number,
                    location: row.location,
                    equipment_tools_remarks: row.equipment_tools_remarks,
                }))
            }
            await axios.post(`${apiUrl}ics-204/personnel-assigned/create/`, personnelPayloads);

            const equipmentsPayloads = {
                datas: formData.equipmentAssigned.map(row => ({
                    ics_204_id: ics_204_id,
                    kind: row.kind,
                    quantity: row.quantity,
                    type_specification: row.type_specification,
                    number: row.number,
                    location: row.location,
                    remarks: row.remarks,
                }))
            }
            await axios.post(`${apiUrl}ics-204/equipment-assigned/create/`, equipmentsPayloads);

            alert('Data submitted successfully!');
        } catch (error) {
            console.error('Error submitting data:', error);
            alert(`Failed to submit data: ${error.response?.data?.message || error.message}`);
        }
    };

    const fetchIncidentData = async () => {
        try {
            const response = await axios.get(`${apiUrl}incident-data/read`);
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
            const response = await axios.get(`${apiUrl}planning-section/resources-unit-leader/read/`);
            setRULeaderData(response.data);
            console.log("Resources Unit Leader Data:", response.data);
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
            const response = await axios.get(`${apiUrl}main-section/operation-section-chief/read/`);
            setOSChiefData(response.data);
            console.log("Operation Section Chief Data:", response.data);
        } catch (error) {
            console.error('Error fetching Operation Section Chief data:', error);
            setError('Failed to fetch Operation Section Chief data');
        }
    };

    useEffect(() => {
        fetchOSChief();
    }, []);

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
    
    return (
        <FormContainer title="Input ICS 204 - Assignment List" >
            <div className="mb-4 flex flex-row">
                <select
                    className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                    value={formData.incident_id || ""}
                    onChange={handleIncidentChange}
                    required
                >
                    <option value="" disabled>
                        Select Incident
                    </option>
                    {incidentData.map((incident) => (
                        <option key={incident.id} value={incident.id}>
                            {incident.name}
                        </option>
                    ))}
                </select>

                <select
                    className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                    value={formData.operational_period_id || ""}
                    onChange={handleOperationalPeriodChange}
                    disabled={loading || !formData.incident_id}
                    required
                >
                    <option value="" disabled>
                        {loading ? 'Loading...' : 'Select Operational Period'}
                    </option>
                    {operationalPeriodData.map((period) => (
                        <option key={period.id} value={period.id}>
                            {period.date_from} - {period.date_to}
                        </option>
                    ))}
                </select>
            </div>
            <form onSubmit={handleSubmit}>
                <table className="table-auto border-collapse w-full">
                    <tbody>
                        {/* <!-- Baris untuk Operations Personnel --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Operations Personnel</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <div className="flex w-full">
                                    {/* Tabel Pertama */}
                                    <table className="table-auto border-collapse w-1/2 mr-2">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 border"></th>
                                                <th className="px-4 py-2 border">Name</th>
                                                <th className="px-4 py-2 border">Contact Number</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="px-4 py-2 border font-bold">Operation Section Chief</td>
                                                <td className="px-4 py-2 border">
                                                    <select
                                                        name="operation_section_chief_id"
                                                        className="flex-1 block rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                                        value={formData.operation_section_chief_id || ""}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            operation_section_chief_id: e.target.value
                                                        }))}
                                                        required={!formData.resources_unit_leader_id}
                                                    >
                                                        <option value="" disabled>
                                                            Select Operation Section Chief
                                                        </option>
                                                        {OSChiefData.map(chief => (
                                                            <option key={chief.id} value={chief.id}>
                                                                {chief.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        value={operationSectionChiefNumber} // Menampilkan nomor telepon
                                                        className="w-full px-2 py-1 border rounded bg-gray-100" // Styling untuk tampilan read-only
                                                        readOnly // Membuat input field read-only
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border font-bold">Branch Director</td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        name='branch_director_name'
                                                        value={formData.branch_director_name}
                                                        onChange={handleChange}
                                                        className="w-full px-2 py-1 border rounded"
                                                        placeholder="Enter name"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        name='branch_director_number'
                                                        value={formData.branch_director_number}
                                                        onChange={handleChange}
                                                        className="w-full px-2 py-1 border rounded"
                                                        placeholder="Enter contact number"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border font-bold">Division/Group Supervisor</td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        name='division_supervisor_name'
                                                        value={formData.division_supervisor_name}
                                                        onChange={handleChange}
                                                        className="w-full px-2 py-1 border rounded"
                                                        placeholder="Enter name"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        name='division_supervisor_number'
                                                        value={formData.division_supervisor_number}
                                                        onChange={handleChange}
                                                        className="w-full px-2 py-1 border rounded"
                                                        placeholder="Enter contact number"
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    {/* Tabel Kedua */}
                                    <table className="table-auto border-collapse w-1/2 ml-2">
                                        <tbody>
                                            <tr>
                                                <td className="px-4 py-2 border font-bold">Branch</td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        name='branch'
                                                        value={formData.branch}
                                                        onChange={handleChange}
                                                        className="w-full px-2 py-1 border rounded"
                                                        placeholder="Enter details"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border font-bold">Division/Group</td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        name='division'
                                                        value={formData.division}
                                                        onChange={handleChange}
                                                        className="w-full px-2 py-1 border rounded"
                                                        placeholder="Enter details"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border font-bold">Staging Area</td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        name='staging_area'
                                                        value={formData.staging_area}
                                                        onChange={handleChange}
                                                        className="w-full px-2 py-1 border rounded"
                                                        placeholder="Enter details"
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Personnel Assigned --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Personnel Assigned</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <PersonnelAssigned
                                    rowsPersonnels={formData.personnelAssigned}
                                    onAddRow={addPersonnelsRow}
                                    onRemoveRow={removePersonnelsRow}
                                    onChangeRow={handlePersonnelsChange}
                                />
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Equipment & Materials Assigned --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Equipment & Materials Assigned</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <EquipmentAssigned
                                    rowsEquipments={formData.equipmentAssigned}
                                    onAddRow={addEquipmentsRow}
                                    onRemoveRow={removeEquipmentsRow}
                                    onChangeRow={handleEquipmentsChange}
                                />
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Work Assignment --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Work Assignment</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <textarea
                                    name="work_assignment"
                                    value={formData.work_assignment}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="7"
                                    cols="50"
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Special Instructions --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Special Instructions</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <textarea
                                    name="special_instructions"
                                    value={formData.special_instructions}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="7"
                                    cols="50"
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Communications --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Communications (radio and/or contact numbers needed for this assignment)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                {/* Container untuk label dan input */}
                                <div className="space-y-4">
                                    {/* Radio Communication Channel Number */}
                                    <div className="flex items-center">
                                        <label htmlFor="radio_channel_number" className="w-1/4 pr-4">Radio Communication Channel Number</label>
                                        <input
                                            id="radio_channel_number"
                                            name="radio_channel_number"
                                            className="w-3/4 px-3 py-2 border rounded-md"
                                            value={formData.radio_channel_number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Frequency */}
                                    <div className="flex items-center">
                                        <label htmlFor="frequency" className="w-1/4 pr-4">Frequency</label>
                                        <input
                                            id="frequency"
                                            name="frequency"
                                            className="w-3/4 px-3 py-2 border rounded-md"
                                            value={formData.frequency}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Communication Mode (Digital, Analog, Mixed) */}
                                    <div className="flex items-center">
                                        <label htmlFor="communication_mode" className="w-1/4 pr-4">Communication Mode (Digital, Analog, Mixed)</label>
                                        <input
                                            id="communication_mode"
                                            name="communication_mode"
                                            className="w-3/4 px-3 py-2 border rounded-md"
                                            value={formData.communication_mode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Mobile Phone Number */}
                                    <div className="flex items-center">
                                        <label htmlFor="mobile_phone" className="w-1/4 pr-4">Mobile Phone Number</label>
                                        <input
                                            id="mobile_phone"
                                            name="mobile_phone"
                                            className="w-3/4 px-3 py-2 border rounded-md"
                                            value={formData.mobile_phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        {/* Prepared by */}
                        <tr>
                            <td className="px-4 py-2 font-bold">
                                Prepared by:
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">
                                {/* Select untuk Resources Unit Leader */}
                                <select
                                    name="resources_unit_leader_id"
                                    className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                    value={formData.resources_unit_leader_id || ""}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        resources_unit_leader_id: e.target.value
                                    }))}
                                    required={!formData.operation_section_chief_id}
                                >
                                    <option value="" disabled>
                                        Select Resources Unit Leader
                                    </option>
                                    {RULeaderData.map(chief => (
                                        <option key={chief.id} value={chief.id}>
                                            {chief.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="checkbox"
                                    name="is_prepared_ru_leader" // Nama field berbeda
                                    checked={formData.is_prepared_ru_leader || false}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        is_prepared_ru_leader: e.target.checked
                                    }))}
                                    className="mr-2"
                                />
                                Signature (Resources Unit Leader)
                            </td>
                        </tr>

                        {/* Prepared by */}
                        <tr>
                            <td className="px-4 py-2">
                                {/* Select untuk Operation Section Chief */}
                                <select
                                    name="operation_section_chief_id"
                                    className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                    value={formData.prepared_operation_section_chief_id || ""}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        prepared_operation_section_chief_id: e.target.value
                                    }))}
                                    disabled={formData.is_prepared_os_chief} // Tidak bisa diedit jika OS Chief dicentang
                                    required={!formData.resources_unit_leader_id}
                                >
                                    <option value="" disabled>
                                        Select Prepared by Operation Section Chief
                                    </option>
                                    {OSChiefData.map(chief => (
                                        <option key={chief.id} value={chief.id}>
                                            {chief.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="checkbox"
                                    name="is_prepared_os_chief"
                                    checked={formData.is_prepared_os_chief || false}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        is_prepared_os_chief: e.target.checked
                                    }))}
                                    className="mr-2"
                                />
                                Signature (Operation Section Chief)
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Tombol Submit --> */}
                        <tr>
                            <td colSpan={7} className="text-right px-4 py-2">
                                <ButtonSubmit />
                            </td>
                        </tr>
                    </tbody>
                </table>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form >
        </FormContainer >
    )
}
