'use client';

import { ButtonSaveChanges } from '@/components/ButtonComponents';
import FormContainer from '@/components/FormContainer';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import UploadFile from '@/components/UploadFile';


export default function Detail() {
    const { id } = useParams();
    const [formData, setFormData] = useState({});
    const [incidentData, setIncidentData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [safetyOfficerData, setSafetyOfficerData] = useState([]);
    const [preparationID, setPreparationID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const hostName = document.location.hostname;
    const apiUrl = `http://${hostName}:8000/api/`;
    const routeUrl = "ics-208/main";

    useEffect(() => {
        setLoading(true);
        setError(null);

        let operationalPeriodId = null;

        // Ambil data detail
        axios
            .get(`${apiUrl}${routeUrl}/read/${id}`)
            .then(async (response) => {
                setFormData(response.data);
                operationalPeriodId = response.data.operational_period_id;

                // Ambil data file jika ada
                if (response.data.site_safety_plan) {
                    const fileData = await fetchFileData(response.data.site_safety_plan);
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        site_safety_plan: fileData
                    }))
                }

                return axios.get(`${apiUrl}operational-period/read`);
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
            axios.get(`${apiUrl}ics-208/preparation/read-by-ics-208-id/${id}`)
                .then((response) => {
                    if (response.data.length > 0) {
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            is_prepared: response.data[0].is_prepared,
                            safety_officer_id: response.data[0].safety_officer_id,
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

    const handleFileUpload = async (filename) => {
        try {
            await axios.put(`${apiUrl}ics-208/main/update/${id}`, {
                site_safety_plan: filename,
            });

            setFormData(prevData => ({
                ...prevData,
                site_safety_plan: filename,
            }));
        } catch (error) {
            console.error('Error updating site safety plan:', error);
        }
    };

    const handleDeleteFile = async () => {
        setFormData(prevData => ({
            ...prevData,
            site_safety_plan: null,
        }));
    };

    const fetchFileData = async (filename) => {
        if (filename) {
            try {
                const response = await axios.get(
                    `http://localhost:8000/file/get/${filename}`, {
                    responseType: 'blob',
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                }
                );
                return filename;
            } catch (error) {
                console.error('Error fetching map sketch:', error);
                return null;
            }
        }
        return null;
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
        const selectedValue = e.target.value;

        const operational_period_id = selectedValue ? parseInt(selectedValue, 10) : null;
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validasi data sebelum mengirim
            if (!formData.operational_period_id) {
                alert("Please select an Operational Period.");
                return;
            }
            if (!formData.safety_officer_id) {
                alert('Please fill in all required fields.');
                return;
            }

            const mainPayload = {
                operational_period_id: formData.operational_period_id,
                message: formData.message,
                is_required: formData.is_required,
                site_safety_plan: formData.site_safety_plan,
                additional_comments: formData.additional_comments,
            };
            const response = await axios.put(`${apiUrl}ics-208/main/update/${id}`, mainPayload);
            const ics_208_id = response.data.id;

            const now = dayjs();
            const preparedPayload = {
                ics_208_id: ics_208_id,
                safety_officer_id: formData.safety_officer_id,
                date_prepared: now.format('YYYY-MM-DD'),
                time_prepared: now.format('HH:mm'),
                is_prepared: formData.is_prepared,
            };
            if (preparationID) {
                await axios.put(`${apiUrl}ics-208/preparation/update/${preparationID}`, preparedPayload);
            } else {
                await axios.post(`${apiUrl}ics-208/preparation/create`, preparedPayload);
            }

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

    const fetchSafetyOfficer = async () => {
        try {
            const response = await axios.get(`${apiUrl}main-section/safety-officer/read/`);
            setSafetyOfficerData(response.data);
        } catch (error) {
            console.error('Error fetching Planning Section Chief data:', error);
            setError('Failed to fetch Planning Section Chief data');
        }
    };

    useEffect(() => {
        fetchSafetyOfficer();
    }, []);

    return (
        <FormContainer title="ICS 208 - Safety Message/Plan Detail" >
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

                        {/* <!-- Baris untuk Safety Message/Expanded Safety Message, Safety Plan, Site Safety Plan --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan="3">Safety Message/Expanded Safety Message, Safety Plan, Site Safety Plan</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan="3">
                                <textarea
                                    name="message"
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="7"
                                    cols="50"
                                    onChange={handleChange}
                                    value={formData.message}
                                    required
                                />
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Site Safety Plan Required? --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold">
                                <span>
                                    Site Safety Plan Required?
                                </span>
                                <input
                                    name='is_required'
                                    type="checkbox"
                                    className='ml-2'
                                    onChange={handleChange}
                                    checked={formData.is_required || false}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 py-2" colSpan={7}>
                                <UploadFile
                                    onFileUpload={handleFileUpload}
                                    titleName='Upload Site Safety Plan'
                                    currentFile={formData.site_safety_plan}
                                    onDeleteFile={handleDeleteFile}
                                    disabled={!formData.is_required}
                                    id={id}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td className="px-4 pt-4">
                                <span className="font-bold">
                                    Additional Safety Message(s)
                                </span>
                                <textarea
                                    name='additional_comments'
                                    className="w-full px-3 py-2 border rounded-md"
                                    onChange={handleChange}
                                    value={formData.additional_comments}
                                    rows="3">
                                </textarea>
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
                                <select
                                    name="safety_officer_id"
                                    className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                    value={formData.safety_officer_id || ""}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        safety_officer_id: e.target.value
                                    }))}
                                    required
                                >
                                    <option value="" disabled>
                                        Select Planning Section Chief
                                    </option>
                                    {safetyOfficerData.map(officer => (
                                        <option key={officer.id} value={officer.id}>
                                            {officer.name}
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
                                    required
                                />
                                Signature
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Tombol Submit --> */}
                        <tr>
                            <td colSpan={6} className="text-right align-bottom px-4 py-2">
                                <ButtonSaveChanges />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form >
        </FormContainer >
    )
}
