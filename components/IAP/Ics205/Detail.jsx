'use client';

import { ButtonSaveChanges } from '@/components/ButtonComponents';
import FormContainer from '@/components/FormContainer';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import RadioChannel from './RadioChannel';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';

export default function Detail() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        operational_period_id: null,
        communication_unit_leader_id: null,
        special_instructions: "",
        radioChannel: [],
        idsToDeleteRadioChannels: [],
    });
    const [incidentData, setIncidentData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [CULeaderData, setCULeaderData] = useState([]);
    const [preparationID, setPreparationID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiUrl = 'http://127.0.0.1:8000/'
    const routeUrl = "ics-205/main";

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch main data
                const responseData = await axios.get(`${apiUrl}${routeUrl}/read/${id}`);
                const mainData = responseData.data;

                // Fetch additional data in parallel
                const [operationalPeriodResponse, preparationResponse, radioChannelsData] = await Promise.all([
                    axios.get(`${apiUrl}operational-period/read`),
                    axios.get(`${apiUrl}ics-205/preparation/read-by-ics-205-id/${id}`),
                    fetchRadioChannelsData(mainData.id),
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
                    radioChannel: radioChannelsData.length > 0 ? radioChannelsData : [
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
                    ...(preparationData && {
                        is_prepared: preparationData.is_prepared,
                        communication_unit_leader_id: preparationData.communication_unit_leader_id,
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

    const fetchRadioChannelsData = async (ics_205_id) => {
        try {
            const response = await axios.get(`${apiUrl}ics-205/radio-channel/read-by-ics-id/${ics_205_id}`);
            return response.data;
        } catch (err) {
            console.error("Error fetching radio channels:", err);
            setError("Failed to fetch radio channels");
            return [];
        }
    };

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
    const handleRadioChannelChange = (index, updates) => {
        setFormData(prevData => {
            const newRadioChannels = [...prevData.radioChannel];
            newRadioChannels[index] = { ...newRadioChannels[index], ...updates };
            return { ...prevData, radioChannel: newRadioChannels };
        });
    };

    // Functions to add/remove rows in child components
    const addRadioChannelRow = () => {
        setFormData(prevData => ({
            ...prevData,
            radioChannel: [...prevData.radioChannel, {
                channel_number: "",
                channel_name: "",
                type_specification: "",
                frequency: "",
                mode: "",
                functions: "",
                assignment: "",
                remarks: "",
            }],
        }));
    };

    const removeRadioChannelRow = (index) => {
        const radioChannelId = formData.radioChannel[index].id;
        if (radioChannelId) {
            setFormData(prevData => ({
                ...prevData,
                radioChannel: prevData.radioChannel.filter((_, i) => i !== index),
                idsToDeleteRadioChannels: [...prevData.idsToDeleteRadioChannels, radioChannelId],
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                radioChannel: prevData.radioChannel.filter((_, i) => i !== index),
            }));
        }
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
                special_instructions: formData.special_instructions,
            };

            // Kalau tidak mau overwrite maka tinggal create saja. tapi dengan fetch data lama

            const response = await axios.put(`${apiUrl}ics-205/main/update/${id}/`, mainPayload);
            const ics_205_id = response.data.id;

            const now = dayjs();
            const preparedPayload = {
                ics_205_id: ics_205_id,
                communication_unit_leader_id: formData.communication_unit_leader_id,
                is_prepared: formData.is_prepared,
                date_prepared: now.format('YYYY-MM-DD'),
                time_prepared: now.format('HH:mm'),
            };
            if (preparationID) {
                await axios.put(`${apiUrl}ics-205/preparation/update/${preparationID}/`, preparedPayload);
            } else {
                await axios.post(`${apiUrl}ics-205/preparation/create/`, preparedPayload);
            }

            // Update radio channels
            await updateRadioChannels(formData.radioChannel)

            // Delete marked radios
            if (formData.idsToDeleteRadioChannels.length > 0) {
                await axios.delete(`${apiUrl}ics-205/radio-channel/delete-many/`, {
                    data: {
                        ids: formData.idsToDeleteRadioChannels
                    }
                });
            }

            console.log('Data submitted successfully:', response.data);
            alert('Data submitted successfully');
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data');
        }
    };

    const updateRadioChannels = async (radioChannelsData) => {
        try {
            // Create new Radios (without id)
            const newRadioChannels = radioChannelsData.filter(radio => !radio.id);
            if (newRadioChannels.length > 0) {
                await axios.post(`${apiUrl}ics-205/radio-channel/create/`, {
                    datas: newRadioChannels.map(radio => ({
                        ics_205_id: id,
                        ...radio
                    }))
                });
            }

            // Update existing Radios (with id)
            const existingRadioChannels = radioChannelsData.filter(radio => radio.id);
            for (const radio of existingRadioChannels) {
                await axios.put(
                    `${apiUrl}ics-205/radio-channel/update/${radio.id}`,
                    { ...radio, ics_205_id: id }
                );
            }
        } catch (error) {
            console.error('Error updating radio channels:', error);
            throw error;
        }
    }

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

    const fetchCULeader = async () => {
        try {
            const response = await axios.get(`${apiUrl}logistic-section/communication-unit-leader/read/`);
            setCULeaderData(response.data);
            console.log("Communication Unit Leader Data:", response.data);
        } catch (error) {
            console.error('Error fetching Communication Unit Leader data:', error);
            setError('Failed to fetch Communication Unit Leader data');
        }
    };

    useEffect(() => {
        fetchCULeader();
    }, []);

    if (incidentData.length === 0 || CULeaderData.length === 0) {
        return <div>Loading...</div>;
    }

    if (error) return <p className="text-red-500">{error}</p>;


    return (
        <FormContainer title="Input ICS 205 - Radio Communication Plan" >
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
                        {/* <!-- Baris untuk Basic Radio Channel Use --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Basic Radio Channel Use</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <RadioChannel
                                    rowsRadios={formData.radioChannel}
                                    onAddRow={addRadioChannelRow}
                                    onRemoveRow={removeRadioChannelRow}
                                    onChangeRow={handleRadioChannelChange}
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

                        {/* Prepared by */}
                        <tr>
                            <td className="px-4 py-2 font-bold">
                                Prepared by:
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">
                                {/* Select untuk Communication Unit Leader */}
                                <select
                                    name="communication_unit_leader_id"
                                    className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                    value={formData.communication_unit_leader_id || ""}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        communication_unit_leader_id: e.target.value
                                    }))}
                                    required
                                >
                                    <option value="" disabled>
                                        Select Communcation Unit Leader
                                    </option>
                                    {CULeaderData.map(leader => (
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
        </FormContainer >
    )
}
