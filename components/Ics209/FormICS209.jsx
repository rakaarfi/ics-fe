'use client';

import React, { useState } from 'react';
import FormContainer from '../FormContainer';
import { ButtonSaveChanges, ButtonSubmit } from '../ButtonComponents';
import dayjs from 'dayjs';
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr';

export default function FormICS209({
    formData,
    setFormData,
    error,
    loading,
    incidentData,
    operationalPeriodData,
    selectedIncident,
    fetchedIncident,
    selectedPeriod,
    fetchedPeriod,
    ICData,
    SULeaderData,
    actionType,
    handleIncidentChange,
    handleOperationalPeriodChange,
    setActionType,
    handleChange,
    handleSubmit,
    firstInput = true
}) {
    const [activeTab, setActiveTab] = useState(1);

    const handleTabChange = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    // Fungsi untuk memformat angka menjadi format currency (Rp 12,000)
    const formatCurrency = (value) => {
        if (!value) return "";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        })
            .format(value)
            .replace("Rp", "Rp ")
            .trim();
    };

    // Fungsi untuk menghandle perubahan input agar tidak terjadi bug angka 0 tambahan
    const handleCurrencyChange = (e) => {
        const { name, value } = e.target;

        // Hapus semua karakter non-angka
        const rawValue = value.replace(/[^0-9]/g, "");

        // Cegah angka kosong berubah menjadi "0"
        const newValue = rawValue === "" ? "" : parseInt(rawValue, 10);

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: newValue, // Simpan sebagai angka tanpa format
        }));
    };

    const parseTimeIncident = (timeStr) => {
        if (!timeStr) return null;

        if (timeStr.includes(':')) {
            const today = dayjs().format('YYYY-MM-DD');
            return dayjs(`${today} ${timeStr}`).format('HH:mm');
        }
        return null;
    };

    return (
        <FormContainer title="ICS 209 - Incident Status Summary">
            {/* Modal Dialog untuk Memilih Aksi */}
            {actionType === null && !firstInput && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between gap-3">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                onClick={() => setActionType("edit")}
                            >
                                Update an
                                <br />
                                existing report
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                onClick={() => setActionType("create")}
                            >
                                Create a new version
                                <br />
                                based on a previous one
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {(actionType !== null || firstInput) && (
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
                    {formData.incident_id && formData.operational_period_id && (
                        <table className="table-fixed border-collapse w-full">
                            <tbody>
                                {/* Baris Pertama - Section 1 & 2 */}
                                <tr>
                                    {/* Incident Name */}
                                    <td className='px-4 py-2 border rounded-md'>
                                        <table className="w-full">
                                            <tbody>
                                                <tr>
                                                    <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                        1. Incident Name
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        {selectedIncident?.name || fetchedIncident?.name}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>

                                    {/* Incident No */}
                                    <td className="px-4 py-2 border rounded-md" >
                                        <table className="w-full">
                                            <tbody>
                                                <tr>
                                                    <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                        2. Incident No
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        {selectedIncident?.no || fetchedIncident?.no}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>

                                {/* Baris Kedua - Section 3 & 4+5 */}
                                <tr>
                                    {/* Location of Incident */}
                                    <td className='px-4 py-2 border rounded-md'>
                                        <table className="w-full">
                                            <tbody>
                                                <tr>
                                                    <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                        3. Location of Incident
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        {selectedIncident?.location || fetchedIncident?.location}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>

                                    {/* Date/Time + Time Zone */}
                                    <td className="px-4 py-2 border rounded-md" >
                                        <table className="w-full">
                                            <tbody>
                                                <tr>
                                                    <td className="px-4 py-2 border rounded-md bg-gray-300" colSpan={2}>
                                                        4. Date & Time of Incident
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md bg-gray-300" >
                                                        5. Time Zone
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        {selectedIncident?.date_incident || fetchedIncident?.date_incident}
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        {parseTimeIncident(selectedIncident?.time_incident) || parseTimeIncident(fetchedIncident?.time_incident) || '-'}
                                                    </td>
                                                    <td className="px-4 py-2 border rounded-md" >
                                                        {selectedIncident?.timezone || fetchedIncident?.timezone}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>

                                {/* Baris Ketiga - Section 6 dan 7 */}
                                <tr>
                                    {/* Location of Incident */}
                                    <td className='px-4 py-2 border rounded-md'>
                                        <table className="w-full">
                                            <tbody>
                                                <tr>
                                                    <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                        6. Brief Description of Incident
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-2 border rounded-md">
                                                        {selectedIncident?.description || fetchedIncident?.description}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>

                                    {/* Operational Period */}
                                    <td className="px-4 py-2 border rounded-md" >
                                        <table className="w-full">
                                            <tbody>
                                                <tr>
                                                    <td className="px-4 py-2 border rounded-md bg-gray-300" colSpan={4}>
                                                        7. Operational Period
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-2 border rounded-md">Date From:</td>
                                                    <td className="px-4 py-2 border rounded-md">{selectedPeriod?.date_from || fetchedPeriod.date_from}</td>
                                                    <td className="px-4 py-2 border rounded-md">Date To:</td>
                                                    <td className="px-4 py-2 border rounded-md">{selectedPeriod?.date_to || fetchedPeriod.date_to}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-2 border rounded-md">Time From:</td>
                                                    <td className="px-4 py-2 border rounded-md">{selectedPeriod?.time_from || fetchedPeriod.time_from}</td>
                                                    <td className="px-4 py-2 border rounded-md">Time To:</td>
                                                    <td className="px-4 py-2 border rounded-md">{selectedPeriod?.time_to || fetchedPeriod.time_to}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mt-4 flex flex-row">
                            <button type='button' className={`px-4 py-2 ${activeTab === 1 ? 'bg-gray-300' : 'bg-white'} border`} onClick={() => handleTabChange(1)}>Tab 1</button>
                            <button type='button' className={`px-4 py-2 ${activeTab === 2 ? 'bg-gray-300' : 'bg-white'} border`} onClick={() => handleTabChange(2)}>Tab 2</button>
                            <button type='button' className={`px-4 py-2 ${activeTab === 3 ? 'bg-gray-300' : 'bg-white'} border`} onClick={() => handleTabChange(3)}>Tab 3</button>
                        </div>
                        <table className="table-fixed border-collapse w-full my-5">
                            <tbody>
                                {activeTab === 1 && (
                                    <>
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md w-1/3" >
                                                <table className="w-full">
                                                    <tbody>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                                Report Version
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <div className="flex space-x-4">
                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="report_version"
                                                                            value="Initial"
                                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                                            checked={formData.report_version === "Initial"}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span>Initial</span>
                                                                    </label>

                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="report_version"
                                                                            value="Update"
                                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                                            checked={formData.report_version === "Update"}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span>Update</span>
                                                                    </label>

                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="report_version"
                                                                            value="Final"
                                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                                            checked={formData.report_version === "Final"}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span>Final</span>
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>

                                            <td className="px-4 py-2 border rounded-md  w-1/3" >
                                                <table className="w-full">
                                                    <tbody>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                                Report Number
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="text"
                                                                    name='report_number'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={formData.report_number}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>

                                            <td className="px-4 py-2 border rounded-md  w-1/3" >
                                                <table className="w-full">
                                                    <tbody>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                                Incident Commander
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <select
                                                                    name="incident_commander_id"
                                                                    className="flex-1 block rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                                                    value={formData.incident_commander_id || ""}
                                                                    onChange={(e) => setFormData(prev => ({
                                                                        ...prev,
                                                                        incident_commander_id: e.target.value
                                                                    }))}
                                                                    required
                                                                >
                                                                    <option value="" disabled>
                                                                        Select Incident Commander
                                                                    </option>
                                                                    {ICData.map(commander => (
                                                                        <option key={commander.id} value={commander.id}>
                                                                            {commander.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="px-4 py-2 border rounded-md" colSpan={2}>
                                                <table className="w-full">
                                                    <tbody>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                                Source of Incident
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="text"
                                                                    name='incident_source'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={formData.incident_source}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>

                                            <td className="px-4 py-2 border rounded-md" >
                                                <table className="w-full">
                                                    <tbody>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                                Controlled/Uncontrolled
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <div className="flex space-x-4">
                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="is_source_ctrl"
                                                                            value="true"
                                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                                            checked={formData.is_source_ctrl === true}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span>Controlled</span>
                                                                    </label>

                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="is_source_ctrl"
                                                                            value="false"
                                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                                            checked={formData.is_source_ctrl === false}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span>Uncontrolled</span>
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="px-4 py-2 border rounded-md" colSpan={2}>
                                                <table className="w-full">
                                                    <tbody>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                                Materials Release
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="text"
                                                                    name='materials_release'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={formData.materials_release}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>

                                            <td className="px-4 py-2 border rounded-md" >
                                                <table className="w-full">
                                                    <tbody>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                                Controlled/Uncontrolled
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <div className="flex space-x-4">
                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="is_material_ctrl"
                                                                            value="true"
                                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                                            checked={formData.is_material_ctrl === true}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span>Controlled</span>
                                                                    </label>

                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="is_material_ctrl"
                                                                            value="false"
                                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                                            checked={formData.is_material_ctrl === false}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span>Uncontrolled</span>
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                                <table className="w-full">
                                                    <tbody>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                                Status Response
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="text"
                                                                    name='response_status'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={formData.response_status}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            {/* Impact to Personnel */}
                                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                                <table className="w-full">
                                                    <tbody>
                                                        {/* Header */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300" colSpan={10}>
                                                                Impact to Personnel
                                                            </td>
                                                        </tr>

                                                        {/* Accounted For */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md whitespace-nowrap">
                                                                <input
                                                                    type="checkbox"
                                                                    name='is_acc'
                                                                    className="mr-2"
                                                                    checked={formData.is_acc || false}
                                                                    onChange={handleChange} />
                                                                <strong>Accounted for</strong>
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">Number</td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="number"
                                                                    name='acc_num'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={parseInt(formData.acc_num, 10)}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md text-center" colSpan={2}>
                                                                <input
                                                                    type="checkbox"
                                                                    name='is_acc_mustered'
                                                                    className="mr-2"
                                                                    checked={formData.is_acc_mustered || false}
                                                                    onChange={handleChange}
                                                                />
                                                                Mustered
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md text-center" colSpan={2}>
                                                                <input
                                                                    type="checkbox"
                                                                    name='is_acc_sheltered'
                                                                    className="mr-2"
                                                                    checked={formData.is_acc_sheltered || false}
                                                                    onChange={handleChange}
                                                                />
                                                                Sheltered
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md text-center" colSpan={2}>
                                                                <input
                                                                    type="checkbox"
                                                                    name='is_acc_evacuated'
                                                                    className="mr-2"
                                                                    checked={formData.is_acc_evacuated || false}
                                                                    onChange={handleChange}
                                                                />
                                                                Evacuated
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>

                                                            </td>
                                                        </tr>

                                                        {/* Unaccounted For */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md whitespace-nowrap">
                                                                <input
                                                                    type="checkbox"
                                                                    name='is_unacc'
                                                                    className="mr-2"
                                                                    checked={formData.is_unacc || false}
                                                                    onChange={handleChange} />
                                                                <strong>Unaccounted for</strong>
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">Number</td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="text"
                                                                    min="0"
                                                                    name='unacc_num'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={parseInt(formData.unacc_num, 10) || 0}
                                                                    onChange={handleChange}
                                                                    readOnly
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">Employee</td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    name='unacc_emp'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={parseInt(formData.unacc_emp, 10) || 0}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">Contractor</td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    name='unacc_con'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={parseInt(formData.unacc_con, 10) || 0}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">Other</td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    name='unacc_oth'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={parseInt(formData.unacc_oth, 10) || 0}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>

                                                            </td>
                                                        </tr>

                                                        {/* Injured */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    name='is_injured'
                                                                    className="mr-2"
                                                                    checked={formData.is_injured || false}
                                                                    onChange={handleChange}
                                                                />
                                                                <strong>Injured</strong>
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">Number</td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="text"
                                                                    name='inj_num'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={parseInt(formData.inj_num, 10) || 0}
                                                                    onChange={handleChange}
                                                                    readOnly
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">Employee</td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    name='inj_emp'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={parseInt(formData.inj_emp, 10) || 0}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">Contractor</td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    name='inj_con'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={parseInt(formData.inj_con, 10) || 0}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">Other</td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    name='inj_oth'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={parseInt(formData.inj_oth, 10) || 0}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>

                                                            </td>
                                                        </tr>

                                                        {/* Dead */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="checkbox"
                                                                    name='is_dead'
                                                                    className="mr-2"
                                                                    checked={formData.is_dead}
                                                                    onChange={handleChange}
                                                                />
                                                                <strong>Dead</strong>
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">Number</td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="text"
                                                                    name='dead_num'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={parseInt(formData.dead_num, 10) || 0}
                                                                    onChange={handleChange}
                                                                    readOnly
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">Employee</td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    name='dead_emp'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={parseInt(formData.dead_emp, 10) || 0}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">Contractor</td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    name='dead_con'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={parseInt(formData.dead_con, 10) || 0}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">Other</td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    name='dead_oth'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={parseInt(formData.dead_oth, 10) || 0}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            {/* Impact on Env */}
                                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                                <table className="w-full">
                                                    <tbody>
                                                        {/* Header */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                                <strong>Impact on Environment</strong>
                                                                <div className="flex space-x-4 ml-32">
                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="env_impact"
                                                                            value="None"
                                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                                            checked={formData.env_impact === "None"}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span>None</span>
                                                                    </label>

                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="env_impact"
                                                                            value="Minor"
                                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                                            checked={formData.env_impact === "Minor"}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span>Minor</span>
                                                                    </label>

                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="env_impact"
                                                                            value="Major"
                                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                                            checked={formData.env_impact === "Major"}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span>Major</span>
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-100" colSpan={10}>
                                                                Description Impact on Environment
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <textarea
                                                                    name="env_desc"
                                                                    value={formData.env_desc}
                                                                    rows="7"
                                                                    cols="50"
                                                                    onChange={handleChange}
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                >
                                                                </textarea>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            {/* Impact on Community */}
                                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                                <table className="w-full">
                                                    <tbody>
                                                        {/* Header */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                                <strong>Impact on Community</strong>
                                                                <div className="flex space-x-4 ml-32">
                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="comm_impact"
                                                                            value="None"
                                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                                            checked={formData.comm_impact === "None"}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span>None</span>
                                                                    </label>

                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="comm_impact"
                                                                            value="Minor"
                                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                                            checked={formData.comm_impact === "Minor"}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span>Minor</span>
                                                                    </label>

                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="comm_impact"
                                                                            value="Major"
                                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                                            checked={formData.comm_impact === "Major"}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span>Major</span>
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-100" colSpan={10}>
                                                                Description Impact on Community
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <textarea
                                                                    name="comm_desc"
                                                                    value={formData.comm_desc}
                                                                    rows="7"
                                                                    cols="50"
                                                                    onChange={handleChange}
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                >
                                                                </textarea>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            {/* Impact on Operations */}
                                            <td className="px-4 py-2 border rounded-md" colSpan={3}>
                                                <table className="w-full">
                                                    <tbody>
                                                        {/* Header */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                                <strong>Impact on Operations</strong>
                                                                <div className="flex space-x-4 ml-32">
                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="ops_impact"
                                                                            value="None"
                                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                                            checked={formData.ops_impact === "None"}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span>None</span>
                                                                    </label>

                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="ops_impact"
                                                                            value="Minor"
                                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                                            checked={formData.ops_impact === "Minor"}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span>Minor</span>
                                                                    </label>

                                                                    <label className="flex items-center space-x-2">
                                                                        <input
                                                                            type="radio"
                                                                            name="ops_impact"
                                                                            value="Major"
                                                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                                            checked={formData.ops_impact === "Major"}
                                                                            onChange={handleChange}
                                                                        />
                                                                        <span>Major</span>
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-100" colSpan={10}>
                                                                Description Impact on Operations
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <textarea
                                                                    name="ops_desc"
                                                                    value={formData.ops_desc}
                                                                    rows="7"
                                                                    cols="50"
                                                                    onChange={handleChange}
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                >
                                                                </textarea>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </>
                                )}
                                {activeTab === 2 && (
                                    <>
                                        <tr>
                                            {/* Significant Event for the Time Period Reported */}
                                            <td className="px-4 py-2 border rounded-md" colSpan={8}>
                                                <table className="w-full">
                                                    <tbody>
                                                        {/* Header */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                                <strong>Significant Event for the Time Period Reported</strong>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <textarea
                                                                    name="events_period"
                                                                    value={formData.events_period}
                                                                    rows="7"
                                                                    cols="50"
                                                                    onChange={handleChange}
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                >
                                                                </textarea>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            {/* Incident Objectives for Next Operational Period */}
                                            <td className="px-4 py-2 border rounded-md" colSpan={8}>
                                                <table className="w-full">
                                                    <tbody>
                                                        {/* Header */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                                <strong>Incident Objectives for Next Operational Period</strong>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <textarea
                                                                    name="obj_next_period"
                                                                    value={formData.obj_next_period}
                                                                    rows="7"
                                                                    cols="50"
                                                                    onChange={handleChange}
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                >
                                                                </textarea>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            {/* Planned Action for Next Operational Period */}
                                            <td className="px-4 py-2 border rounded-md" colSpan={8}>
                                                <table className="w-full">
                                                    <tbody>
                                                        {/* Header */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                                <strong>Planned Action for Next Operational Period</strong>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <textarea
                                                                    name="actions_next_period"
                                                                    value={formData.actions_next_period}
                                                                    rows="7"
                                                                    cols="50"
                                                                    onChange={handleChange}
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                >
                                                                </textarea>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            {/* Significant Resources Needed */}
                                            <td className="px-4 py-2 border rounded-md" colSpan={8}>
                                                <table className="w-full">
                                                    <tbody>
                                                        {/* Header */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                                <strong>Significant Resources Needed</strong>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <textarea
                                                                    name="res_needed"
                                                                    value={formData.res_needed}
                                                                    rows="7"
                                                                    cols="50"
                                                                    onChange={handleChange}
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                >
                                                                </textarea>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        {/* Anticipated Incident Management Completion Date */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md w-1/2" colSpan={4}>
                                                <table className="w-full table-fixed">
                                                    <tbody>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                                <strong>Anticipated Incident Management Completion Date</strong>
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="date"
                                                                    name="est_completion_date"
                                                                    className="w-full text-center border rounded-md"
                                                                    value={formData.est_completion_date}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>

                                            {/* Estimated Incident Costs to Date */}
                                            <td className="px-4 py-2 border rounded-md w-1/2" colSpan={4}>
                                                <table className="w-full table-fixed">
                                                    <tbody>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                                <strong>Estimated Incident Costs to Date</strong>
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="text"
                                                                    name="cost_to_date"
                                                                    className="w-full text-center border rounded-md"
                                                                    value={formatCurrency(formData.cost_to_date)}
                                                                    onChange={handleCurrencyChange}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        {/* Projected Significant Resource Demobilization Start Date */}
                                        <tr>
                                            <td className="px-4 py-2 border rounded-md w-1/2" colSpan={4}>
                                                <table className="w-full table-fixed">
                                                    <tbody>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                                <strong>Projected Significant Resource Demobilization Start Date</strong>
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="date"
                                                                    name="est_res_democ_start"
                                                                    className="w-full text-center border rounded-md"
                                                                    value={formData.est_res_democ_start}
                                                                    onChange={handleChange}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>

                                            {/* Projected Final Incident Cost Estimate */}
                                            <td className="px-4 py-2 border rounded-md w-1/2" colSpan={4}>
                                                <table className="w-full table-fixed">
                                                    <tbody>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300">
                                                                <strong>Projected Final Incident Cost Estimate</strong>
                                                            </td>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <input
                                                                    type="text"
                                                                    name='final_cost_est'
                                                                    className="w-full text-center border rounded-md"
                                                                    value={formatCurrency(formData.final_cost_est)}
                                                                    onChange={handleCurrencyChange}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </>
                                )}
                                {activeTab === 3 && (
                                    <>
                                        <tr>
                                            {/* Contact with/from Government Agencies */}
                                            <td className="px-4 py-2 border rounded-md" colSpan={8}>
                                                <table className="w-full">
                                                    <tbody>
                                                        {/* Header */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                                <strong>Contact with/from Government Agencies</strong>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <textarea
                                                                    name="gov_contact"
                                                                    value={formData.gov_contact}
                                                                    rows="7"
                                                                    cols="50"
                                                                    onChange={handleChange}
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                >
                                                                </textarea>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            {/* Contact with/from Media */}
                                            <td className="px-4 py-2 border rounded-md" colSpan={8}>
                                                <table className="w-full">
                                                    <tbody>
                                                        {/* Header */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                                <strong>Contact with/from Media</strong>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <textarea
                                                                    name="media_contact"
                                                                    value={formData.media_contact}
                                                                    rows="7"
                                                                    cols="50"
                                                                    onChange={handleChange}
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                >
                                                                </textarea>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            {/* Contact with/from Next-of-Kin */}
                                            <td className="px-4 py-2 border rounded-md" colSpan={8}>
                                                <table className="w-full">
                                                    <tbody>
                                                        {/* Header */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                                <strong>Contact with/from Next-of-Kin</strong>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <textarea
                                                                    name="kin_contact"
                                                                    value={formData.kin_contact}
                                                                    rows="7"
                                                                    cols="50"
                                                                    onChange={handleChange}
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                >
                                                                </textarea>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            {/* Contact with/from Shareholders */}
                                            <td className="px-4 py-2 border rounded-md" colSpan={8}>
                                                <table className="w-full">
                                                    <tbody>
                                                        {/* Header */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                                <strong>Contact with/from Shareholders</strong>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <textarea
                                                                    name="shareholder_contact"
                                                                    value={formData.shareholder_contact}
                                                                    rows="7"
                                                                    cols="50"
                                                                    onChange={handleChange}
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                >
                                                                </textarea>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>

                                        <tr>
                                            {/* Contact with/from NGOs */}
                                            <td className="px-4 py-2 border rounded-md" colSpan={8}>
                                                <table className="w-full">
                                                    <tbody>
                                                        {/* Header */}
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md bg-gray-300 flex items-center justify-start" colSpan={10}>
                                                                <strong>Contact with/from NGOs</strong>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="px-4 py-2 border rounded-md">
                                                                <textarea
                                                                    name="ngo_contact"
                                                                    value={formData.ngo_contact}
                                                                    rows="7"
                                                                    cols="50"
                                                                    onChange={handleChange}
                                                                    className="w-full px-3 py-2 border rounded-md"
                                                                >
                                                                </textarea>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </>
                                )}

                                <tr>
                                    <td className="space-x-2 text-right" colSpan={8}>
                                        {activeTab > 1 && (
                                            <button
                                                type="button"
                                                className="px-4 py-2 mt-4 bg-gray-500 text-white rounded"
                                                onClick={() => handleTabChange(activeTab - 1)}>
                                                <GrLinkPrevious />
                                            </button>
                                        )}
                                        {activeTab < 3 && (
                                            <button
                                                type="button"
                                                className="px-4 py-2 mt-4 bg-blue-500 text-white rounded"
                                                onClick={() => handleTabChange(activeTab + 1)}>
                                                <GrLinkNext />
                                            </button>
                                        )}
                                    </td>
                                </tr>

                                {/* Prepared by */}
                                <tr>
                                    <td className="px-4 py-2 font-bold">
                                        7. Prepared by:
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">
                                        <select
                                            name="situation_unit_leader_id"
                                            className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                            value={formData.situation_unit_leader_id || ""}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                situation_unit_leader_id: e.target.value
                                            }))}
                                            required
                                        >
                                            <option value="" disabled>
                                                Select Situation Unit Leader
                                            </option>
                                            {SULeaderData.map(leader => (
                                                <option key={leader.id} value={leader.id}>
                                                    {leader.name}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="checkbox"
                                            name="is_prepared"
                                            checked={formData.is_prepared || false}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                is_prepared: e.target.checked
                                            }))}
                                            className="mr-2"
                                            required
                                        />
                                        Signature
                                    </td>
                                </tr>

                                {/* Submit Button */}
                                <tr>
                                    <td colSpan={8} className="text-right px-4 py-2">
                                        {firstInput ? <ButtonSubmit /> : <ButtonSaveChanges />}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </>
            )
            }
        </FormContainer >
    );
}