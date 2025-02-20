"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import TableHeader from './TableHeader';
import FormContainer from '../FormContainer';
import { fetchPaginatedData } from '@/utils/api';
import Pagination from '@/components/Pagination';
import { SearchQuery } from '@/components/SearchQuery';
import { createData, handleUpdate, handleDelete } from '@/utils/api';
import { FormTemplate, FormTemplateInput } from '@/components/ImtMembers/FormTemplate';
import { ButtonDelete, ButtonSubmit, ButtonSave, ButtonEdit, CancelButton } from '@/components/ButtonComponents';


export default function ListTemplate({ routeUrl, responseKey, headerText }) {
    const searchParams = useSearchParams();
    const [queryPage, setQueryPage] = useState("1");
    const [querySearch, setQuerySearch] = useState("");

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(Number(queryPage));
    const [totalPages, setTotalPages] = useState(0);
    const [totalData, setTotalData] = useState(0);
    const [search, setSearch] = useState(querySearch);
    const [error, setError] = useState(null);
    const [activeRow, setActiveRow] = useState(null);
    const [updateFormData, setUpdateFormData] = useState({});
    const [createFormData, setCreateFormData] = useState({});

    if (!routeUrl || !responseKey) {
        return <p className="text-red-500">Error: Missing required parameters</p>;
    }
    
    useEffect(() => {
        setQueryPage(searchParams.get("page") || "1");
        setQuerySearch(searchParams.get("search") || "");
    }, [searchParams]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        fetchPaginatedData({
            routeUrl,
            responseKey,
            currentPage,
            search,
            setData,
            setCurrentPage,
            setTotalPages,
            setTotalData,
            setError,
        });
    }, [currentPage, search]);

    useEffect(() => {
        const params = new URLSearchParams();
        params.set("page", currentPage);
        if (search) {
            params.set("search", search);
        }
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newUrl);
    }, [currentPage, search]);

    const handleCreateChange = (e) => {
        setCreateFormData({
            ...createFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreateSubmit = async () => {
        try {
            const newData = await createData({ routeUrl, payload: createFormData });
            setData((prevData) => [newData, ...prevData]);
            setCreateFormData({});
        } catch (err) {
            setError("Failed to create data");
            console.error(err);
        }
    };

    const handleUpdateChange = (e) => {
        setUpdateFormData({ ...updateFormData, [e.target.name]: e.target.value });
    };

    const handleUpdateSubmit = (e, id) => {
        e.preventDefault();
        console.log("Submitting for ID:", id);
        if (!id) {
            alert("Error: ID is undefined.");
            return;
        }
        handleUpdate(id, routeUrl, updateFormData);
    };

    return (
        <FormContainer title={headerText} error={error}>
            <div className=" mb-4">
                <SearchQuery
                    searchQuery={search}
                    setSearchQuery={setSearch}
                    placeHolder={"Enter keyword..."}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-xs">
                    <TableHeader />
                    <tbody>

                        {/* Row for Create */}
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center bg-[#e1e5e7]">Input</td>
                            <FormTemplateInput
                                formData={createFormData}
                                onChange={handleCreateChange}
                            />
                            <td className="border border-gray-300 px-4 py-2 text-center bg-[#e1e5e7]" colSpan={2}>
                                <ButtonSubmit onClick={handleCreateSubmit} />
                            </td>
                        </tr>

                        {/* Rows for Read, Update, and Delete */}
                        {data.map((item, index) => (
                            <React.Fragment key={item.id}>
                                {activeRow === item.id ? (
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            {index + 1 + (currentPage - 1) * 10}
                                        </td>
                                        <FormTemplate
                                            formData={updateFormData}
                                            onChange={handleUpdateChange}
                                        />
                                        <td className="border border-gray-300 px-4 py-2">
                                            <CancelButton onClick={() => setActiveRow(null)} />
                                        </td>
                                        <td className="border border-gray-300 px-4 py-4">
                                            <ButtonSave onClick={(e) => handleUpdateSubmit(e, item.id)} />
                                        </td>
                                    </tr>
                                ) : (
                                    // Row for Delete and Edit
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            {index + 1 + (currentPage - 1) * 10}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.nf_name}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.role}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.office_phone}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.mobile_phone}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.join_date}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.exit_date}</td>
                                        <td className="border border-gray-300 px-2 py-4 text-center">
                                            <ButtonEdit
                                                onClick={() => {
                                                    setActiveRow(item.id);

                                                    setUpdateFormData({
                                                        name: item.name,
                                                        nf_name: item.nf_name,
                                                        role: item.role,
                                                        office_phone: item.office_phone,
                                                        mobile_phone: item.mobile_phone,
                                                        join_date: item.join_date,
                                                        exit_date: item.exit_date,
                                                    });
                                                }}
                                            />
                                        </td>
                                        <td className="border border-gray-300 px-2 py-4 text-center">
                                            <ButtonDelete
                                                onClick={() => handleDelete(item.id, routeUrl)}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                searchQuery={search}
            />
        </FormContainer>
    );
}

