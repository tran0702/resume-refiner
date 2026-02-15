
import React from 'react';
import './TemplateSelector.css';

interface TemplateSelectorProps {
    selectedTemplate: string;
    onSelect: (template: string) => void;
}

const templates = [
    { id: 'harvard', name: 'Harvard Style', desc: 'Classic, text-heavy, perfect for ATS.', color: '#2c3e50' },
    { id: 'modern', name: 'Modern Clean', desc: 'Sleek with subtle accents.', color: '#2980b9' },
    { id: 'tech', name: 'Tech Minimalist', desc: 'Streamlined for developers.', color: '#27ae60' }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onSelect }) => {
    return (
        <div className="template-selector">
            <h3>Select Resume Template</h3>
            <div className="template-grid">
                {templates.map((t) => (
                    <div
                        key={t.id}
                        className={`template-card ${selectedTemplate === t.id ? 'active' : ''}`}
                        onClick={() => onSelect(t.id)}
                        style={{ borderColor: selectedTemplate === t.id ? t.color : 'var(--border-color)' }}
                    >
                        <div className="template-preview" style={{ backgroundColor: t.color }}>
                            <span>{t.name[0]}</span>
                        </div>
                        <div className="template-info">
                            <h4>{t.name}</h4>
                            <p>{t.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplateSelector;
