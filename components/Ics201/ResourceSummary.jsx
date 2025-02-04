'use client'

import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { MinusButton, PlusButton } from '../ButtonComponents';

const TimePicker = dynamic(
    () => import('@mui/x-date-pickers').then((mod) => mod.TimePicker),
    { ssr: false }
);

export default function ResourceSummary({
    rowsSummary,
    onAddRow,
    onRemoveRow,
    onChangeRow,
    onChangeTime
}) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleResourceChange = (index, e) => {
        const fieldName = e.target.name;
        let value = e.target.value;
        if (e.target.type === 'checkbox') {
            value = e.target.checked; // Get boolean value for checkboxes
        }
        onChangeRow(index, { [fieldName]: value });
    };

    const handleTimeChange = (value, index) => {
        const formattedTime = value ? value.format('HH:mm') : null;
        onChangeTime(formattedTime, index);
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return null;
        return dayjs(`2024-01-01 ${timeStr}`);
    };

    return (
        <div>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Resource</th>
                        <th className="border px-4 py-2">Resource Identified</th>
                        <th className="border px-4 py-2">Date Ordered</th>
                        <th className="border px-4 py-2">Time Ordered</th>
                        <th className="border px-4 py-2">ETA</th>
                        <th className="border px-4 py-2">Arrived?</th>
                        <th className="border px-4 py-2">Notes(location/assignment/status)</th>
                        <th className="border px-4 py-2 w-[8%]"></th>
                    </tr>
                </thead>
                <tbody>
                    {rowsSummary.map((row, index) => (
                        <tr key={index}>
                            <td className='border px-4 py-2'>
                                <input
                                    type="text"
                                    name="resource"
                                    className="w-full px-3 py-2 border rounded-md"
                                    onChange={(e) => handleResourceChange(index, e)}
                                    value={row.resource}
                                    required
                                />
                            </td>
                            <td className='border px-4 py-2'>
                                <input
                                    type="text"
                                    name="resource_identified"
                                    className="w-full px-3 py-2 border rounded-md"
                                    onChange={(e) => handleResourceChange(index, e)}
                                    value={row.resource_identified}
                                    required
                                />
                            </td>
                            <td className='border px-4 py-2'>
                                <input
                                    type="date"
                                    name="date_ordered"
                                    className="w-full px-3 py-2 border rounded-md"
                                    onChange={(e) => handleResourceChange(index, e)}
                                    value={row.date_ordered}
                                    required
                                />
                            </td>
                            <td className="border px-4 py-2">
                                {isClient && (
                                    <LocalizationProvider dateAdapter={AdapterDayjs} suppressHydrationWarning>
                                        <TimePicker
                                            suppressHydrationWarning
                                            ampm={false}
                                            onChange={(value) => handleTimeChange(value, index)}
                                            value={formatTime(row.time_ordered) || dayjs('00:00', 'HH:mm')}
                                            slotProps={{
                                                textField: {
                                                    name: 'time_ordered',
                                                    required: true,
                                                    fullWidth: true,
                                                    variant: 'outlined',
                                                    className: 'w-full px-3 py-2 border rounded-md',
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                )}
                            </td>
                            <td className='border px-4 py-2'>
                                <input
                                    type="text"
                                    name="eta"
                                    className="w-full px-3 py-2 border rounded-md"
                                    onChange={(e) => handleResourceChange(index, e)}
                                    value={row.eta}
                                    required
                                />
                            </td>
                            <td className='border px-4 py-2'>
                                <input
                                    type="checkbox"
                                    name="is_arrived"
                                    className="w-5 h-5 border rounded-md"
                                    onChange={(e) => handleResourceChange(index, e)}
                                    checked={row.is_arrived}

                                />
                            </td>
                            <td className="border px-4 py-2">
                                <textarea
                                    name="notes"
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={row.notes}
                                    cols="50"
                                    onChange={(e) => handleResourceChange(index, e)}
                                    required
                                />
                            </td>
                            <td className="border px-4 py-2 text-center">
                                {index === 0 ? (
                                    <button
                                        type='button'
                                        onClick={onAddRow}
                                        className="bg-[#548C2F] hover:bg-green-700 text-white font-bold w-10 h-10 flex items-center justify-center rounded"
                                    >
                                        +
                                    </button>
                                ) : (
                                    <div className="flex flex-row gap-2">
                                        <button
                                            type='button'
                                            onClick={onAddRow}
                                            className="bg-[#548C2F] hover:bg-green-700 text-white font-bold w-10 h-10 flex items-center justify-center rounded"
                                        >
                                            +
                                        </button>
                                        <button
                                            type='button'
                                            onClick={() => onRemoveRow(index)}
                                            className="bg-[#880D1E] hover:bg-red-700 text-white font-bold w-10 h-10 flex items-center justify-center rounded"
                                        >
                                            -
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
