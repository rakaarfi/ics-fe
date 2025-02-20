'use client';

import React from 'react';

export default function Hospital({
    rowsHospitals,
    onAddRow,
    onRemoveRow,
    onChangeRow,
}) {

    const handleHospitalChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        onChangeRow(index, { [name]: type === "checkbox" ? checked : value });
    };

    return (
        <div>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border" rowSpan={2}>Name</th>
                        <th className="px-4 py-2 border" rowSpan={2}>Address</th>
                        <th className="px-4 py-2 border" rowSpan={2}>Contact Number(s)/Frequency</th>
                        <th className="px-4 py-2 border" colSpan={2}>Travel Time</th>
                        <th className="px-4 py-2 border" rowSpan={2}>Trauma Center</th>
                        <th className="px-4 py-2 border" rowSpan={2}>Burn Center</th>
                        <th className="px-4 py-2 border" rowSpan={2}>Helipad</th>
                        <th className="border px-4 py-2 w-[8%]" rowSpan={2}></th>
                    </tr>
                    <tr>
                        <th className="px-4 py-2 border">Air</th>
                        <th className="px-4 py-2 border">Ground</th>
                    </tr>
                </thead>
                <tbody>
                    {rowsHospitals.map((row, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='name'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.name}
                                    onChange={(e) => handleHospitalChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='address'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.address}
                                    onChange={(e) => handleHospitalChange(index, e)}
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
                                    onChange={(e) => handleHospitalChange(index, e)}
                                    placeholder="Enter details"
                                    required
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='air_travel_time'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.air_travel_time}
                                    onChange={(e) => handleHospitalChange(index, e)}
                                    placeholder="Enter details"
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="text"
                                    name='ground_travel_time'
                                    className="w-full px-2 py-1 border rounded"
                                    value={row.ground_travel_time}
                                    onChange={(e) => handleHospitalChange(index, e)}
                                    placeholder="Enter details"
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name='is_trauma_center'
                                        className="w-4 h-4 border rounded"
                                        checked={row.is_trauma_center}
                                        onChange={(e) => handleHospitalChange(index, e)}
                                    />
                                    <span>Level</span>
                                    <input
                                        type="text"
                                        name='level_trauma_center'
                                        className="w-full px-2 py-1 border rounded"
                                        value={row.level_trauma_center}
                                        onChange={(e) => handleHospitalChange(index, e)}
                                        placeholder="Enter details"
                                    />
                                </div>
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="checkbox"
                                    name='is_burn_center'
                                    className="w-full px-2 py-1 border rounded"
                                    checked={row.is_burn_center}
                                    onChange={(e) => handleHospitalChange(index, e)}
                                />
                            </td>
                            <td className="px-4 py-2 border">
                                <input
                                    type="checkbox"
                                    name='is_helipad'
                                    className="w-full px-2 py-1 border rounded"
                                    checked={row.is_helipad}
                                    onChange={(e) => handleHospitalChange(index, e)}
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