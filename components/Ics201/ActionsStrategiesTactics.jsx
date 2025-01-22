'use client';

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

export default function ActionsStrategiesTactics({
    rowsActions,
    onAddRow,
    onRemoveRow,
    onChangeRow,
    onChangeTime,
}) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleActionsChange = (index, e) => {
        const value = e.target.value;
        onChangeRow(index, { actions: value });
    };

    const handleTimeChange = (value, index) => {
        const formattedTime = value ? value.format('HH:mm') : null;
        onChangeTime(formattedTime, index);
    };

    // Fungsi untuk memformat waktu
    // const formatTime = (timeStr) => {
    //     if (!timeStr) return null;
    //     // Jika timeStr sudah dalam format dayjs, gunakan langsung
    //     if (dayjs.isDayjs(timeStr)) return timeStr;
    //     // Jika timeStr adalah string, konversi ke dayjs
    //     return dayjs(timeStr, 'HH:mm:ss');
    // };

    // Fungsi untuk memformat waktu
    const formatTime = (timeStr) => {
        if (!timeStr) return null;
        return dayjs(`2024-01-01 ${timeStr}`);
    };

    return (
        <div>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="border px-4 py-2 w-2/12">Time</th>
                        <th className="border px-4 py-2">Actions</th>
                        <th className="border px-4 py-2 w-[8%]"></th>
                    </tr>
                </thead>
                <tbody>
                    {rowsActions.map((row, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">
                                {isClient && (
                                    <LocalizationProvider dateAdapter={AdapterDayjs} suppressHydrationWarning>
                                        <TimePicker
                                            suppressHydrationWarning
                                            ampm={false}
                                            onChange={(value) => handleTimeChange(value, index)}
                                            value={formatTime(row.time_initiated)}
                                            slotProps={{
                                                textField: {
                                                    name: `time_initiated`,
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
                            <td className="border px-4 py-2">
                                <textarea
                                    name={`actions`}
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={row.actions}
                                    rows="7"
                                    cols="50"
                                    onChange={(e) => handleActionsChange(index, e)}
                                    required
                                />
                            </td>
                            <td className="border px-4 py-2 text-center">
                                {index === 0 ? (
                                    <PlusButton onClick={onAddRow} />
                                ) : (
                                    <div className="flex flex-row gap-2">
                                        <PlusButton onClick={onAddRow} />
                                        <MinusButton onClick={() => onRemoveRow(index)} />
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