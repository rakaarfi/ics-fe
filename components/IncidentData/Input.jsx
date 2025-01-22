'use client'

import React, { useState } from 'react';
import FormContainer from '../FormContainer'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createData } from '@/utils/api';
import { ButtonSubmit } from '../ButtonComponents';

export default function Input() {

    const [formData, setFormData] = useState({});
    const routeUrl = 'incident-data';

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
            await createData({ routeUrl, payload: formData });
            alert("Data submitted successfully!");
        } catch (error) {
            console.error("Submission error:", error.message);
        }
    };
    return (
        <FormContainer title="Input Incident Data">
            <form onSubmit={handleSubmit}>
                <table className="table-auto border-collapse w-full">
                    <tbody>
                        <tr>
                            <td className="px-4 py-2">Incident No:</td>
                            <td className="px-4 py-2" colSpan={5}>
                                <input
                                    type="text"
                                    name="no"
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
                                    className="w-full px-3 py-2 border rounded-md"
                                    onChange={handleChange}
                                    defaultValue=""
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
                                    className="w-full px-3 py-2 border rounded-md"
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={6} className="text-right align-bottom px-4 py-2">
                                <ButtonSubmit />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </FormContainer>
    );
}