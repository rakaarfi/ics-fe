'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dayjs from 'dayjs';
import { fetchData, fetchOperationalPeriodByIncident, readBy } from '@/utils/api';
import FormICS209 from './FormICS209';

export default function Detail() {
    const firstInput = false;
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [formData, setFormData] = useState({
        operational_period_id: "",
        report_version: "",
        report_number: "",
        incident_commander_id: "",
        incident_source: "",
        is_source_ctrl: true,
        materials_release: "",
        is_material_ctrl: true,
        response_status: "",
        is_acc: false,
        acc_num: 0,
        is_acc_mustered: false,
        is_acc_sheltered: false,
        is_acc_evacuated: false,
        is_unacc: false,
        unacc_num: 0,
        unacc_emp: 0,
        unacc_con: 0,
        unacc_oth: 0,
        is_injured: false,
        inj_num: 0,
        inj_emp: 0,
        inj_con: 0,
        inj_oth: 0,
        is_dead: false,
        dead_num: 0,
        dead_emp: 0,
        dead_con: 0,
        dead_oth: 0,
        env_impact: "",
        env_desc: "",
        comm_impact: "",
        comm_desc: "",
        ops_impact: "",
        ops_desc: "",
        events_period: "",
        obj_next_period: "",
        actions_next_period: "",
        res_needed: "",
        est_completion_date: "",
        est_res_democ_start: "",
        cost_to_date: "",
        final_cost_est: "",
        gov_contact: "",
        media_contact: "",
        kin_contact: "",
        shareholder_contact: "",
        comm_rep_contact: "",
        ngo_contact: "",
        is_prepared: false,
        situation_unit_leader_id: "",
        date_prepared: "",
        time_prepared: "",
    });
    const [incidentData, setIncidentData] = useState([]);
    const [fetchedIncident, setFetchedIncident] = useState(null);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [fetchedPeriod, setFetchedPeriod] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [SULeaderData, setSULeaderData] = useState([]);
    const [ICData, setICData] = useState([]);
    const [preparationID, setPreparationID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;

    useEffect(() => {
        setActionType(null);
    }, []);

    // -------------------------------------------------------------------------
    // Gunakan helper readBy, fetchData di dalam useEffect
    // -------------------------------------------------------------------------
    useEffect(() => {
        const fetchIcs209Data = async () => {
            setLoading(true);
            setError(null);

            try {
                // Ambil detail ICS 209 (main data) - pakai readBy
                const mainData = await readBy({ routeUrl: "ics-209/main/read", id });
                setData(mainData);
                setFormData(mainData);
                const operationalPeriodId = mainData.operational_period_id;

                // Ambil Operational Period dan Incident Data in parallel
                const [operationalPeriodResponse, incidentDataResponse] = await Promise.all([
                    fetchData('operational-period'),
                    fetchData('incident-data')
                ])
                setOperationalPeriodData(operationalPeriodResponse);
                setIncidentData(incidentDataResponse);

                const selectedOperationalPeriod = operationalPeriodResponse.find(
                    (period) => period.id === operationalPeriodId
                );
                setFetchedPeriod(selectedOperationalPeriod);

                if (selectedOperationalPeriod) {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        incident_id: selectedOperationalPeriod.incident_id,
                    }));
                }
                
                const selectedIncident = incidentDataResponse.find(
                    (item) => item.id === selectedOperationalPeriod?.incident_id
                );
                setFetchedIncident(selectedIncident);

                // Kalau ada id, baru fetch preparation data - pakai readBy
                if (id) {
                    const prepResponse = await readBy({
                        routeUrl: 'ics-209/preparation/read-by-ics-209-id',
                        id
                    });
                    if (prepResponse && prepResponse.length > 0) {
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            is_prepared: prepResponse[0].is_prepared,
                            situation_unit_leader_id: prepResponse[0].situation_unit_leader_id,
                            date_prepared: prepResponse[0].date_prepared,
                            time_prepared: prepResponse[0].time_prepared,
                        }));
                        setPreparationID(prepResponse[0].id);
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchIcs209Data();
    }, [id]);

    // -------------------------------------------------------------------------
    // Fetch data
    // -------------------------------------------------------------------------
    // Fetch Situation Unit Leader Data
    const fetchSULeader = async () => {
        try {
            const response = await fetchData('planning-section/situation-unit-leader');
            setSULeaderData(response);
        } catch (error) {
            console.error('Error fetching Situation Unit Leader data:', error);
            setError('Failed to fetch Situation Unit Leader data');
        }
    };

    useEffect(() => {
        fetchSULeader();
    }, []);

    // Fetch Incident Commander Data
    const fetchIC = async () => {
        try {
            const response = await fetchData('main-section/incident-commander');
            setICData(response);
        } catch (error) {
            console.error('Error fetching Incident Commander data:', error);
            setError('Failed to fetch Incident Commander data');
        }
    };

    useEffect(() => {
        fetchIC();
    }, []);

    // -------------------------------------------------------------------------
    // Handler dropdown Incident & Operational Period
    // -------------------------------------------------------------------------
    const handleIncidentChange = async (e) => {
        const incident_id = parseInt(e.target.value, 10);
        if (!incident_id) return;

        const incident = incidentData.find((item) => item.id === incident_id);
        setSelectedIncident(incident);

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
        const operational_period = operationalPeriodData.find((item) => item.id === operational_period_id);
        setSelectedPeriod(operational_period);

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
            if (!formData.incident_commander_id || !formData.situation_unit_leader_id) {
                alert('Please fill in all required fields.');
                return;
            }

            const mainPayload = {
                operational_period_id: formData.operational_period_id,
                report_version: formData.report_version,
                report_number: formData.report_number,
                incident_commander_id: formData.incident_commander_id,
                incident_source: formData.incident_source,
                is_source_ctrl: formData.is_source_ctrl,
                materials_release: formData.materials_release,
                is_material_ctrl: formData.is_material_ctrl,
                response_status: formData.response_status,
                is_acc: formData.is_acc,
                acc_num: parseInt(formData.acc_num, 10),
                is_acc_mustered: formData.is_acc_mustered,
                is_acc_sheltered: formData.is_acc_sheltered,
                is_acc_evacuated: formData.is_acc_evacuated,
                is_unacc: formData.is_unacc,
                unacc_num: parseInt(formData.unacc_num, 10),
                unacc_emp: parseInt(formData.unacc_emp, 10),
                unacc_con: parseInt(formData.unacc_con, 10),
                unacc_oth: parseInt(formData.unacc_oth, 10),
                is_injured: formData.is_injured,
                inj_num: parseInt(formData.inj_num, 10),
                inj_emp: parseInt(formData.inj_emp, 10),
                inj_con: parseInt(formData.inj_con, 10),
                inj_oth: parseInt(formData.inj_oth, 10),
                is_dead: formData.is_dead,
                dead_num: parseInt(formData.dead_num, 10),
                dead_emp: parseInt(formData.dead_emp, 10),
                dead_con: parseInt(formData.dead_con, 10),
                dead_oth: parseInt(formData.dead_oth, 10),
                env_impact: formData.env_impact,
                env_desc: formData.env_desc,
                comm_impact: formData.comm_impact,
                comm_desc: formData.comm_desc,
                ops_impact: formData.ops_impact,
                ops_desc: formData.ops_desc,
                events_period: formData.events_period,
                obj_next_period: formData.obj_next_period,
                actions_next_period: formData.actions_next_period,
                res_needed: formData.res_needed,
                est_completion_date: formData.est_completion_date,
                est_res_democ_start: formData.est_res_democ_start,
                cost_to_date: formData.cost_to_date,
                final_cost_est: formData.final_cost_est,
                gov_contact: formData.gov_contact,
                media_contact: formData.media_contact,
                kin_contact: formData.kin_contact,
                shareholder_contact: formData.shareholder_contact,
                comm_rep_contact: formData.comm_rep_contact,
                ngo_contact: formData.ngo_contact,
            };

            // Pilih API
            const response = actionType === "edit"
                ? await axios.put(`${apiUrl}ics-209/main/update`, mainPayload) // Edit existing report
                : await axios.post(`${apiUrl}ics-209/main/create`, mainPayload); // Create new report

            const ics_209_id = response.data.id;

            const now = dayjs();
            const preparedPayload = {
                ics_209_id: ics_209_id,
                situation_unit_leader_id: formData.situation_unit_leader_id,
                date_prepared: now.format('YYYY-MM-DD'),
                time_prepared: now.format('HH:mm'),
                is_prepared: formData.is_prepared,
            };
            if (preparationID) {
                await axios.put(`${apiUrl}ics-209/preparation/update/${preparationID}`, preparedPayload);
            } else {
                await axios.post(`${apiUrl}ics-209/preparation/create`, preparedPayload);
            }
            alert("Changes saved successfully!");
        } catch (error) {
            console.error('Error submitting data:', error);
            alert(`Failed to submit data: ${error.response?.data?.message || error.message}`);
        }
    };

    // Update nilai _num secara otomatis
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            unacc_num: (parseInt(prev.unacc_emp) || 0) + (parseInt(prev.unacc_con) || 0) + (parseInt(prev.unacc_oth) || 0),
            inj_num: (parseInt(prev.inj_emp) || 0) + (parseInt(prev.inj_con) || 0) + (parseInt(prev.inj_oth) || 0),
            dead_num: (parseInt(prev.dead_emp) || 0) + (parseInt(prev.dead_con) || 0) + (parseInt(prev.dead_oth) || 0),
        }));
    }, [formData.unacc_emp, formData.unacc_con, formData.unacc_oth, formData.inj_emp, formData.inj_con, formData.inj_oth, formData.dead_emp, formData.dead_con, formData.dead_oth]);

    return (
        <FormICS209
            formData={formData}
            setFormData={setFormData}
            error={error}
            loading={loading}
            incidentData={incidentData}
            operationalPeriodData={operationalPeriodData}
            selectedIncident={selectedIncident}
            fetchedIncident={fetchedIncident}
            selectedPeriod={selectedPeriod}
            fetchedPeriod={fetchedPeriod}
            ICData={ICData}
            SULeaderData={SULeaderData}
            actionType={actionType}
            setActionType={setActionType}
            handleIncidentChange={handleIncidentChange}
            handleOperationalPeriodChange={handleOperationalPeriodChange}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            firstInput={firstInput}
        />
    );
}