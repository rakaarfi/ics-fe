'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { fetchData, fetchOperationalPeriodByIncident, readBy } from '@/utils/api';
import { useParams } from 'next/navigation';
import FormICS215A from './FormICS215A';

export default function Detail() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        operational_period_id: "",
        name: "",
        position: "",
        home_agency: "",
        is_prepared_safety_officer: false,
        is_prepared_os_chief: false,
        subForm: [],
        idsToDeleteSubForm: [],
    });
    const [incidentData, setIncidentData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [OSChiefData, setOSChiefData] = useState([]);
    const [safetyOfficerData, setSafetyOfficerData] = useState([]);
    const [preparationOSChiefID, setPreparationOSChiefID] = useState(null);
    const [preparationSafetyOfficerID, setPreparationSafetyOfficerID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;

    // -------------------------------------------------------------------------
    // Gunakan helper readBy, fetchData di dalam useEffect
    // -------------------------------------------------------------------------
    useEffect(() => {
        const fetchIcs215AData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch main data
                const responseData = await readBy({ routeUrl: "ics-215a/main/read", id });
                const mainData = responseData;

                // Fetch additional data in parallel
                const [operationalPeriodResponse, subFormData, preparationOSChiefResponse, preparationSafetyOfficerResponse] = await Promise.all([
                    fetchData('operational-period'),
                    fetchSubFormData(mainData.id),
                    readBy({ routeUrl: 'ics-215a/preparation-os-chief/read-by-ics-215a-id', id }),
                    readBy({ routeUrl: 'ics-215a/preparation-safety-officer/read-by-ics-215a-id', id }),
                ]);

                // Extracting data
                const operationalPeriodData = operationalPeriodResponse;
                const preparationOSChiefData = preparationOSChiefResponse.length > 0 ? preparationOSChiefResponse[0] : null;
                const preparationSafetyOfficerData = preparationSafetyOfficerResponse.length > 0 ? preparationSafetyOfficerResponse[0] : null;

                // Find associated incident_id from operational period
                const selectedOperationalPeriod = operationalPeriodData.find(period => period.id === mainData.operational_period_id);
                const incidentId = selectedOperationalPeriod ? selectedOperationalPeriod.incident_id : null;

                // Update FormData with fetched data
                setFormData(prevFormData => ({
                    ...prevFormData,
                    ...mainData, // Spread all main data fields
                    incident_id: incidentId,
                    subForm: subFormData.length > 0 ? subFormData : [{
                        name: "",
                        position: "",
                        home_agency: "",
                    }],
                    activityLog: activityLogData.length > 0 ? activityLogData : [{
                        date_activity: "",
                        time_activity: null,
                        notable_activity: "",
                    }],
                    ...(preparationOSChiefData && {
                        is_prepared_os_chief: preparationOSChiefData.is_prepared,
                        operation_section_chief_id: preparationOSChiefData.operation_section_chief_id,
                        date_prepared: preparationOSChiefData.date_prepared,
                        time_prepared: preparationOSChiefData.time_prepared,
                    }),
                    ...(preparationSafetyOfficerData && {
                        is_prepared_safety_officer: preparationSafetyOfficerData.is_prepared,
                        safety_officer_id: preparationSafetyOfficerData.safety_officer_id,
                        date_prepared: preparationSafetyOfficerData.date_prepared,
                        time_prepared: preparationSafetyOfficerData.time_prepared,
                    })
                }));

                // Set state
                setOperationalPeriodData(operationalPeriodData);
                if (preparationOSChiefData) {
                    setPreparationOSChiefID(preparationOSChiefData.id);
                }
                if (preparationSafetyOfficerData) {
                    setPreparationSafetyOfficerID(preparationSafetyOfficerData.id);
                }

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchIcs215AData();
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

    const fetchSubFormData = async (ics_215a_id) => {
        try {
            const response = await readBy({
                routeUrl: "ics-215a/sub-form/read-by-ics-215a-id",
                id: ics_215a_id
            });
            return response;
        } catch (error) {
            console.error("Error fetching subForm assigned data:", error);
            throw error;
        }
    };

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
    // Handler Resource Assigned
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
            idsToDeleteSubForm: [...prevData.idsToDeleteSubForm, prevData.subForm[index].id]
        }));
    }

    const handleSubFormChange = (index, updates) => {
        setFormData(prevData => {
            const newSubForm = [...prevData.subForm];
            newSubForm[index] = { ...newSubForm[index], ...updates };
            return { ...prevData, subForm: newSubForm };
        });
    }

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

            const mainPayload = {
                operational_period_id: formData.operational_period_id,
            };
            const response = await axios.put(`${apiUrl}ics-215a/main/update/${id}`, mainPayload);
            const ics_215a_id = response.data.id;

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
                if (preparationOSChiefID) {
                    await axios.put(`${apiUrl}ics-215a/preparation-os-chief/update/${preparationOSChiefID}`, preparedOSChiefPayload);
                } else {
                    await axios.post(`${apiUrl}ics-215a/preparation-os-chief/create/`, preparedOSChiefPayload);
                }
            }

            // Payload untuk RU Leader
            if (formData.is_prepared_safety_officer) {
                const preparedSafetyOfficerPayload = {
                    ics_215a_id: ics_215a_id,
                    safety_officer_id: formData.safety_officer_id,
                    date_prepared: now.format('YYYY-MM-DD'),
                    time_prepared: now.format('HH:mm'),
                    is_prepared: formData.is_prepared_safety_officer,
                };
                if (preparationSafetyOfficerID) {
                    await axios.put(`${apiUrl}ics-215a/preparation-safety-officer/update/${preparationSafetyOfficerID}`, preparedSafetyOfficerPayload);
                } else {
                    await axios.post(`${apiUrl}ics-215a/preparation-safety-officer/create/`, preparedSafetyOfficerPayload);
                }
            }

            // Update subForm assigned and activity log
            await updateSubForm(formData.subForm)

            // Delete marked subForm assigned and activity log
            if (formData.idsToDeleteSubForm > 0) {
                await axios.delete(`${apiUrl}ics-215a/sub-form/delete-many`, {
                    data: {
                        ids: formData.idsToDeleteSubForm
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
    const updateSubForm = async (subFormData) => {
        try {
            // Create new subForm (tanpa ID)
            const newSubForm = subFormData.filter(setFormData => !setFormData.id);
            if (newSubForm.length > 0) {
                await axios.post(`${apiUrl}ics-215a/sub-form/create/`, {
                    datas: newSubForm.map(s => ({
                        ics_215a_id: id,
                        ...s,
                    }))
                });
            }

            // Update existing subForm (dengan ID)
            const existingSubForm = subFormData.filter(s => s.id);
            for (const subForm of existingSubForm) {
                await axios.put(
                    `${apiUrl}ics-215a/sub-form/update/${subForm.id}`,
                    subForm
                );
            }
        } catch (error) {
            console.error("Error updating subForm:", error);
            throw error;
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