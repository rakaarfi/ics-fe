'use client';

import React from 'react';

const PeriodRemark = ({ formData, handleChange, initialData = {} }) => {
    return (
        <div className="flex flex-col gap-4 mb-6">
            <div>
                <label htmlFor="date_from" className="block font-bold mb-2">
                    Period, from :
                </label>
                <div className="flex gap-2">
                    <input
                        type="date"
                        name="date_from"
                        value={formData.date_from || initialData.date_from || ""}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border rounded-md"
                    />
                    <input
                        type="date"
                        name="date_to"
                        value={formData.date_to || initialData.date_to || ""}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border rounded-md"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="remark" className="block font-bold mb-2">
                    Remark
                </label>
                <textarea
                    id="remark"
                    name="remark"
                    value={formData.remark || initialData.remark || ""}
                    onChange={handleChange}
                    rows="1"
                    className="block w-full px-3 py-2 border rounded-md"
                />
            </div>
        </div>
    );
};

export default PeriodRemark;