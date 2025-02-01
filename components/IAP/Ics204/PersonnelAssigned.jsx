'use client';

import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MinusButton, PlusButton } from '@/components/ButtonComponents';


const TimePicker = dynamic(
    () => import('@mui/x-date-pickers').then((mod) => mod.TimePicker),
    { ssr: false }
);

export default function PersonnelAssigned({
    rowsPersonnels,
    onAddRow,
    onRemoveRow,
    onChangeRow,
}) {

    const handlePersonnelChange = (index, e) => {
        const { name, value } = e.target;
        onChangeRow(index, { [name]: value });
    };

    return (
        <div>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">Name</th>
                        <th className="px-4 py-2 border">Contact Number</th>
                        <th className="px-4 py-2 border">Reporting Location</th>
                        <th className="px-4 py-2 border">Special Equipment, Tools, and Remarks</th>
                        <th className="border px-4 py-2 w-[8%]"></th>
                    </tr>
                </thead>
                <tbody>
                    {rowsPersonnels.map((row, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='name'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.name}
                                    onChange={(e) => handlePersonnelChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='number'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.number}
                                    onChange={(e) => handlePersonnelChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='location'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.location}
                                    onChange={(e) => handlePersonnelChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='equipment_tools_remarks'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.equipment_tools_remarks}
                                    onChange={(e) => handlePersonnelChange(index, e)}
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