'use client'

import axios from "axios";
import { useState, useEffect, useRef } from "react";

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [filename, setFilename] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [allImages, setAllImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const fileInputRef = useRef(null); // Create a reference for the file input

    // Fungsi untuk mengambil daftar semua gambar
    const fetchAllImages = async () => {
        try {
            const response = await axios.get("http://localhost:8000/upload/list-map-sketches/");
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
                `http://localhost:8000/upload/get-map-sketch/${filename}`,
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
                `http://localhost:8000/upload/delete-map-sketch/${filename}`
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
                `http://localhost:8000/upload/update-map-sketch/${selectedFile}`,
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
        <div style={{ padding: "20px" }} className="lg:ml-[17rem] ml-[9rem] lg:my-0 my-24 mx-2">
            <h1>Upload dan Periksa Gambar</h1>

            {/* Form untuk memilih file */}
            <div className="flex gap-4">
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
                <button onClick={handleCancel}>Cancel</button> {/* Add the Cancel button */}
            </div>

            {/* Status upload */}
            {uploadStatus && <p>{uploadStatus}</p>}

            {/* Tombol untuk memeriksa file */}
            {filename && (
                <div>
                    <button onClick={handleCheckFile}>Periksa File</button>
                </div>
            )}

            {/* Tampilkan gambar jika berhasil diambil */}
            {imageUrl && (
                <div>
                    <h2>Gambar yang Diunggah:</h2>
                    <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "100%", height: "auto" }} />
                </div>
            )}

            {/* Tampilkan semua gambar yang tersimpan */}
            <div>
                <h2>Semua Gambar yang Tersimpan:</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {allImages.map((image, index) => (
                        <div key={index} style={{ border: "1px solid #ccc", padding: "10px" }} className="flex flex-col items-center gap-10">
                            <img
                                src={`http://localhost:8000/upload/get-map-sketch/${image}`}
                                alt={image}
                                style={{ maxWidth: "200px", height: "auto" }}
                            />
                            <p>{image}</p>
                            <button onClick={() => handleDeleteFile(image)}>Hapus</button>
                            <button onClick={() => setSelectedFile(image)}>Pilih untuk Update</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form untuk memperbarui file */}
            {selectedFile && (
                <div>
                    <h2>Perbarui File: {selectedFile}</h2>
                    <input
                        type="file"
                        accept="image/jpg,image/jpeg"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <button onClick={handleUpdateFile}>Perbarui File</button>
                </div>
            )}
        </div>
    );
}