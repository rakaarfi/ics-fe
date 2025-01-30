'use client';

import React from 'react';

import PeriodRemark from './PeriodRemark';
import SectionSelect from './SectionSelect';
import { MainSection, PlanningSection, LogisticSection, FinanceSection, OperationSectionList, boldItems } from "./inputFields";

const RosterForm = ({
    formData,
    handleChange,
    handleSubmit,
    dynamicOptions,
    initialData = {},
    SubmitButton,
    periodRemark = true,
    RULeaderData,
    setFormData,
    // findIdByName,
}) => {
    return (
        <form onSubmit={handleSubmit}>
            {periodRemark && (
                <>
                    <PeriodRemark
                        formData={formData}
                        handleChange={handleChange}
                        initialData={initialData}
                    />
                    <h2 className="text-xl font-bold mb-4">Incident Management Team</h2>
                </>
            )}
            <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-6 w-full">
                    {!periodRemark && (
                        <h2 className="text-xl font-bold">Incident Commander and Commander Staff:</h2>
                    )}
                    <SectionSelect
                        items={MainSection}
                        dynamicOptions={dynamicOptions}
                        formData={formData}
                        handleChange={handleChange}
                        initialData={initialData}
                        boldItems={boldItems}
                    // findIdByName={findIdByName}
                    />
                    {!periodRemark && (
                        <h2 className="text-xl font-bold">Planning Section:</h2>
                    )}
                    <SectionSelect
                        items={PlanningSection}
                        dynamicOptions={dynamicOptions}
                        formData={formData}
                        handleChange={handleChange}
                        initialData={initialData}
                        boldItems={boldItems}
                    // findIdByName={findIdByName}
                    />
                </div>

                <div className="flex flex-col gap-6 w-full">
                    {!periodRemark && (
                        <h2 className="text-xl font-bold">Operations Section:</h2>
                    )}
                    <SectionSelect
                        items={OperationSectionList}
                        dynamicOptions={dynamicOptions}
                        formData={formData}
                        handleChange={handleChange}
                        initialData={initialData}
                        boldItems={boldItems}
                    // findIdByName={findIdByName}
                    />
                    {!periodRemark && (
                        <h2 className="text-xl font-bold">Logistic Section:</h2>
                    )}
                    <SectionSelect
                        items={LogisticSection}
                        dynamicOptions={dynamicOptions}
                        formData={formData}
                        handleChange={handleChange}
                        initialData={initialData}
                        boldItems={boldItems}
                    // findIdByName={findIdByName}
                    />
                    {!periodRemark && (
                        <h2 className="text-xl font-bold">Finance Section:</h2>
                    )}
                    <SectionSelect
                        items={FinanceSection}
                        dynamicOptions={dynamicOptions}
                        formData={formData}
                        handleChange={handleChange}
                        initialData={initialData}
                        boldItems={boldItems}
                    // findIdByName={findIdByName}
                    />
                    {!periodRemark && (
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr>
                                    <td className="px-4 py-2 font-bold">
                                        Prepared by:
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">
                                        <select
                                            name="resources_unit_leader_id"
                                            className="flex-1 block w-[400px] rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#55c0b8] sm:text-sm/6"
                                            value={formData.resources_unit_leader_id || ""}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                resources_unit_leader_id: e.target.value
                                            }))}
                                            required
                                        >
                                            <option value="" disabled>
                                                Select Resources Unit Leader
                                            </option>
                                            {RULeaderData.map(chief => (
                                                <option key={chief.id} value={chief.id}>
                                                    {chief.name}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="checkbox"
                                            name="is_prepared"
                                            checked={formData.is_prepared || false}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                is_prepared: e.target.checked
                                            }))}
                                            className="mr-2"
                                            required
                                        />
                                        Signature
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                    <SubmitButton />
                </div>
            </div>
        </form>
    );
};

export default RosterForm;