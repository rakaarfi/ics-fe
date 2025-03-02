'use client';

import React, { useState } from 'react';
import FormContainer from '../FormContainer';
import { ButtonSaveChanges, ButtonSubmit } from '../ButtonComponents';
import SubForm from './SubForm';

export default function FormICS215A({
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
    handleAddSubFormsRow,
    handleRemoveSubFormsRow,
    handleSubFormChange,
    OSChiefData,
    safetyOfficerData,
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

                            {/* <!-- Baris untuk SubForm --> */}
                            <tr>
                                <td className="px-4 py-2" colSpan={10}>
                                    <SubForm
                                        rowsSubForm={formData.subForm}
                                        onAddRow={handleAddSubFormsRow}
                                        onRemoveRow={handleRemoveSubFormsRow}
                                        onChangeRow={handleSubFormChange}
                                    />
                                </td>
                            </tr>

                            {/* Prepared by */}
                            <tr>
                                <td className="px-4 py-2 font-bold">
                                    Prepared by:
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2">
                                    {/* Select untuk Safety Officer */}
                                    <select
                                        name="safety_officer_id"
                                        className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                        value={formData.safety_officer_id || ""}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            safety_officer_id: e.target.value
                                        }))}
                                        required={!formData.operation_section_chief_id}
                                    >
                                        <option value="" disabled>
                                            Select Safety Officer
                                        </option>
                                        {safetyOfficerData.map(chief => (
                                            <option key={chief.id} value={chief.id}>
                                                {chief.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="checkbox"
                                        name="is_prepared_safety_officer" // Nama field berbeda
                                        checked={formData.is_prepared_safety_officer || false}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            is_prepared_safety_officer: e.target.checked
                                        }))}
                                        className="mr-2"
                                    />
                                    Signature (Safety Officer)
                                </td>
                            </tr>

                            {/* Prepared by */}
                            <tr>
                                <td className="px-4 py-2">
                                    {/* Select untuk Operation Section Chief */}
                                    <select
                                        name="operation_section_chief_id"
                                        className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                        value={formData.operation_section_chief_id || ""}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            operation_section_chief_id: e.target.value
                                        }))}
                                        required={!formData.safety_officer_id}
                                    >
                                        <option value="" disabled>
                                            Select Prepared by Operation Section Chief
                                        </option>
                                        {OSChiefData.map(chief => (
                                            <option key={chief.id} value={chief.id}>
                                                {chief.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="checkbox"
                                        name="is_prepared_os_chief"
                                        checked={formData.is_prepared_os_chief || false}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            is_prepared_os_chief: e.target.checked
                                        }))}
                                        className="mr-2"
                                    />
                                    Signature (Operation Section Chief)
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