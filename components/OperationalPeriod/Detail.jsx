'use client'

import { fetchData, handleUpdate, readById } from '@/utils/api';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import FormContainer from '../FormContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { ButtonSaveChanges } from '../ButtonComponents';

export default function Detail() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});

    const routeUrl = "operational-period";
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [incidentData, setIncidentData] = useState([]);

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await readById({ routeUrl, id });
                const formattedData = {
                    ...responseData,
                    time_from: responseData.time_from || null,
                    time_to: responseData.time_to || null
                };
                setData(formattedData);
                setFormData(formattedData);
            } catch (err) {
                setError("Failed to fetch data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!data) return <p>No data found</p>;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTimeChange = (name, value) => {
        const timeString = value ? value.format('HH:mm') : null;
        setFormData({ ...formData, [name]: timeString });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleUpdate(id, 'operational-period', formData);
        } catch (err) {
            alert("Error in handleSubmit:", err);
        }
    };

    const parseTimeIncident = (timeStr) => {
        if (!timeStr) return null;

        if (timeStr.includes(':')) {
            const today = dayjs().format('YYYY-MM-DD');
            return dayjs(`${today} ${timeStr}`);
        }
        return null;
    };

    return (
        <FormContainer title="Update Operational Period">
            <form onSubmit={handleSubmit}>
                <table className="table-auto border-collapse w-full">
                    <tbody>
                        <tr>
                            <td className="px-4 py-2">Incident Name:</td>
                            <td className="px-4 py-2" colSpan={5}>
                                <select
                                    name="incident_id"
                                    className="block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                    onChange={handleChange}
                                    value={formData.incident_id}
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
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">Date From:</td>
                            <td className="px-4 py-2">
                                <input
                                    type="date"
                                    name="date_from"
                                    value={formData.date_from}
                                    className="w-full px-3 py-2 border rounded-md"
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">Time From:</td>
                            <td className="px-4 py-2">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        ampm={false}
                                        onChange={(value) => handleTimeChange('time_from', value)}
                                        value={parseTimeIncident(formData.time_from)}
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
                        </tr>
                        <tr>
                            <td className="px-4 py-2">Date To:</td>
                            <td className="px-4 py-2">
                                <input
                                    type="date"
                                    name="date_to"
                                    value={formData.date_to}
                                    className="w-full px-3 py-2 border rounded-md"
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">Time To:</td>
                            <td className="px-4 py-2">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        ampm={false}
                                        onChange={(value) => handleTimeChange('time_to', value)}
                                        value={parseTimeIncident(formData.time_to)}
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
                        </tr>
                        <tr>
                            <td className="px-4 py-2">Remarks</td>
                            <td className="px-4 py-2" colSpan={5}>
                                <textarea
                                    name="remarks"
                                    rows={3}
                                    value={formData.remarks}
                                    className="w-full px-3 py-2 border rounded-md"
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={6} className="text-right align-bottom px-4 py-2">
                                <ButtonSaveChanges />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </FormContainer>
    )
}
