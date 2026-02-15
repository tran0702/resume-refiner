
import React, { useState } from 'react';
import './FileUpload.css';

interface FileUploadProps {
    label: string;
    onTextExtracted: (text: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onTextExtracted }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload-resume', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.extracted_text) {
                onTextExtracted(data.extracted_text);
            } else {
                setError("No text extracted from file.");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "An error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="file-upload-container">
            <h3>{label}</h3>
            <div className="upload-box">
                <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="primary-btn"
                >
                    {uploading ? "Processing..." : "Upload & Parse"}
                </button>
            </div>
            {error && <p className="error-msg">{error}</p>}
            {file && <p className="file-name">Selected: {file.name}</p>}
        </div>
    );
};

export default FileUpload;
