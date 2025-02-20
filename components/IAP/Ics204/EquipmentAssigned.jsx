'use client';

import React from 'react';

export default function EquipmentAssigned({
    rowsEquipments,
    onAddRow,
    onRemoveRow,
    onChangeRow,
}) {

    const handleEquipmentChange = (index, e) => {
        const { name, value } = e.target;
        onChangeRow(index, { [name]: value });
    };

    return (
        <div>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border">Kind</th>
                        <th className="px-4 py-2 border">Quantity</th>
                        <th className="px-4 py-2 border">Type(Specification)</th>
                        <th className="px-4 py-2 border">Contact Number</th>
                        <th className="px-4 py-2 border">Reporting Location</th>
                        <th className="px-4 py-2 border">Remarks</th>
                        <th className="border px-4 py-2 w-[8%]"></th>
                    </tr>
                </thead>
                <tbody>
                    {rowsEquipments.map((row, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='kind'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.kind}
                                    onChange={(e) => handleEquipmentChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="number"
                                    name='quantity'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.quantity}
                                    onChange={(e) => handleEquipmentChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='type_specification'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.type_specification}
                                    onChange={(e) => handleEquipmentChange(index, e)}
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
                                    onChange={(e) => handleEquipmentChange(index, e)}
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
                                    onChange={(e) => handleEquipmentChange(index, e)}
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
                                    onChange={(e) => handleEquipmentChange(index, e)}
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