'use client'

import React from "react";
import useFetchDynamicOptions from "../ImtRoster/useFetchDynamicOptions";
import { boldItems, firstSection, secondSection, thirdSection, planningSection, logisticSection, financeSection } from "./inputChartFields";


const Chart = ({ chartData, onChange, initialData = {} }) => {

    const { dynamicOptions, error } = useFetchDynamicOptions();

    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...chartData, [name]: value });
    };

    const findIdByName = (name, options = []) => {
        if (!Array.isArray(options)) {
            return "";
        }
        const foundOption = options.find(option => option.name === name);
        return foundOption ? foundOption.id : "";
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="container mx-auto text-center pt-5">
                <div className="items-center justify-center flex">
                    <div className="text-center">
                        <div className="flex flex-col justify-center items-center">
                            <div className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                {firstSection.map((item) => (
                                    <div key={item.name}>
                                        <h2 className="font-bold">{item.label}</h2>
                                        <select
                                            className={`block  w-full px-3 py-2 border rounded-md ${boldItems.includes(item.label) ? "font-bold" : ""
                                                }`}
                                            name={item.name}
                                            value={
                                                chartData[item.name] ||
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
                                ))}
                            </div>
                        </div>
                        <ul className="flex flex-row mt-10 justify-center">
                            <div className="-mt-10 border-l-2 absolute h-10 border-gray-400"></div>
                            <li className="relative p-6">
                                <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                    style={{ left: '130px', right: '50%' }}></div>
                                <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                    style={{ left: '50%', right: '135px' }}></div>
                                <div className="flex justify-center items-center"
                                    style={{ left: '0%', right: '100%' }}>
                                    <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                        style={{ left: '9%', right: '0px' }}></div>
                                    <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                        style={{ left: '26%', right: '0px' }}></div>
                                    <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                        style={{ left: '42%', right: '0px' }}></div>
                                    <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                        style={{ left: '58%', right: '0px' }}></div>
                                    <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                        style={{ left: '74%', right: '0px' }}></div>
                                    <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                        style={{ left: '90.5%', right: '0px' }}></div>
                                    <div className="text-start">
                                        <div className="flex flex-row justify-start items-start gap-5">
                                            {secondSection.map((item) => (
                                                <div key={item.name} className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                    <h2 className="font-bold">{item.label}</h2>
                                                    <select
                                                        className={`block  w-full px-3 py-2 border rounded-md ${boldItems.includes(item.label) ? "font-bold" : ""
                                                            }`}
                                                        name={item.name}
                                                        value={
                                                            chartData[item.name] ||
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
                                            ))}
                                        </div>
                                        <ul className="flex flex-row mt-10 justify-center">
                                            <div className="-mt-10 border-l-2 absolute h-10 border-gray-400"
                                                style={{ left: '42%', right: '0px' }}></div>
                                            <li className="relative p-6">
                                                <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                    style={{ left: '126px', right: '50%' }}></div>
                                                <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                    style={{ left: '50%', right: '126px' }}></div>
                                                <div className="flex justify-center items-center">
                                                    <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                                        style={{ left: '10.5%', right: '0px' }}></div>
                                                    <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                                        style={{ left: '37%', right: '0px' }}></div>
                                                    <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                                        style={{ left: '63%', right: '0px' }}></div>
                                                    <div className="border-l-2 absolute h-6 border-gray-400 top-0"
                                                        style={{ left: '89.5%', right: '0px' }}></div>
                                                    <div className="text-center">
                                                        <div className="flex flex-row justify-start items-start gap-[100px]">
                                                            {thirdSection.map((item) => (
                                                                <div key={item.name} className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                    <h2 className="font-bold">{item.label}</h2>
                                                                    <select
                                                                        className={`block  w-full px-3 py-2 border rounded-md ${boldItems.includes(item.label) ? "font-bold" : ""
                                                                            }`}
                                                                        name={item.name}
                                                                        value={
                                                                            chartData[item.name] ||
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
                                                            ))}
                                                        </div>
                                                        <ul className="flex flex-row justify-center">


                                                            <div className="-mt-10 border-l-2 absolute h-[515px] border-gray-400"
                                                                style={{ left: '37%', right: '0px', top: '147px' }}></div>
                                                            <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                style={{ left: '395px', right: '760px', top: '200px' }}></div>
                                                            <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                style={{ left: '395px', right: '760px', top: '285px' }}></div>
                                                            <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                style={{ left: '395px', right: '760px', top: '370px' }}></div>
                                                            <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                style={{ left: '395px', right: '760px', top: '455px' }}></div>
                                                            <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                style={{ left: '395px', right: '760px', top: '540px' }}></div>
                                                            <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                style={{ left: '395px', right: '760px', top: '620px' }}></div>

                                                            <div className="-mt-10 border-l-2 absolute h-[515px] border-gray-400"
                                                                style={{ left: '63%', right: '0px', top: '147px' }}></div>
                                                            <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                style={{ left: '720px', right: '445px', top: '200px' }}></div>
                                                            <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                style={{ left: '720px', right: '445px', top: '285px' }}></div>
                                                            <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                style={{ left: '720px', right: '445px', top: '370px' }}></div>
                                                            <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                style={{ left: '720px', right: '445px', top: '455px' }}></div>
                                                            <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                style={{ left: '720px', right: '445px', top: '540px' }}></div>
                                                            <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                style={{ left: '720px', right: '445px', top: '620px' }}></div>

                                                            <div className="-mt-10 border-l-2 absolute h-[370px] border-gray-400"
                                                                style={{ left: '90%', right: '0px', top: '147px' }}></div>
                                                            <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                style={{ left: '1055px', right: '120px', top: '200px' }}></div>
                                                            <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                style={{ left: '1055px', right: '120px', top: '295px' }}></div>
                                                            <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                style={{ left: '1055px', right: '120px', top: '380px' }}></div>
                                                            <div className="border-t-2 absolute h-8 border-gray-400 top-0"
                                                                style={{ left: '1055px', right: '120px', top: '475px' }}></div>

                                                            <li className="relative py-6" style={{ left: '-100px', right: '0px' }}>
                                                                <div className="relative flex justify-center">
                                                                    <div className="text-center">
                                                                        <ul className="flex flex-row justify-center">
                                                                            <li className="relative py-6">
                                                                                <div className="relative flex justify-center">
                                                                                    <div className="text-center">
                                                                                        <div className="flex flex-col justify-center items-center">
                                                                                            {planningSection.map((item) => (
                                                                                                <div key={item.name} className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                    <h2 className="font-bold">{item.label}</h2>
                                                                                                    <select
                                                                                                        className={`block  w-full px-3 py-2 border rounded-md ${boldItems.includes(item.label) ? "font-bold" : ""
                                                                                                            }`}
                                                                                                        name={item.name}
                                                                                                        value={
                                                                                                            chartData[item.name] ||
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
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li className="relative py-6" style={{ left: '10px', right: '0px' }}>
                                                                <div className="relative flex justify-center" >
                                                                    <div className="text-center">
                                                                        <ul className="flex flex-row justify-center">
                                                                            <li className="relative py-6">
                                                                                <div className="relative flex justify-center">
                                                                                    <div className="text-center">
                                                                                        <div className="flex flex-col justify-center items-center">
                                                                                            {logisticSection.map((item) => (
                                                                                                <div key={item.name} className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                    <h2 className="font-bold">{item.label}</h2>
                                                                                                    <select
                                                                                                        className={`block  w-full px-3 py-2 border rounded-md ${boldItems.includes(item.label) ? "font-bold" : ""
                                                                                                            }`}
                                                                                                        name={item.name}
                                                                                                        value={
                                                                                                            chartData[item.name] ||
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
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <li className="relative py-6" style={{ left: '130px', right: '0px' }}>
                                                                <div className="relative flex justify-center" >
                                                                    <div className="text-center">
                                                                        <ul className="flex flex-row justify-center">
                                                                            <li className="relative py-6">
                                                                                <div className="relative flex justify-center">
                                                                                    <div className="text-center">
                                                                                        <div className="flex flex-col justify-center items-center">
                                                                                            {financeSection.map((item) => (
                                                                                                <div key={item.name} className="text-center p-4 border border-gray-300 rounded-lg shadow text-xs w-[215px]">
                                                                                                    <h2 className="font-bold">{item.label}</h2>
                                                                                                    <select
                                                                                                        className={`block  w-full px-3 py-2 border rounded-md ${boldItems.includes(item.label) ? "font-bold" : ""
                                                                                                            }`}
                                                                                                        name={item.name}
                                                                                                        value={
                                                                                                            chartData[item.name] ||
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
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chart;