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
    // findIdByName
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <PeriodRemark
                formData={formData}
                handleChange={handleChange}
                initialData={initialData}
            />

            <h2 className="text-xl font-bold mb-4">Incident Management Team</h2>

            <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-6 w-full">
                    <SectionSelect
                        items={MainSection}
                        dynamicOptions={dynamicOptions}
                        formData={formData}
                        handleChange={handleChange}
                        initialData={initialData}
                        boldItems={boldItems}
                        // findIdByName={findIdByName}
                    />
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
                    <SectionSelect
                        items={OperationSectionList}
                        dynamicOptions={dynamicOptions}
                        formData={formData}
                        handleChange={handleChange}
                        initialData={initialData}
                        boldItems={boldItems}
                        // findIdByName={findIdByName}
                    />
                    <SectionSelect
                        items={LogisticSection}
                        dynamicOptions={dynamicOptions}
                        formData={formData}
                        handleChange={handleChange}
                        initialData={initialData}
                        boldItems={boldItems}
                        // findIdByName={findIdByName}
                    />
                    <SectionSelect
                        items={FinanceSection}
                        dynamicOptions={dynamicOptions}
                        formData={formData}
                        handleChange={handleChange}
                        initialData={initialData}
                        boldItems={boldItems}
                        // findIdByName={findIdByName}
                    />
                    <SubmitButton />
                </div>
            </div>
        </form>
    );
};

export default RosterForm;