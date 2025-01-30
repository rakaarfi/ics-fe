'use client';

import { ButtonSubmit } from '@/components/ButtonComponents';
import FormContainer from '@/components/FormContainer';
import React from 'react'

export default function Input() {
    return (
        <FormContainer title="Input ICS 208" >
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

                        {/* <!-- Baris untuk Safety Message/Expanded Safety Message, Safety Plan, Site Safety Plan --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan="3">Safety Message/Expanded Safety Message, Safety Plan, Site Safety Plan</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan="3">
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

                        {/* <!-- Baris untuk Site Safety Plan Required? --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold">
                                <span>
                                    Site Safety Plan Required?
                                </span>
                                <input type="checkbox" className='ml-2' />
                            </td>
                            <td className="px-4 pt-4 font-bold">
                                <span>
                                    Site Safety Plan
                                </span>
                                <textarea className="w-full px-3 py-2 border rounded-md" rows="3"></textarea>
                            </td>
                            <td className="px-4 pt-4 font-bold">
                                <span>
                                    Additional Safety Message(s)
                                </span>
                                <textarea className="w-full px-3 py-2 border rounded-md" rows="3"></textarea>
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Tombol Submit --> */}
                        <tr>
                            <td className="text-right px-4 py-2" colSpan="3">
                                <ButtonSubmit />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form >
        </FormContainer >
    )
}
