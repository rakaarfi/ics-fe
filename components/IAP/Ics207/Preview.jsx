'use client';

import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React, { useEffect, useRef, useState } from 'react';
import FormContainer from '@/components/FormContainer';


export default function Preview() {
    const [ICS203Data, setICS203Data] = useState([]);
    const [selectedICS203Id, setSelectedICS203Id] = useState(null);
    const [selectedICS203, setSelectedICS203] = useState({});
    const [preparationData, setPreparationData] = useState(null);
    const [chartData, setChartData] = useState({});
    const [RULeaderData, setRULeaderData] = useState([]);
    const iframeRef = useRef(null);

    const apiUrl = 'http://127.0.0.1:8000/'
    const routeUrl = "ics-203/main";

    useEffect(() => {
        const fetchICS203Data = async () => {
            try {
                const response = await axios.get(`${apiUrl}${routeUrl}/read/`);
                const ics203List = await Promise.all(response.data.map(async (item) => {
                    const operationalPeriodResponse = await axios.get(`${apiUrl}operational-period/read/${item.operational_period_id}`);
                    const incidentResponse = await axios.get(`${apiUrl}incident-data/read/${operationalPeriodResponse.data.incident_id}`);
                    return {
                        id: item.id,
                        operational_period_id: item.operational_period_id,
                        incident_commander_id: item.incident_commander_id,
                        deputy_incident_commander_id: item.deputy_incident_commander_id,
                        safety_officer_id: item.safety_officer_id,
                        public_information_officer_id: item.public_information_officer_id,
                        liaison_officer_id: item.liaison_officer_id,
                        legal_officer_id: item.legal_officer_id,
                        human_capital_officer_id: item.human_capital_officer_id,
                        operation_section_chief_id: item.operation_section_chief_id,
                        planning_section_chief_id: item.planning_section_chief_id,
                        situation_unit_leader_id: item.situation_unit_leader_id,
                        resources_unit_leader_id: item.resources_unit_leader_id,
                        documentation_unit_leader_id: item.documentation_unit_leader_id,
                        demobilization_unit_leader_id: item.demobilization_unit_leader_id,
                        environmental_unit_leader_id: item.environmental_unit_leader_id,
                        technical_specialist_id: item.technical_specialist_id,
                        logistic_section_chief_id: item.logistic_section_chief_id,
                        communication_unit_leader_id: item.communication_unit_leader_id,
                        medical_unit_leader_id: item.medical_unit_leader_id,
                        food_unit_leader_id: item.food_unit_leader_id,
                        facility_unit_leader_id: item.facility_unit_leader_id,
                        supply_unit_leader_id: item.supply_unit_leader_id,
                        transportation_unit_leader_id: item.transportation_unit_leader_id,
                        finance_section_chief_id: item.finance_section_chief_id,
                        procurement_unit_leader_id: item.procurement_unit_leader_id,
                        compensation_claim_unit_leader_id: item.compensation_claim_unit_leader_id,
                        cost_unit_leader_id: item.cost_unit_leader_id,
                        time_unit_leader_id: item.time_unit_leader_id,
                        dateFrom: operationalPeriodResponse.data.date_from,
                        dateTo: operationalPeriodResponse.data.date_to,
                        timeFrom: operationalPeriodResponse.data.time_from,
                        timeTo: operationalPeriodResponse.data.time_to,
                        incidentName: incidentResponse.data.name,
                    };
                }));
                setICS203Data(ics203List);
            } catch (err) {
                console.error("Error fetching ICS-203 data:", err.message);
            }
        };
        fetchICS203Data();
    }, []);

    useEffect(() => {
        const fetchRULeader = async () => {
            try {
                const response = await axios.get(`${apiUrl}planning-section/resources-unit-leader/read/`);
                setRULeaderData(response.data);
            } catch (error) {
                console.error('Error fetching Resources Unit Leader data:', error);
            }
        };
        fetchRULeader();
    }, []);

    const handleSelectChange = async (event) => {
        const ics203Id = event.target.value;
        setSelectedICS203Id(ics203Id);

        try {
            const selectedItem = ICS203Data.find(item => item.id == ics203Id);
            if (!selectedItem) return;
            setSelectedICS203(selectedItem);

            const preparationResponse = await axios.get(`${apiUrl}ics-203/preparation/read-by-ics-203-id/${ics203Id}`);
            setPreparationData(preparationResponse.data.length > 0 ? preparationResponse.data[0] : null);

            setChartData(selectedItem);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const iframe = iframeRef.current;

        if (iframe && chartData) {
            console.log('Attempting to send data:', chartData);

            // Kirim data saat iframe selesai dimuat
            const sendMessage = () => {
                iframe.contentWindow.postMessage(chartData, '*');
            };

            if (iframe.contentWindow) {
                sendMessage();
            } else {
                iframe.onload = sendMessage;
            }
        }
    }, [chartData]);

    const handleExportButtonClick = async () => {
        try {
            const response = await axios.post(
                `${apiUrl}ics-207/export-docx/${selectedICS203Id}`,
                {},
                {
                    responseType: 'blob', // Penting untuk menangani file biner
                }
            );

            // Buat URL objek dari blob
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // Buat elemen <a> untuk memicu unduhan
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ics_207_${selectedICS203Id}.docx`); // Nama file yang akan diunduh
            document.body.appendChild(link);
            link.click();

            // Hapus elemen <a> setelah unduhan selesai
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error exporting document:', error);
        }
    };


    return (
        <div>
            <FormContainer title="ICS 207 - Incident Organization Chart Preview" className="max-w-2xl mx-auto p-4 mb-8 bg-white rounded shadow-lg">
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-[#FF700A] hover:bg-[#FFA05C] text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2"
                        onClick={handleExportButtonClick}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Export to Word
                    </button>
                </div>
                <div className="mb-4">
                    <select
                        className="block w-full p-2 border border-gray-300 rounded-md"
                        value={selectedICS203Id || ''}
                        onChange={handleSelectChange}
                    >
                        <option value="" disabled>
                            Select ICS 203
                        </option>
                        {ICS203Data.map((option) => (
                            <option key={option.id} value={option.id}>
                                {`${option.incidentName} | ${option.dateFrom} - ${option.dateTo} `}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Header Section */}

                <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                    <TableBody>
                        <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                            <TableCell sx={{ padding: '1rem' }}>
                                <strong>1. Incident Name:</strong>
                                <div
                                    className="border border-gray-300"
                                    style={{ height: '70px', marginTop: '10px', padding: '1rem' }}
                                >
                                    {selectedICS203?.incidentName || 'Unknown Incident'}
                                </div>
                            </TableCell>
                            <TableCell sx={{ padding: '1rem' }}>
                                <strong>2. Operational Period:</strong>
                                <br />
                                {selectedICS203 ? (
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '70px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        <span className="mr-4">Date From: {selectedICS203.dateFrom}</span>
                                        <span className="mr-4">Date To: {selectedICS203.dateTo}</span>
                                        <br />
                                        <span className="mr-4">Time From: {selectedICS203.timeFrom}</span>
                                        <span>Time To: {selectedICS203.timeTo}</span>
                                    </div>
                                ) : (
                                    'Unknown Operational Period'
                                )}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Section 3 */}
                <div className="section-9">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>3. Current Organization</strong>
                                    <br />
                                    {selectedICS203Id && (
                                        <div style={{ marginTop: '20px', width: '100%', height: '1050px', border: '1px solid #ccc' }}>
                                            <iframe
                                                ref={iframeRef}
                                                src="/chart-preview"
                                                width="100%"
                                                height="100%"
                                                style={{ border: 'none' }}
                                                title="Chart Preview"
                                                onLoad={() => {
                                                    console.log('Iframe loaded, sending chart data:', chartData);
                                                    iframeRef.current?.contentWindow?.postMessage(chartData, '*');
                                                }}
                                            />
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Footer Section */}
                <div className="footer-section">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>4. Prepared by:</strong>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ marginLeft: '5rem' }}>
                                            {RULeaderData.find((RULeader) => RULeader.id === preparationData?.resources_unit_leader_id)?.name || "N/A"}
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            Position: Resources Unit Leader
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            Signature: {preparationData?.is_prepared ? '✓' : '✗'}
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            Prepared Date: {preparationData?.date_prepared || "-"}
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            Prepared Time: {preparationData?.time_prepared || "-"}
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </FormContainer>
        </div>
    );
}
