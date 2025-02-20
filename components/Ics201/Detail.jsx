'use client'

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const TimePicker = dynamic(
    () => import('@mui/x-date-pickers/TimePicker').then((mod) => mod.TimePicker),
    { ssr: false }
);

import Chart from './Chart';
import UploadImage from './UploadImage';
import FormContainer from '../FormContainer';
import ResourceSummary from './ResourceSummary';
import { fetchData, readByIcs201Id, readById } from '@/utils/api';
import ActionsStrategiesTactics from './ActionsStrategiesTactics';
import { ButtonSaveChanges } from '../ButtonComponents';

dayjs.extend(customParseFormat);

export default function Detail() {

    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        incident_id: null,
        date_initiated: '',
        time_initiated: null,
        map_sketch: '',
        situation_summary: '',
        objectives: '',
        actionsStrategiesTactics: [],
        resourceSummary: [],
        chartData: {},
        idsToDeleteActions: [],
        idsToDeleteResources: [],
    });
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [incidentData, setIncidentData] = useState([]);
    const [newFile, setNewFile] = useState(null);

    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;
    const routeUrl = "ics-201/main";
    const routeActionUrl = "ics-201/actions-strategies-tactics";
    const routeResourceUrl = "ics-201/resource-summary";
    const routeChartUrl = "ics-201/chart";

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch main data
                const responseData = await readById({ routeUrl, id });
                const timeInitiated = responseData.time_initiated ? responseData.time_initiated.trim() : null;
                const parsedTime = dayjs(timeInitiated, 'HH:mm:ss', true);

                const formattedData = {
                    ...responseData,
                    time_initiated: parsedTime.isValid() ? parsedTime.format('HH:mm') : null,
                };

                setData(formattedData);
                setFormData(prevFormData => ({
                    ...prevFormData,
                    ...formattedData,
                }));

                // Fetch related data
                const actionsData = await fetchActionsData(responseData.id);
                const resourcesData = await fetchResourcesData(responseData.id);
                const chartData = await fetchChartData(responseData.id);
                const mapSketchData = await fetchMapSketchData(responseData.map_sketch);

                // Update form data with related data
                setFormData(prevFormData => ({
                    ...prevFormData,
                    actionsStrategiesTactics: actionsData,
                    resourceSummary: resourcesData,
                    chartData: chartData.length > 0 ? chartData[0] : {},
                    map_sketch: mapSketchData
                }));

                // Check and add empty rows if necessary
                if (actionsData.length === 0) {
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        actionsStrategiesTactics: [...prevFormData.actionsStrategiesTactics, { time_initiated: null, actions: "" }]
                    }));
                }

                if (resourcesData.length === 0) {
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        resourceSummary: [...prevFormData.resourceSummary, { resource: "", resource_identified: "", date_ordered: "", time_ordered: null, eta: "", is_arrived: false, notes: "" }]
                    }));
                }

            } catch (err) {
                setError("Failed to fetch data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchActionsData = async (ics_201_id) => {
        const response = await readByIcs201Id({ routeUrl: routeActionUrl, id: ics_201_id });
        return response;
    };

    const fetchResourcesData = async (ics_201_id) => {
        const response = await readByIcs201Id({ routeUrl: routeResourceUrl , id: ics_201_id });
        return response;
    };

    const fetchChartData = async (ics_201_id) => {
        const response = await readByIcs201Id({ routeUrl: routeChartUrl, id: ics_201_id });
        return response;
    };

    const fetchMapSketchData = async (filename) => {
        if (filename) {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/file/get/${filename}`, {
                    responseType: 'blob',
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                }
                );
                console.log('map sketch data', response);

                return filename;
            } catch (error) {
                console.error('Error fetching map sketch:', error);
                return null;
            }
        }
        return null;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTimeChange = (value) => {
        const timeString = value ? value.format('HH:mm') : null;
        setFormData({ ...formData, time_initiated: timeString });
    };

    const handleFileUpload = async (filename) => {
        try {
            await axios.put(`${apiUrl}ics-201/main/update/${id}`, {
                map_sketch: filename,
            });

            setFormData(prevData => ({
                ...prevData,
                map_sketch: filename,
            }));
        } catch (error) {
            console.error('Error updating map sketch:', error);
        }
    };

    const handleDeleteFile = async () => {
        setFormData(prevData => ({
            ...prevData,
            map_sketch: null,
        }));
    };

    // Actions
    const handleAddActionsRow = () => {
        setFormData(prevData => ({
            ...prevData,
            actionsStrategiesTactics: [...prevData.actionsStrategiesTactics, { time_initiated: null, actions: "" }],
        }));
    };

    const handleRemoveActionsRow = (index) => {
        const actionId = formData.actionsStrategiesTactics[index].id;
        console.log("Action ID to delete:", actionId);
        if (actionId) {
            setFormData(prevData => ({
                ...prevData,
                actionsStrategiesTactics: prevData.actionsStrategiesTactics.filter((_, i) => i !== index),
                idsToDeleteActions: [...prevData.idsToDeleteActions, actionId],
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                actionsStrategiesTactics: prevData.actionsStrategiesTactics.filter((_, i) => i !== index),
            }));
        }
    };

    const handleActionsChange = (index, updates) => {
        setFormData(prevData => {
            const newActions = [...prevData.actionsStrategiesTactics];
            newActions[index] = { ...newActions[index], ...updates };
            return { ...prevData, actionsStrategiesTactics: newActions };
        });
    };

    const handleTimeActionsChange = (timeStr, index) => {
        setFormData(prevData => {
            const newActions = [...prevData.actionsStrategiesTactics];
            newActions[index] = {
                ...newActions[index],
                time_initiated: timeStr
            };
            return { ...prevData, actionsStrategiesTactics: newActions };
        });
    };

    // Resources
    const handleAddResourceRow = () => {
        setFormData(prevData => ({
            ...prevData,
            resourceSummary: [...prevData.resourceSummary, { resource: "", resource_identified: "", date_ordered: "", time_ordered: null, eta: "", is_arrived: false, notes: "" }],
        }));
    };

    const handleRemoveResourceRow = (index) => {
        const resourceId = formData.resourceSummary[index].id;
        console.log("Resource ID to delete:", resourceId);
        if (resourceId) {
            setFormData(prevData => ({
                ...prevData,
                resourceSummary: prevData.resourceSummary.filter((_, i) => i !== index),
                idsToDeleteResources: [...prevData.idsToDeleteResources, resourceId],
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                resourceSummary: prevData.resourceSummary.filter((_, i) => i !== index),
            }));
        }
    };

    const handleResourceChange = (index, updates) => {
        setFormData(prevData => {
            const newResources = [...prevData.resourceSummary];
            newResources[index] = { ...newResources[index], ...updates };
            return { ...prevData, resourceSummary: newResources };
        });
    };

    const handleTimeResourceChange = (timeStr, index) => {
        setFormData(prevData => {
            const newResources = [...prevData.resourceSummary];
            newResources[index] = {
                ...newResources[index],
                time_ordered: timeStr
            };
            return { ...prevData, resourceSummary: newResources };
        });
    };

    const handleChartDataChange = (data) => {
        setFormData(prevData => ({ ...prevData, chartData: data }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Reformat time_initiated to HH:mm
            const formattedData = {
                ...formData,
                time_initiated: formData.time_initiated ? dayjs(formData.time_initiated).format('HH:mm') : null,
            };

            // Update main data
            const response = await axios.put(`${apiUrl}ics-201/main/update/${id}`, formData);

            // Update actions strategies tactics
            if (formData.actionsStrategiesTactics?.length > 0) {
                await updateActions(formData.actionsStrategiesTactics);
            }

            // Update resource summary
            if (formData.resourceSummary?.length > 0) {
                await updateResources(formData.resourceSummary);
            }

            // Update chart data
            if (Object.keys(formData.chartData).length > 0) {
                await updateChart(formData.chartData);
            }

            // Handle file upload if necessary
            if (newFile) {
                await handleFileUpload(newFile);
            }

            // Delete marked for deletion
            if (formData.idsToDeleteActions.length > 0) {
                await axios.delete(`${apiUrl}ics-201/actions-strategies-tactics/delete-many/`, {
                    data: { ids: formData.idsToDeleteActions }
                });
            }

            if (formData.idsToDeleteResources.length > 0) {
                await axios.delete(`${apiUrl}ics-201/resource-summary/delete-many/`, {
                    data: { ids: formData.idsToDeleteResources }
                });
            }

            alert("Changes saved successfully!");
        } catch (err) {
            console.error("Error saving changes:", err);
            alert("Error saving changes: " + err.message);
        }
    };

    const updateActions = async (actionsData) => {
        try {
            // Format time
            const formatTime = (timeStr) => {
                if (!timeStr) return null;
                return timeStr.split(':').slice(0, 2).join(':');
            };

            // Identify new actions (without id)
            const newActions = actionsData.filter(action => !action.id);
            // Prepare new actions to create
            if (newActions.length > 0) {
                const newActionsWithId = newActions.map(action => ({
                    ics_201_id: id,
                    time_initiated: formatTime(action.time_initiated),
                    actions: action.actions || ''
                }));
                await axios.post(`${apiUrl}ics-201/actions-strategies-tactics/create/`, {
                    datas: newActionsWithId
                });
            }

            // Identify existing actions (with id)
            const existingActions = actionsData.filter(action => action.id);
            // Update existing actions
            for (const action of existingActions) {
                const updatedAction = {
                    id: action.id,
                    time_initiated: formatTime(action.time_initiated),
                    actions: action.actions || '',
                    ics_201_id: id
                };
                await axios.put(
                    `${apiUrl}ics-201/actions-strategies-tactics/update/${action.id}`,
                    updatedAction
                );
            }

        } catch (error) {
            console.error("Error updating actions:", error);
            throw error;
        }
    };

    // Similarly for Resources
    const updateResources = async (resourcesData) => {
        try {
            // Format time
            const formatTime = (timeStr) => {
                if (!timeStr) return null;
                return timeStr.split(':').slice(0, 2).join(':');
            };

            // Identify new resources (without id)
            const newResources = resourcesData.filter(resource => !resource.id);
            // Prepare new resources to create
            if (newResources.length > 0) {
                const newResourcesWithId = newResources.map(resource => ({
                    ics_201_id: id,
                    resource: resource.resource || '',
                    resource_identified: resource.resource_identified || '',
                    date_ordered: resource.date_ordered || null,
                    time_ordered: formatTime(resource.time_ordered),
                    eta: resource.eta || '',
                    is_arrived: resource.is_arrived || false,
                    notes: resource.notes || ''
                }));
                await axios.post(`${apiUrl}ics-201/resource-summary/create/`, {
                    datas: newResourcesWithId
                });
            }

            // Identify existing resources (with id)
            const existingResources = resourcesData.filter(resource => resource.id);
            // Update existing resources
            for (const resource of existingResources) {
                const updatedResource = {
                    id: resource.id,
                    ics_201_id: id,
                    resource: resource.resource || '',
                    resource_identified: resource.resource_identified || '',
                    date_ordered: resource.date_ordered || null,
                    time_ordered: formatTime(resource.time_ordered),
                    eta: resource.eta || '',
                    is_arrived: resource.is_arrived || false,
                    notes: resource.notes || ''
                };
                await axios.put(
                    `${apiUrl}ics-201/resource-summary/update/${resource.id}`,
                    updatedResource
                );
            }

        } catch (error) {
            console.error("Error updating resources:", error);
            throw error;
        }
    };

    const updateChart = async (chartData) => {
        if (chartData.id) {
            // Update existing chart
            await axios.put(`${apiUrl}ics-201/chart/update/${chartData.id}`, chartData);
        } else {
            // Create new chart
            await axios.post(`${apiUrl}ics-201/chart/create/`, chartData);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!data) return <p>No data found</p>;

    return (
        <FormContainer title="ICS 201 - Incident Briefing Detail">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <select
                        name="incident_id"
                        className="block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                        onChange={handleChange}
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
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        ampm={false}
                                        onChange={handleTimeChange}
                                        value={formData.time_initiated ? dayjs(formData.time_initiated, 'HH:mm') : null} // Format waktu sebagai dayjs
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
                                <UploadImage
                                    onFileUpload={handleFileUpload}
                                    currentFile={formData.map_sketch}
                                    onDeleteFile={handleDeleteFile}
                                    id={id}
                                />
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
                                    onAddRow={handleAddActionsRow}
                                    onRemoveRow={handleRemoveActionsRow}
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
                                    onAddRow={handleAddResourceRow}
                                    onRemoveRow={handleRemoveResourceRow}
                                    onChangeRow={handleResourceChange}
                                    onChangeTime={handleTimeResourceChange}
                                />
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Tombol Save Changes --> */}
                        <tr>
                            <td colSpan={6} className="text-right align-bottom px-4 py-2">
                                <ButtonSaveChanges />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <div className='flex justify-end'>
                <Link href={`/dashboard/ics-201/tobe-approved/${id}`} className="bg-[#61638d] hover:bg-[#393b63] text-white font-bold py-1 px-3 rounded">
                    To Be Approved
                </Link>
            </div>
        </FormContainer>
    );
}