'use client';

import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dynamic from 'next/dynamic';

const TimePicker = dynamic(
    () => import('@mui/x-date-pickers/TimePicker').then((mod) => mod.TimePicker),
    { ssr: false }
);


export default function ActivityLog({
    rowsActivityLog,
    onAddRow,
    onRemoveRow,
    onChangeRow,
    onChangeTime
}) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleActivityLogChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        onChangeRow(index, { [name]: type === "checkbox" ? checked : value });
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
                        <th className="px-4 py-2 border">Date</th>
                        <th className="px-4 py-2 border">Time</th>
                        <th className="px-4 py-2 border">Notable Activity</th>
                        <th className="border px-4 py-2 w-[8%]"></th>
                    </tr>
                </thead>
                <tbody>
                    {rowsActivityLog.map((row, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 border">
                                <input
                                    type="date"
                                    name='date_activity'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.date_activity}
                                    onChange={(e) => handleActivityLogChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                {isClient && (
                                    <LocalizationProvider dateAdapter={AdapterDayjs} suppressHydrationWarning>
                                        <TimePicker
                                            suppressHydrationWarning
                                            ampm={false}
                                            onChange={(value) => handleTimeChange(value, index)}
                                            value={formatTime(row.time_activity) || dayjs('00:00', 'HH:mm')}
                                            slotProps={{
                                                textField: {
                                                    name: 'time_activity',
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
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='notable_activity'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.notable_activity}
                                    onChange={(e) => handleActivityLogChange(index, e)}
                                    placeholder="Enter details"
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
    );
}