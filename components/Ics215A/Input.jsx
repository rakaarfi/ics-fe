'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { fetchData, fetchOperationalPeriodByIncident } from '@/utils/api';
import FormICS215A from './FormICS215A';

export default function Input() {
    const [formData, setFormData] = useState({
        operational_period_id: "",
        name: "",
        position: "",
        home_agency: "",
        is_prepared_safety_officer: false,
        is_prepared_os_chief: false,
        subForm: [{
            incident_area: "",
            hazards_risks: "",
            mitigations: "",
        }],
    });
    const [incidentData, setIncidentData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [OSChiefData, setOSChiefData] = useState([]);
    const [safetyOfficerData, setSafetyOfficerData] = useState([]);
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

    const fetchSafetyOfficer = async () => {
        try {
            const response = await fetchData('main-section/safety-officer');
            setSafetyOfficerData(response);
        } catch (error) {
            console.error('Error fetching Safety Officer data:', error);
            setError('Failed to fetch Safety Officer data');
        }
    };

    useEffect(() => {
        fetchSafetyOfficer();
    }, []);

    const fetchOSChief = async () => {
        try {
            const response = await fetchData('main-section/operation-section-chief');
            setOSChiefData(response);
        } catch (error) {
            console.error('Error fetching Operation Section Chief data:', error);
            setError('Failed to fetch Operation Section Chief data');
        }
    };

    useEffect(() => {
        fetchOSChief();
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
    // Handler SubForm
    // -------------------------------------------------------------------------
    const handleAddSubFormsRow = () => {
        setFormData(prevData => ({
            ...prevData,
            subForm: [...prevData.subForm, {
                incident_area: "",
                hazards_risks: "",
                mitigations: "",
            }],
        }));
    }

    const handleRemoveSubFormsRow = (index) => {
        setFormData(prevData => ({
            ...prevData,
            subForm: prevData.subForm.filter((_, i) => i !== index),
        }));
    }

    const handleSubFormChange = (index, updates) => {
        setFormData(prevData => {
            const newSubForms = [...prevData.subForm];
            newSubForms[index] = { ...newSubForms[index], ...updates };
            return { ...prevData, subForm: newSubForms };
        });
    }

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

            // Validasi minimal salah satu select terisi
            if (!formData.is_prepared_os_chief && !formData.is_prepared_safety_officer) {
                setError("Please select at least one of Operation Section Chief or Safety Officer.");
                return;
            } else {
                setError(null); // Reset error jika valid
            }

            const mainPayload = {
                operational_period_id: formData.operational_period_id,
            };
            const response = await axios.post(`${apiUrl}ics-215a/main/create`, mainPayload);
            const ics_215a_id = response.data.id;

            const subFormPayloads = {
                datas: formData.subForm.map(row => ({
                    ics_215a_id: ics_215a_id,
                    incident_area: row.incident_area,
                    hazards_risks: row.position,
                    mitigations: row.mitigations,
                }))
            }
            await axios.post(`${apiUrl}ics-215a/sub-form/create/`, subFormPayloads);

            const now = dayjs();
            // Payload untuk OS Chief
            if (formData.is_prepared_os_chief) {
                const preparedOSChiefPayload = {
                    ics_215a_id: ics_215a_id,
                    operation_section_chief_id: formData.operation_section_chief_id,
                    date_prepared: now.format('YYYY-MM-DD'),
                    time_prepared: now.format('HH:mm'),
                    is_prepared: formData.is_prepared_os_chief,
                };
                await axios.post(`${apiUrl}ics-215a/preparation-os-chief/create/`, preparedOSChiefPayload);
            }

            // Payload untuk Safety Officer
            if (formData.is_prepared_safety_officer) {
                const preparedSafetyOfficerPayload = {
                    ics_215a_id: ics_215a_id,
                    safety_officer_id: formData.safety_officer_id,
                    date_prepared: now.format('YYYY-MM-DD'),
                    time_prepared: now.format('HH:mm'),
                    is_prepared: formData.is_prepared_safety_officer,
                };
                await axios.post(`${apiUrl}ics-215a/preparation-safety-officer/create/`, preparedSafetyOfficerPayload);
            }

            alert('Data submitted successfully!');
        } catch (error) {
            console.error('Error submitting data:', error);
            alert(`Failed to submit data: ${error.response?.data?.message || error.message}`);
        }
    };

    useEffect(() => {
        if (!formData.is_prepared_os_chief) {
            // Jika Operation Section Chief tidak menjadi "Prepared by", hapus dari state
            setFormData(prev => ({
                ...prev,
                operation_section_chief_id: null
            }));
        }
    }, [formData.is_prepared_os_chief]);

    useEffect(() => {
        if (!formData.is_prepared_safety_officer) {
            // Jika Safety Officer tidak menjadi "Prepared by", hapus dari state
            setFormData(prev => ({
                ...prev,
                safety_officer_id: null
            }));
        }
    }, [formData.is_prepared_safety_officer]);

    return (
        <FormICS215A
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
            handleAddSubFormsRow={handleAddSubFormsRow}
            handleRemoveSubFormsRow={handleRemoveSubFormsRow}
            handleSubFormChange={handleSubFormChange}
            OSChiefData={OSChiefData}
            safetyOfficerData={safetyOfficerData}
        />
    );
}