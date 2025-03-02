'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { fetchData, fetchOperationalPeriodByIncident } from '@/utils/api';
import FormICS214 from './FormICS214';

export default function Input() {
    const [formData, setFormData] = useState({
        operational_period_id: "",
        name: "",
        position: "",
        home_agency: "",
        resourcesAssigned: [{
            name: "",
            position: "",
            home_agency: "",
        }],
        activityLog: [{
            date_activity: "",
            time_activity: null,
            notable_activity: "",
        }],
        prepared_name: "",
        is_prepared: false
    });
    const [incidentData, setIncidentData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;

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
    // Submit data (POST)
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
            const response = await axios.post(`${apiUrl}ics-214/main/create`, mainPayload);
            const ics_214_id = response.data.id;

            const resourcesPayloads = {
                datas: formData.resourcesAssigned.map(row => ({
                    ics_214_id: ics_214_id,
                    name: row.name,
                    position: row.position,
                    home_agency: row.home_agency,
                }))
            }
            await axios.post(`${apiUrl}ics-214/resources-assigned/create/`, resourcesPayloads);

            const activityLogPayloads = {
                datas: formData.activityLog.map(row => ({
                    ics_214_id: ics_214_id,
                    date_activity: row.date_activity,
                    time_activity: row.time_activity || '00:00',
                    notable_activity: row.notable_activity,
                }))
            }
            await axios.post(`${apiUrl}ics-214/activity-log/create/`, activityLogPayloads);

            alert('Data submitted successfully!');
        } catch (error) {
            console.error('Error submitting data:', error);
            alert(`Failed to submit data: ${error.response?.data?.message || error.message}`);
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