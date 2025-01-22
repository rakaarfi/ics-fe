'use client';

import React, { useEffect, useState } from "react";
import ReactFlow, { MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';  // Memastikan stylesheet ReactFlow dimuat
import axios from "axios";
import { fetchData } from "@/utils/api";

const Chart = () => {
    const [data, setData] = useState({});
    const [roster, setRoster] = useState([]);
    const [selectedRoster, setSelectedRoster] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

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
            const response = await axios.get(`http://127.0.0.1:8000/roster-table/${selectedId}/`);
            setData(response.data);
            generateNodesAndEdges(response.data);
        } catch (err) {
            console.error("Error fetching data:", err.message);
        }
    };

    const handleRosterClick = (rosterId) => {
        getData(rosterId);
    };

    const nodeDefaults = {
        style: {
            background: '#f5f5f5',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: 200,
            textAlign: 'center'
        }
    };

    const generateNodesAndEdges = (data) => {
        const nodes = [
            {
                id: 'ic',
                data: {
                    label: `Incident Commander\n${data.incident_commander_name}`
                },
                position: { x: 350, y: 50 },
                                style: {
                    background: '#f5f5f5',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: 200,
                    textAlign: 'center'
                }
            },
            {
                id: 'hco',
                data: {
                    label: `Human Capital Officer\n${data.human_capital_officer_name}`
                },
                position: { x: 350, y: 200 },
                                style: {
                    background: '#f5f5f5',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    width: 200,
                    textAlign: 'center'
                }
            },
        ];

        const edges = [
            {
                id: 'ic-hco',
                source: 'ic',
                target: 'hco',
                style: {
                    stroke: '#555',
                    strokeWidth: 2,
                },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#555',
                },
            },
        ];

        setNodes(nodes);
        setEdges(edges);
    };

    return (
        <div className="container mx-auto p-4 font-jkt">
            <div className="justify-center items-center min-h-screen min-w-screen">
                <div className="border rounded-3xl p-4 shadow-lg dark:bg-[#12171c] bg-[#ffffff] dark:border-0">
                    <div className="flex flex-col mb-4">
                        <select
                            value={selectedRoster ? selectedRoster.id : ""}
                            onChange={(e) => handleRosterClick(Number(e.target.value))}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8]"
                        >
                            <option value="" disabled>
                                Select Roster
                            </option>
                            {roster.map((rosterItem) => (
                                <option key={rosterItem.id} value={rosterItem.id}>
                                    {rosterItem.date_from} - {rosterItem.date_to}
                                </option>
                            ))}
                        </select>
                        <p className="w-full px-3 py-1.5 text-base text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8]">
                            Remark: {selectedRoster ? selectedRoster.remark : ""}
                        </p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="text-2xl font-bold text-center mb-2 whitespace-nowrap">Organisation Flow chart</h1>
                        <div style={{ width: '100%', height: '600px', border: '1px solid #eee' }}>
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                fitView
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chart;