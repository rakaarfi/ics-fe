'use client'

import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

export default function UploadImage({ onFileUpload, onDeleteFile, currentFile, id }) {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [filename, setFilename] = useState(currentFile || "");
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");

    const [timestamp, setTimestamp] = useState(null);

    const hostName = typeof window !== 'undefined' ? window.location.hostname : '';
    const apiUrl = `http://${hostName}:8000/api/`;

    useEffect(() => {
        setTimestamp(Date.now()); // Hanya dijalankan di client
    }, []);

    const fileInputRef = useRef(null);

    // Bersihkan URL objek saat komponen di-unmount atau file berubah
    useEffect(() => {
        return () => {
            if (imageUrl && imageUrl.startsWith("blob:")) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    // Jika ada currentFile, set imageUrl untuk menampilkan preview dari server
    useEffect(() => {
        console.log("Current file received in UploadFile:", currentFile);

        if (currentFile) {
            setFilename(currentFile);
            setImageUrl(`${apiUrl}file/get/${currentFile}`);
        } else {
            setImageUrl(null); // Set imageUrl ke null jika tidak ada currentFile
        }
    }, [currentFile]);

    // Fungsi untuk mengunggah file
    const handleUpload = async () => {
        if (!file) {
            setError("Select the file first!");
            return;
        }

        setIsLoading(true);
        setError("");

        // Modifikasi nama file dengan menambahkan timestamp
        const originalName = file.name;
        const fileExtension = originalName.split('.').pop(); // Ambil ekstensi file
        const fileNameWithoutExtension = originalName.slice(0, originalName.lastIndexOf('.')); // Ambil nama file tanpa ekstensi
        const modifiedFileName = `${fileNameWithoutExtension}_${timestamp}.${fileExtension}`; // Nama file baru

        // Buat objek File baru dengan nama yang sudah dimodifikasi
        const modifiedFile = new File([file], modifiedFileName, { type: file.type });

        const formData = new FormData();
        formData.append("file", modifiedFile); // Gunakan file dengan nama yang sudah dimodifikasi

        try {
            const response = await axios.post(
                `${apiUrl}file/upload/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        // Contoh perhitungan persen
                        const total = progressEvent.total;
                        const current = progressEvent.loaded;
                        const percentCompleted = Math.round((current / total) * 100);
                        // Bisa disimpan ke state untuk menampilkan progress bar
                        console.log(`Upload progress: ${percentCompleted}%`);
                    },
                }
            );

            if (response.status === 200) {
                setUploadStatus("File uploaded successfully!");
                setFilename(response.data.filename);
                setImageUrl(URL.createObjectURL(file)); // Tampilkan preview file
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

    // Fungsi untuk menghapus file yang sudah diunggah
    const handleRemoveFile = async () => {
        if (!filename) {
            setError("No files were uploaded.");
            return;
        }

        try {
            const response = await axios.delete(`${apiUrl}file/delete/${filename}`);
            if (response.status === 200) {
                // // Update the map_sketch field in the database
                // await axios.put(`${apiUrl}ics-201/main/update/${id}`, {
                //     map_sketch: null,
                // });

                setFile(null);
                setFilename("");
                setImageUrl(null); // Set imageUrl ke null setelah file dihapus
                setUploadStatus("");
                onFileUpload(""); // Reset nama file di parent component
                onDeleteFile(); // Beritahu parent component bahwa file dihapus
            } else {
                setError("Failed to remove the file.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred while removing the file.");
        }
    };

    // Fungsi untuk membatalkan upload
    const handleCancel = () => {
        setFile(null);
        setUploadStatus("");
        setImageUrl(null); // Set imageUrl ke null saat upload dibatalkan
        setError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset input file
        }
    };

    // Fungsi untuk memeriksa file yang diunggah
    const handleCheckFile = async () => {
        if (!filename) {
            setError("No files uploaded yet!");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await axios.get(
                `${apiUrl}file/get/${filename}`,
                { responseType: "blob" }
            );

            if (response.status === 200) {
                const url = URL.createObjectURL(response.data);
                setImageUrl(url);
            } else {
                setError("File not found.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred while checking the file.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi untuk menangani perubahan file
    const handleFileChange = (e) => {
        if (imageUrl && imageUrl.startsWith("blob:")) {
            URL.revokeObjectURL(imageUrl);
        }

        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const isValidType = ["image/jpeg", "image/jpg", "image/png"].includes(selectedFile.type);
            const isSizeAllowed = selectedFile.size <= 5 * 1024 * 1024; // 5MB

            if (!isValidType) {
                setError("Only JPG, JPEG, or PNG files are allowed.");
            } else if (!isSizeAllowed) {
                setError("Maximum file size is 5MB.");
            } else {
                setFile(selectedFile);
                setImageUrl(URL.createObjectURL(selectedFile)); // Preview langsung sebelum upload
                setError("");
            }
        }
    };

    // Fungsi untuk menangani drag-and-drop
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

        if (imageUrl && imageUrl.startsWith("blob:")) {
            URL.revokeObjectURL(imageUrl);
        }

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            const isValidType = ["image/jpeg", "image/png"].includes(droppedFile.type);
            const isSizeAllowed = droppedFile.size <= 5 * 1024 * 1024; // Maksimal 5MB

            if (!isValidType) {
                setError("Only JPG, JPEG, or PNG files are allowed.");
            } else if (!isSizeAllowed) {
                setError("Maximum file size is 5MB.");
            } else {
                setFile(droppedFile);
                setImageUrl(URL.createObjectURL(droppedFile)); // Preview langsung sebelum upload
                setError("");
            }
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Upload Map/Sketch</h1>

            {/* Form untuk memilih file */}
            <div className="space-y-4">
                {/* Dropzone Area */}
                <div
                    role="button"
                    tabIndex={0}
                    className={`flex items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
                        } ${error && "border-red-500 bg-red-50"}`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => {
                        if (fileInputRef.current) {
                            fileInputRef.current.click();
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            fileInputRef.current?.click();
                        }
                    }}
                >
                    {/* Tampilkan <label> hanya jika file belum dimasukkan */}
                    {!file && !filename ? (
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <AiOutlineCloudUpload size={30} className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                {isDragging && <p className="mt-2 text-blue-600">Release the file here</p>}
                            </div>
                        </label>
                    ) : (
                        // Tampilkan pesan jika file sudah dimasukkan
                        <p className="text-sm text-gray-500">The file has been selected. Click here to change the file.</p>
                    )}
                </div>

                {/* Input file (tetap ada, tetapi tersembunyi) */}
                <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    accept="image/jpg,image/jpeg,image/png"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">PNG, JPG or JPEG (MAX.5MB).</p>

                {/* Preview Gambar */}
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Uploaded"
                        className="max-w-full h-auto rounded-lg shadow-md"
                    />
                )}

                {/* Tombol Upload dan Cancel */}
                <div className="flex gap-2">
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
                            type="button"
                            onClick={handleRemoveFile}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
                        >
                            Delete File
                        </button>
                    )}
                </div>
            </div>

            {/* Status upload */}
            {uploadStatus && (
                <p className={`mt-4 text-sm ${uploadStatus.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                    {uploadStatus}
                </p>
            )}

            {/* Pesan error */}
            {error && (
                <p className="mt-4 text-sm text-red-600">
                    {error}
                </p>
            )}

            {/* Tombol untuk memeriksa file */}
            {/* {filename && (
                <div className="mt-4">
                    <button
                        onClick={handleCheckFile}
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300"
                    >
                        {isLoading ? "Memeriksa..." : "Periksa File"}
                    </button>
                </div>
            )} */}

            {/* Tampilkan gambar jika berhasil diambil */}
            {/* {imageUrl && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Gambar yang Diunggah:</h2>
                    <img
                        src={imageUrl}
                        alt="Uploaded"
                        className="max-w-full h-auto rounded-lg shadow-md"
                    />
                </div>
            )} */}
        </div>
    );
}