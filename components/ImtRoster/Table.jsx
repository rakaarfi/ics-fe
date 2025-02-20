'use client';

import React, { useEffect, useState } from "react";
import { fetchData, readTableById } from "@/utils/api";
import { getIncidentTeamData } from "./tableFields";
// import pdfMake from 'pdfmake/build/pdfmake';
import './print.css'; // Import print stylesheet

// pdfMake.fonts = {
//     Roboto: {
//         normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
//         bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
//         italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
//         bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
//     }
// };

const Table = () => {
    const [data, setData] = useState({});
    const [roster, setRoster] = useState([]);
    const [selectedRoster, setSelectedRoster] = useState(null);
    const incidentTeamData = getIncidentTeamData(data);
    // const [showPreview, setShowPreview] = useState(false);
    // const [pdfSrc, setPdfSrc] = useState('');

    useEffect(() => {
        const fetchRosterData = async () => {
            try {
                const initialRoster = await fetchData('roster');
                setRoster(initialRoster);
            } catch (err) {
                console.error("Error fetching roster data:", err.message);
            }
        };

        fetchRosterData();
    }, []);

    const getData = async (selectedId) => {
        setSelectedRoster(roster.find((roster) => roster.id === selectedId));
        try {
            const response = await readTableById({ routeUrl: 'roster-table', id: selectedId });
            setData(response);
        } catch (err) {
            console.error("Error fetching data:", err.message);
        }
    };

    const handleRosterClick = (rosterId) => {
        getData(rosterId);
    };

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // const handlePrint = () => {
    //     window.print();
    // };

    // const createDocDefinition = () => ({
    //     content: [
    //         { text: 'Incident Management Team Roster', style: 'header' },
    //         { text: formattedDate, style: 'subheader' },
    //         {
    //             table: {
    //                 headerRows: 1,
    //                 widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
    //                 body: [
    //                     ['No.', 'Position Name', 'IMT Member Name', 'Office', 'Cellular'],
    //                     ...incidentTeamData.map(row => [
    //                         row.no || '-',
    //                         row.position || '-',
    //                         row.name || '-',
    //                         row.office || '-',
    //                         row.cell || '-'
    //                     ])
    //                 ]
    //             }
    //         }
    //     ],
    //     styles: {
    //         header: {
    //             fontSize: 18,
    //             bold: true,
    //             margin: [0, 0, 0, 10]
    //         },
    //         subheader: {
    //             fontSize: 12,
    //             italic: true,
    //             margin: [0, 5, 0, 15]
    //         }
    //     }
    // });

    // const previewPDF = () => {
    //     if (incidentTeamData.length === 0) {
    //         alert('No data to preview.');
    //         return;
    //     }
    //     pdfMake.createPdf(createDocDefinition()).getBlob((blob) => {
    //         const url = URL.createObjectURL(blob);
    //         setPdfSrc(url);
    //         setShowPreview(true);
    //     });
    // };

    // const downloadPDF = () => {
    //     if (incidentTeamData.length === 0) {
    //         alert('No data to download.');
    //         return;
    //     }
    //     pdfMake.createPdf(createDocDefinition()).download('IncidentManagementTeamRoster.pdf');
    // };

    return (
        <div className="p-8 bg-gray-100">
            <div className="bg-gray-700 text-white p-4 rounded-t-lg flex justify-between items-center">
                <h1 className="text-xl font-bold">Incident Management Team Roster</h1>
            </div>
            <div className="overflow-x-auto">
                <div className="flex flex-col mb-4">
                    <select
                        value={selectedRoster ? selectedRoster.id : ""}
                        onChange={(e) => handleRosterClick(Number(e.target.value))}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8]"
                    >
                        <option value="" disabled>
                            Select Roster
                        </option>
                        {roster.map((roster) => (
                            <option key={roster.id} value={roster.id}>
                                {roster.date_from} - {roster.date_to}
                            </option>
                        ))}
                    </select>
                    <p className="w-full px-3 py-1.5 text-base text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8]">
                        Remark: {selectedRoster ? selectedRoster.remark : ""}
                    </p>
                </div>
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-500 text-white">
                            <th className="border border-gray-300 px-2 py-1" rowSpan={2}>No.</th>
                            <th className="border border-gray-300 px-2 py-1" rowSpan={2}>Position Name</th>
                            <th className="border border-gray-300 px-2 py-1" rowSpan={2}>IMT Member Name</th>
                            <th className="border border-gray-300 px-2 py-1" rowSpan={1} colSpan={2}>Phone No</th>
                        </tr>
                        <tr className="bg-gray-500 text-white">
                            <th className="border border-gray-300 px-2 py-1" rowSpan={1} colSpan={1}>Office</th>
                            <th className="border border-gray-300 px-2 py-1" rowSpan={1} colSpan={1}>Cellular</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidentTeamData.map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                <td className="border border-gray-300 px-2 py-1 text-center">{row.no || '-'}</td>
                                <td className="border border-gray-300 px-2 py-1">{row.position || '-'}</td>
                                <td className="border border-gray-300 px-2 py-1">{row.name || '-'}</td>
                                <td className="border border-gray-300 px-2 py-1">{row.office || '-'}</td>
                                <td className="border border-gray-300 px-2 py-1">{row.cell || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4 text-sm text-gray-500 flex justify-between">
                    <div>{formattedDate}</div>
                </div>
            </div>
            <div className="mt-4 flex space-x-2">
                {/* <button onClick={previewPDF} className="bg-blue-500 text-white px-4 py-2">Preview PDF</button>
                <button onClick={downloadPDF} className="bg-blue-500 text-white px-4 py-2">Download PDF</button> */}
                {/* <button onClick={handlePrint} className="bg-blue-500 text-white px-4 py-2">Print Table</button> */}
            </div>
            {/* {showPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded">
                        <button onClick={() => {
                            URL.revokeObjectURL(pdfSrc);
                            setShowPreview(false);
                        }} className="float-right">X</button>
                        <iframe src={pdfSrc} width="1000px" height="800px"></iframe>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default Table;