'use client';

import React from 'react';


export default function MedicalAidStations({
    rowsMedicals,
    onAddRow,
    onRemoveRow,
    onChangeRow,
}) {

    const handleMedicalChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        onChangeRow(index, { [name]: type === "checkbox" ? checked : value });
    };

    return (
        <div>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">Name</th>
                        <th className="px-4 py-2 border">Location</th>
                        <th className="px-4 py-2 border">Contact Number(s)/Frequency</th>
                        <th className="px-4 py-2 border">Paramedics on Site?</th>
                        <th className="border px-4 py-2 w-[8%]"></th>
                    </tr>
                </thead>
                <tbody>
                    {rowsMedicals.map((row, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='name'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.name}
                                    onChange={(e) => handleMedicalChange(index, e)}
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
                                    onChange={(e) => handleMedicalChange(index, e)}
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
                                    onChange={(e) => handleMedicalChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="checkbox"
                                    name='is_paramedic'
                                    className="w-full px-2 py-1 border rounded"
                                    checked={row.is_paramedic}
                                    onChange={(e) => handleMedicalChange(index, e)}
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