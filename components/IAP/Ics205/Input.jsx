'use client';

import { ButtonSubmit } from '@/components/ButtonComponents';
import FormContainer from '@/components/FormContainer';
import React from 'react'

export default function Input() {
    return (
        <FormContainer title="Input ICS 205" >
            <div className="mb-4 flex flex-row">
                <select
                    name="incident_id"
                    className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                // onChange={(e) => handleIncidentChange(parseInt(e.target.value, 10))}
                // value={formData.incident_id || ""}
                >
                    <option value={""} disabled>
                        Select Incident
                    </option>
                    {/* {incidentData.map((incident) => (
                        <option key={incident.id} value={incident.id}>
                            {incident.name}
                        </option>
                    ))} */}
                </select>
                <select
                    name="id"
                    className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                // onChange={(e) => handleIncidentChange(parseInt(e.target.value, 10))}
                // value={formData.incident_id || ""}
                >
                    <option value={""} disabled>
                        Select Operational Period
                    </option>
                    {/* {incidentData.map((incident) => (
                        <option key={incident.id} value={incident.id}>
                            {incident.name}
                        </option>
                    ))} */}
                </select>
            </div>
            <form
            // onSubmit={handleSubmit}
            >
                <table className="table-auto border-collapse w-full">
                    <tbody>
                        {/* <!-- Baris untuk Basic Radio Channel Use --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Basic Radio Channel Use</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <table className="table-auto border-collapse w-full">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 border">Channel Number</th>
                                            <th className="px-4 py-2 border">Channel Name</th>
                                            <th className="px-4 py-2 border">Radio Frequency</th>
                                            <th className="px-4 py-2 border">Mode(Analog, Digital, Mixed)</th>
                                            <th className="px-4 py-2 border">Function</th>
                                            <th className="px-4 py-2 border">Assignment</th>
                                            <th className="px-4 py-2 border">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    type="text"
                                                    className="w-full px-2 py-1 border rounded"
                                                    placeholder="Enter details"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    type="text"
                                                    className="w-full px-2 py-1 border rounded"
                                                    placeholder="Enter details"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    type="text"
                                                    className="w-full px-2 py-1 border rounded"
                                                    placeholder="Enter details"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    type="text"
                                                    className="w-full px-2 py-1 border rounded"
                                                    placeholder="Enter details"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    type="text"
                                                    className="w-full px-2 py-1 border rounded"
                                                    placeholder="Enter details"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    type="text"
                                                    className="w-full px-2 py-1 border rounded"
                                                    placeholder="Enter details"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    type="text"
                                                    className="w-full px-2 py-1 border rounded"
                                                    placeholder="Enter details"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Special Instructions --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Special Instructions</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <textarea
                                    // name="situation_summary"
                                    // value={formData.situation_summary}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows="7"
                                    cols="50"
                                    // onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Tombol Submit --> */}
                        <tr>
                            <td colSpan={7} className="text-right px-4 py-2">
                                <ButtonSubmit />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form >
        </FormContainer >
    )
}
