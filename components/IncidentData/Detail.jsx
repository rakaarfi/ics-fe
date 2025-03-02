'use client'

import { handleUpdate, readById } from '@/utils/api';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import FormContainer from '../FormContainer';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ButtonSaveChanges } from '../ButtonComponents';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';

const TimePicker = dynamic(
    () => import('@mui/x-date-pickers/TimePicker').then((mod) => mod.TimePicker),
    { ssr: false }
);

export default function Detail() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});

    const routeUrl = "incident-data";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await readById({ routeUrl, id });
                const formattedData = {
                    ...responseData,
                    time_incident: responseData.time_incident || null
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

    const handleTimeChange = (value) => {
        const timeString = value ? value.format('HH:mm') : null;
        setFormData({ ...formData, time_incident: timeString });
    };

    const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                await handleUpdate(id, 'incident-data', formData);
            } catch (err) {
                alert("Error in handleSubmit:", err);
            }
        };

    const parseTimeIncident = (timeStr) => {
        if (!timeStr) return null;

        // Jika waktu dalam format HH:mm:ss
        if (timeStr.includes(':')) {
            const today = dayjs().format('YYYY-MM-DD');
            return dayjs(`${today} ${timeStr}`);
        }
        return null;
    };

    return (
        <FormContainer title="Update Incident Data">
            <form onSubmit={handleSubmit}>
                <table className="table-auto border-collapse w-full">
                    <tbody>
                        <tr>
                            <td className="px-4 py-2">Incident No:</td>
                            <td className="px-4 py-2" colSpan={5}>
                                <input
                                    type="text"
                                    name="no"
                                    value={formData.no}
                                    className="w-full px-3 py-2 border rounded-md"
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">Incident Name:</td>
                            <td className="px-4 py-2" colSpan={5}>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    className="w-full px-3 py-2 border rounded-md"
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">Date of Incident:</td>
                            <td className="px-4 py-2">
                                <input
                                    type="date"
                                    name="date_incident"
                                    value={formData.date_incident}
                                    className="w-full px-3 py-2 border rounded-md"
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 text-right">Time of Incident:</td>
                            <td className="px-4 py-2">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        ampm={false}
                                        onChange={handleTimeChange}
                                        value={parseTimeIncident(formData.time_incident)}
                                        slotProps={{
                                            textField: {
                                                name: 'time_incident',
                                                required: true,
                                                fullWidth: true,
                                                variant: 'outlined',
                                                className: 'w-full px-3 py-2 border rounded-md',
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </td>
                            <td className="px-4 py-2 text-right">Time Zone:</td>
                            <td className="px-4 py-2">
                                <select
                                    name="timezone"
                                    value={formData.timezone}
                                    className="w-full px-3 py-2 border rounded-md"
                                    onChange={handleChange}
                                    required
                                >
                                    <option value={""} disabled>Select Time Zone</option>
                                    <option value="Western Indonesia Time">Western Indonesia Time</option>
                                    <option value="Central Indonesia Time">Central Indonesia Time</option>
                                    <option value="Eastern Indonesia Time">Eastern Indonesia Time</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">Location of Incident</td>
                            <td className="px-4 py-2" colSpan={5}>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    className="w-full px-3 py-2 border rounded-md"
                                    onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">Brief Description of Incident</td>
                            <td className="px-4 py-2" colSpan={5}>
                                <textarea
                                    name="description"
                                    rows={3}
                                    value={formData.description}
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
