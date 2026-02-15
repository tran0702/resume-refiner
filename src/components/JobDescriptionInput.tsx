
import React, { useState } from 'react';
import FileUpload from './FileUpload';
import './JobDescriptionInput.css';

interface JobDescriptionInputProps {
    onTextChange: (text: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ onTextChange }) => {
    const [mode, setMode] = useState<'upload' | 'paste'>('paste');
    const [text, setText] = useState('');

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);
        onTextChange(newText);
    };

    const handleFileUpload = (extractedText: string) => {
        setText(extractedText);
        onTextChange(extractedText);
        setMode('paste'); // Switch to paste view to show extracted text
    };

    return (
        <div className="jd-input-container">
            <h3>Job Description</h3>
            <div className="tabs">
                <button
                    className={mode === 'paste' ? 'active-tab' : ''}
                    onClick={() => setMode('paste')}
                >
                    Paste Text
                </button>
                <button
                    className={mode === 'upload' ? 'active-tab' : ''}
                    onClick={() => setMode('upload')}
                >
                    Upload File
                </button>
            </div>

            <div className="input-area">
                {mode === 'paste' ? (
                    <textarea
                        className="jd-textarea"
                        placeholder="Paste job description here..."
                        value={text}
                        onChange={handleTextChange}
                    />
                ) : (
                    <FileUpload
                        label="Upload Job Description (PDF/DOCX)"
                        onTextExtracted={handleFileUpload}
                    />
                )}
            </div>
        </div>
    );
};

export default JobDescriptionInput;
