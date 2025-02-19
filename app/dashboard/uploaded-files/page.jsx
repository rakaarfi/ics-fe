'use client'

import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Grid, List, Pencil, Eye } from "lucide-react"; // Ikon modern
import dynamic from "next/dynamic";
import { DocViewerRenderers, MSDocRenderer } from "@cyntler/react-doc-viewer";

const DocViewer = dynamic(() => import("@cyntler/react-doc-viewer"), { ssr: false });

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [filename, setFilename] = useState("");
    const [fileUrl, setfileUrl] = useState("");
    const [allFiles, setAllFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [viewMode, setViewMode] = useState("grid"); // Default ke grid
    const [previewFile, setPreviewFile] = useState(null);

    const fileInputRef = useRef(null); // Create a reference for the file input
    const apiUrl = 'http://127.0.0.1:8000/'

    // Fungsi untuk mengambil daftar semua gambar
    const fetchAllFiles = async () => {
        try {
            const response = await axios.get(`${apiUrl}file/list/`);
            if (response.status === 200) {
                setAllFiles(response.data.files);
            } else {
                console.error("Failed to retrieve the image list.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Ambil daftar file saat komponen dimuat
    useEffect(() => {
        fetchAllFiles();
    }, []);

    // Fungsi untuk mengunggah file
    const handleUpload = async () => {
        if (!file) {
            alert("Select the file first!");
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
                setUploadStatus("File uploaded successfully!");
                setFilename(response.data.filename);
                fetchAllFiles();
            } else {
                setUploadStatus("Failed to upload the file.");
            }
        } catch (error) {
            console.error("Error:", error);
            setUploadStatus("An error occurred while uploading the file.");
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
            alert("No files uploaded yet!");
            return;
        }

        try {
            const response = await axios.get(
                `${apiUrl}file/get/${filename}`,
                { responseType: "blob" }
            );

            if (response.status === 200) {
                const fileUrl = URL.createObjectURL(response.data);
                setfileUrl(fileUrl);
            } else {
                alert("File not found.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while checking the file.");
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
                // Refresh daftar file setelah menghapus
                fetchAllFiles();
            } else {
                alert("Failed to delete the file.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while deleting the file.");
        }
    };

    // Fungsi untuk memperbarui file
    const handleUpdateFile = async () => {
        if (!selectedFile || !file) {
            alert("Select the file first!");
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
                fetchAllFiles();
            } else {
                alert("Failed to update the file.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while updating the file.");
        }
    };

    // Ubah fungsi handlePreview menjadi seperti ini
    const handlePreview = async (filename) => {
        try {
            // Ambil file sebagai blob
            const response = await axios.get(
                `${apiUrl}file/get/${filename}`,
                { responseType: 'blob' }
            );

            if (response.status === 200) {
                // Dapatkan tipe MIME yang sebenarnya dari response
                const fileType = response.headers['content-type'] || getMimeType(filename);
                const blob = response.data;

                // Buat URL objek dari blob
                const fileUrl = URL.createObjectURL(blob);

                const docs = [{
                    uri: fileUrl,
                    fileName: filename,
                    fileType: fileType
                }]

                setPreviewFile(docs);
            }
        } catch (error) {
            console.error("Error previewing file:", error);
            alert("Failed to preview the file");
        }
    };

    // Tambahkan fungsi helper untuk mendeteksi tipe MIME berdasarkan ekstensi
    const getMimeType = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        const mimeTypes = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'txt': 'text/plain',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif'
        };

        return mimeTypes[extension] || 'application/octet-stream';
    };

    const isImage = (filename) => {
        if (filename) {
            // Determine file type from the filename extension
            const extension = filename.split('.').pop().toLowerCase();
            return ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension);
        }
        return false;
    };

    const docs = [
        {
            uri: "https://calibre-ebook.com/downloads/demos/demo.docx",
            fileType: "docx",
            fileName: "demo.docx"
        }
    ]


    return (
        <>
            <div className="lg:ml-[17rem] ml-[9rem] my-10 p-6 bg-gray-100 rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold mb-4">Upload and Review Files</h1>

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
                {fileUrl && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-2">Uploaded Files:</h2>
                        <img
                            src={fileUrl}
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
                    <h2 className="text-lg font-semibold">All Saved Files:</h2>

                    <div className={viewMode === "grid" ? "grid grid-cols-3 gap-4 mt-4" : "flex flex-col gap-4 mt-4"}>
                        {allFiles.map((fileName, index) => (
                            <div
                                key={index}
                                className={`border p-3 rounded-lg shadow-md bg-white ${viewMode === "grid" ? "flex flex-col items-center" : "flex items-center gap-4"
                                    }`}
                            >
                                {isImage(fileName) ? (
                                    <img
                                        src={`${apiUrl}file/get/${fileName}`}
                                        alt={fileName}
                                        className={viewMode === "grid" ? "w-40 h-auto rounded-lg" : "w-20 h-20 rounded-lg"}
                                    />
                                ) : (
                                    <button onClick={() => handlePreview(fileName)} className="px-3 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2">
                                        <Eye size={18} /> Preview
                                    </button>
                                )}
                                <p className="text-sm text-gray-700">{fileName.length > 25 ? `${fileName.substring(0, 25)}...` : fileName}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {previewFile && (
                    <div className="mt-6 p-4 bg-white shadow-lg rounded-lg">
                        <h2 className="text-lg font-semibold">File Preview: {previewFile.fileName}</h2>
                        <DocViewer
                            documents={docs}
                            config={{
                                header: {
                                    disableHeader: false,
                                    disableFileName: false,
                                    retainURLParams: false
                                }
                            }}
                            pluginRenderers={[...DocViewerRenderers, MSDocRenderer]}
                        />
                        <div className="mt-4">
                            <a
                                href={previewFile.uri}
                                download={previewFile.fileName}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg inline-block hover:bg-blue-600"
                            >
                                Download File
                            </a>
                        </div>
                    </div>
                )}
            </div>

        </>
    );
}