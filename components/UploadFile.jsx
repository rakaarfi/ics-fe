'use client'

import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { CloudUpload } from "lucide-react"

export default function UploadFile({ onFileUpload, onDeleteFile, currentFile, titleName = 'Upload File', disabled = false }) {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [filename, setFilename] = useState(currentFile || "");
    const [fileUrl, setFileUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");
    const [fileType, setFileType] = useState(null);

    const [timestamp, setTimestamp] = useState(null);
    const hostName = document.location.hostname;
    const apiUrl = `http://${hostName}:8000/api/`;
    const fileInputRef = useRef(null);

    const handleClick = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    useEffect(() => {
        setTimestamp(Date.now()); // Hanya dijalankan di client
    }, []);

    useEffect(() => {
        return () => {
            if (fileUrl && fileUrl.startsWith("blob:")) {
                URL.revokeObjectURL(fileUrl);
            }
        };
    }, [fileUrl]);

    useEffect(() => {
        console.log("Current file received in UploadFile:", currentFile);
        if (currentFile) {
            setFilename(currentFile);
            setFileUrl(`${apiUrl}file/get/${currentFile}`);
            // setFileUrl(currentFile);

            // Determine file type from the filename extension
            const extension = currentFile.split('.').pop().toLowerCase();
            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension);
            setFileType(isImage ? 'image' : 'document');
        } else {
            setFileUrl(null);
            setFileType(null);
        }
    }, [currentFile]);

    const handleUpload = async () => {
        if (!file) {
            setError("Select the file first!");
            return;
        }

        setIsLoading(true);
        setError("");

        const originalName = file.name;
        const fileExtension = originalName.split('.').pop();
        const fileNameWithoutExtension = originalName.slice(0, originalName.lastIndexOf('.'));
        const modifiedFileName = `${fileNameWithoutExtension}_${timestamp}.${fileExtension}`;

        const modifiedFile = new File([file], modifiedFileName, { type: file.type });

        const formData = new FormData();
        formData.append("file", modifiedFile);

        try {
            const response = await axios.post(`${apiUrl}file/upload/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    console.log(`Upload progress: ${percentCompleted}%`);
                },
            });

            if (response.status === 200) {
                setUploadStatus("File uploaded successfully!");
                setFilename(response.data.filename);
                setFileUrl(URL.createObjectURL(file));
                onFileUpload(response.data.filename);
            } else {
                setUploadStatus("Failed to upload the file.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred while uploading the file.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveFile = async () => {
        if (!filename) {
            setError("No files were uploaded.");
            return;
        }

        try {
            const response = await axios.delete(`${apiUrl}file/delete/${filename}`);
            if (response.status === 200) {
                setFile(null);
                setFilename("");
                setFileUrl(null);
                setFileType(null);
                setUploadStatus("");
                onFileUpload("");
                onDeleteFile();
            } else {
                setError("Failed to delete the file.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred while deleting the file.");
        }
    };

    const handleCancel = () => {
        setFile(null);
        setUploadStatus("");
        setFileUrl(null); // Set imageUrl ke null saat upload dibatalkan
        setFileType(null);
        setError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset input file
        }
    };

    const handleFileChange = (e) => {
        if (fileUrl && fileUrl.startsWith("blob:")) {
            URL.revokeObjectURL(fileUrl);
        }

        const selectedFile = e.target.files[0];
        processFile(selectedFile);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (fileUrl && fileUrl.startsWith("blob:")) {
            URL.revokeObjectURL(fileUrl);
        }

        const droppedFile = e.dataTransfer.files[0];
        processFile(droppedFile);
    };

    const processFile = (selectedFile) => {
        if (selectedFile) {
            const allowedTypes = [
                "image/jpeg", "image/png", "image/gif", "image/svg+xml",
                "application/pdf",
                "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            ];
            const isValidType = allowedTypes.includes(selectedFile.type);
            const isSizeAllowed = selectedFile.size <= 10 * 1024 * 1024; // Maksimal 10MB

            if (!isValidType) {
                setError("The file type is not supported.");
            } else if (!isSizeAllowed) {
                setError("Maximum file size is 10MB.");
            } else {
                setFile(selectedFile);
                setFileUrl(URL.createObjectURL(selectedFile));
                setFileType(selectedFile.type.split('/')[0]); // 'image' or 'application'
                setError("");
            }
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">{titleName}</h1>

            {/* Drag & Drop Area */}
            <div
                role="button"
                tabIndex={0}
                className={`flex items-center justify-center w-full border-2 rounded-lg cursor-pointer transition-all
                    ${isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-50"}
                    ${error && "border-red-500 bg-red-50"}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                onKeyDown={(e) => {
                    if (!disabled && (e.key === "Enter" || e.key === " ")) {
                        fileInputRef.current?.click();
                    }
                }}
            >
                {!file && !filename ? (
                    <>
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <CloudUpload size={30} className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                <p className={`text-sm ${disabled ? "text-red-500" : "text-gray-500"}`}>
                                    {disabled ? "Checkbox must be checked" : "Click to upload or drag and drop"}
                                </p>
                                {isDragging && <p className="mt-2 text-blue-600">Release the file here</p>}
                            </div>
                        </label>
                    </>
                ) : (
                    <p className="text-gray-500 text-sm">File selected. Click to change.</p>
                )}
            </div>
            <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={(e) => !disabled && handleFileChange(e)}
                ref={fileInputRef}
                accept=".jpg,.jpeg,.png,.gif,.svg,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                disabled={disabled}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">DOC, PDF, XLS, XLSX.</p>

            {fileUrl && (
                <div className="mt-4">
                    {/* Check the file type and display accordingly */}
                    {(file?.type?.includes("image") || fileType === 'image') ? (
                        <>
                            <img src={fileUrl} alt="Preview" className="max-w-full h-auto rounded-lg shadow-md" />

                            <div className="text-sm text-gray-500 mt-2">
                                <p>File Name: {file?.name || filename}</p>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500">📄 File Name:  {file?.name || filename}</p>
                    )}


                </div>
            )}


            <div className="flex gap-2 mt-4">
                {!filename && (
                    <>
                        <button
                            onClick={handleUpload}
                            disabled={isLoading || !file}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {isLoading ? "Uploading..." : "Upload File"}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isLoading || !file}
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
                        >
                            Cancel
                        </button>
                    </>
                )}
                {filename && (
                    <button
                        onClick={handleRemoveFile}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Delete File
                    </button>
                )}
            </div>

            {uploadStatus && <p className="mt-4 text-sm text-green-600">{uploadStatus}</p>}
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
    );
}
