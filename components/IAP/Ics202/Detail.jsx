'use client';

import axios from 'axios';
import { ButtonSaveChanges } from '@/components/ButtonComponents';
import FormContainer from '@/components/FormContainer';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';

export default function Detail() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [formData, setFormData] = useState({
        operational_period_id: "",
        objectives: "",
        command_emphasis: "",
        situational_awareness: "",
        is_required: false,
        safety_plan_location: "",
        ics_203: false,
        ics_204: false,
        ics_205: false,
        ics_205a: false,
        ics_206: false,
        ics_207: false,
        ics_208: false,
        map_chart: false,
        weather_tides_currents: false,
    });
    const [incidentData, setIncidentData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [PSChiefData, setPSChiefData] = useState([]);
    const [preparationData, setPreparationData] = useState({
        is_prepared: false,
        planning_section_chief_id: "",
        date_prepared: "",
        time_prepared: "",
    })
    const [preparationID, setPreparationID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const hostName = document.location.hostname;
    const apiUrl = `http://${hostName}:8000/api/`;
    const routeUrl = "ics-202/main";

    useEffect(() => {
        setLoading(true);
        setError(null);

        let operationalPeriodId = null;

        // Ambil data detail
        axios
            .get(`${apiUrl}${routeUrl}/read/${id}`)
            .then((response) => {
                setData(response.data);
                setFormData(response.data);
                operationalPeriodId = response.data.operational_period_id;

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
            axios.get(`${apiUrl}ics-202/preparation/read-by-ics-202-id/${id}`)
                .then((response) => {
                    setPreparationData(response.data[0]);
                    setPreparationID(response.data[0].id);
                })
                .catch((error) => {
                    console.error('Error fetching Preparation data:', error);
                    setError('Failed to fetch Preparation data');
                });
        }

    }, [id]);


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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const mainPayload = {
                operational_period_id: formData.operational_period_id,
                objectives: formData.objectives,
                command_emphasis: formData.command_emphasis,
                situational_awareness: formData.situational_awareness,
                is_required: formData.is_required,
                safety_plan_location: formData.safety_plan_location,
                ics_203: formData.ics_203,
                ics_204: formData.ics_204,
                ics_205: formData.ics_205,
                ics_205a: formData.ics_205a,
                ics_206: formData.ics_206,
                ics_207: formData.ics_207,
                ics_208: formData.ics_208,
                map_chart: formData.map_chart,
                weather_tides_currents: formData.weather_tides_currents,
            };
            const response = await axios.put(`${apiUrl}ics-202/main/update/${id}`, mainPayload);
            const ics_202_id = response.data.id;

            const now = dayjs();
            const preparedPayload = {
                ics_202_id: ics_202_id,
                planning_section_chief_id: preparationData.planning_section_chief_id,
                date_prepared: now.format('YYYY-MM-DD'),
                time_prepared: now.format('HH:mm'),
                is_prepared: preparationData.is_prepared
            };
            if (preparationID) {
                await axios.put(`${apiUrl}ics-202/preparation/update/${preparationID}`, preparedPayload);
            } else {
                await axios.post(`${apiUrl}ics-202/preparation/create`, preparedPayload);
            }
            alert("Changes saved successfully!");
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Failed to submit data. Please try again.');
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

    const fetchPSChief = async () => {
        try {
            const response = await axios.get(`${apiUrl}planning-section/planning-section-chief/read/`);
            setPSChiefData(response.data);
        } catch (error) {
            console.error('Error fetching Planning Section Chief data:', error);
            setError('Failed to fetch Planning Section Chief data');
        }
    };

    useEffect(() => {
        fetchPSChief();
    }, []);

    return (
        <FormContainer title="ICS 202 Incident Objectives Detail">
            <form onSubmit={handleSubmit}>
                <div className="mb-4 flex flex-row">
                    {/* Dropdown Incident */}
                    <select
                        className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                        value={formData.incident_id || ""}
                        onChange={handleIncidentChange}
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

                    {/* Dropdown Operational Period */}
                    <select
                        className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                        value={formData.operational_period_id || ""}
                        onChange={handleOperationalPeriodChange}
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

                {error && <div className="text-red-500">{error}</div>}
                <table className="table-auto border-collapse w-full">
                    <tbody>
                        {/* Objective(s) */}
                        <tr>
                            <td className="px-4 py-2 font-bold" colSpan={7}>Objective(s)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <textarea
                                    name="objectives"
                                    value={formData.objectives}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="7"
                                    cols="50"
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        {/* Operational Period Command Emphasis */}
                        <tr>
                            <td className="px-4 py-2 font-bold" colSpan={7}>Operational Period Command Emphasis</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <textarea
                                    name="command_emphasis"
                                    value={formData.command_emphasis}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="7"
                                    cols="50"
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        {/* General Situational Awareness */}
                        <tr>
                            <td className="px-4 py-2" colSpan={7}>General Situational Awareness</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <textarea
                                    name="situational_awareness"
                                    value={formData.situational_awareness}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="7"
                                    cols="50"
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        {/* Site Safety Plan */}
                        <tr>
                            <td className="px-4 py-2 font-bold">
                                Site Safety Plan Required? (Yes/No)
                                <input
                                    type="checkbox"
                                    name="is_required"
                                    checked={formData.is_required}
                                    onChange={handleChange}
                                    className="mx-2"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-bold">
                                Approved Site Safety Plan(s) Located at:
                                <input
                                    id="approved-site-input"
                                    type="text"
                                    name="safety_plan_location"
                                    value={formData.safety_plan_location}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                    disabled={!formData.is_required}
                                />
                            </td>
                        </tr>

                        {/* Incident Action Plan(s) */}
                        <tr>
                            <td className="px-4 py-2 font-bold">
                                Incident Action Plan (the items checked below are included in this Incident Action Plan)
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: "ICS 203", name: "ics_203" },
                                        { label: "ICS 205A", name: "ics_205a" },
                                        { label: "ICS 208", name: "ics_208" },
                                        { label: "ICS 204", name: "ics_204" },
                                        { label: "ICS 206", name: "ics_206" },
                                        { label: "Map/Chart", name: "map_chart" },
                                        { label: "ICS 205", name: "ics_205" },
                                        { label: "ICS 207", name: "ics_207" },
                                        { label: "Weather Forecast/Tides/Currents", name: "weather_tides_currents" },
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name={item.name}
                                                checked={formData[item.name]}
                                                onChange={handleChange}
                                                className="mx-2"
                                            />
                                            <label>{item.label}</label>
                                        </div>
                                    ))}
                                </div>
                            </td>
                        </tr>

                        {/* Prepared by */}
                        <tr>
                            <td className="px-4 py-2 font-bold">
                                7. Prepared by:
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">
                                <select
                                    name="planning_section_chief_id"
                                    className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                    value={preparationData.planning_section_chief_id || ""}
                                    onChange={(e) => setPreparationData(prev => ({
                                        ...prev,
                                        planning_section_chief_id: e.target.value
                                    }))}
                                    required
                                >
                                    <option value="" disabled>
                                        Select Planning Section Chief
                                    </option>
                                    {PSChiefData.map(chief => (
                                        <option key={chief.id} value={chief.id}>
                                            {chief.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="checkbox"
                                    name="is_prepared"
                                    checked={preparationData.is_prepared || false}
                                    onChange={(e) => setPreparationData(prev => ({
                                        ...prev,
                                        is_prepared: e.target.checked
                                    }))}
                                    className="mr-2"
                                    required
                                />
                                Signature
                            </td>
                        </tr>

                        {/* Submit Button */}
                        <tr>
                            <td colSpan={6} className="text-right align-bottom px-4 py-2">
                                <ButtonSaveChanges />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <div className='flex justify-end'>
                <Link href={`/dashboard/iap/ics-202/tobe-approved/${id}`} className="bg-[#61638d] hover:bg-[#393b63] text-white font-bold py-1 px-3 rounded">
                    To Be Approved
                </Link>
            </div>
        </FormContainer>
    );
}