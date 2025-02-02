'use client';

import React, { useEffect, useState } from 'react';


export default function Transportation({
    rowsTransportations,
    onAddRow,
    onRemoveRow,
    onChangeRow,
}) {

    const handleTransportationChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        onChangeRow(index, { [name]: type === "checkbox" ? checked : value });
    };

    return (
        <div>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">Ambulance Service</th>
                        <th className="px-4 py-2 border">Location</th>
                        <th className="px-4 py-2 border">Contact Number(s)/Frequency</th>
                        <th className="px-4 py-2 border" colSpan={2}>Level of Service</th>
                        <th className="border px-4 py-2 w-[8%]"></th>
                    </tr>
                </thead>
                <tbody>
                    {rowsTransportations.map((row, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='ambulance_service'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.ambulance_service}
                                    onChange={(e) => handleTransportationChange(index, e)}
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
                                    onChange={(e) => handleTransportationChange(index, e)}
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
                                    onChange={(e) => handleTransportationChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <label>
                                    <input
                                        type="checkbox"
                                        name='is_als'
                                        className="mr-1"
                                        checked={row.is_als}
                                        onChange={(e) => handleTransportationChange(index, e)}
                                    />
                                    ALS
                                </label>
                            </td>
                            <td className="px-4 py-2 border">
                                <label>
                                    <input
                                        type="checkbox"
                                        name='is_bls'
                                        className="mr-1"
                                        checked={row.is_bls}
                                        onChange={(e) => handleTransportationChange(index, e)}
                                    />
                                    BLS
                                </label>
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