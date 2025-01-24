import React from "react";
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

export default function TableHeader({ sortConfig, requestSort }) {
    const headers = [
        { key: 'id', label: 'No' },
        { key: 'incident', label: 'Incident Name' },
        { key: 'date_initiated', label: 'Date Initiated' },
        { key: 'time_initiated', label: 'Time Initiated' },
        { key: 'situation_summary', label: 'Situation Summary' },
        { key: 'objectives', label: 'Objectives' },
        { key: 'approved', label: 'Is Approved' },
    ];
    const headerActions = "Actions";

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <FaSort className="ml-1" />;
        return sortConfig.direction === 'asc'
            ? <FaSortUp className="ml-1" />
            : <FaSortDown className="ml-1" />;
    };

    return (
        <thead>
            <tr>
                {headers.map((header) => (
                    <th
                        key={header.key}
                        className="border border-gray-300 px-4 py-2"
                        onClick={() => requestSort(header.key)}>
                        <div className="flex items-center">
                            {header.label}
                            {getSortIcon(header.key)}
                        </div>
                    </th>
                ))}
                <th className="border border-gray-300 px-4 py-2" colSpan={2}>
                    {headerActions}
                </th>
            </tr>
        </thead>
    );
}