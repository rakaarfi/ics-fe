'use client';

import React, { useState } from 'react';
import FormContainer from '../FormContainer';
import { ButtonSaveChanges, ButtonSubmit } from '../ButtonComponents';
import ResourcesAssigned from './ResourcesAssigned';
import ActivityLog from './ActivityLog';

export default function FormICS214({
    formData,
    setFormData,
    error,
    loading,
    incidentData,
    operationalPeriodData,
    handleIncidentChange,
    handleOperationalPeriodChange,
    handleChange,
    handleSubmit,
    handleAddResourcesRow,
    handleRemoveResourcesRow,
    handleResourceChange,
    handleAddActivityLogRow,
    handleRemoveActivityLogRow,
    handleActivityLogChange,
    handleTimeActivityLogChange
}) {
    return (
        <FormContainer title="ICS 214 - Activity Log">
            <>
                <div className="mb-4 flex flex-row">
                    <select
                        className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                        value={formData.incident_id || ""}
                        onChange={handleIncidentChange}
                        required
                    >
                        <option value="" disabled>
                            Select Incident
                        </option>
                        {incidentData.map((incident) => (
                            <option key={incident.id} value={incident.id}>
                                {incident.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                        value={formData.operational_period_id || ""}
                        onChange={handleOperationalPeriodChange}
                        disabled={loading || !formData.incident_id}
                        required
                    >
                        <option value="" disabled>
                            {loading ? 'Loading...' : 'Select Operational Period'}
                        </option>
                        {operationalPeriodData.map((period) => (
                            <option key={period.id} value={period.id}>
                                {period.date_from} - {period.date_to}
                            </option>
                        ))}
                    </select>
                </div>
                {error && <div className="text-red-500">{error}</div>}
                <form
                    onSubmit={handleSubmit}
                >
                    <table className="table-auto border-collapse w-full">
                        <tbody>
                            <tr>
                                <td className="px-4 py-2" colSpan={10}>
                                    <table className="w-full table-auto">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 border">Name</th>
                                                <th className="px-4 py-2 border">ICS Position</th>
                                                <th className="px-4 py-2 border">Home Agency (and Unit)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        name='name'
                                                        className="w-full px-2 py-1 border rounded"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        placeholder="Enter details"
                                                        required
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        name='position'
                                                        className="w-full px-2 py-1 border rounded"
                                                        value={formData.position}
                                                        onChange={handleChange}
                                                        placeholder="Enter details"
                                                        required
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border">
                                                    <input
                                                        type="text"
                                                        name='home_agency'
                                                        className="w-full px-2 py-1 border rounded"
                                                        value={formData.home_agency}
                                                        onChange={handleChange}
                                                        placeholder="Enter details"
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>

                            {/* <!-- Baris untuk Resources Assigned --> */}
                            <tr>
                                <td className="px-4 pt-4 font-bold" colSpan={7}>Resources Assigned</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2" colSpan={10}>
                                    <ResourcesAssigned
                                        rowsResources={formData.resourcesAssigned}
                                        onAddRow={handleAddResourcesRow}
                                        onRemoveRow={handleRemoveResourcesRow}
                                        onChangeRow={handleResourceChange}
                                    />
                                </td>
                            </tr>

                            {/* <!-- Baris untuk Activity Log --> */}
                            <tr>
                                <td className="px-4 pt-4 font-bold" colSpan={7}>Activity Log</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2" colSpan={10}>
                                    <ActivityLog
                                        rowsActivityLog={formData.activityLog}
                                        onAddRow={handleAddActivityLogRow}
                                        onRemoveRow={handleRemoveActivityLogRow}
                                        onChangeRow={handleActivityLogChange}
                                        onChangeTime={handleTimeActivityLogChange}
                                    />
                                </td>
                            </tr>

                            {/* Prepared by */}
                            <tr>
                                <td className="px-4 pt-4 font-bold" colSpan={7}>Prepared By</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2">
                                    <input
                                        type="text"
                                        name='name'
                                        className="w-full px-2 py-1 border rounded"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter details"
                                        required
                                    />
                                    <input
                                        type="checkbox"
                                        name="is_prepared"
                                        checked={formData.is_prepared || false}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            is_prepared: e.target.checked
                                        }))}
                                        className="mr-2"
                                    />
                                    Signature
                                </td>
                            </tr>

                            {/* <!-- Baris untuk Tombol Submit --> */}
                            <tr>
                                <td colSpan={7} className="text-right px-4 py-2">
                                    <ButtonSaveChanges /> <ButtonSubmit />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form >
            </>
        </FormContainer >
    );
}