'use client'

import axios from 'axios';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Chart from './Chart';
import UploadImage from './UploadImage';
import { fetchData } from '@/utils/api';
import FormContainer from '../FormContainer'
import ResourceSummary from './ResourceSummary';
import { ButtonSubmit } from '../ButtonComponents';
import ActionsStrategiesTactics from './ActionsStrategiesTactics';

const TimePicker = dynamic(
    () => import('@mui/x-date-pickers').then((mod) => mod.TimePicker),
    { ssr: false }
);

export default function Input() {
    const [formData, setFormData] = useState({
        incident_id: null,
        date_incident: dayjs(),
        time_incident: dayjs('00:00', 'HH:mm'),
        date_initiated: '',
        time_initiated: '',
        map_sketch: '',
        situation_summary: '',
        is_signature: false,
        objectives: '',
        ics_201_id: null,
        actionsStrategiesTactics: [
            { time_initiated: null, actions: "" },
        ],
        resourceSummary: [
            { resource: "", resource_identified: "", date_ordered: "", time_ordered: null, eta: "", is_arrived: false, notes: "" },
        ],
        chartData: {},
    })
    const [incidentData, setIncidentData] = useState([]);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [isClient, setIsClient] = useState(false);

    const apiUrl = 'http://127.0.0.1:8000/'
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const fetchIncidentData = async () => {
            try {
                const data = await fetchData('incident-data');
                setIncidentData(data);
            } catch (error) {
                console.error('Error fetching incident data:', error);
            }
        };

        fetchIncidentData();
    }, []);

    // Fungsi untuk menangani perubahan nama file yang diunggah
    const handleFileUpload = (filename) => {
        setFormData(prevData => ({
            ...prevData,
            map_sketch: filename, // Simpan nama file ke state formData
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleIncidentChange = (incidentId) => {
        const incident = incidentData.find((incident) => incident.id === incidentId);
        setSelectedIncident(incident);
        setFormData(prevData => ({
            ...prevData,
            incident_id: incidentId,
        }));
    };

    // Functions to handle changes in child components
    const handleActionsChange = (index, updates) => {
        setFormData(prevData => {
            const newActions = [...prevData.actionsStrategiesTactics];
            newActions[index] = { ...newActions[index], ...updates };
            return { ...prevData, actionsStrategiesTactics: newActions };
        });
    };

    const handleTimeActionsChange = (value, index) => {
        setFormData(prevData => {
            const newActions = [...prevData.actionsStrategiesTactics];
            newActions[index].time_initiated = value;
            return { ...prevData, actionsStrategiesTactics: newActions };
        });
    };

    const handleResourceChange = (index, updates) => {
        setFormData(prevData => {
            const newResources = [...prevData.resourceSummary];
            newResources[index] = { ...newResources[index], ...updates };
            return { ...prevData, resourceSummary: newResources };
        });
    };

    const handleTimeResourceChange = (value, index) => {
        setFormData(prevData => {
            const newResources = [...prevData.resourceSummary];
            newResources[index].time_ordered = value;
            return { ...prevData, resourceSummary: newResources };
        });
    };

    const handleChartDataChange = (data) => {
        setFormData(prevData => ({ ...prevData, chartData: data }));
    };

    // Functions to add/remove rows in child components
    const addActionsRow = () => {
        setFormData(prevData => ({
            ...prevData,
            actionsStrategiesTactics: [...prevData.actionsStrategiesTactics, { time_initiated: dayjs('00:00', 'HH:mm'), actions: "" }],
        }));
    };

    const removeActionsRow = (index) => {
        setFormData(prevData => ({
            ...prevData,
            actionsStrategiesTactics: prevData.actionsStrategiesTactics.filter((_, i) => i !== index),
        }));
    };

    const addResourceRow = () => {
        setFormData(prevData => ({
            ...prevData,
            resourceSummary: [...prevData.resourceSummary, { resource: "", resource_identified: "", date_ordered: "", time_ordered: dayjs('00:00', 'HH:mm'), eta: "", is_arrived: false, notes: "" }],
        }));
    };

    const removeResourceRow = (index) => {
        setFormData(prevData => ({
            ...prevData,
            resourceSummary: prevData.resourceSummary.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi: Pastikan file sudah diunggah
        if (!formData.map_sketch) {
            alert("Harap unggah file map/sketch terlebih dahulu!");
            return;
        }

        try {
            // Submit main form data
            const mainPayload = {
                incident_id: formData.incident_id,
                date_initiated: dayjs(formData.date_initiated).format('YYYY-MM-DD'),
                time_initiated: formData.time_initiated,
                map_sketch: formData.map_sketch,
                situation_summary: formData.situation_summary,
                is_signature: formData.is_signature,
                objectives: formData.objectives,
            };

            // console.log("Main Payload:", mainPayload); // Log the payload
            const response = await axios.post(`${apiUrl}ics-201/main/create/`, mainPayload);
            const ics_201_id = response.data.id;
            setFormData(prevData => ({ ...prevData, ics_201_id: ics_201_id }));

            // Submit ActionsStrategiesTactics data
            const actionsPayload = {
                datas: formData.actionsStrategiesTactics.map((row) => ({
                    time_initiated: row.time_initiated || '00:00',
                    actions: row.actions,
                    ics_201_id: ics_201_id,
                })),
            };
            // console.log("Actions Payload:", actionsPayload); // Log the payload
            await axios.post(`${apiUrl}ics-201/actions-strategies-tactics/create/`, actionsPayload);

            // Submit ResourceSummary data
            const resourcesPayload = {
                datas: formData.resourceSummary.map((row) => ({
                    resource: row.resource,
                    resource_identified: row.resource_identified,
                    date_ordered: row.date_ordered,
                    time_ordered: row.time_ordered || '00:00',
                    eta: row.eta,
                    is_arrived: row.is_arrived,
                    notes: row.notes,
                    ics_201_id: ics_201_id,
                })),
            };
            // console.log("Resources Payload:", resourcesPayload);
            await axios.post(`${apiUrl}ics-201/resource-summary/create/`, resourcesPayload);

            // Submit Chart data
            const chartPayload = {
                ...formData.chartData,
                ics_201_id: ics_201_id,
            };
            // console.log("Chart Payload:", chartPayload);
            await axios.post(`${apiUrl}ics-201/chart/create/`, chartPayload);

            alert("Data submitted successfully!");
        } catch (error) {
            console.error('Error submitting data:', error);
            alert("An error occurred while submitting the data.");
        }
    };

    const handleTimeChange = (value) => {
        if (value) {
            setFormData(prevData => ({
                ...prevData,
                time_initiated: value.format('HH:mm')
            }));
        }
    };

    return (
        <FormContainer title="Input ICS 201 - Incident Briefing">
            <div className="mb-4">
                <select
                    name="incident_id"
                    className="block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                    onChange={(e) => handleIncidentChange(parseInt(e.target.value, 10))}
                    value={formData.incident_id || ""}
                >
                    <option value={""} disabled>
                        Select Incident
                    </option>
                    {incidentData.map((incident) => (
                        <option key={incident.id} value={incident.id}>
                            {incident.name}
                        </option>
                    ))}
                </select>
            </div>
            {selectedIncident && (
                <table className="table-auto border-collapse w-full">
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 border rounded-md bg-gray-300 w-72">Incident Name:</td>
                            <td className="px-4 py-2 border rounded-md">
                                {selectedIncident.name}
                            </td>
                            <td className="px-4 py-2 border rounded-md bg-gray-300 w-72">Incident No:</td>
                            <td className="px-4 py-2 border rounded-md">
                                {selectedIncident.no}
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
            <form onSubmit={handleSubmit}>
                <table className="table-auto border-collapse w-full">
                    <tbody>
                        {/* <!-- Baris untuk Date/Time Initiated --> */}
                        <tr>
                            <td className="px-4 py-2">Date/Time Initiated:</td>
                            <td className="px-4 py-2">
                                <input
                                    type="date"
                                    name="date_initiated"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={formData.date_initiated}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                            <td className="px-4 py-2">
                                {isClient && (
                                    <LocalizationProvider dateAdapter={AdapterDayjs} suppressHydrationWarning>
                                        <TimePicker
                                            suppressHydrationWarning
                                            ampm={false}
                                            value={formData.time_initiated ? dayjs(formData.time_initiated, 'HH:mm') : dayjs('00:00', 'HH:mm')}
                                            onChange={handleTimeChange}
                                            slotProps={{
                                                textField: {
                                                    name: 'time_initiated',
                                                    required: true,
                                                    fullWidth: true,
                                                    variant: 'outlined',
                                                    className: 'w-full px-3 py-2 border rounded-md',
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                )}
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Map/Sketch --> */}
                        <tr>
                            <td className="px-4 py-2">Map/Sketch</td>
                            <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300" colSpan={7}>
                                (include sketch, showing the total area of operations, the incident site/area, impacted and threatened areas, overflight results, trajectories, impacted shorelines, or other graphics depicting situational status and resource assignment):
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Upload Sketch --> */}
                        <tr>
                            <td className="px-4 py-2" colSpan={7}>
                                <UploadImage onFileUpload={handleFileUpload} />
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Situation Summary and Health and Safety Briefing --> */}
                        <tr>
                            <td className="px-4 py-2" colSpan={7}>Situation Summary and Health and Safety Briefing</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300" colSpan={7}>
                                (for briefing or transfer of command): Recognize potential incident Health and Safety Hazards and develop necessary measures (remove hazard, provide protective equipment, warn people of the hazard) to protect responders from those hazards.
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={7}>
                                <textarea
                                    name="situation_summary"
                                    value={formData.situation_summary}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="7"
                                    cols="50"
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Current and Planned Objectives --> */}
                        <tr>
                            <td className="px-4 py-2" colSpan={7}>Current and Planned Objectives:</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={7}>
                                <textarea
                                    name="objectives"
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="7"
                                    cols="50"
                                    value={formData.objectives}
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Current and Planned Actions, Strategies and Tactics --> */}
                        <tr>
                            <td className="px-4 py-2" colSpan={7}>Current and Planned Actions, Strategies and Tactics:</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={7}>
                                <ActionsStrategiesTactics
                                    rowsActions={formData.actionsStrategiesTactics}
                                    onAddRow={addActionsRow}
                                    onRemoveRow={removeActionsRow}
                                    onChangeRow={handleActionsChange}
                                    onChangeTime={handleTimeActionsChange}
                                />
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Chart --> */}
                        <tr>
                            <td className="px-4 py-2" colSpan={7}>
                                <div
                                    className="border border-gray-300 rounded-md p-3"
                                    style={{
                                        maxHeight: '800px',
                                        maxWidth: '1150px',
                                        overflowX: 'scroll',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{
                                        minWidth: 'max-content',
                                        paddingLeft: '100px',
                                        paddingRight: '100px'
                                    }}>
                                        <Chart
                                            chartData={formData.chartData}
                                            onChange={handleChartDataChange}
                                        />
                                    </div>
                                </div>
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Resource Summary --> */}
                        <tr>
                            <td className="px-4 py-2" colSpan={7}>Resource Summary:</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={7}>
                                <ResourceSummary
                                    rowsSummary={formData.resourceSummary}
                                    onAddRow={addResourceRow}
                                    onRemoveRow={removeResourceRow}
                                    onChangeRow={handleResourceChange}
                                    onChangeTime={handleTimeResourceChange}
                                />
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
            </form>
        </FormContainer>
    )
}
