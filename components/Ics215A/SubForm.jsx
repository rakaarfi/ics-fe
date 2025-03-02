'use client';

import React from 'react';


export default function SubForm({
    rowsSubForm,
    onAddRow,
    onRemoveRow,
    onChangeRow,
}) {

    const handleSubFormChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        onChangeRow(index, { [name]: type === "checkbox" ? checked : value });
    };

    return (
        <div>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">3. Incident Area</th>
                        <th className="px-4 py-2 border">4. Hazards/Risks</th>
                        <th className="px-4 py-2 border">5. Mitigations</th>
                        <th className="border px-4 py-2 w-[8%]"></th>
                    </tr>
                </thead>
                <tbody>
                    {rowsSubForm.map((row, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='incident_area'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.incident_area}
                                    onChange={(e) => handleSubFormChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='hazards_risks'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.hazards_risks}
                                    onChange={(e) => handleSubFormChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='mitigations'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.mitigations}
                                    onChange={(e) => handleSubFormChange(index, e)}
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