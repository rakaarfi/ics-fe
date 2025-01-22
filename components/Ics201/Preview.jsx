'use client';

import React, { useRef } from 'react';
import FormContainer from '../FormContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { TableHead } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Preview() {
    const componentRef = useRef();

    const handleExportPDF = async () => {
        const headerSection = document.querySelector('.header-section'); // Section 1, 2, 3
        const footerSection = document.querySelector('.footer-section'); // Section 6
        const section4 = document.querySelector('.section-4'); // Section 4
        const section5 = document.querySelector('.section-5'); // Section 5
        const section7 = document.querySelector('.section-7'); // Section 7
        const section8 = document.querySelector('.section-8'); // Section 8
        const section9 = document.querySelector('.section-9'); // Section 9
        const section10 = document.querySelector('.section-10'); // Section 10

        const pdf = new jsPDF('p', 'mm', 'a4');

        // Fungsi untuk menambahkan header dan footer ke halaman
        const addHeaderAndFooter = async (pdf) => {
            // Render header
            const headerCanvas = await html2canvas(headerSection);
            const headerImgData = headerCanvas.toDataURL('image/png');
            const headerImgHeight = (headerCanvas.height * 210) / headerCanvas.width;

            // Render footer
            const footerCanvas = await html2canvas(footerSection);
            const footerImgData = footerCanvas.toDataURL('image/png');
            const footerImgHeight = (footerCanvas.height * 210) / footerCanvas.width;

            // Tambahkan header ke halaman
            pdf.addImage(headerImgData, 'PNG', 0, 0, 210, headerImgHeight);

            // Tambahkan footer ke halaman
            pdf.addImage(footerImgData, 'PNG', 0, 297 - footerImgHeight, 210, footerImgHeight);

            return { headerImgHeight, footerImgHeight };
        };

        // Fungsi untuk menambahkan konten ke halaman
        const addContentToPage = async (pdf, section, yOffset) => {
            const canvas = await html2canvas(section);
            const imgData = canvas.toDataURL('image/png');
            const imgHeight = (canvas.height * 210) / canvas.width;

            // Tambahkan konten ke halaman
            pdf.addImage(imgData, 'PNG', 0, yOffset, 210, imgHeight);

            return imgHeight;
        };

        // Halaman 1: Section 4 dan 5
        const { headerImgHeight, footerImgHeight } = await addHeaderAndFooter(pdf);
        let yOffset = headerImgHeight;

        // Tambahkan Section 4
        const section4Height = await addContentToPage(pdf, section4, yOffset);
        yOffset += section4Height;

        // Tambahkan Section 5
        await addContentToPage(pdf, section5, yOffset);

        // Halaman 2: Section 7 dan 8
        pdf.addPage();
        await addHeaderAndFooter(pdf);
        yOffset = headerImgHeight;

        // Tambahkan Section 7
        const section7Height = await addContentToPage(pdf, section7, yOffset);
        yOffset += section7Height;

        // Tambahkan Section 8
        await addContentToPage(pdf, section8, yOffset);

        // Halaman 3: Section 9
        pdf.addPage();
        await addHeaderAndFooter(pdf);
        yOffset = headerImgHeight;

        // Tambahkan Section 9
        await addContentToPage(pdf, section9, yOffset);

        // Halaman 4: Section 10
        pdf.addPage();
        await addHeaderAndFooter(pdf);
        yOffset = headerImgHeight;

        // Tambahkan Section 10
        await addContentToPage(pdf, section10, yOffset);

        // Simpan PDF
        pdf.save('preview.pdf');
    };

    return (
        <div>
            <button
                style={{ marginBottom: '20px' }}
                onClick={handleExportPDF}
            >
                Export to PDF
            </button>
            <FormContainer
                title="Preview"
                className="max-w-2xl mx-auto p-4 mb-8 bg-white rounded shadow-lg"
                ref={componentRef}
            >
                {/* Header Section (Section 1, 2, 3) */}
                <div className="header-section">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell sx={{ padding: '1rem' }}>
                                    <strong>1. Incident Name:</strong>
                                </TableCell>
                                <TableCell sx={{ padding: '1rem' }}>
                                    <strong>2. Incident Number:</strong>
                                </TableCell>
                                <TableCell sx={{ padding: '1rem' }}>
                                    <strong>3. Date/Time Initiated:</strong><br />
                                    Date: ______ Time: ______
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 4 */}
                <div className="section-4">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>4. Map/Sketch</strong> (include sketch, showing the total area of operations, the incident site/area, impacted and threatened areas, overflight results, trajectories, impacted shorelines, or other graphics depicting situational status and resource assignment):
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert map or sketch image here */}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 5 */}
                <div className="section-5">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>5. Situation Summary and Health and Safety Briefing</strong> (for briefings or transfer of command): Recognize potential incident Health and Safety Hazards and develop necessary measures (remove hazard, provide personal protective equipment, warn people of the hazard) to protect responders from those hazards.
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert map or sketch image here */}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 7 */}
                <div className="section-7">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>7. Current and Planned Objectives</strong>
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert map or sketch image here */}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 8 */}
                <div className="section-8">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>8. Current and Planned Actions, Strategies, and Tactics:</strong>
                                    <br />
                                    <Table sx={{ marginTop: '10px', border: '1px solid #ccc' }}>
                                        {/* Table Head */}
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Time</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        {/* Table Body */}
                                        <TableBody>
                                            {[...Array(10)].map((_, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}></TableCell>
                                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 9 */}
                <div className="section-9">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>9. Current Organization</strong>
                                    <br />
                                    <div
                                        className="border border-gray-300"
                                        style={{ height: '200px', marginTop: '10px', padding: '1rem' }}
                                    >
                                        {/* Insert map or sketch image here */}
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Section 10 */}
                <div className="section-10">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '10rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>10. Resource Summary:</strong>
                                    <br />
                                    <Table sx={{ marginTop: '10px', border: '1px solid #ccc' }}>
                                        {/* Table Head */}
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Resource</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Resource Identifier</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date/Time Ordered</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ETA</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Arrived</TableCell>
                                                <TableCell sx={{ border: '1px solid #ccc', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Notes(location/assignment/status)</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        {/* Table Body */}
                                        <TableBody>
                                            {[...Array(10)].map((_, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}></TableCell>
                                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}></TableCell>
                                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}></TableCell>
                                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}></TableCell>
                                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}></TableCell>
                                                    <TableCell sx={{ border: '1px solid #ccc', height: '24px' }}></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Footer Section (Section 6) */}
                <div className="footer-section">
                    <Table sx={{ width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                            <TableRow sx={{ height: '3rem', backgroundColor: '#e5e5e5', border: '4px solid black' }}>
                                <TableCell colSpan={3} sx={{ padding: '1rem' }}>
                                    <strong>6. Prepared by:</strong>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ width: '150px', marginLeft: '1rem' }}>
                                            <TextField label="Name" variant="standard" />
                                        </div>
                                        <div style={{ width: '150px', marginLeft: '1rem' }}>
                                            <TextField label="Position/Title" variant="standard" />
                                        </div>
                                        <div style={{ width: '150px', marginLeft: '1rem' }}>
                                            <TextField label="Signature" variant="standard" />
                                        </div>
                                        <div style={{ width: '150px', marginLeft: '1rem' }}>
                                            <TextField label="Date/Time" variant="standard" />
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </FormContainer>
        </div>
    );
}