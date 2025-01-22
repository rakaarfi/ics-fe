import React from "react";

export default function TableHeader() {
    const headers = [
        "No",
        "Incident Name",
        "Date Initiated",
        "Time Initiated",
        "Map Sketch",
        "Situation Summary",
        "Objectives",
    ];
    const headerActions = "Actions";

    return (
        <thead>
            <tr>
                {headers.map((header) => (
                    <th key={header} className="border border-gray-300 px-4 py-2">
                        {header}
                    </th>
                ))}
                <th className="border border-gray-300 px-4 py-2" colSpan={2}>
                    {headerActions}
                </th>
            </tr>
        </thead>
    );
}