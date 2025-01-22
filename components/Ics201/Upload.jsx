'use client'

import axios from "axios";
import { useState, useRef, useEffect } from "react";

export default function Upload({ onFileUpload, onDeleteFile, currentFile, id }) {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [filename, setFilename] = useState(currentFile || "");
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");

    const [timestamp, setTimestamp] = useState(null);

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
        if (currentFile) {
            setFilename(currentFile);
            setImageUrl(`http://localhost:8000/upload/get-map-sketch/${currentFile}`);
        } else {
            setImageUrl(null); // Set imageUrl ke null jika tidak ada currentFile
        }
    }, [currentFile]);

    // Fungsi untuk mengunggah file
    const handleUpload = async () => {
        if (!file) {
            setError("Pilih file terlebih dahulu!");
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
                "http://localhost:8000/upload/upload-map-sketch/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                setUploadStatus("File berhasil diunggah!");
                setFilename(response.data.filename);
                setImageUrl(URL.createObjectURL(file)); // Tampilkan preview file
                onFileUpload(response.data.filename);
            } else {
                setUploadStatus("Gagal mengunggah file.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Terjadi kesalahan saat mengunggah file.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi untuk menghapus file yang sudah diunggah
    const handleRemoveFile = async () => {
        if (!filename) {
            setError("Tidak ada file yang diunggah.");
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:8000/upload/delete-map-sketch/${filename}`);
            if (response.status === 200) {
                // // Update the map_sketch field in the database
                // await axios.put(`http://localhost:8000/ics-201/main/update/${id}`, {
                //     map_sketch: null,
                // });

                setFile(null);
                setFilename("");
                setImageUrl(null); // Set imageUrl ke null setelah file dihapus
                setUploadStatus("");
                onFileUpload(""); // Reset nama file di parent component
                onDeleteFile(); // Beritahu parent component bahwa file dihapus
            } else {
                setError("Gagal menghapus file.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Terjadi kesalahan saat menghapus file.");
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
            setError("Belum ada file yang diunggah!");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await axios.get(
                `http://localhost:8000/upload/get-map-sketch/${filename}`,
                { responseType: "blob" }
            );

            if (response.status === 200) {
                const url = URL.createObjectURL(response.data);
                setImageUrl(url);
            } else {
                setError("File tidak ditemukan.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Terjadi kesalahan saat memeriksa file.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi untuk menangani perubahan file
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png")) {
            setFile(selectedFile);
            setError("");
        } else {
            setError("Hanya file JPG, JPEG, atau PNG yang diizinkan.");
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

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type === "image/jpeg" || droppedFile.type === "image/png")) {
            setFile(droppedFile);
            setError("");
        } else {
            setError("Hanya file JPG, JPEG, atau PNG yang diizinkan.");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Upload Map/Sketch</h1>

            {/* Form untuk memilih file */}
            <div className="space-y-4">
                {/* Dropzone Area */}
                <div
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
                >
                    {/* Tampilkan <label> hanya jika file belum dimasukkan */}
                    {!file && !filename && (
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg
                                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 16"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                    />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG</p>
                            </div>
                        </label>
                    )}

                    {/* Tampilkan pesan jika file sudah dimasukkan */}
                    {(file || filename) && (
                        <p className="text-sm text-gray-500">
                            File sudah dipilih. Klik di sini untuk mengganti file.
                        </p>
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
                                {isLoading ? "Mengunggah..." : "Upload File"}
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
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
                        >
                            Hapus File
                        </button>
                    )}
                </div>
            </div>

            {/* Status upload */}
            {uploadStatus && (
                <p className={`mt-4 text-sm ${uploadStatus.includes("berhasil") ? "text-green-600" : "text-red-600"}`}>
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