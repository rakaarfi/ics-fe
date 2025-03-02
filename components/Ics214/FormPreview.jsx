'use client';

import FormContainer from '../FormContainer'
import React, { useState } from 'react';
import { ButtonSaveChanges, ButtonSubmit } from '../ButtonComponents';
import dayjs from 'dayjs';
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function FormPreview({
    fetchedIncident,
    fetchedPeriod,
    formData,
    isPrepared,
    preparedDate,
    preparedTime,
    handleExportButtonClick,
}) {
    return (
        <div>
            <FormContainer
                title="ICS 214 - Activity Log Preview"
                className="max-w-2xl mx-auto p-4 mb-8 bg-white rounded shadow-lg"
            >
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
                {/* Header Section (Section 1, 2) */}
                <div className="header-section">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell sx={{ padding: '1rem' }}>
                                    <strong>1. Incident Name:</strong>
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '70px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {fetchedIncident?.name || 'Unknown Incident'}
                                    </div>

                                </TableCell>
                                <TableCell sx={{ padding: '1rem' }}>
                                    <strong>2. Operational Period:</strong>
                                    <br />
                                    {fetchedPeriod ? (
                                        <div
                                            className="border border-gray-300"
                                            style={{ height: '70px', marginTop: '10px', padding: '1rem' }}
                                        >
                                            <span className="mr-4">Date From: {fetchedPeriod.date_from}</span>
                                            <span className="mr-4">Date To: {fetchedPeriod.date_to}</span>
                                            <br />
                                            <span className="mr-4">Time From: {fetchedPeriod.time_from}</span>
                                            <span>Time To: {fetchedPeriod.time_to}</span>
                                        </div>
                                    ) : (
                                        'Unknown Operational Period'
                                    )}

                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 3 */}
                <div className="section-10">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <Table sx={{ marginTop: '10px', border: '1px solid #ccc' }}>
                                        {/* Table Head */}
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Position</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Home Agency (and Unit)</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        {/* Table Body */}
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                                    {/* {formData.name} */}
                                                </TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                                    {/* {formData.position} */}
                                                </TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>
                                                    {/* {formData.home_agency} */}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 3 */}
                <div className="section-10">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>3. Resources Assigned</strong>
                                    <br />
                                    <Table sx={{ marginTop: '10px', border: '1px solid #ccc' }}>
                                        {/* Table Head */}
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Position</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Home Agency (and Unit)</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        {/* Table Body */}
                                        {/* <TableBody>
                                            {formData.resourcesAssigned && formData.resourcesAssigned.length > 0 ? (
                                                formData.resourcesAssigned.map((resource, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{resource.name}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{resource.position}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{resource.home_agency}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} sx={{ border: '1px solid #ccc', textAlign: 'center', height: '24px' }}>
                                                        No data available
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody> */}
                                    </Table>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 4 */}
                <div className="section-10">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>4. Activity Log</strong>
                                    <br />
                                    <Table sx={{ marginTop: '10px', border: '1px solid #ccc' }}>
                                        {/* Table Head */}
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Time</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Notable Activity</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        {/* Table Body */}
                                        {/* <TableBody>
                                            {formData.activityLog && formData.activityLog.length > 0 ? (
                                                formData.activityLog.map((activity, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{activity.date_activity}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{activity.time_activity}</TableCell>
                                                        <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}>{activity.notable_activity}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} sx={{ border: '1px solid #ccc', textAlign: 'center', height: '24px' }}>
                                                        No data available
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody> */}
                                    </Table>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 8 */}
                <div className="footer-section">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>8. Prepared by:</strong>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ marginLeft: '5rem' }}>
                                            {formData?.name || 'Unknown'}
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            Signature: {formData?.is_prepared ? '✓' : '✗'}
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            {/* Prepared Date: {preparedDate || 'Unknown'} */}
                                        </div>
                                        <div style={{ marginLeft: '5rem' }}>
                                            {/* Prepared Time: {preparedTime || 'Unknown'} */}
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </FormContainer>
        </div>
    )
}
