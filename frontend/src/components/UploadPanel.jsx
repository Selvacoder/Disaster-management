import { useCallback, useState } from 'react';
import './UploadPanel.css';

export default function UploadPanel({ onUploadSuccess }) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);

    const validateFile = (file) => {
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            return 'Please upload a PNG or JPG image';
        }
        if (file.size > maxSize) {
            return 'File size must be less than 5MB';
        }
        return null;
    };

    const handleFile = async (file) => {
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        setUploading(true);

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);

        // Upload to backend
        const formData = new FormData();
        formData.append('blueprint', file);

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.status === 'success') {
                onUploadSuccess(data.building);
            } else {
                setError('Upload failed. Please try again.');
            }
        } catch (err) {
            setError('Failed to connect to server. Is the backend running?');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, []);

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    };

    return (
        <div className="upload-panel">
            <h2>📐 Upload Blueprint</h2>

            <div
                className={`drop-zone ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => document.getElementById('file-input').click()}
            >
                <input
                    id="file-input"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={onFileSelect}
                    style={{ display: 'none' }}
                />

                {uploading ? (
                    <div className="upload-status">
                        <div className="spinner"></div>
                        <p>Processing blueprint...</p>
                    </div>
                ) : preview ? (
                    <div className="preview">
                        <img src={preview} alt="Blueprint preview" />
                        <p className="preview-label">Click to upload different blueprint</p>
                    </div>
                ) : (
                    <div className="upload-prompt">
                        <div className="upload-icon">📄</div>
                        <p className="main-text">Drop blueprint here</p>
                        <p className="sub-text">or click to browse</p>
                        <p className="format-text">PNG, JPG (max 5MB)</p>
                    </div>
                )}
            </div>

            {error && (
                <div className="error-message">
                    ⚠️ {error}
                </div>
            )}
        </div>
    );
}
