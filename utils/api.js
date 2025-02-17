import axios from "axios";

const apiUrl = "http://127.0.0.1:8000/";

// Create
export const createData = async ({ routeUrl, payload }) => {
    const response = await axios.post(`${apiUrl}${routeUrl}/create/`, payload);
    return response.data;
};

// Read
export const fetchData = async (routeUrl) => {
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

// Read by ID
export const readById = async ({ routeUrl, id }) => {
    const response = await axios.get(`${apiUrl}${routeUrl}/read/${id}`);
    return response.data;
};

export const readTableById = async ({ routeUrl, id }) => {
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
            await axios.delete(`${apiUrl}${routeUrl}/delete/${id}`);
            alert("Data deleted successfully!");

        } catch (err) {
            alert("Error deleting data: " + err.message);
        }
    }
};