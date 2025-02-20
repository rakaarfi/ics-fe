'use client'

import React, { useEffect, useState } from "react";
import { fetchData, readTableById } from "@/utils/api";
import FormContainer from "../FormContainer";

const ChartNameOnly = () => {

    const [data, setData] = useState({});
    const [roster, setRoster] = useState([]);
    const [selectedRoster, setSelectedRoster] = useState(null);

    useEffect(() => {
        const fetchRosterData = async () => {
            try {
                const initialRoster = await fetchData('roster');
                setRoster(initialRoster);
            } catch (err) {
                console.error("Error fetching roster data:", err.message);
            }
        };

        fetchRosterData();
    }, []);

    const getData = async (selectedId) => {
        setSelectedRoster(roster.find((roster) => roster.id === selectedId));
        try {
            const response = await readTableById({ routeUrl: 'roster-table', id: selectedId });
            setData(response);
        } catch (err) {
            console.error("Error fetching data:", err.message);
        }
    };

    const handleRosterClick = (rosterId) => {
        getData(rosterId);
    };

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <FormContainer>
            <h1 className="text-2xl font-bold text-center mb-2 whitespace-nowrap">Organisation Flow chart</h1>
            <div className="flex flex-col mb-4">
                <select
                    value={selectedRoster ? selectedRoster.id : ""}
                    onChange={(e) => handleRosterClick(Number(e.target.value))}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8]"
                >
                    <option value="" disabled>
                        Select Roster
                    </option>
                    {roster.map((roster) => (
                        <option key={roster.id} value={roster.id}>
                            {roster.date_from} — {roster.date_to}
                        </option>
                    ))}
                </select>
                <p className="w-full px-3 py-1.5 text-base text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8]">
                    Remark: {selectedRoster ? selectedRoster.remark : ""}
                </p>
            </div>

            <div
                className="border border-gray-300 rounded-md p-3"
                style={{
                    maxHeight: '800px',
                    overflowX: 'scroll',
                    position: 'relative'
                }}
            >
                <div style={{
                    minWidth: 'max-content',
                    paddingLeft: '100px',
                    paddingRight: '100px'
                }}>

                    <div className="container mx-auto text-center pt-5">
                        <div className="items-center justify-center flex">
                            <div className="text-center">
                                <div className="flex flex-col justify-center items-center">
                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                        <h2 className="font-bold">Incident Commander</h2>
                                        <p>{data.incident_commander_name}</p>
                                    </div>
                                </div>
                                <ul className="flex flex-row mt-10 justify-center">
                                    <div className="-mt-10 border-l-2 absolute h-10 border-gray-400"></div>
                                    <li className="relative p-6">
                                        <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                            style={{ left: '129px', right: '50%' }}></div>
                                        <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                            style={{ left: '50%', right: '135px' }}></div>
                                        <div className="flex justify-center items-center"
                                            style={{ left: '-12%', right: '100%' }}>
                                            <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                                style={{ left: '9%', right: '0px' }}></div>
                                            <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                                style={{ left: '25%', right: '0px' }}></div>
                                            <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                                style={{ left: '42%', right: '0px' }}></div>
                                            <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                                style={{ left: '58%', right: '0px' }}></div>
                                            <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                                style={{ left: '75%', right: '0px' }}></div>
                                            <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                                style={{ left: '90.5%', right: '0px' }}></div>
                                            <div className="text-start">
                                                <div className="flex flex-row justify-start items-start gap-5">
                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                        <h2 className="font-bold">Human Capital Officer</h2>
                                                        <p>{data.human_capital_officer_name}</p>
                                                    </div>
                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                        <h2 className="font-bold">Public Information Officer</h2>
                                                        <p>{data.public_information_officer_name}</p>
                                                    </div>
                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                        <h2 className="font-bold">Deputy Incident Commander</h2>
                                                        <p>{data.deputy_incident_commander_name}</p>
                                                    </div>
                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                        <h2 className="font-bold">Safety Officer</h2>
                                                        <p>{data.safety_officer_name}</p>
                                                    </div>
                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                        <h2 className="font-bold">Liaison Officer</h2>
                                                        <p>{data.liaison_officer_name}</p>
                                                    </div>
                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                        <h2 className="font-bold">Legal Officer</h2>
                                                        <p>{data.legal_officer_name}</p>
                                                    </div>
                                                </div>
                                                <ul className="flex flex-row mt-10 justify-center">
                                                    <div className="-mt-10 border-l-2 absolute h-10 border-gray-400"
                                                        style={{ left: '42%', right: '0px' }}></div>
                                                    <li className="relative p-6">
                                                        <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                            style={{ left: '127px', right: '50%' }}></div>
                                                        <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                            style={{ left: '50%', right: '126px' }}></div>
                                                        <div className="flex justify-center items-center">
                                                            <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                                                style={{ left: '10.5%', right: '0px' }}></div>
                                                            <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                                                style={{ left: '37%', right: '0px' }}></div>
                                                            <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                                                style={{ left: '63%', right: '0px' }}></div>
                                                            <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                                                style={{ left: '89.5%', right: '0px' }}></div>
                                                            <div className="text-center">
                                                                <div className="flex flex-row justify-start items-start gap-[100px]">
                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                        <h2 className="font-bold">Operation Section Chief</h2>
                                                                        <p>{data.operation_section_chief_name}</p>
                                                                    </div>
                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                        <h2 className="font-bold">Planning Section Chief</h2>
                                                                        <p>{data.planning_section_chief_name}</p>
                                                                    </div>
                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                        <h2 className="font-bold">Logistic Section Chief</h2>
                                                                        <p>{data.logistic_section_chief_name}</p>
                                                                    </div>
                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                        <h2 className="font-bold">Finance Section Chief</h2>
                                                                        <p>{data.finance_section_chief_name}</p>
                                                                    </div>
                                                                </div>
                                                                <ul className="flex flex-row justify-center">

                                                                    <div className="-mt-10 border-l-2 absolute h-[410px] border-gray-400"
                                                                        style={{ left: '37%', right: '0px', top: '130px' }}></div>
                                                                    <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                        style={{ left: '395px', right: '760px', top: '170px' }}></div>
                                                                    <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                        style={{ left: '395px', right: '760px', top: '235px' }}></div>
                                                                    <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                        style={{ left: '395px', right: '760px', top: '300px' }}></div>
                                                                    <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                        style={{ left: '395px', right: '760px', top: '365px' }}></div>
                                                                    <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                        style={{ left: '395px', right: '760px', top: '440px' }}></div>
                                                                    <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                        style={{ left: '395px', right: '760px', top: '500px' }}></div>

                                                                    <div className="-mt-10 border-l-2 absolute h-[410px] border-gray-400"
                                                                        style={{ left: '63%', right: '0px', top: '130px' }}></div>
                                                                    <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                        style={{ left: '715px', right: '445px', top: '170px' }}></div>
                                                                    <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                        style={{ left: '715px', right: '445px', top: '235px' }}></div>
                                                                    <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                        style={{ left: '715px', right: '445px', top: '300px' }}></div>
                                                                    <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                        style={{ left: '715px', right: '445px', top: '365px' }}></div>
                                                                    <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                        style={{ left: '715px', right: '445px', top: '440px' }}></div>
                                                                    <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                        style={{ left: '715px', right: '445px', top: '500px' }}></div>

                                                                    <div className="-mt-10 border-l-2 absolute h-[300px] border-gray-400"
                                                                        style={{ left: '90%', right: '0px', top: '130px' }}></div>
                                                                    <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                        style={{ left: '1045px', right: '120px', top: '170px' }}></div>
                                                                    <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                        style={{ left: '1045px', right: '120px', top: '245px' }}></div>
                                                                    <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                        style={{ left: '1045px', right: '120px', top: '320px' }}></div>
                                                                    <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                        style={{ left: '1045px', right: '120px', top: '388px' }}></div>

                                                                    <li className="relative py-6" style={{ left: '-100px', right: '0px' }}>
                                                                        <div className="relative flex justify-center">
                                                                            <div className="text-center">
                                                                                <ul className="flex flex-row justify-center">
                                                                                    <li className="relative py-6">
                                                                                        <div className="relative flex justify-center">
                                                                                            <div className="text-center">
                                                                                                <div className="flex flex-col justify-center items-center">
                                                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                        <h2 className="font-bold">Environmental Unit Leader</h2>
                                                                                                        <p>{data.environmental_unit_leader_name}</p>
                                                                                                    </div>
                                                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                        <h2 className="font-bold">Technical Specialist</h2>
                                                                                                        <p>{data.technical_specialist_name}</p>
                                                                                                    </div>
                                                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                        <h2 className="font-bold">Demobilization Unit Leader</h2>
                                                                                                        <p>{data.demobilization_unit_leader_name}</p>
                                                                                                    </div>
                                                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                        <h2 className="font-bold">Situation Unit Leader</h2>
                                                                                                        <p>{data.situation_unit_leader_name}</p>
                                                                                                    </div>
                                                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                        <h2 className="font-bold">Resources Unit leader</h2>
                                                                                                        <p>{data.resources_unit_leader_name}</p>
                                                                                                    </div>
                                                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                        <h2 className="font-bold">Documentation Unit Leader</h2>
                                                                                                        <p>{data.documentation_unit_leader_name}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li className="relative py-6" style={{ left: '5px', right: '0px' }}>
                                                                        <div className="relative flex justify-center" >
                                                                            <div className="text-center">
                                                                                <ul className="flex flex-row justify-center">
                                                                                    <li className="relative py-6">
                                                                                        <div className="relative flex justify-center">
                                                                                            <div className="text-center">
                                                                                                <div className="flex flex-col justify-center items-center">
                                                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                        <h2 className="font-bold">Communication Unit Leader</h2>
                                                                                                        <p>{data.communication_unit_leader_name}</p>
                                                                                                    </div>
                                                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                        <h2 className="font-bold">Medical Unit Leader</h2>
                                                                                                        <p>{data.medical_unit_leader_name}</p>
                                                                                                    </div>
                                                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                        <h2 className="font-bold">Food Unit Leader</h2>
                                                                                                        <p>{data.food_unit_leader_name}</p>
                                                                                                    </div>
                                                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                        <h2 className="font-bold">Facilities Unit Leader</h2>
                                                                                                        <p>{data.facility_unit_leader_name}</p>
                                                                                                    </div>
                                                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                        <h2 className="font-bold">Supply Unit leader</h2>
                                                                                                        <p>{data.supply_unit_leader_name}</p>
                                                                                                    </div>
                                                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                        <h2 className="font-bold">Transportation Unit Leader</h2>
                                                                                                        <p>{data.transportation_unit_leader_name}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li className="relative py-6" style={{ left: '120px', right: '0px' }}>
                                                                        <div className="relative flex justify-center" >
                                                                            <div className="text-center">
                                                                                <ul className="flex flex-row justify-center">
                                                                                    <li className="relative py-6">
                                                                                        <div className="relative flex justify-center">
                                                                                            <div className="text-center">
                                                                                                <div className="flex flex-col justify-center items-center">
                                                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                        <h2 className="font-bold">Procurement Unit Leader</h2>
                                                                                                        <p>{data.procurement_unit_leader_name}</p>
                                                                                                    </div>
                                                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                        <h2 className="font-bold">Compensation/Claim Unit Leader</h2>
                                                                                                        <p>{data.compensation_claim_unit_leader_name}</p>
                                                                                                    </div>
                                                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                        <h2 className="font-bold">Cost Unit Leader</h2>
                                                                                                        <p>{data.cost_unit_leader_name}</p>
                                                                                                    </div>
                                                                                                    <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                        <h2 className="font-bold">Time Unit leader</h2>
                                                                                                        <p>{data.time_unit_leader_name}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FormContainer>
    );
};

export default ChartNameOnly;