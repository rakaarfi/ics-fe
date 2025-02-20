'use client'

import React, { useEffect, useState } from 'react';
import FormContainer from '../FormContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ButtonSubmit, MinusButton, PlusButton } from '../ButtonComponents';
import { fetchData } from '@/utils/api';
import dayjs from 'dayjs';
import axios from 'axios';
import dynamic from 'next/dynamic';

const TimePicker = dynamic(
    () => import('@mui/x-date-pickers/TimePicker').then((mod) => mod.TimePicker),
    { ssr: false }
);


export default function Input() {
    const [incidentData, setIncidentData] = useState([]);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [rows, setRows] = useState([
        { date_from: "", time_from: "", date_to: "", time_to: "", remarks: "" },
    ]);

    const addNewRow = () => setRows([...rows, { date_from: "", time_from: "", date_to: "", time_to: "", remarks: "" }]);
    const removeRow = (index) => setRows(rows.filter((_, i) => i !== index));

    const apiUrl = 'http://127.0.0.1:8000/'

    useEffect(() => {
        const fetchIncidentData = async () => {
            try {
                const data = await fetchData('incident-data');
                setIncidentData(data);
            } catch (error) {
                console.error('Error fetching incident data:', error);
            }
        };

        fetchIncidentData();
    }, []);

    const handleChange = async (incidentId) => {
        const incident = incidentData.find((incident) => incident.id === incidentId);
        setSelectedIncident(incident);
    };

    const handleInputChange = async (index, e) => {
        const { name, value } = e.target;
        const updatedRows = [...rows];
        updatedRows[index][name] = value;
        setRows(updatedRows);
    };

    const handleTimeChange = (value, index, field) => {
        const timeString = value ? value.format('HH:mm') : null;
        const updatedRows = [...rows];
        updatedRows[index][field] = timeString;
        setRows(updatedRows);
    };

    const parseTimeIncident = (timeStr) => {
        if (!timeStr) return null;

        if (timeStr.includes(':')) {
            const today = dayjs().format('YYYY-MM-DD');
            return dayjs(`${today} ${timeStr}`).format('HH:mm');
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = rows.map((row) => ({
                ...row,
                incident_id: selectedIncident.id,
            }))
            await axios.post(`${apiUrl}operational-period/create/`, {
                periods: payload
            })
            alert("Data submitted successfully!");
            setRows([{ date_from: "", time_from: "", date_to: "", time_to: "", remarks: "" }]);
        } catch (error) {
            console.error('Error creating operational period:', error);
            alert("Terjadi kesalahan saat menyimpan data.");
        }
    };

    return (
        <FormContainer title="Operational Period">
            <div className="mb-4">
                <select
                    name="incident_id"
                    className="block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                    onChange={(e) => handleChange(parseInt(e.target.value))}
                    value={selectedIncident?.id || ""}
                    required
                >
                    <option value={""} disabled>
                        Select Incident
                    </option>
                    {incidentData.map((incident) => (
                        <option key={incident.id} value={incident.id}>
                            {incident.name}
                        </option>
                    ))}
                </select>
            </div>
            {selectedIncident && (
                <table className="table-auto border-collapse w-full">
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 border rounded-md bg-gray-300">Incident No:</td>
                            <td className="px-4 py-2 border rounded-md" colSpan={5}>
                                {selectedIncident.no}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border rounded-md bg-gray-300">Incident Name:</td>
                            <td className="px-4 py-2 border rounded-md" colSpan={5}>
                                {selectedIncident.name}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border rounded-md bg-gray-300">Date of Incident:</td>
                            <td className="px-4 py-2 border rounded-md">
                                {selectedIncident.date_incident}
                            </td>
                            <td className="px-4 py-2 border rounded-md bg-gray-300">Time of Incident:</td>
                            <td className="px-4 py-2 border rounded-md">
                                {parseTimeIncident(selectedIncident.time_incident) || '-'}
                            </td>
                            <td className="px-4 py-2 border rounded-md bg-gray-300">Time Zone:</td>
                            <td className="px-4 py-2 border rounded-md">
                                {selectedIncident.timezone}
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border rounded-md bg-gray-300">Location of Incident</td>
                            <td className="px-4 py-2 border rounded-md" colSpan={5}>
                                {selectedIncident.location}
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
            <form onSubmit={handleSubmit}>
                <table className="table-auto border-collapse w-full">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Date From</th>
                            <th className="border px-4 py-2">Time From</th>
                            <th className="border px-4 py-2">Date To</th>
                            <th className="border px-4 py-2">Time To</th>
                            <th className="border px-4 py-2">Remarks</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">
                                    <input
                                        type="date"
                                        name="date_from"
                                        value={row.date_from}
                                        onChange={(e) => handleInputChange(index, e)}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            ampm={false}
                                            onChange={(value) => handleTimeChange(value, index, 'time_from')}
                                            value={row.time_from ? dayjs(row.time_from, 'HH:mm') : dayjs('00:00', 'HH:mm')}
                                            slotProps={{
                                                textField: {
                                                    name: 'time_from',
                                                    required: true,
                                                    fullWidth: true,
                                                    variant: 'outlined',
                                                    className: 'w-full px-3 py-2 border rounded-md',
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                </td>
                                <td className="border px-4 py-2">
                                    <input
                                        type="date"
                                        name="date_to"
                                        value={row.date_to}
                                        onChange={(e) => handleInputChange(index, e)}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            ampm={false}
                                            onChange={(value) => handleTimeChange(value, index, 'time_to')}
                                            value={row.time_to ? dayjs(row.time_to, 'HH:mm') : dayjs('00:00', 'HH:mm')}
                                            slotProps={{
                                                textField: {
                                                    name: 'time_to',
                                                    required: true,
                                                    fullWidth: true,
                                                    variant: 'outlined',
                                                    className: 'w-full px-3 py-2 border rounded-md',
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                </td>
                                <td className="border px-4 py-2">
                                    <textarea
                                        name="remarks"
                                        value={row.remarks}
                                        onChange={(e) => handleInputChange(index, e)}
                                        rows={3}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    ></textarea>
                                </td>
                                <td className="border px-4 py-2 text-center">
                                    {index === 0 ? (
                                        <PlusButton onClick={addNewRow} />
                                    ) : (
                                        <div className="flex flex-row gap-2">
                                            <PlusButton onClick={addNewRow} />
                                            <MinusButton onClick={() => removeRow(index)} />
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="text-right mt-4">
                    <ButtonSubmit />
                </div>
            </form>
        </FormContainer>
    );
}