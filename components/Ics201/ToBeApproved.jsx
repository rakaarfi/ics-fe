'use client';

import axios from 'axios';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Checkbox, FormControl, FormControlLabel, TableHead } from '@mui/material';

import FormContainer from '../FormContainer';
import { fetchData, readByIcs201Id, readById } from '@/utils/api';
import useFetchDynamicOptions from '../ImtRoster/useFetchDynamicOptions';

const TimePicker = dynamic(
    () => import('@mui/x-date-pickers/TimePicker').then((mod) => mod.TimePicker),
    { ssr: false }
);

dayjs.extend(customParseFormat);


export default function ToBeApproved() {
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
    });
    const [incidentData, setIncidentData] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const { dynamicOptions } = useFetchDynamicOptions();
    const [approvalData, setApprovalData] = useState({
        is_approved: false,
        date_approved: dayjs().format('YYYY-MM-DD'),
        time_approved: dayjs().format('HH:mm'),
    });
    
    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;
    const routeUrl = "ics-201/main";
    const routeActionUrl = "ics-201/actions-strategies-tactics";
    const routeResourceUrl = "ics-201/resource-summary";
    const routeChartUrl = "ics-201/chart";
    const iframeRef = useRef(null);

    useEffect(() => {
        if (formData.map_sketch) {
            setImageUrl(`${apiUrl}file/get/${formData.map_sketch}`);
        } else {
            setImageUrl(null);
        }
    }, [formData.map_sketch]);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (iframe && formData.chartData) {
            console.log('Attempting to send data:', formData.chartData);
            iframe.onload = () => {
                iframe.contentWindow.postMessage(formData.chartData, '*');
            };
        }
    }, [formData.chartData]);

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

    useEffect(() => {
        const fetchApprovalData = async (ics_201_id) => {
            try {
                const response = await axios.get(
                    `${apiUrl}ics-201/approval/read-by-ics-id/${ics_201_id}`
                );
                if (response.data.length > 0) {
                    setApprovalData(response.data[0]);
                }
            } catch (error) {
                console.error('Error fetching approval data:', error);
            }
        };

        if (id) {
            fetchApprovalData(id);
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
                    `http://localhost:8000/api/file/get/${filename}`,
                    { responseType: 'blob' }
                );
                return filename;
            } catch (error) {
                console.error('Error fetching map sketch:', error);
                return null;
            }
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ics_201_id: data.id,
                date_approved: approvalData.date_approved,
                time_approved: approvalData.time_approved,
                is_approved: approvalData.is_approved,
            };

            const response = await axios.post(
                `${apiUrl}ics-201/approval/create/`,
                payload
            );

            if (response.status === 200) {
                alert("Approval submitted successfully!");
            }
        } catch (err) {
            console.error("Error saving approval:", err);
            alert("Error saving approval: " + err.message);
        }
    };

    const getIncident = (incidentId) => {
        const incident = incidentData.find(incident => incident.id === incidentId);
        return incident || { name: 'Unknown Incident', no: 'Unknown Incident' };
    };
    
    const incidentDetails = getIncident(formData.incident_id);

    const findNameById = (id, options = []) => {
        if (!Array.isArray(options)) {
            return "";
        }
        const foundOption = options.find(option => option.id === id);
        return foundOption ? foundOption.name || "N/A" : "";
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!data) return <p>No data found</p>;

    return (
        <div>
            <FormContainer
                title="ICS 201 - To Be Approved"
                className="max-w-2xl mx-auto p-4 mb-8 bg-white rounded shadow-lg"
            >
                {/* Header Section (Section 1, 2, 3) */}
                <div className="header-section">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell sx={{ padding: '1rem' }}>
                                    <strong>1. Incident Name:</strong> {incidentDetails.name}
                                </TableCell>
                                <TableCell sx={{ padding: '1rem' }}>
                                    <strong>2. Incident Number:</strong> {incidentDetails.no}
                                </TableCell>
                                <TableCell sx={{ padding: '1rem' }}>
                                    <strong>3. Date/Time Initiated:</strong><br />
                                    Date: {formData.date_initiated} Time: {formData.time_initiated}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 4 */}
                <div className="section-4">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>4. Map/Sketch</strong> (include sketch, showing the total area of operations, the incident site/area, impacted and threatened areas, overflight results, trajectories, impacted shorelines, or other graphics depicting situational status and resource assignment):
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '600px', marginTop: '10px', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        {imageUrl && (
                                            <img
                                                src={imageUrl}
                                                alt="Uploaded"
                                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                className="shadow-md"
                                            />
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 5 */}
                <div className="section-5">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>5. Situation Summary and Health and Safety Briefing</strong> (for briefings or transfer of command): Recognize potential incident Health and Safety Hazards and develop necessary measures (remove hazard, provide personal protective equipment, warn people of the hazard) to protect responders from those hazards.
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert Situation Summary and Health and Safety Briefing here */}
                                        {formData.situation_summary}
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
                                    <strong>7. Current and Planned Objectives</strong>
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert Current and Planned Objectives here */}
                                        {formData.objectives}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 8 */}
                <div className="section-8">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>8. Current and Planned Actions, Strategies, and Tactics:</strong>
                                    <br />
                                    <Table sx={{ marginTop: '10px', border: '1px solid #ccc', width: '100%' }}>
                                        {/* Table Head */}
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Time</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        {/* Table Body */}
                                        <TableBody>
                                            {formData.actionsStrategiesTactics.length > 0 ? (
                                                formData.actionsStrategiesTactics.map((action, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                                            {action.time_initiated || 'N/A'}
                                                        </TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                                            {action.actions || 'N/A'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={2} sx={{ border: '1px solid #ccc', textAlign: 'center', height: '24px' }}>
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

                {/* Section 9 */}
                <div className="section-9">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>9. Current Organization</strong>
                                    <br />
                                    {/* <div
                                        className="border border-gray-300"
                                        style={{ height: '1000px', marginTop: '10px', padding: '1rem', width: '100%' }}
                                    > */}
                                    {/* Insert Current Organization here */}
                                    {/* <ChartPreview chartData={formData.chartData} /> */}
                                    {/* </div> */}
                                    <div style={{ marginTop: '20px', width: '100%', height: '600px', border: '1px solid #ccc' }}>
                                        <iframe
                                            ref={iframeRef}
                                            src="/chart-preview"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 'none' }}
                                            title="Chart Preview"
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 10 */}
                <div className="section-10">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>10. Resource Summary:</strong>
                                    <br />
                                    <Table sx={{ marginTop: '10px', border: '1px solid #ccc' }}>
                                        {/* Table Head */}
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Resource</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Resource Identifier</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date/Time Ordered</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ETA</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Arrived</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Notes(location/assignment/status)</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        {/* Table Body */}
                                        <TableBody>
                                            {formData.resourceSummary.length > 0 ? (
                                                formData.resourceSummary.map((resource, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{resource.resource}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{resource.resource_identified}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                                            {resource.date_ordered ? `${resource.date_ordered} ${resource.time_ordered}` : ''}
                                                        </TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{resource.eta}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{resource.is_arrived ? '✓' : '✗'}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{resource.notes}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} sx={{ border: '1px solid #ccc', textAlign: 'center', height: '24px' }}>
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

                {/* Footer Section (Section 6) */}
                <div className="footer-section">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>6. Prepared by:</strong>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ marginLeft: '5rem' }}>
                                            Name: {formData.chartData.incident_commander_id ?
                                                findNameById(formData.chartData.incident_commander_id, dynamicOptions.incident_commander_id)
                                                : "N/A"}
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            Position: Incident Commander
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            <FormControl>
                                                {/* Checkbox Signature */}
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            name="is_approved"
                                                            checked={approvalData.is_approved}
                                                            onChange={(e) => setApprovalData(prev => ({
                                                                ...prev,
                                                                is_approved: e.target.checked
                                                            }))}
                                                        />
                                                    }
                                                    label="Signature"
                                                />
                                            </FormControl>
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            <TextField
                                                required
                                                variant="standard"
                                                type="date"
                                                name="date_approved"
                                                value={approvalData.date_approved}
                                                onChange={(e) => setApprovalData(prev => ({
                                                    ...prev,
                                                    date_approved: e.target.value
                                                }))}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <TimePicker
                                                    ampm={false}
                                                    value={dayjs(approvalData.time_approved, 'HH:mm')}
                                                    onChange={(newValue) => {
                                                        setApprovalData(prev => ({
                                                            ...prev,
                                                            time_approved: newValue.format('HH:mm')
                                                        }));
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit Approval
                    </button>
                </div>
            </FormContainer>
        </div>
    );
}