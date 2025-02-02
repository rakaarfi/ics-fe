import React from "react";
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

export default function TableHeader({ sortConfig, requestSort }) {
    const headers = [
        { key: 'id', label: 'No' },
        { key: 'incident_name', label: 'Incident Name' },
        { key: 'operational_period_range', label: 'Operational Period' },
        { key: 'medical_aid_station_name', label: 'Medical Aid Station' },
        { key: 'transportation_name', label: 'Transportation' },
        { key: 'hospital_name', label: 'Hospital' },
        { key: 'special_medical_procedures', label: 'Special Medical Procedures' },
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