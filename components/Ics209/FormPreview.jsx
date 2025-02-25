'use client';

import FormContainer from '../FormContainer'
import React, { useState } from 'react';
import { ButtonSaveChanges, ButtonSubmit } from '../ButtonComponents';
import dayjs from 'dayjs';
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr';
import { Checkbox, FormControl, FormControlLabel, MenuItem, Select, Table, TableBody, TableCell, TableRow } from '@mui/material';

export default function FormPreview({
    fetchedIncident,
    fetchedPeriod,
    formData,
    SULeaderData,
    isPrepared,
    preparedDate,
    preparedTime,
    ICData,
    approvalData,
    setApprovalData,
    handleExportButtonClick,
    error,
    isTobeApproved = false,
    handleSubmit,
}) {
    const firstInput = true;
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

    const parseTimeIncident = (timeStr) => {
        if (!timeStr) return null;

        if (timeStr.includes(':')) {
            const today = dayjs().format('YYYY-MM-DD');
            return dayjs(`${today} ${timeStr}`).format('HH:mm');
        }
        return null;
    };
    return (
        <FormContainer
            title="ICS 209 - Incident Status Summary Preview"
            className="max-w-2xl mx-auto p-4 mb-8 bg-white rounded shadow-lg"
        >
            {!isTobeApproved && (
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-[#FF700A] hover:bg-[#FFA05C] text-white font-semibold py-2 px-6 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2"
                        onClick={handleExportButtonClick}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Export to Word
                    </button>
                </div>
            )}
            <div className="header-section">
                {error && <div className="text-red-500">{error}</div>}
                <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                    <TableBody>
                        {/* Baris Pertama - Section 1 & 2 */}
                        <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                            <TableCell sx={{ padding: '1rem' }}>
                                <strong>1. Incident Name</strong>
                                <div
                                    className="border border-gray-300"
                                    style={{ height: '100px', marginTop: '10px', padding: '1rem' }}
                                >
                                    {fetchedIncident?.name}
                                </div>
                            </TableCell>
                            <TableCell sx={{ padding: '1rem' }}>
                                <strong>2. Incident No</strong>
                                <div
                                    className="border border-gray-300"
                                    style={{ height: '100px', marginTop: '10px', padding: '1rem' }}
                                >
                                    {fetchedIncident?.no}
                                </div>
                            </TableCell>
                        </TableRow>

                        {/* Baris Kedua - Section 3 & 4+5 */}
                        <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                            <TableCell sx={{ padding: '1rem' }}>
                                <strong>3. Location of Incident</strong>
                                <div
                                    className="border border-gray-300"
                                    style={{ height: '100px', marginTop: '10px', padding: '1rem' }}
                                >
                                    {fetchedIncident?.location}
                                </div>
                            </TableCell>

                            {/* Date/Time + Time Zone */}
                            <TableCell sx={{ padding: '1rem' }}>
                                <div className='flex flex-row'>
                                    <div
                                        className="w-1/2 flex flex-col"
                                    >
                                        <strong>4. Date & Time of Incident</strong>
                                        <div
                                            className="border border-gray-300 flex flex-col"
                                            style={{ height: '100px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {fetchedIncident?.date_incident} | {parseTimeIncident(fetchedIncident?.time_incident) || '-'}
                                        </div>
                                    </div>
                                    <div
                                        className="w-1/2 flex flex-col"
                                    >
                                        <strong>5. Time Zone</strong>
                                        <div
                                            className="border border-gray-300 flex flex-col"
                                            style={{ height: '100px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {fetchedIncident?.timezone}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>

                        {/* Baris Ketiga - Section 6 dan 7 */}
                        <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                            <TableCell sx={{ padding: '1rem' }}>
                                <strong>6. Brief Description of Incident</strong>
                                <div
                                    className="border border-gray-300"
                                    style={{ height: '100px', marginTop: '10px', padding: '1rem' }}
                                >
                                    {fetchedIncident?.description}
                                </div>
                            </TableCell>

                            {/* Operational Period */}
                            <TableCell sx={{ padding: '1rem' }}>
                                <strong>7. Operational Period</strong>
                                <div className='flex flex-row'>
                                    <div
                                        className="border border-gray-300 w-1/2"
                                        style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        <strong>Date From:</strong>
                                        <span className='ml-2'>{fetchedPeriod?.date_from}</span>
                                    </div>
                                    <div
                                        className="border border-gray-300 w-1/2"
                                        style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        <strong>Date To:</strong>
                                        <span className='ml-2'>{fetchedPeriod?.date_to}</span>
                                    </div>
                                </div>
                                <div className='flex flex-row'>
                                    <div
                                        className="border border-gray-300 w-1/2"
                                        style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        <strong>Time From:</strong>
                                        <span className='ml-2'>{fetchedPeriod?.time_from}</span>
                                    </div>
                                    <div
                                        className="border border-gray-300 w-1/2"
                                        style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        <strong>Time To:</strong>
                                        <span className='ml-2'>{fetchedPeriod?.time_to}</span>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <div className="mt-4 flex flex-row">
                    <button type='button' className={`px-4 py-2 ${activeTab === 1 ? 'bg-gray-300' : 'bg-white'} border`} onClick={() => handleTabChange(1)}>Tab 1</button>
                    <button type='button' className={`px-4 py-2 ${activeTab === 2 ? 'bg-gray-300' : 'bg-white'} border`} onClick={() => handleTabChange(2)}>Tab 2</button>
                    <button type='button' className={`px-4 py-2 ${activeTab === 3 ? 'bg-gray-300' : 'bg-white'} border`} onClick={() => handleTabChange(3)}>Tab 3</button>
                </div>
                <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                    <TableBody>
                        {activeTab === 1 && (
                            <>
                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    <TableCell sx={{ padding: '1rem' }}>
                                        <strong>Report Version</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '100px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.report_version}
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{ padding: '1rem' }}>
                                        <strong>Report Number</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '100px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.report_number}
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{ padding: '1rem' }}>
                                        <strong>Incident Commander</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '100px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {ICData.name || ICData.find(
                                                (item) => item.id === formData.incident_commander_id
                                            )?.name || (
                                                    <span className="text-red-500">Not Found</span>
                                                )}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    <TableCell sx={{ padding: '1rem' }} colSpan={2}>
                                        <strong>Source of Incident</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '100px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.incident_source}
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{ padding: '1rem' }}>
                                        <strong>Controlled/Uncontrolled</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '100px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.is_source_ctrl ? 'Controlled' : 'Uncontrolled'}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    <TableCell sx={{ padding: '1rem' }} colSpan={2}>
                                        <strong>Materials Release</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '100px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.materials_release}
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{ padding: '1rem' }}>
                                        <strong>Controlled/Uncontrolled</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '100px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.is_material_ctrl ? 'Controlled' : 'Uncontrolled'}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    <TableCell sx={{ padding: '1rem' }} colSpan={3}>
                                        <strong>Status Response</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '100px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.response_status}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    {/* Operational Period */}
                                    <TableCell sx={{ padding: '1rem' }} colSpan={4}>
                                        <strong>Impact to Personnel</strong>
                                        {/* Accounted For */}
                                        <div className='flex flex-row'>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                {formData.is_acc ? '✓ ' : '✗ '}<strong>Accounted for</strong>
                                            </div>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                <strong>Number: </strong>{parseInt(formData?.acc_num, 10)}
                                            </div>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                {formData.is_acc_mustered ? '✓ ' : '✗ '}<strong>Mustered</strong>
                                            </div>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                {formData.is_acc_sheltered ? '✓ ' : '✗ '}<strong>Sheltered</strong>
                                            </div>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                {formData.is_acc_evacuated ? '✓ ' : '✗ '}<strong>Evacuated</strong>
                                            </div>
                                        </div>

                                        {/* Unaccounted For */}
                                        <div className='flex flex-row'>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                {formData.is_unacc ? '✓ ' : '✗ '}<strong>Unaccounted for</strong>
                                            </div>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                <strong>Number: </strong>{parseInt(formData?.unacc_num, 10) || 0}
                                            </div>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                <strong>Employee: </strong>{parseInt(formData?.unacc_emp, 10) || 0}
                                            </div>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                <strong>Contractor: </strong>{parseInt(formData?.unacc_con, 10) || 0}
                                            </div>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                <strong>Other: </strong>{parseInt(formData?.unacc_oth, 10) || 0}
                                            </div>
                                        </div>

                                        {/* Injured */}
                                        <div className='flex flex-row'>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                {formData.is_unacc ? '✓ ' : '✗ '}<strong>Injured</strong>
                                            </div>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                <strong>Number: </strong>{parseInt(formData?.inj_num, 10) || 0}
                                            </div>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                <strong>Employee: </strong>{parseInt(formData?.inj_emp, 10) || 0}
                                            </div>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                <strong>Contractor: </strong>{parseInt(formData?.inj_con, 10) || 0}
                                            </div>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                <strong>Other: </strong>{parseInt(formData?.inj_oth, 10) || 0}
                                            </div>
                                        </div>

                                        {/* Dead */}
                                        <div className='flex flex-row'>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                {formData.is_unacc ? '✓ ' : '✗ '}<strong>Dead</strong>
                                            </div>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                <strong>Number: </strong>{parseInt(formData?.dead_num, 10) || 0}
                                            </div>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                <strong>Employee: </strong>{parseInt(formData?.dead_emp, 10) || 0}
                                            </div>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                <strong>Contractor: </strong>{parseInt(formData?.dead_con, 10) || 0}
                                            </div>
                                            <div
                                                className="border border-gray-300 w-full"
                                                style={{ height: '50px', marginTop: '10px', padding: '1rem' }}
                                            >
                                                <strong>Other: </strong>{parseInt(formData?.dead_oth, 10) || 0}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* Impact on Environment */}
                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    <TableCell sx={{ padding: '1rem' }} colSpan={3}>
                                        <strong>Impact on Environment ➜</strong>
                                        <span className='ml-2'>{formData.env_impact}</span>
                                        <br />
                                        <br />
                                        <strong>Description Impact on Community</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.env_desc}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* Impact on Community */}
                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    <TableCell sx={{ padding: '1rem' }} colSpan={3}>
                                        <strong>Impact on Community ➜</strong>
                                        <span className='ml-2'>{formData.comm_impact}</span>
                                        <br />
                                        <br />
                                        <strong>Description Impact on Community</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.comm_desc}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* Impact on Operations */}
                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    <TableCell sx={{ padding: '1rem' }} colSpan={3}>
                                        <strong>Impact on Operations ➜</strong>
                                        <span className='ml-2'>{formData.ops_impact}</span>
                                        <br />
                                        <br />
                                        <strong>Description Impact on Operations</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.ops_desc}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </>
                        )}
                        {activeTab === 2 && (
                            <>
                                {/* Significant Event for the Time Period Reported */}
                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    <TableCell sx={{ padding: '1rem' }} colSpan={8}>
                                        <strong>Significant Event for the Time Period Reported</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.events_period}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* Incident Objectives for Next Operational Period */}
                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    <TableCell sx={{ padding: '1rem' }} colSpan={8}>
                                        <strong>Incident Objectives for Next Operational Period</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.obj_next_period}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* Planned Action for Next Operational Period */}
                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    <TableCell sx={{ padding: '1rem' }} colSpan={8}>
                                        <strong>Planned Action for Next Operational Period</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.actions_next_period}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* Significant Resources Needed */}
                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    <TableCell sx={{ padding: '1rem' }} colSpan={8}>
                                        <strong>Significant Resources Needed</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.res_needed}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    {/* Anticipated Incident Management Completion Date */}
                                    <TableCell sx={{ padding: '1rem' }} colSpan={4}>
                                        <strong>Anticipated Incident Management Completion Date</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '70px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.est_completion_date}
                                        </div>
                                    </TableCell>

                                    {/* Estimated Incident Costs to Date */}
                                    <TableCell sx={{ padding: '1rem' }} colSpan={4}>
                                        <strong>Estimated Incident Costs to Date</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '70px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formatCurrency(formData.cost_to_date)}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    {/* Projected Significant Resource Demobilization Start Date */}
                                    <TableCell sx={{ padding: '1rem' }} colSpan={4}>
                                        <strong>Projected Significant Resource Demobilization Start Date</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '70px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.est_res_democ_start}
                                        </div>
                                    </TableCell>

                                    {/* Projected Final Incident Cost Estimate */}
                                    <TableCell sx={{ padding: '1rem' }} colSpan={4}>
                                        <strong>Projected Final Incident Cost Estimate</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '70px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formatCurrency(formData.final_cost_est)}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </>
                        )}
                        {activeTab === 3 && (
                            <>
                                {/* Contact with/from Government Agencies */}
                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    <TableCell sx={{ padding: '1rem' }}>
                                        <strong>Contact with/from Government Agencies</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.gov_contact}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* Contact with/from Media */}
                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    <TableCell sx={{ padding: '1rem' }}>
                                        <strong>Contact with/from Media</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.media_contact}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* Contact with/from Next-of-Kin */}
                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    <TableCell sx={{ padding: '1rem' }}>
                                        <strong>Contact with/from Next-of-Kin</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.kin_contact}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* Contact with/from Shareholders */}
                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    <TableCell sx={{ padding: '1rem' }}>
                                        <strong>Contact with/from Shareholders</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.shareholder_contact}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* Contact with/from NGOs */}
                                <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                    <TableCell sx={{ padding: '1rem' }}>
                                        <strong>Contact with/from NGOs</strong>
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            {formData.ngo_contact}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </>
                        )}

                        {/* Prepared by */}
                        <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                            <TableCell colSpan={8} sx={{ padding: '1rem' }}>
                                <strong>Prepared by:</strong>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div style={{ marginLeft: '5rem' }}>
                                        {SULeaderData?.name || 'Unknown'}
                                    </div>
                                    <div style={{ marginLeft: '5rem' }}>
                                        Position: Planning Section Chief
                                    </div>
                                    <div style={{ marginLeft: '5rem' }}>
                                        Signature: {isPrepared ? '✓' : '✗'}
                                    </div>
                                    <div style={{ marginLeft: '5rem' }}>
                                        Prepared Date: {preparedDate}
                                    </div>
                                    <div style={{ marginLeft: '5rem' }}>
                                        Prepared Time: {preparedTime}
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>

                        {!isTobeApproved && (
                            // {/* Approved by */ }
                            < TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={8} sx={{ padding: '1rem' }}>
                                    <strong>Approved by:</strong>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ marginLeft: '5rem' }}>
                                            {ICData?.name || 'Unknown'}
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            Position: Incident Commander
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            Signature: {approvalData.is_approved ? '✓' : '✗'}
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            Approved Date: {approvalData.date_approved}
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            Approved Time: {approvalData.time_approved}
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                        {isTobeApproved && (
                            <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={8} sx={{ padding: '1rem' }}>
                                    <strong>Approved by:</strong>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ marginLeft: '5rem' }}>
                                            <Select
                                                name='incident_commander_id'
                                                className="flex-1 block rounded-md px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                                value={formData.incident_commander_id || ''}
                                                onChange={(e) => setApprovalData(prev => ({
                                                    ...prev,
                                                    incident_commander_id: e.target.value
                                                }))}
                                                inputProps={
                                                    {
                                                        name: 'incident_commander_id'
                                                    }
                                                }
                                                variant="standard"
                                                label="Incident Commander"
                                                displayEmpty
                                                disabled
                                            >
                                                <MenuItem value="" disabled>
                                                    <em>Select Incident Commander</em>
                                                </MenuItem>
                                                {ICData.map(commander => (
                                                    <MenuItem key={commander.id} value={commander.id}>
                                                        {commander.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>

                                        <div style={{ marginLeft: '5rem' }}>
                                            Position: Incident Commander
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            <FormControl>
                                                {/* Checkbox Signature */}
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            name="is_approved"
                                                            checked={approvalData.is_approved}
                                                            onChange={(e) => setApprovalData(prev => ({
                                                                ...prev,
                                                                is_approved: e.target.checked
                                                            }))}
                                                            required
                                                        />
                                                    }
                                                    label="Signature"
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
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
                    </TableBody>
                </Table>
            </div >
            {isTobeApproved && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={!approvalData.is_approved}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit Approval
                    </button>
                </div>
            )}
        </FormContainer >
    )
}
