'use client';

import React, { useEffect, useState } from "react";
import FormContainer from "@/components/FormContainer";
import RosterForm from "@/components/ImtRoster/RosterForm";
import useFetchDynamicOptions from "@/components/ImtRoster/useFetchDynamicOptions";
import { ButtonSubmit } from "@/components/ButtonComponents";
import axios from "axios";
import dayjs from 'dayjs';
import { fetchData, fetchOperationalPeriodByIncident } from "@/utils/api";


export default function Input() {
    const { dynamicOptions } = useFetchDynamicOptions();
    const [formData, setFormData] = useState({});
    const [incidentData, setIncidentData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [RULeaderData, setRULeaderData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;

    // -------------------------------------------------------------------------
    // Fetch data
    // -------------------------------------------------------------------------
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

    const fetchRULeader = async () => {
        try {
            const response = await fetchData('planning-section/resources-unit-leader');
            setRULeaderData(response);
        } catch (error) {
            console.error('Error fetching Resources Unit Leader data:', error);
            setError('Failed to fetch Resources Unit Leader data');
        }
    };

    useEffect(() => {
        fetchRULeader();
    }, []);

    // -------------------------------------------------------------------------
    // Handler umum untuk text/checkbox
    // -------------------------------------------------------------------------
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        const selectedValue = e.target.value;

        const operational_period_id = selectedValue ? parseInt(selectedValue, 10) : null;
        setFormData(prevState => ({
            ...prevState,
            operational_period_id
        }));
    };

    // -------------------------------------------------------------------------
    // Submit data (POST)
    // -------------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.operational_period_id) {
            alert("Please select an Operational Period.");
            return;
        }

        try {
            const mainPayload = {
                operational_period_id: formData.operational_period_id,
                incident_commander_id: formData.incident_commander_id,
                deputy_incident_commander_id: formData.deputy_incident_commander_id,
                safety_officer_id: formData.safety_officer_id,
                public_information_officer_id: formData.public_information_officer_id,
                liaison_officer_id: formData.liaison_officer_id,
                legal_officer_id: formData.legal_officer_id,
                human_capital_officer_id: formData.human_capital_officer_id,
                operation_section_chief_id: formData.operation_section_chief_id,
                planning_section_chief_id: formData.planning_section_chief_id,
                situation_unit_leader_id: formData.situation_unit_leader_id,
                resources_unit_leader_id: formData.resources_unit_leader_id,
                documentation_unit_leader_id: formData.documentation_unit_leader_id,
                demobilization_unit_leader_id: formData.demobilization_unit_leader_id,
                environmental_unit_leader_id: formData.environmental_unit_leader_id,
                technical_specialist_id: formData.technical_specialist_id,
                logistic_section_chief_id: formData.logistic_section_chief_id,
                communication_unit_leader_id: formData.communication_unit_leader_id,
                medical_unit_leader_id: formData.medical_unit_leader_id,
                food_unit_leader_id: formData.food_unit_leader_id,
                facility_unit_leader_id: formData.facility_unit_leader_id,
                supply_unit_leader_id: formData.supply_unit_leader_id,
                transportation_unit_leader_id: formData.transportation_unit_leader_id,
                finance_section_chief_id: formData.finance_section_chief_id,
                procurement_unit_leader_id: formData.procurement_unit_leader_id,
                compensation_claim_unit_leader_id: formData.compensation_claim_unit_leader_id,
                cost_unit_leader_id: formData.cost_unit_leader_id,
                time_unit_leader_id: formData.time_unit_leader_id,
            };
            const response = await axios.post(`${apiUrl}ics-203/main/create`, mainPayload);
            const ics_203_id = response.data.id;

            const now = dayjs();
            const preparedPayload = {
                ics_203_id: ics_203_id,
                resources_unit_leader_id: formData.resources_unit_leader_id,
                date_prepared: now.format('YYYY-MM-DD'),
                time_prepared: now.format('HH:mm'),
                is_prepared: formData.is_prepared,
            };
            await axios.post(`${apiUrl}ics-203/preparation/create/`, preparedPayload);
            alert("Data submitted successfully!");
        } catch (error) {
            console.error("Submission error:", error.message);
            alert("Terjadi kesalahan saat menyimpan data.");
        }
    };

    return (
        <FormContainer title="Input ICS 203 - Organization Assignment List">
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-4 flex flex-row">
                <select
                    className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                    value={formData.incident_id || ""}
                    onChange={handleIncidentChange}
                    required
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

                <select
                    className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                    value={formData.operational_period_id || ""}
                    onChange={handleOperationalPeriodChange}
                    disabled={loading || !formData.incident_id}
                    required
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
            <RosterForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                dynamicOptions={dynamicOptions}
                SubmitButton={ButtonSubmit}
                periodRemark={false}
                RULeaderData={RULeaderData}
                setFormData={setFormData}
            />
        </FormContainer>
    );
}
