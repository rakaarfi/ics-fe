'use client';

import React from 'react';


export default function ResourcesAssigned({
    rowsResources,
    onAddRow,
    onRemoveRow,
    onChangeRow,
}) {

    const handleResourceChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        onChangeRow(index, { [name]: type === "checkbox" ? checked : value });
    };

    return (
        <div>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">Name</th>
                        <th className="px-4 py-2 border">ICS Position</th>
                        <th className="px-4 py-2 border">Home Agency (and Unit)</th>
                        <th className="border px-4 py-2 w-[8%]"></th>
                    </tr>
                </thead>
                <tbody>
                    {rowsResources.map((row, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='name'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.name}
                                    onChange={(e) => handleResourceChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='position'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.position}
                                    onChange={(e) => handleResourceChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='home_agency'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.home_agency}
                                    onChange={(e) => handleResourceChange(index, e)}
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