'use client';

import { ButtonSubmit } from '@/components/ButtonComponents';
import FormContainer from '@/components/FormContainer';
import React from 'react'

export default function Input() {
    return (
        <FormContainer title="Input ICS 202" >
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
                        {/* <!-- Baris untuk Objective(s) --> */}
                        <tr>
                            <td className="px-4 py-2 font-bold" colSpan={7}>Objective(s)</td>
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

                        {/* <!-- Baris untuk Operational Period Command Emphasis --> */}
                        <tr>
                            <td className="px-4 py-2 font-bold" colSpan={7}>Operational Period Command Emphasis</td>
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
                        <tr>
                            <td className="px-4 py-2" colSpan={7}>General Situational Awareness</td>
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

                        {/* <!-- Baris untuk Site Safety Plan --> */}
                        <tr>
                            <td className="px-4 py-2 font-bold">
                                Site Safety Plan Required? (Yes/No)
                                <input
                                    type="checkbox"
                                    // name="site_safety_plan_required"
                                    className="mx-2"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-bold">
                                Approved Site Safety Plan(s) Located at:
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-md"
                                    // name="situation_summary"
                                    // value={formData.situation_summary}
                                    // onChange={handleChange}
                                    required
                                />
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Incident Action Plan(s) --> */}
                        {/* <!-- Baris untuk Incident Action Plan(s) --> */}
                        <tr>
                            <td className="px-4 py-2 font-bold">
                                Incident Action Plan (the items checked below are included in this Incident Action Plan)
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">
                                <div className="grid grid-cols-3 gap-4"> {/* Grid dengan 3 kolom dan jarak antar item */}
                                    {[
                                        { label: "ICS 203", name: "ics_203" },
                                        { label: "ICS 205A", name: "ics_205a" },
                                        { label: "ICS 208", name: "ics_208" },
                                        { label: "ICS 204", name: "ics_204" },
                                        { label: "ICS 206", name: "ics_206" },
                                        { label: "Map/Chart", name: "map_chart" },
                                        { label: "ICS 205", name: "ics_205" },
                                        { label: "ICS 207", name: "ics_207" },
                                        { label: "Weather Forecast/Tides/Currents", name: "weather_forecast" },
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name={item.name} // Menggunakan name dari objek
                                                className="mx-2"
                                            />
                                            <label>{item.label}</label>
                                        </div>
                                    ))}
                                </div>
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
            </form>
        </FormContainer >
    )
}
