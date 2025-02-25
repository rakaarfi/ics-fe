'use client';

import axios from 'axios';
import dayjs from 'dayjs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Checkbox, FormControl, FormControlLabel, MenuItem, Select } from '@mui/material';
import FormContainer from '@/components/FormContainer';
import { fetchData, readBy } from '@/utils/api';
import { FormatListNumberedRtlSharp } from '@mui/icons-material';
import FormPreview from './FormPreview';

dayjs.extend(customParseFormat);


export default function ToBeApproved() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [activeTab, setActiveTab] = useState(1);
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
    const [incidentDetails, setIncidentDetails] = useState(null);
    const [selectedOperationalPeriod, setSelectedOperationalPeriod] = useState(null)
    const [SULeaderData, setSULeaderData] = useState([]);
    const [incidentCommanderData, setIncidentCommanderData] = useState([]);
    const [ICData, setICData] = useState([]);
    const [preparationID, setPreparationID] = useState(null);
    const [approvalData, setApprovalData] = useState({
        incident_commander_id: "",
        is_approved: false,
        date_approved: dayjs().format('YYYY-MM-DD'),
        time_approved: dayjs().format('HH:mm'),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;

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
                const operationalPeriodResponse = await readBy({ routeUrl: 'operational-period/read', id: operationalPeriodId });
                const incidentId = operationalPeriodResponse.incident_id;
                setSelectedOperationalPeriod(operationalPeriodResponse);

                if (operationalPeriodResponse) {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        incident_id: incidentId,
                    }));
                }

                const incidentResponse = await readBy({
                    routeUrl: 'incident-data/read',
                    id: incidentId
                });
                setIncidentDetails(incidentResponse);

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
                console.log('ICS 209 Data:', mainData);

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
    const fetchSULeader = async (SULeaderId) => {
        try {
            const response = await readBy({
                routeUrl: 'planning-section/situation-unit-leader/read',
                id: SULeaderId
            });
            setSULeaderData(response);
        } catch (error) {
            console.error('Error fetching Situation Unit Leader data:', error);
            setError(`Error fetching Situation Unit Leader data`)
        }
    };

    useEffect(() => {
        if (formData.situation_unit_leader_id) {
            fetchSULeader(formData.situation_unit_leader_id);
        }
    }, [formData.situation_unit_leader_id]);

    // Fetch Incident Commander
    const fetchIC = async (incindentId) => {
        try {
            const response = await readBy({
                routeUrl: 'main-section/incident-commander/read',
                id: incindentId
            });
            setICData(response);
        } catch (error) {
            console.error('Error fetching Incident Commander data:', error);
            setError(`Error fetching Incident Commander data`)
        }
    }

    useEffect(() => {
        if (formData.incident_commander_id) {
            fetchIC(formData.incident_commander_id)
        };
    }, [formData.incident_commander_id]);

    // Fetch data Incident Commander
    const fetchIncidentCommander = async () => {
        try {
            const response = await fetchData('main-section/incident-commander')
            setIncidentCommanderData(response)
        } catch (error) {
            console.error('Error fetching incident commander data:', error);
            setError('Failed to fetch incident commander data');
        }
    };

    useEffect(() => {
        fetchIncidentCommander();
    }, []);

    // Fetch Approval Data
    useEffect(() => {
        const fetchApprovalData = async (ics_202_id) => {
            try {
                const response = await readBy({
                    routeUrl: 'ics-202/approval/read-by-ics-202-id',
                    id: ics_202_id
                });
                if (response && response.length > 0) {
                    setApprovalData(response[0]);
                }
            } catch (error) {
                console.error('Error fetching approval data:', error);
                setError(`Error fetching approval data`)
            }
        };

        if (id) {
            fetchApprovalData(id);
        }
    }, [id]);

    // -------------------------------------------------------------------------
    // Submit data (POST)
    // -------------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const now = dayjs();
            const payload = {
                ics_209_id: formData.id,
                incident_commander_id: formData.incident_commander_id,
                date_approved: now.format('YYYY-MM-DD'),
                time_approved: now.format('HH:mm'),
                is_approved: approvalData.is_approved,
            };
            const response = await axios.post(`${apiUrl}ics-209/approval/create/`, payload);
            console.log('Approval submitted successfully:', response.data);
            alert('Approval submitted successfully!');
        } catch (error) {
            console.error('Error submitting approval:', error);
            alert('Failed to submit approval. Please try again.');
        }
    };

    const isPrepared = formData.is_prepared;
    const preparedDate = formData.date_prepared;
    const preparedTime = formData.time_prepared;

    return (
        <FormPreview
            fetchedIncident={incidentDetails}
            fetchedPeriod={selectedOperationalPeriod}
            formData={formData}
            SULeaderData={SULeaderData}
            isPrepared={isPrepared}
            preparedDate={preparedDate}
            preparedTime={preparedTime}
            ICData={incidentCommanderData}
            approvalData={approvalData}
            setApprovalData={setApprovalData}
            error={error}
            isTobeApproved={true}
            handleSubmit={handleSubmit}
        />
    );
}