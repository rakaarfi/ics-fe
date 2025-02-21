'use client';

import React, { useEffect, useState } from "react";
import FormContainer from "@/components/FormContainer";
import RosterForm from "@/components/ImtRoster/RosterForm";
import useFetchDynamicOptions from "@/components/ImtRoster/useFetchDynamicOptions";
import { ButtonSaveChanges } from "@/components/ButtonComponents";
import axios from "axios";
import dayjs from 'dayjs';
import { useParams } from "next/navigation";
import { fetchOperationalPeriodByIncident, fetchData, readBy, readById } from "@/utils/api";

export default function Detail() {
    const { id } = useParams();
    const { dynamicOptions } = useFetchDynamicOptions();
    const [formData, setFormData] = useState({
        operational_period_id: null,
        incident_commander_id: null,
        deputy_incident_commander_id: null,
        safety_officer_id: null,
        public_information_officer_id: null,
        liaison_officer_id: null,
        legal_officer_id: null,
        human_capital_officer_id: null,
        operation_section_chief_id: null,
        planning_section_chief_id: null,
        situation_unit_leader_id: null,
        resources_unit_leader_id: null,
        documentation_unit_leader_id: null,
        demobilization_unit_leader_id: null,
        environmental_unit_leader_id: null,
        technical_specialist_id: null,
        logistic_section_chief_id: null,
        communication_unit_leader_id: null,
        medical_unit_leader_id: null,
        food_unit_leader_id: null,
        facility_unit_leader_id: null,
        supply_unit_leader_id: null,
        transportation_unit_leader_id: null,
        finance_section_chief_id: null,
        procurement_unit_leader_id: null,
        compensation_claim_unit_leader_id: null,
        cost_unit_leader_id: null,
        time_unit_leader_id: null,
        is_prepared: false,
        resources_unit_leader_id: null,
        date_prepared: "",
        time_prepared: "",
    });
    const [incidentData, setIncidentData] = useState([]);
    const [operationalPeriodData, setOperationalPeriodData] = useState([]);
    const [RULeaderData, setRULeaderData] = useState([]);
    const [preparationData, setPreparationData] = useState({
        is_prepared: false,
        resources_unit_leader_id: "",
        date_prepared: "",
        time_prepared: "",
    })
    const [preparationID, setPreparationID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;

    // routeUrl yang merepresentasikan endpoint ICS-203 main
    const routeUrl = "ics-203/main";

    // -------------------------------------------------------------------------
    // Gunakan helper readById, fetchData, readByIcs203Id di dalam useEffect
    // -------------------------------------------------------------------------
    useEffect(() => {
        const fetchIcs203Data = async () => {
            setLoading(true);
            setError(null);

            try {
                // Ambil detail ICS 202 (main data) - pakai readById
                const mainData = await readById({ routeUrl, id });
                setFormData(mainData);

                // Simpan ID operational period untuk pemakaian berikutnya
                const operationalPeriodId = mainData.operational_period_id;

                // Ambil semua data operational period - pakai fetchData
                const allOperationalPeriods = await fetchData('operational-period');
                setOperationalPeriodData(allOperationalPeriods);

                // Cari operational period yang sesuai
                const selectedOperationalPeriod = allOperationalPeriods.find(
                    (period) => period.id === operationalPeriodId
                );
                if (selectedOperationalPeriod) {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        incident_id: selectedOperationalPeriod.incident_id,
                    }));
                }

                // Kalau ada id, baru fetch preparation data - pakai readBy
                if (id) {
                    const prepResponse = await readBy({
                        routeUrl: 'ics-203/preparation/read-by-ics-203-id',
                        id
                    });
                    if (prepResponse && prepResponse.length > 0) {
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            is_prepared: prepResponse[0].is_prepared,
                            resources_unit_leader_id: prepResponse[0].resources_unit_leader_id,
                            date_prepared: prepResponse[0].date_prepared,
                            time_prepared: prepResponse[0].time_prepared
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

        fetchIcs203Data();
    }, [id, routeUrl]);

    // -------------------------------------------------------------------------
    // Fetch data Incident & Resources Unit Leader
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
            console.log("Resources Unit Leader Data:", response);
        } catch (error) {
            console.error('Error fetching Resources Unit Leader data:', error);
            setError('Failed to fetch Resources Unit Leader data');
        }
    };

    useEffect(() => {
        fetchRULeader();
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
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // -------------------------------------------------------------------------
    // Submit data (PUT / POST)
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
            const response = await axios.put(`${apiUrl}ics-203/main/update/${id}`, mainPayload);
            const ics_203_id = response.data.id;

            const now = dayjs();
            const preparedPayload = {
                ics_203_id: ics_203_id,
                resources_unit_leader_id: formData.resources_unit_leader_id,
                date_prepared: now.format('YYYY-MM-DD'),
                time_prepared: now.format('HH:mm'),
                is_prepared: formData.is_prepared,
            };
            if (preparationID) {
                await axios.put(`${apiUrl}ics-203/preparation/update/${preparationID}`, preparedPayload)
            } else {
                await axios.post(`${apiUrl}ics-203/preparation/create`, preparedPayload);
            }
            alert("Data submitted successfully!");
        } catch (error) {
            console.error("Submission error:", error.message);
            alert("Terjadi kesalahan saat menyimpan data.");
        }
    };

    return (
        <FormContainer title="ICS 203 - Organization Assignment Detail">
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
                SubmitButton={ButtonSaveChanges}
                periodRemark={false}
                RULeaderData={RULeaderData}
                setFormData={setFormData}
            />
        </FormContainer>
    );
}
