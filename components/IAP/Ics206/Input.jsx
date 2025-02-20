'use client';

import { ButtonSubmit } from '@/components/ButtonComponents';
import FormContainer from '@/components/FormContainer';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import MedicalAidStations from './MedicalAidStations';
import Transportation from './Transportation';
import Hospital from './Hospital';
import dayjs from 'dayjs';
import { fetchOperationalPeriodByIncident } from '@/utils/api';


export default function Input() {
    const [formData, setFormData] = useState({
        operational_period_id: null,
        medicalAidStation: [
            {
                name: "",
                location: "",
                number: "",
                is_paramedic: false,
            },
        ],
        transportation: [
            {
                ambulance_service: "",
                location: "",
                number: "",
                is_als: false,
                is_bls: false,
            },
        ],
        hospital: [
            {
                name: "",
                address: "",
                number: "",
                air_travel_time: "",
                ground_travel_time: "",
                is_trauma_center: false,
                level_trauma_center: "",
                is_burn_center: false,
                is_helipad: false,
            },
        ],
        special_medical_procedures: "",
        is_utilized: false,
    });
    const [incidentData, setIncidentData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [MULeaderData, setMULeaderData] = useState([]);
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

        fetchOperationalPeriodByIncident(incident_id)
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
    const handleMedicalChange = (index, updates) => {
        setFormData(prevData => {
            const newMedicals = [...prevData.medicalAidStation];
            newMedicals[index] = { ...newMedicals[index], ...updates };
            return { ...prevData, medicalAidStation: newMedicals };
        });
    };

    const handleTransportationChange = (index, updates) => {
        setFormData(prevData => {
            const newTransportations = [...prevData.transportation];
            newTransportations[index] = { ...newTransportations[index], ...updates };
            return { ...prevData, transportation: newTransportations };
        });
    };

    const handleHospitalChange = (index, updates) => {
        setFormData(prevData => {
            const newHospitals = [...prevData.hospital];
            newHospitals[index] = { ...newHospitals[index], ...updates };
            return { ...prevData, hospital: newHospitals };
        });
    };

    // Functions to add/remove rows in child components
    const addMedicalsRow = () => {
        setFormData(prevData => ({
            ...prevData,
            medicalAidStation: [...prevData.medicalAidStation, {
                name: "",
                location: "",
                number: "",
                is_paramedic: false,
            },],
        }));
    };

    const removeMedicalsRow = (index) => {
        setFormData(prevData => ({
            ...prevData,
            medicalAidStation: prevData.medicalAidStation.filter((_, i) => i !== index),
        }));
    };

    const addTransportationsRow = () => {
        setFormData(prevData => ({
            ...prevData,
            transportation: [...prevData.transportation, {
                ambulance_service: "",
                location: "",
                number: "",
                is_als: false,
                is_bls: false,
            },],
        }));
    };

    const removeTransportationsRow = (index) => {
        setFormData(prevData => ({
            ...prevData,
            transportation: prevData.transportation.filter((_, i) => i !== index),
        }));
    };

    const addHospitalsRow = () => {
        setFormData(prevData => ({
            ...prevData,
            hospital: [...prevData.hospital, {
                name: "",
                address: "",
                number: "",
                air_travel_time: "",
                ground_travel_time: "",
                is_trauma_center: false,
                level_trauma_center: "",
                is_burn_center: false,
                is_helipad: false,
            },],
        }));
    };

    const removeHospitalsRow = (index) => {
        setFormData(prevData => ({
            ...prevData,
            hospital: prevData.hospital.filter((_, i) => i !== index),
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

            const mainPayload = {
                operational_period_id: formData.operational_period_id,
                special_medical_procedures: formData.special_medical_procedures,
                is_utilized: formData.is_utilized,
            };
            const response = await axios.post(`${apiUrl}ics-206/main/create`, mainPayload);
            const ics_206_id = response.data.id;

            const now = dayjs();
            const preparedPayload = {
                ics_206_id: ics_206_id,
                medical_unit_leader_id: formData.medical_unit_leader_id,
                date_prepared: now.format('YYYY-MM-DD'),
                time_prepared: now.format('HH:mm'),
                is_prepared: formData.is_prepared,
            };
            await axios.post(`${apiUrl}ics-206/preparation/create/`, preparedPayload);

            const medicalPayloads = {
                datas: formData.medicalAidStation.map(row => ({
                    ics_206_id: ics_206_id,
                    name: row.name,
                    location: row.location,
                    number: row.number,
                    is_paramedic: row.is_paramedic,
                }))
            }
            await axios.post(`${apiUrl}ics-206/medical-aid-station/create/`, medicalPayloads);

            const transportationPayloads = {
                datas: formData.transportation.map(row => ({
                    ics_206_id: ics_206_id,
                    ambulance_service: row.ambulance_service,
                    location: row.location,
                    number: row.number,
                    is_als: row.is_als,
                    is_bls: row.is_bls,
                }))
            }
            await axios.post(`${apiUrl}ics-206/transportation/create/`, transportationPayloads);

            const hospitalPayloads = {
                datas: formData.hospital.map(row => ({
                    ics_206_id: ics_206_id,
                    name: row.name,
                    address: row.address,
                    number: row.number,
                    air_travel_time: row.air_travel_time,
                    ground_travel_time: row.ground_travel_time,
                    is_trauma_center: row.is_trauma_center,
                    level_trauma_center: row.level_trauma_center,
                    is_burn_center: row.is_burn_center,
                    is_helipad: row.is_helipad,
                }))
            }
            await axios.post(`${apiUrl}ics-206/hospitals/create/`, hospitalPayloads);

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

    const fetchMULeader = async () => {
        try {
            const response = await axios.get(`${apiUrl}logistic-section/medical-unit-leader/read/`);
            setMULeaderData(response.data);
            console.log("Medical Unit Leader Data:", response.data);
        } catch (error) {
            console.error('Error fetching Medical Unit Leader data:', error);
            setError('Failed to fetch Medical Unit Leader data');
        }
    };

    useEffect(() => {
        fetchMULeader();
    }, []);

    return (
        <FormContainer title="Input ICS 206 - Medical Plan" >
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
            <form
                onSubmit={handleSubmit}
            >
                <table className="table-auto border-collapse w-full">
                    <tbody>

                        {/* <!-- Baris untuk Medical Aid Stations --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Medical Aid Stations</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <MedicalAidStations
                                    rowsMedicals={formData.medicalAidStation}
                                    onAddRow={addMedicalsRow}
                                    onRemoveRow={removeMedicalsRow}
                                    onChangeRow={handleMedicalChange}
                                />
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Transportation (indicate air or ground) --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Transportation (indicate air or ground)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <Transportation
                                    rowsTransportations={formData.transportation}
                                    onAddRow={addTransportationsRow}
                                    onRemoveRow={removeTransportationsRow}
                                    onChangeRow={handleTransportationChange}
                                />
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Hospitals --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Hospitals</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <Hospital
                                    rowsHospitals={formData.hospital}
                                    onAddRow={addHospitalsRow}
                                    onRemoveRow={removeHospitalsRow}
                                    onChangeRow={handleHospitalChange}
                                />
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Special Medical Emergency Procedures --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Special Medical Emergency Procedures</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <textarea
                                    name="special_medical_procedures"
                                    value={formData.special_medical_procedures}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="7"
                                    cols="50"
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Check box if aviation Assets are utilized for rescue. If assets are used, coordinate with Air Operations. --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>
                                <input
                                    type="checkbox"
                                    name='is_utilized'
                                    value={formData.is_utilized}
                                    onChange={handleChange}
                                    className="w-4 h-4 border rounded"
                                />
                                <span className="ml-2">
                                    Check box if aviation Assets are utilized for rescue. If assets are used, coordinate with Air Operations.
                                </span>
                            </td>
                        </tr>

                        {/* Prepared by */}
                        <tr>
                            <td className="px-4 py-2">
                                {/* Select untuk Medical Unit Leader */}
                                <select
                                    name="medical_unit_leader_id"
                                    className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                    value={formData.medical_unit_leader_id || ""}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        medical_unit_leader_id: e.target.value
                                    }))}
                                    required
                                >
                                    <option value="" disabled>
                                        Select Prepared by Medical Unit Leader
                                    </option>
                                    {MULeaderData.map(leader => (
                                        <option key={leader.id} value={leader.id}>
                                            {leader.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="checkbox"
                                    name="is_prepared"
                                    checked={formData.is_prepared || false}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        is_prepared: e.target.checked
                                    }))}
                                    className="mr-2"
                                />
                                Signature
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
            </form >
        </FormContainer >
    )
}
