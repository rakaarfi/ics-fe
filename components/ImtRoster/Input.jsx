'use client';

import { createData } from "@/utils/api";
import React, { useState } from "react";
import { ButtonSubmit } from "../ButtonComponents";
import useFetchDynamicOptions from "./useFetchDynamicOptions";
import RosterForm from "./RosterForm";
import FormContainer from "../FormContainer";

export default function Input() {

    const { dynamicOptions, error } = useFetchDynamicOptions();
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createData({ routeUrl: 'roster', payload: formData });
            alert("Data submitted successfully!");
        } catch (error) {
            console.error("Submission error:", error.message);
            alert("Terjadi kesalahan saat menyimpan data.");
        }
    };

    return (
        <FormContainer title="Input Roster">
            {error && <p className="text-red-500">{error}</p>}
            <RosterForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                dynamicOptions={dynamicOptions}
                SubmitButton={ButtonSubmit}
            />
        </FormContainer>
    );
}
