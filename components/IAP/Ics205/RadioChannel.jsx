'use client';

import React, { useEffect, useState } from 'react';

export default function RadioChannel({
    rowsRadios,
    onAddRow,
    onRemoveRow,
    onChangeRow,
}) {

    const handleRadioChange = (index, e) => {
        const { name, value } = e.target;
        onChangeRow(index, { [name]: value });
    };

    return (
        <div>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">Channel Number</th>
                        <th className="px-4 py-2 border">Channel Name</th>
                        <th className="px-4 py-2 border">Radio Frequency</th>
                        <th className="px-4 py-2 border">Mode</th>
                        <th className="px-4 py-2 border">Function</th>
                        <th className="px-4 py-2 border">Assignment</th>
                        <th className="px-4 py-2 border">Remarks</th>
                        <th className="border px-4 py-2 w-[8%]"></th>
                    </tr>
                </thead>
                <tbody>
                    {rowsRadios.map((row, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='channel_number'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.channel_number}
                                    onChange={(e) => handleRadioChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='channel_name'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.channel_name}
                                    onChange={(e) => handleRadioChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='frequency'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.frequency}
                                    onChange={(e) => handleRadioChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <select
                                    name='mode'
                                    className="px-2 py-1 border rounded"
                                    value={row.mode}
                                    onChange={(e) => handleRadioChange(index, e)}
                                    required
                                >
                                    <option value="" disabled>Select Mode</option>
                                    <option value="Analog">Analog</option>
                                    <option value="Digital">Digital</option>
                                    <option value="Mixed">Mixed</option>
                                </select>
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='functions'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.functions}
                                    onChange={(e) => handleRadioChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='assignment'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.assignment}
                                    onChange={(e) => handleRadioChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='remarks'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.remarks}
                                    onChange={(e) => handleRadioChange(index, e)}
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