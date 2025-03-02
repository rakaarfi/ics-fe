'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { fetchData, fetchOperationalPeriodByIncident } from '@/utils/api';
import FormICS214 from './FormICS214';
import { useParams } from 'next/navigation';

export default function Detail() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        operational_period_id: "",
        name: "",
        position: "",
        home_agency: "",
        resourcesAssigned: [],
        activityLog: [],
        prepared_name: "",
        is_prepared: false,
        idsToDeleteResources: [],
        idsToDeleteActivityLog: []
    });
    const [incidentData, setIncidentData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;

    // -------------------------------------------------------------------------
    // Gunakan helper readBy, fetchData di dalam useEffect
    // -------------------------------------------------------------------------
    useEffect(() => {
        const fetchIcs214Data = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch main data
                const responseData = await readBy({ routeUrl: "ics-214/main/read", id });
                const mainData = responseData;

                // Fetch additional data in parallel
                const [operationalPeriodResponse, resourcesData, activityLogData] = await Promise.all([
                    fetchData('operational-period'),
                    fetchResourcesData(mainData.id),
                    fetchActivityLogData(mainData.id),
                ]);

                // Extracting data
                const operationalPeriodData = operationalPeriodResponse;

                // Find associated incident_id from operational period
                const selectedOperationalPeriod = operationalPeriodData.find(period => period.id === mainData.operational_period_id);
                const incidentId = selectedOperationalPeriod ? selectedOperationalPeriod.incident_id : null;

                // Update FormData with fetched data
                setFormData(prevFormData => ({
                    ...prevFormData,
                    ...mainData, // Spread all main data fields
                    incident_id: incidentId,
                    resourcesAssigned: resourcesData.length > 0 ? resourcesData : [{
                        name: "",
                        position: "",
                        home_agency: "",
                    }],
                    activityLog: activityLogData.length > 0 ? activityLogData : [{
                        date_activity: "",
                        time_activity: null,
                        notable_activity: "",
                    }],
                }));

                // Set state
                setOperationalPeriodData(operationalPeriodData);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchIcs214Data();
        }
    }, [id]);

    // -------------------------------------------------------------------------
    // Fetch data
    // -------------------------------------------------------------------------
    // Fetch Incident Data
    const fetchIncidentData = async () => {
        try {
            const response = await fetchData('incident-data');
            setIncidentData(response);
        } catch (error) {
            console.error('Error fetching incident data:', error);
            setError('Failed to fetch incident data');
        }
    };

    useEffect(() => {
        fetchIncidentData();
    }, []);

    const fetchResourcesData = async (ics_214_id) => {
        try {
            const response = await readBy({
                routeUrl: "ics-214/resources-assigned/read-by-ics-214-id",
                id: ics_214_id
            });
            return response;
        } catch (error) {
            console.error("Error fetching resources assigned data:", error);
            throw error;
        }
    };

    const fetchActivityLogData = async (ics_214_id) => {
        try {
            const response = await readBy({
                routeUrl: "ics-214/activity-log/read-by-ics-214-id",
                id: ics_214_id
            });
            return response;
        } catch (error) {
            console.error("Error fetching activity log data:", error);
            throw error;
        }
    };

    // -------------------------------------------------------------------------
    // Handler dropdown Incident & Operational Period
    // -------------------------------------------------------------------------
    const handleIncidentChange = async (e) => {
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

        try {
            const responseData = await fetchOperationalPeriodByIncident(incident_id);
            setOperationalPeriodData(responseData);
        } catch (err) {
            console.error('Failed to fetch operational period data:', err);
            setError('Failed to fetch operational period data');
        } finally {
            setLoading(false);
        }
    };

    const handleOperationalPeriodChange = (e) => {
        const operational_period_id = parseInt(e.target.value, 10);
        setFormData(prevState => ({
            ...prevState,
            operational_period_id
        }));
    };

    // -------------------------------------------------------------------------
    // Handler umum untuk text/checkbox
    // -------------------------------------------------------------------------
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === "checkbox"
                ? checked
                : (name === "is_source_ctrl" || name === "is_material_ctrl")
                    ? value === "true"
                    : value,
        }));
    };

    // -------------------------------------------------------------------------
    // Handler Resource Assigned
    // -------------------------------------------------------------------------
    const handleAddResourcesRow = () => {
        setFormData(prevData => ({
            ...prevData,
            resourcesAssigned: [...prevData.resourcesAssigned, {
                name: "",
                position: "",
                home_agency: "",
            }],
        }));
    }

    const handleRemoveResourcesRow = (index) => {
        setFormData(prevData => ({
            ...prevData,
            resourcesAssigned: prevData.resourcesAssigned.filter((_, i) => i !== index),
            idsToDeleteResources: [...prevData.idsToDeleteResources, prevData.resourcesAssigned[index].id]
        }));
    }

    const handleResourceChange = (index, updates) => {
        setFormData(prevData => {
            const newResources = [...prevData.resourcesAssigned];
            newResources[index] = { ...newResources[index], ...updates };
            return { ...prevData, resourcesAssigned: newResources };
        });
    }

    // -------------------------------------------------------------------------
    // Handler ActivityLog
    // -------------------------------------------------------------------------
    const handleAddActivityLogRow = () => {
        setFormData(prevData => ({
            ...prevData,
            activityLog: [...prevData.activityLog, {
                date_activity: "",
                time_activity: null,
                notable_activity: "",
            }],
        }));
    }

    const handleRemoveActivityLogRow = (index) => {
        setFormData(prevData => ({
            ...prevData,
            activityLog: prevData.activityLog.filter((_, i) => i !== index),
            idsToDeleteActivityLog: [...prevData.idsToDeleteActivityLog, prevData.activityLog[index].id]
        }));
    }

    const handleActivityLogChange = (index, updates) => {
        setFormData(prevData => {
            const newActivityLog = [...prevData.activityLog];
            newActivityLog[index] = { ...newActivityLog[index], ...updates };
            return { ...prevData, activityLog: newActivityLog };
        });
    }

    const handleTimeActivityLogChange = (timeStr, index) => {
        setFormData(prevData => {
            const newActivityLog = [...prevData.activityLog];
            newActivityLog[index] = {
                ...newActivityLog[index],
                time_activity: timeStr
            };
            return { ...prevData, activityLog: newActivityLog };
        });
    };

    // -------------------------------------------------------------------------
    // Submit data (PUT / POST)
    // -------------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validasi data sebelum mengirim
            if (!formData.operational_period_id) {
                alert("Please select an Operational Period.");
                return;
            }

            const now = dayjs();
            const mainPayload = {
                operational_period_id: formData.operational_period_id,
                name: formData.name,
                position: formData.position,
                home_agency: formData.home_agency,
                prepared_name: formData.prepared_name,
                date_prepared: now.format('YYYY-MM-DD'),
                time_prepared: now.format('HH:mm'),
                is_prepared: formData.is_prepared
            };
            const response = await axios.put(`${apiUrl}ics-214/main/update/${id}`, mainPayload);
            const ics_214_id = response.data.id;

            // Update resources assigned and activity log
            await updateResources(formData.resourcesAssigned)
            await updateActivityLog(formData.activityLog)

            // Delete marked resources assigned and activity log
            if (formData.idsToDeleteResources > 0) {
                await axios.delete(`${apiUrl}ics-214/resources-assigned/delete-many`, {
                    data: {
                        ids: formData.idsToDeleteResources
                    }
                })
            }

            if (formData.idsToDeleteActivityLog > 0) {
                await axios.delete(`${apiUrl}ics-214/activity-log/delete-many`, {
                    data: {
                        ids: formData.idsToDeleteActivityLog
                    }
                })
            }

            alert("Changes saved successfully!");
        } catch (error) {
            console.error('Error submitting data:', error);
            alert(`Failed to submit data: ${error.response?.data?.message || error.message}`);
        }
    };

    // -------------------------------------------------------------------------
    // Update
    // -------------------------------------------------------------------------
    const updateResources = async (resourcesData) => {
        try {
            // Create new resources (tanpa ID)
            const newResources = resourcesData.filter(r => !r.id);
            if (newResources.length > 0) {
                await axios.post(`${apiUrl}ics-214/resources-assigned/create/`, {
                    datas: newResources.map(r => ({
                        ics_214_id: id,
                        ...r,
                    }))
                });
            }

            // Update existing resources (dengan ID)
            const existingResources = resourcesData.filter(r => r.id);
            for (const resources of existingResources) {
                await axios.put(
                    `${apiUrl}ics-214/resources-assigned/update/${resources.id}`,
                    resources
                );
            }
        } catch (error) {
            console.error("Error updating resources:", error);
            throw error;
        }
    };

    const updateActivityLog = async (activityLogData) => {
        try {
            // Create new activity log (tanpa ID)
            const newActivityLog = activityLogData.filter(a => !a.id);
            if (newActivityLog.length > 0) {
                await axios.post(`${apiUrl}ics-214/activity-log/create/`, {
                    datas: newActivityLog.map(a => ({
                        ics_206_id: id,
                        ...a,
                    }))
                });
            }

            // Update existing activity log (dengan ID)
            const existingActivityLog = activityLogData.filter(a => a.id);
            for (const activity of existingActivityLog) {
                await axios.put(
                    `${apiUrl}ics-214/activity-log/update/${activity.id}`,
                    activity
                );
            }
        } catch (error) {
            console.error("Error updating activity log:", error);
            throw error;
        }
    };

    return (
        <FormICS214
            formData={formData}
            setFormData={setFormData}
            error={error}
            loading={loading}
            incidentData={incidentData}
            operationalPeriodData={operationalPeriodData}
            handleIncidentChange={handleIncidentChange}
            handleOperationalPeriodChange={handleOperationalPeriodChange}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleAddResourcesRow={handleAddResourcesRow}
            handleRemoveResourcesRow={handleRemoveResourcesRow}
            handleResourceChange={handleResourceChange}
            handleAddActivityLogRow={handleAddActivityLogRow}
            handleRemoveActivityLogRow={handleRemoveActivityLogRow}
            handleActivityLogChange={handleActivityLogChange}
            handleTimeActivityLogChange={handleTimeActivityLogChange}
        />
    );
}