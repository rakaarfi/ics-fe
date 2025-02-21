"use client"

import axios from "axios";
import { useEffect, useState } from "react";

export const useHostName = () => {
    const [hostName, setHostName] = useState('');

    useEffect(() => {
        if (document) {
            setHostName(document.location.hostname);
        }
    }, []);

    return hostName;
};

// Create
export const createData = async ({ routeUrl, payload }) => {
    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;

    const response = await axios.post(`${apiUrl}${routeUrl}/create/`, payload);
    return response.data;
};

// Read
export const fetchData = async (routeUrl) => {
    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;
    
    const response = await axios.get(`${apiUrl}${routeUrl}/read`);
    return response.data;
}

export const fetchPaginatedData = async ({
    routeUrl,
    responseKey,
    currentPage,
    search,
    setData,
    setCurrentPage,
    setTotalPages,
    setTotalData,
    setError
}) => {
    try {
        const hostName = document.location.hostname;
        const apiUrl = `http://${hostName}:8000/api/`;
        
        const url = `${apiUrl}${routeUrl}/${responseKey}?page=${currentPage}&search=${search}`;
        const response = await axios.get(url);
        setData(response.data.data);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.total_pages);
        setTotalData(response.data.total_data);

    } catch (error) {
        console.error("Error fetching data:", error.message);
        setError(error.message);
    }
};

// Read by
export const readBy = async ({ routeUrl, id }) => {
    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;
    
    try {
        const response = await axios.get(`${apiUrl}${routeUrl}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Read Operational Period By Incident
export const fetchOperationalPeriodByIncident = async ( incidentId ) => {
    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;
    
    const response = await axios.get(`${apiUrl}operational-period/read-by-incident/${incidentId}`);
    return response.data;
}

// Read by ICS 201 ID
export const readByIcs201Id = async ({ routeUrl, id }) => {
    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;
    
    try {
        const response = await axios.get(`${apiUrl}${routeUrl}/read-by-ics-id/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Read by ICS 202 ID
export const readByIcs202Id = async ({ routeUrl, id }) => {
    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;
    
    try {
        const response = await axios.get(`${apiUrl}${routeUrl}/read-by-ics-202-id/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Read by ID
export const readById = async ({ routeUrl, id }) => {
    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;
    
    const response = await axios.get(`${apiUrl}${routeUrl}/read/${id}`);
    return response.data;
};

export const readTableById = async ({ routeUrl, id }) => {
    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;
    
    const response = await axios.get(`${apiUrl}${routeUrl}/${id}/`);
    return response.data;
};

// Update
export const handleUpdate = async (id, routeUrl, formData) => {
    try {
        const hostName = document.location.hostname;
        const apiUrl = `http://${hostName}:8000/api/`;
        
        const response = await axios.put(`${apiUrl}${routeUrl}/update/${id}`, formData);
        alert("Data updated successfully!");
    } catch (err) {
        alert("Error updating data: " + err.message);
    }
};


// Delete
export const handleDelete = async (id, routeUrl) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this data?");
    if (isConfirmed) {
        try {
            const hostName = document.location.hostname;
            const apiUrl = `http://${hostName}:8000/api/`;
            
            await axios.delete(`${apiUrl}${routeUrl}/delete/${id}`);
            alert("Data deleted successfully!");

        } catch (err) {
            alert("Error deleting data: " + err.message);
        }
    }
};