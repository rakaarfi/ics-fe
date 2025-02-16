'use client'

import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Grid, List, Pencil } from "lucide-react"; // Ikon modern

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [filename, setFilename] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [allImages, setAllImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [viewMode, setViewMode] = useState("grid"); // Default ke grid

    const fileInputRef = useRef(null); // Create a reference for the file input
    const apiUrl = 'http://127.0.0.1:8000/'

    // Fungsi untuk mengambil daftar semua gambar
    const fetchAllImages = async () => {
        try {
            const response = await axios.get(`${apiUrl}file/list/`);
            if (response.status === 200) {
                setAllImages(response.data.files);
            } else {
                console.error("Gagal mengambil daftar gambar.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Ambil daftar gambar saat komponen dimuat
    useEffect(() => {
        fetchAllImages();
    }, []);

    // Fungsi untuk mengunggah file
    const handleUpload = async () => {
        if (!file) {
            alert("Pilih file terlebih dahulu!");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await axios.post(
                `${apiUrl}file/upload/`,
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
                fetchAllImages();
            } else {
                setUploadStatus("Gagal mengunggah file.");
            }
        } catch (error) {
            console.error("Error:", error);
            setUploadStatus("Terjadi kesalahan saat mengunggah file.");
        }
    };

    const handleCancel = () => {
        setFile(null);
        setUploadStatus("");
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the input value
        }
    };

    // Fungsi untuk memeriksa file yang diunggah
    const handleCheckFile = async () => {
        if (!filename) {
            alert("Belum ada file yang diunggah!");
            return;
        }

        try {
            const response = await axios.get(
                `${apiUrl}file/get/${filename}`,
                { responseType: "blob" }
            );

            if (response.status === 200) {
                const imageUrl = URL.createObjectURL(response.data);
                setImageUrl(imageUrl);
            } else {
                alert("File tidak ditemukan.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat memeriksa file.");
        }
    };

    // Fungsi untuk menghapus file
    const handleDeleteFile = async (filename) => {
        try {
            const response = await axios.delete(
                `${apiUrl}file/delete/${filename}`
            );

            if (response.status === 200) {
                alert(response.data.message);
                // Refresh daftar gambar setelah menghapus
                fetchAllImages();
            } else {
                alert("Gagal menghapus file.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat menghapus file.");
        }
    };

    // Fungsi untuk memperbarui file
    const handleUpdateFile = async () => {
        if (!selectedFile || !file) {
            alert("Pilih file terlebih dahulu!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.put(
                `${apiUrl}file/update/${selectedFile}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                alert(response.data.message);
                // Refresh daftar gambar setelah memperbarui
                fetchAllImages();
            } else {
                alert("Gagal memperbarui file.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat memperbarui file.");
        }
    };

    return (
        <>
            {/* <div style={{ padding: "20px" }} className="lg:ml-[17rem] ml-[9rem] lg:my-0 my-24 mx-2"> */}
                {/* <h1>Upload dan Periksa Gambar</h1> */}

                {/* Form untuk memilih file */}
                {/* <div className="flex gap-4">
                    {file && (
                        <img src={URL.createObjectURL(file)} alt="Uploaded" style={{ maxWidth: "30%", height: "auto" }} />
                    )}
                    <input
                        type="file"
                        accept="image/jpg,image/jpeg"
                        onChange={(e) => setFile(e.target.files[0])}
                        ref={fileInputRef} // Attach the reference to the input
                    />
                    <button onClick={handleUpload}>Upload File</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div> */}

                {/* Status upload */}
                {/* {uploadStatus && <p>{uploadStatus}</p>} */}

                {/* Tombol untuk memeriksa file */}
                {/* {filename && (
                    <div>
                        <button onClick={handleCheckFile}>Periksa File</button>
                    </div>
                )} */}

                {/* Tampilkan gambar jika berhasil diambil */}
                {/* {imageUrl && (
                    <div>
                        <h2>Gambar yang Diunggah:</h2>
                        <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "100%", height: "auto" }} />
                    </div>
                )} */}

                {/* Tampilkan semua gambar yang tersimpan */}

                {/* <div> */}
                    {/* <h2>Semua Gambar yang Tersimpan:</h2> */}

                    {/* Tombol Toggle */}
                    {/* <div className="mb-4">
                        <button
                            className="px-4 py-2 mr-2 bg-blue-500 text-white rounded"
                            onClick={() => setViewMode("grid")}
                        >
                            Grid View
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-500 text-white rounded"
                            onClick={() => setViewMode("list")}
                        >
                            List View
                        </button>
                    </div> */}

                    {/* Kontainer Gambar */}
                    {/* <div className={viewMode === "grid" ? "grid grid-cols-3 gap-4" : "flex flex-col gap-4"}>
                        {allImages.map((image, index) => (
                            <div
                                key={index}
                                className={viewMode === "grid" ? "border p-2 flex flex-col items-center" : "border p-2 flex items-center gap-4"}
                            >
                                <img
                                    src={`${apiUrl}file/get/${image}`}
                                    alt={image}
                                    className={viewMode === "grid" ? "w-40 h-auto" : "w-20 h-20"}
                                />
                                <p>{image.length > 25 ? `${image.substring(0, 25)}...` : image}</p>
                                <button onClick={() => handleDeleteFile(image)}>Hapus</button>
                                <button onClick={() => setSelectedFile(image)}>Pilih untuk Update</button>
                            </div>
                        ))}
                    </div> */}
                {/* </div> */}
            {/* </div> */}
            <div className="lg:ml-[17rem] ml-[9rem] my-10 p-6 bg-gray-100 rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold mb-4">Upload dan Periksa Gambar</h1>

                {/* Form untuk upload file */}
                <div className="bg-white p-4 rounded-lg shadow flex flex-col gap-4">
                    {file && (
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Uploaded"
                            className="w-40 rounded-lg shadow-md"
                        />
                    )}

                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept="image/jpg,image/jpeg"
                            onChange={(e) => setFile(e.target.files[0])}
                            ref={fileInputRef}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
                        >
                            <Upload size={18} />
                            Pilih File
                        </button>
                        <button
                            onClick={handleUpload}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600"
                        >
                            Upload
                        </button>
                    </div>

                    {uploadStatus && <p className="text-sm text-gray-600">{uploadStatus}</p>}
                </div>

                {/* Tampilkan gambar yang berhasil diunggah */}
                {imageUrl && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-2">Gambar yang Diunggah:</h2>
                        <img
                            src={imageUrl}
                            alt="Uploaded"
                            className="w-full max-w-md rounded-lg shadow-md"
                        />
                    </div>
                )}

                {/* Tombol toggle untuk view mode */}
                <div className="flex justify-end my-4">
                    <button
                        className={`px-3 py-2 rounded-lg flex items-center gap-2 ${viewMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
                            }`}
                        onClick={() => setViewMode("grid")}
                    >
                        <Grid size={18} /> Grid View
                    </button>
                    <button
                        className={`px-3 py-2 ml-2 rounded-lg flex items-center gap-2 ${viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
                            }`}
                        onClick={() => setViewMode("list")}
                    >
                        <List size={18} /> List View
                    </button>
                </div>

                {/* Semua gambar yang tersimpan */}
                <div>
                    <h2 className="text-lg font-semibold">Semua Gambar yang Tersimpan:</h2>

                    <div className={viewMode === "grid" ? "grid grid-cols-3 gap-4 mt-4" : "flex flex-col gap-4 mt-4"}>
                        {allImages.map((image, index) => (
                            <div
                                key={index}
                                className={`border p-3 rounded-lg shadow-md bg-white ${viewMode === "grid" ? "flex flex-col items-center" : "flex items-center gap-4"
                                    }`}
                            >
                                <img
                                    src={`${apiUrl}file/get/${image}`}
                                    alt={image}
                                    className={viewMode === "grid" ? "w-40 h-auto rounded-lg" : "w-20 h-20 rounded-lg"}
                                />
                                <p className="text-sm text-gray-700">{image.length > 25 ? `${image.substring(0, 25)}...` : image}</p>

                                {/* <button className="px-2 py-1 mt-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600" onClick={() => handleDeleteFile(image)}>
                                    <Trash2 size={16} />
                                    Hapus
                                </button> */}
                                {/* <button className="px-2 py-1 mt-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 hover:bg-orange-600" onClick={() => setSelectedFile(image)}>
                                    <Pencil size={16} />
                                    Edit
                                </button> */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    );
}