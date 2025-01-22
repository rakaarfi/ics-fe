'use client';

import { useEffect, useState } from "react";
import { fetchData } from "@/utils/api";

const useFetchDynamicOptions = () => {
    const [dynamicOptions, setDynamicOptions] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        console.time('fetchDataTime'); // Mulai timer

        fetchData("main-section/incident-commander").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "incident_commander_id": response }))
        ).catch((error) => console.error("Error fetching incident-commander:", error));

        fetchData("main-section/deputy-incident-commander").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "deputy_incident_commander_id": response }))
        ).catch((error) => console.error("Error fetching deputy-incident-commander:", error));

        fetchData("main-section/safety-officer").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "safety_officer_id": response }))
        ).catch((error) => console.error("Error fetching safety-officer:", error));

        fetchData("main-section/public-information-officer").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "public_information_officer_id": response }))
        ).catch((error) => console.error("Error fetching public-information-officer:", error));

        fetchData("main-section/liaison-officer").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "liaison_officer_id": response }))
        ).catch((error) => console.error("Error fetching liaison-officer:", error));

        fetchData("main-section/legal-officer").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "legal_officer_id": response }))
        ).catch((error) => console.error("Error fetching legal-officer:", error));

        fetchData("main-section/human-capital-officer").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "human_capital_officer_id": response }))
        ).catch((error) => console.error("Error fetching human-capital-officer:", error));

        fetchData("main-section/operation-section-chief").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "operation_section_chief_id": response }))
        ).catch((error) => console.error("Error fetching operation-section-chief:", error));

        fetchData("planning-section/planning-section-chief").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "planning_section_chief_id": response }))
        ).catch((error) => console.error("Error fetching planning-section-chief:", error));

        fetchData("planning-section/situation-unit-leader").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "situation_unit_leader_id": response }))
        ).catch((error) => console.error("Error fetching situation-unit-leader:", error));

        fetchData("planning-section/resources-unit-leader").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "resources_unit_leader_id": response }))
        ).catch((error) => console.error("Error fetching resources-unit-leader:", error));

        fetchData("planning-section/documentation-unit-leader").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "documentation_unit_leader_id": response }))
        ).catch((error) => console.error("Error fetching documentation-unit-leader:", error));

        fetchData("planning-section/demobilization-unit-leader").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "demobilization_unit_leader_id": response }))
        ).catch((error) => console.error("Error fetching demobilization-unit-leader:", error));

        fetchData("planning-section/environmental-unit-leader").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "environmental_unit_leader_id": response }))
        ).catch((error) => console.error("Error fetching environmental-unit-leader:", error));

        fetchData("planning-section/technical-specialist").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "technical_specialist_id": response }))
        ).catch((error) => console.error("Error fetching technical-specialist:", error));

        fetchData("logistic-section/logistic-section-chief").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "logistic_section_chief_id": response }))
        ).catch((error) => console.error("Error fetching logistic-section-chief:", error));

        fetchData("logistic-section/communication-unit-leader").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "communication_unit_leader_id": response }))
        ).catch((error) => console.error("Error fetching communication-unit-leader:", error));

        fetchData("logistic-section/medical-unit-leader").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "medical_unit_leader_id": response }))
        ).catch((error) => console.error("Error fetching medical-unit-leader:", error));

        fetchData("logistic-section/food-unit-leader").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "food_unit_leader_id": response }))
        ).catch((error) => console.error("Error fetching food-unit-leader:", error));

        fetchData("logistic-section/facility-unit-leader").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "facility_unit_leader_id": response }))
        ).catch((error) => console.error("Error fetching facility-unit-leader:", error));

        fetchData("logistic-section/supply-unit-leader").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "supply_unit_leader_id": response }))
        ).catch((error) => console.error("Error fetching supply-unit-leader:", error));

        fetchData("logistic-section/transportation-unit-leader").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "transportation_unit_leader_id": response }))
        ).catch((error) => console.error("Error fetching transportation-unit-leader:", error));

        fetchData("finance-section/finance-section-chief").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "finance_section_chief_id": response }))
        ).catch((error) => console.error("Error fetching finance-section-chief:", error));

        fetchData("finance-section/procurement-unit-leader").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "procurement_unit_leader_id": response }))
        ).catch((error) => console.error("Error fetching procurement-unit-leader:", error));

        fetchData("finance-section/compensation-claim-unit-leader").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "compensation_claim_unit_leader_id": response }))
        ).catch((error) => console.error("Error fetching compensation-claim-unit-leader:", error));

        fetchData("finance-section/cost-unit-leader").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "cost_unit_leader_id": response }))
        ).catch((error) => console.error("Error fetching cost-unit-leader:", error));

        fetchData("finance-section/time-unit-leader").then((response) =>
            setDynamicOptions((prev) => ({ ...prev, "time_unit_leader_id": response }))
        ).catch((error) => console.error("Error fetching time-unit-leader:", error));

        console.timeEnd('fetchDataTime'); // Hentikan timer dan tampilkan waktu
    }, []);

    return { dynamicOptions, error };
};

export default useFetchDynamicOptions;