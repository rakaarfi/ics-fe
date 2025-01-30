'use client';

import { ButtonSubmit } from '@/components/ButtonComponents';
import FormContainer from '@/components/FormContainer';
import React from 'react'

export default function Input() {
    return (
        <FormContainer title="Input ICS 204" >
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
                        {/* <!-- Baris untuk Operations Personnel --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Operations Personnel</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <div className="flex w-full">
                                    {/* Tabel Pertama */}
                                    <table className="table-auto border-collapse w-1/2 mr-2">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 border"></th>
                                                <th className="px-4 py-2 border">Name</th>
                                                <th className="px-4 py-2 border">Contact Number</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="px-4 py-2 border font-bold">Operation Section Chief</td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        className="w-full px-2 py-1 border rounded"
                                                        placeholder="Enter name"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        className="w-full px-2 py-1 border rounded"
                                                        placeholder="Enter contact number"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border font-bold">Branch Director</td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        className="w-full px-2 py-1 border rounded"
                                                        placeholder="Enter name"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        className="w-full px-2 py-1 border rounded"
                                                        placeholder="Enter contact number"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border font-bold">Division/Group Supervisor</td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        className="w-full px-2 py-1 border rounded"
                                                        placeholder="Enter name"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        className="w-full px-2 py-1 border rounded"
                                                        placeholder="Enter contact number"
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    {/* Tabel Kedua */}
                                    <table className="table-auto border-collapse w-1/2 ml-2">
                                        <tbody>
                                            <tr>
                                                <td className="px-4 py-2 border font-bold">Operation Section Chief</td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        className="w-full px-2 py-1 border rounded"
                                                        placeholder="Enter details"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border font-bold">Branch Director</td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        className="w-full px-2 py-1 border rounded"
                                                        placeholder="Enter details"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 border font-bold">Division/Group Supervisor</td>
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
                                </div>
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Personnel Assigned --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Personnel Assigned</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <table className="table-auto border-collapse w-full">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 border">Name</th>
                                            <th className="px-4 py-2 border">Contact Number</th>
                                            <th className="px-4 py-2 border">Reporting Location</th>
                                            <th className="px-4 py-2 border">Special Equipment, Tools, and Remarks</th>
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
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Equipment & Materials Assigned --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Equipment & Materials Assigned</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                <table className="table-auto border-collapse w-full">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 border">Kind</th>
                                            <th className="px-4 py-2 border">Quantity</th>
                                            <th className="px-4 py-2 border">Type(Specification)</th>
                                            <th className="px-4 py-2 border">Contact Number</th>
                                            <th className="px-4 py-2 border">Reporting Location</th>
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
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        {/* <!-- Baris untuk Work Assignment --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Work Assignment</td>
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

                        {/* <!-- Baris untuk Communications --> */}
                        <tr>
                            <td className="px-4 pt-4 font-bold" colSpan={7}>Communications (radio and/or contact numbers needed for this assignment)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2" colSpan={10}>
                                {/* Container untuk label dan input */}
                                <div className="space-y-4">
                                    {/* Radio Communication Channel Number */}
                                    <div className="flex items-center">
                                        <label htmlFor="radio_channel" className="w-1/4 pr-4">Radio Communication Channel Number</label>
                                        <input
                                            id="radio_channel"
                                            name="radio_channel"
                                            className="w-3/4 px-3 py-2 border rounded-md"
                                            // value={formData.radio_channel}
                                            // onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Frequency */}
                                    <div className="flex items-center">
                                        <label htmlFor="frequency" className="w-1/4 pr-4">Frequency</label>
                                        <input
                                            id="frequency"
                                            name="frequency"
                                            className="w-3/4 px-3 py-2 border rounded-md"
                                            // value={formData.frequency}
                                            // onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Communication Mode (Digital, Analog, Mixed) */}
                                    <div className="flex items-center">
                                        <label htmlFor="communication_mode" className="w-1/4 pr-4">Communication Mode (Digital, Analog, Mixed)</label>
                                        <input
                                            id="communication_mode"
                                            name="communication_mode"
                                            className="w-3/4 px-3 py-2 border rounded-md"
                                            // value={formData.communication_mode}
                                            // onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Mobile Phone Number */}
                                    <div className="flex items-center">
                                        <label htmlFor="mobile_phone" className="w-1/4 pr-4">Mobile Phone Number</label>
                                        <input
                                            id="mobile_phone"
                                            name="mobile_phone"
                                            className="w-3/4 px-3 py-2 border rounded-md"
                                            // value={formData.mobile_phone}
                                            // onChange={handleChange}
                                            required
                                        />
                                    </div>
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
            </form >
        </FormContainer >
    )
}
