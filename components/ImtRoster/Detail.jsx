'use client'

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

import RosterForm from './RosterForm';
import { handleUpdate } from '@/utils/api';
import FormContainer from '../FormContainer';
import { ButtonSaveChanges } from '../ButtonComponents';
import useFetchDynamicOptions from './useFetchDynamicOptions';

export default function Detail() {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const { dynamicOptions, errorDynamicOptions } = useFetchDynamicOptions();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/roster-table/${id}/`);
                setData(response.data);
            } catch (err) {
                console.error("Error fetching data:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleUpdate(id, 'roster', formData);
        } catch (err) {
            alert("Error in handleSubmit:", err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error || errorDynamicOptions) return <p className="text-red-500">{error || errorDynamicOptions}</p>;
    if (!data) return <p>No data found</p>;

    // const findIdByName = (name, options) => {
    //     const foundOption = options.find(option => option.name === name);
    //     return foundOption ? foundOption.id : "";
    // };

    return (
        <FormContainer title="Roster Detail" error={error}>
            <RosterForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                dynamicOptions={dynamicOptions}
                initialData={data}
                SubmitButton={ButtonSaveChanges}
                // findIdByName={findIdByName}
            />
        </FormContainer>
    );
}