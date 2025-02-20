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
    const hostName = document.location.hostname;
    const apiUrl = `http://${hostName}:8000/api/`;

    const response = await axios.post(`${apiUrl}${routeUrl}/create/`, payload);
    return response.data;
};

// Read
export const fetchData = async (routeUrl) => {
    const hostName = document.location.hostname;
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

// Read Operational Period By Incident
export const fetchOperationalPeriodByIncident = async ( incidentId ) => {
    const hostName = document.location.hostname;
    const apiUrl = `http://${hostName}:8000/api/`;
    
    const response = await axios.get(`${apiUrl}operational-period/read-by-incident/${incidentId}`);
    return response;
}

// Read by ID
export const readById = async ({ routeUrl, id }) => {
    const hostName = document.location.hostname;
    const apiUrl = `http://${hostName}:8000/api/`;
    
    const response = await axios.get(`${apiUrl}${routeUrl}/read/${id}`);
    return response.data;
};

export const readTableById = async ({ routeUrl, id }) => {
    const hostName = document.location.hostname;
    const apiUrl = `http://${hostName}:8000/api/`;
    
    const response = await axios.get(`${apiUrl}${routeUrl}/${id}/`);
    return response.data;
};

// Update
// export const handleUpdate = async (e, id, routeUrl) => {
//     e.preventDefault();

//     const formData = new FormData(e.target);
//     const updatedData = Object.fromEntries(formData.entries());

//     try {
//         const response = await axios.put(
//             `${apiUrl}${routeUrl}/update/${id}`,
//             updatedData
//         );
//         alert("Data updated successfully!");

//     } catch (err) {
//         alert("Error updating data: " + err.message);
//     }
// };

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