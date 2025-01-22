'use client';

import React from 'react';

const SectionSelect = ({
    items,
    dynamicOptions,
    formData,
    handleChange,
    initialData = {},
    boldItems,
}) => {
    const findIdByName = (name, options = []) => {
        if (!Array.isArray(options)) {
            return "";
        }
        const foundOption = options.find(option => option.name === name);
        return foundOption ? foundOption.id : "";
    };

    return (
        <div className="flex flex-col gap-2">
            {items.map((item) => (
                <div key={item.name}>
                    <div className='flex flex-row whitespace-nowrap w-full'>
                        <div className={`w-3/4 block px-3 py-2 border rounded-md bg-gray-100 ${boldItems.includes(item.label) ? "font-bold" : ""}`}>
                            {item.label}
                        </div>
                        <select
                            className={`block  w-full px-3 py-2 border rounded-md ${boldItems.includes(item.label) ? "font-bold" : ""
                                }`}
                            name={item.name}
                            value={
                                formData[item.name] ||
                                (initialData && item.defaultName ? findIdByName?.(initialData[item.defaultName], dynamicOptions[item.name]) : "") ||
                                ""
                            }
                            onChange={handleChange}
                        >
                            <option value="" disabled>
                                Select...
                            </option>
                            {(dynamicOptions[item.name] || item.options).map((option) =>
                                typeof option === "string" ? (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ) : (
                                    <option key={option.id} value={option.id}>
                                        {option.name || option.room || option.label}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SectionSelect;