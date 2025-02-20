'use client';

import { ButtonSaveChanges } from '@/components/ButtonComponents';
import FormContainer from '@/components/FormContainer';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import MedicalAidStations from './MedicalAidStations';
import Transportation from './Transportation';
import Hospital from './Hospital';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchOperationalPeriodByIncident } from '@/utils/api';


export default function Detail() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        operational_period_id: null,
        medicalAidStation: [],
        transportation: [],
        hospital: [],
        special_medical_procedures: "",
        is_utilized: false,
        idsToDeleteMedicals: [],
        idsToDeleteTransportations: [],
        idsToDeleteHospitals: [],
    });
    const [incidentData, setIncidentData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [MULeaderData, setMULeaderData] = useState([]);
    const [preparationID, setPreparationID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const hostName = document.location.hostname;
    const apiUrl = `http://${hostName}:8000/api/`;
    const routeUrl = "ics-206/main";

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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch main data
                const responseData = await axios.get(`${apiUrl}${routeUrl}/read/${id}`);
                const mainData = responseData.data;

                // Fetch additional data in parallel
                const [operationalPeriodResponse, preparationResponse, medicalsData, transportationsData, hospitalsData] = await Promise.all([
                    axios.get(`${apiUrl}operational-period/read`),
                    axios.get(`${apiUrl}ics-206/preparation/read-by-ics-206-id/${id}`),
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

    const fetchMedicalsData = async (ics_206_id) => {
        try {
            const response = await axios.get(`${apiUrl}ics-206/medical-aid-station/read-by-ics-id/${ics_206_id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching medical aid station data:", error);
            throw error;
        }
    };

    const fetchTransportationsData = async (ics_206_id) => {
        try {
            const response = await axios.get(`${apiUrl}ics-206/transportation/read-by-ics-id/${ics_206_id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching transportation data:", error);
            throw error;
        }
    };

    const fetchHospitalsData = async (ics_206_id) => {
        try {
            const response = await axios.get(`${apiUrl}ics-206/hospitals/read-by-ics-id/${ics_206_id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching hospital data:", error);
            throw error;
        }
    };

    // Medicals
    const handleAddMedicalsRow = () => {
        setFormData(prevData => ({
            ...prevData,
            medicalAidStation: [...prevData.medicalAidStation, {
                name: "",
                location: "",
                number: "",
                is_paramedic: false,
            }],
        }));
    }

    const handleRemoveMedicalsRow = (index) => {
        setFormData(prevData => ({
            ...prevData,
            medicalAidStation: prevData.medicalAidStation.filter((_, i) => i !== index),
            idsToDeleteMedicals: [...prevData.idsToDeleteMedicals, prevData.medicalAidStation[index].id],
        }));
    }

    const handleMedicalChange = (index, updates) => {
        setFormData(prevData => {
            const newMedicals = [...prevData.medicalAidStation];
            newMedicals[index] = { ...newMedicals[index], ...updates };
            return { ...prevData, medicalAidStation: newMedicals };
        });
    }

    // Transportations
    const handleAddTransportationsRow = () => {
        setFormData(prevData => ({
            ...prevData,
            transportation: [...prevData.transportation, {
                ambulance_service: "",
                location: "",
                number: "",
                is_als: false,
                is_bls: false,
            }],
        }));
    }

    const handleRemoveTransportationsRow = (index) => {
        setFormData(prevData => ({
            ...prevData,
            transportation: prevData.transportation.filter((_, i) => i !== index),
            idsToDeleteTransportations: [...prevData.idsToDeleteTransportations, prevData.transportation[index].id],
        }));
    }

    const handleTransportationChange = (index, updates) => {
        setFormData(prevData => {
            const newTransportations = [...prevData.transportation];
            newTransportations[index] = { ...newTransportations[index], ...updates };
            return { ...prevData, transportation: newTransportations };
        });
    }

    // Hospitals
    const handleAddHospitalsRow = () => {
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
            }],
        }));
    }

    const handleRemoveHospitalsRow = (index) => {
        setFormData(prevData => ({
            ...prevData,
            hospital: prevData.hospital.filter((_, i) => i !== index),
            idsToDeleteHospitals: [...prevData.idsToDeleteHospitals, prevData.hospital[index].id],
        }));
    }

    const handleHospitalChange = (index, updates) => {
        setFormData(prevData => {
            const newHospitals = [...prevData.hospital];
            newHospitals[index] = { ...newHospitals[index], ...updates };
            return { ...prevData, hospital: newHospitals };
        });
    }

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
            const response = await axios.put(`${apiUrl}ics-206/main/update/${id}`, mainPayload);
            const ics_206_id = response.data.id;

            const now = dayjs();
            const preparedPayload = {
                ics_206_id: ics_206_id,
                medical_unit_leader_id: formData.medical_unit_leader_id,
                date_prepared: now.format('YYYY-MM-DD'),
                time_prepared: now.format('HH:mm'),
                is_prepared: formData.is_prepared,
            };
            if (preparationID) {
                await axios.put(`${apiUrl}ics-206/preparation/update/${preparationID}`, preparedPayload);
            } else {
                await axios.post(`${apiUrl}ics-206/preparation/create/`, preparedPayload);
            }

            // Update Medicals, Transportations and Hospitals
            await updateMedicals(formData.medicalAidStation)
            await updateTransportations(formData.transportation)
            await updateHospitals(formData.hospital)

            // Delete marked Medicals, Transportations and Hospitals
            if (formData.idsToDeleteMedicals.length > 0) {
                await axios.delete(`${apiUrl}ics-206/medical-aid-station/delete-many/`, {
                    data: {
                        ids: formData.idsToDeleteMedicals
                    }
                })
            }

            if (formData.idsToDeleteTransportations.length > 0) {
                await axios.delete(`${apiUrl}ics-206/transportation/delete-many/`, {
                    data: {
                        ids: formData.idsToDeleteTransportations
                    }
                })
            }

            if (formData.idsToDeleteHospitals.length > 0) {
                await axios.delete(`${apiUrl}ics-206/hospitals/delete-many/`, {
                    data: {
                        ids: formData.idsToDeleteHospitals
                    }
                })
            }

            alert("Changes saved successfully!");
        } catch (error) {
            console.error('Error submitting data:', error);
            alert(`Failed to submit data: ${error.response?.data?.message || error.message}`);
        }
    };

    const updateMedicals = async (medicalsData) => {
        try {
            // Create new medicals (tanpa ID)
            const newMedicals = medicalsData.filter(m => !m.id);
            if (newMedicals.length > 0) {
                await axios.post(`${apiUrl}ics-206/medical-aid-station/create/`, {
                    datas: newMedicals.map(m => ({
                        ics_206_id: id,
                        ...m,
                    }))
                });
            }

            // Update existing medicals (dengan ID)
            const existingMedicals = medicalsData.filter(m => m.id);
            for (const medical of existingMedicals) {
                await axios.put(
                    `${apiUrl}ics-206/medical-aid-station/update/${medical.id}`,
                    medical
                );
            }
        } catch (error) {
            console.error("Error updating medicals:", error);
            throw error;
        }
    };

    const updateTransportations = async (transportationsData) => {
        try {
            // Create new transportations (tanpa ID)
            const newTransportations = transportationsData.filter(t => !t.id);
            if (newTransportations.length > 0) {
                await axios.post(`${apiUrl}ics-206/transportation/create/`, {
                    datas: newTransportations.map(t => ({
                        ics_206_id: id,
                        ...t
                    }))
                });
            }

            // Update existing transportations (dengan ID)
            const existingTransportations = transportationsData.filter(t => t.id);
            for (const transportation of existingTransportations) {
                await axios.put(
                    `${apiUrl}ics-206/transportation/update/${transportation.id}`,
                    transportation
                );
            }
        } catch (error) {
            console.error("Error updating transportations:", error);
            throw error;
        }
    };

    const updateHospitals = async (hospitalsData) => {
        try {
            // Create new hospitals (tanpa ID)
            const newHospitals = hospitalsData.filter(h => !h.id);
            if (newHospitals.length > 0) {
                await axios.post(`${apiUrl}ics-206/hospitals/create/`, {
                    datas: newHospitals.map(h => ({
                        ics_206_id: id,
                        ...h
                    }))
                });
            }

            // Update existing hospitals (dengan ID)
            const existingHospitals = hospitalsData.filter(h => h.id);
            for (const hospital of existingHospitals) {
                await axios.put(
                    `${apiUrl}ics-206/hospitals/update/${hospital.id}`,
                    hospital
                );
            }
        } catch (error) {
            console.error("Error updating hospitals:", error);
            throw error;
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
        <FormContainer title="ICS 206 - Medical Plan Detail" >
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
                                    onAddRow={handleAddMedicalsRow}
                                    onRemoveRow={handleRemoveMedicalsRow}
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
                                    onAddRow={handleAddTransportationsRow}
                                    onRemoveRow={handleRemoveTransportationsRow}
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
                                    onAddRow={handleAddHospitalsRow}
                                    onRemoveRow={handleRemoveHospitalsRow}
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
                                    checked={formData.is_utilized}
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
                                <ButtonSaveChanges />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form >
            <div className='flex justify-end'>
                <Link href={`/dashboard/iap/ics-206/tobe-approved/${id}`} className="bg-[#61638d] hover:bg-[#393b63] text-white font-bold py-1 px-3 rounded">
                    To Be Approved
                </Link>
            </div>
        </FormContainer >
    )
}
