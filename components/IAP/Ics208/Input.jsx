'use client';

import { ButtonSubmit } from '@/components/ButtonComponents';
import FormContainer from '@/components/FormContainer';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import UploadFile from '@/components/UploadFile';


export default function Input() {
    const [formData, setFormData] = useState({});
    const [incidentData, setIncidentData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [safetyOfficerData, setSafetyOfficerData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiUrl = 'http://127.0.0.1:8000/'

    // Fungsi untuk menangani perubahan nama file yang diunggah
    const handleFileUpload = (filename) => {
        setFormData(prevData => ({
            ...prevData,
            site_safety_plan: filename, // Simpan nama file ke state formData
        }));
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
            if (formData.is_required) {
                alert("Please upload the file first!");
                return;
            }
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
            const response = await axios.post(`${apiUrl}ics-208/main/create`, mainPayload);
            const ics_208_id = response.data.id;

            const now = dayjs();
            const preparedPayload = {
                ics_208_id: ics_208_id,
                safety_officer_id: formData.safety_officer_id,
                date_prepared: now.format('YYYY-MM-DD'),
                time_prepared: now.format('HH:mm'),
                is_prepared: formData.is_prepared,
            };
            await axios.post(`${apiUrl}ics-208/preparation/create/`, preparedPayload);

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
            console.log("Incident Data:", response.data);

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
            console.log("Planning Section Chief Data:", response.data);
        } catch (error) {
            console.error('Error fetching Planning Section Chief data:', error);
            setError('Failed to fetch Planning Section Chief data');
        }
    };

    useEffect(() => {
        fetchSafetyOfficer();
    }, []);

    return (
        <FormContainer title="Input ICS 208 - Safety Message/Plan" >
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
                                <UploadFile onFileUpload={handleFileUpload} titleName='Upload Site Safety Plan' disabled={!formData.is_required}/>
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
                                        Select Safety Officer
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
                            <td className="text-right px-4 py-2" colSpan="3">
                                <ButtonSubmit />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form >
        </FormContainer >
    )
}
