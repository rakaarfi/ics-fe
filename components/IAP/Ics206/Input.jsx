'use client';

import { ButtonSubmit } from '@/components/ButtonComponents';
import FormContainer from '@/components/FormContainer';
import React from 'react'

export default function Input() {
    return (
        <FormContainer title="Input ICS 206" >
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

                        {/* <!-- Baris untuk Medical Aid Stations --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Medical Aid Stations</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <table className="table-auto border-collapse w-full">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 border">Name</th>
                                            <th className="px-4 py-2 border">Location</th>
                                            <th className="px-4 py-2 border">Contact Number(s)/Frequency</th>
                                            <th className="px-4 py-2 border">Paramedics on Site?(Yes/No)</th>
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
                                                    type="checkbox"
                                                    className="w-full px-2 py-1 border rounded"
                                                    placeholder="Enter details"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Transportation (indicate air or ground) --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Transportation (indicate air or ground)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <table className="table-auto border-collapse w-full">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 border">Ambulance Service</th>
                                            <th className="px-4 py-2 border">Location</th>
                                            <th className="px-4 py-2 border">Contact Number(s)/Frequency</th>
                                            <th className="px-4 py-2 border" colSpan={2}>Level of Service</th>
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
                                                <div className="flex items-center gap-2">
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            className="mr-1"
                                                        />
                                                        ALS
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <div className="flex items-center gap-2">
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            className="mr-1"
                                                        />
                                                        BLS
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Hospitals --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Hospitals</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <table className="table-auto border-collapse w-full">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 border" rowSpan={2}>Name</th>
                                            <th className="px-4 py-2 border" rowSpan={2}>Address</th>
                                            <th className="px-4 py-2 border" rowSpan={2}>Contact Number(s)/Frequency</th>
                                            <th className="px-4 py-2 border" colSpan={2}>Travel Time</th>
                                            <th className="px-4 py-2 border" rowSpan={2}>Trauma Center</th>
                                            <th className="px-4 py-2 border" rowSpan={2}>Burn Center</th>
                                            <th className="px-4 py-2 border" rowSpan={2}>Helipad</th>
                                        </tr>
                                        <tr>
                                            <th className="px-4 py-2 border">Air</th>
                                            <th className="px-4 py-2 border">Ground</th>
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
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 border rounded"
                                                    />
                                                    <span>Level</span>
                                                    <input
                                                        type="text"
                                                        className="w-full px-2 py-1 border rounded"
                                                        placeholder="Enter details"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 border rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 border rounded"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Special Medical Emergency Procedures --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Special Medical Emergency Procedures</td>
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

                        {/* <!-- Baris untuk Check box if aviation Assets are utilized for rescue. If assets are used, coordinate with Air Operations. --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 border rounded"
                                />
                                <span className="ml-2">
                                    Check box if aviation Assets are utilized for rescue. If assets are used, coordinate with Air Operations.
                                </span>
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
