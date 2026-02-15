
import React, { useState, useEffect } from 'react';
import './ProfileEditor.css';

interface Experience {
    company: string;
    role: string;
    location: string;
    dates: string;
    bullets: string[];
}

interface Education {
    school: string;
    degree: string;
    year: string;
}

export interface Profile {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    experience: Experience[];
    education: Education[];
    skills: string[];
}

interface ProfileEditorProps {
    initialProfile: Profile;
    onSave: (profile: Profile) => void;
    onCancel: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ initialProfile, onSave, onCancel }) => {
    const [profile, setProfile] = useState<Profile>(initialProfile);

    const handleChange = (field: keyof Profile, value: string) => {
        setProfile({ ...profile, [field]: value });
    };

    // --- Skills ---
    const handleSkillChange = (index: number, value: string) => {
        const newSkills = [...profile.skills];
        newSkills[index] = value;
        setProfile({ ...profile, skills: newSkills });
    };

    const addSkill = () => {
        setProfile({ ...profile, skills: [...profile.skills, ""] });
    };

    const removeSkill = (index: number) => {
        const newSkills = profile.skills.filter((_, i) => i !== index);
        setProfile({ ...profile, skills: newSkills });
    };

    // --- Experience ---
    const handleExpChange = (index: number, field: keyof Experience, value: string) => {
        const newExp = [...profile.experience];
        newExp[index] = { ...newExp[index], [field]: value };
        setProfile({ ...profile, experience: newExp });
    };

    const handleExpBulletChange = (expIndex: number, bulletIndex: number, value: string) => {
        const newExp = [...profile.experience];
        const newBullets = [...newExp[expIndex].bullets];
        newBullets[bulletIndex] = value;
        newExp[expIndex].bullets = newBullets;
        setProfile({ ...profile, experience: newExp });
    }

    const addExpBullet = (expIndex: number) => {
        const newExp = [...profile.experience];
        newExp[expIndex].bullets.push("");
        setProfile({ ...profile, experience: newExp });
    }

    const removeExpBullet = (expIndex: number, bulletIndex: number) => {
        const newExp = [...profile.experience];
        newExp[expIndex].bullets = newExp[expIndex].bullets.filter((_, i) => i !== bulletIndex);
        setProfile({ ...profile, experience: newExp });
    }

    const addExperience = () => {
        setProfile({
            ...profile,
            experience: [
                ...profile.experience,
                { company: "", role: "", location: "", dates: "", bullets: [""] }
            ]
        });
    };

    const removeExperience = (index: number) => {
        const newExp = profile.experience.filter((_, i) => i !== index);
        setProfile({ ...profile, experience: newExp });
    };

    // --- Education ---
    const handleEduChange = (index: number, field: keyof Education, value: string) => {
        const newEdu = [...profile.education];
        newEdu[index] = { ...newEdu[index], [field]: value };
        setProfile({ ...profile, education: newEdu });
    };

    const addEducation = () => {
        setProfile({
            ...profile,
            education: [...profile.education, { school: "", degree: "", year: "" }]
        });
    };

    const removeEducation = (index: number) => {
        const newEdu = profile.education.filter((_, i) => i !== index);
        setProfile({ ...profile, education: newEdu });
    };

    return (
        <div className="profile-editor">
            <div className="editor-header">
                <h2>Edit Master Profile</h2>
                <div className="actions">
                    <button className="secondary-btn" onClick={onCancel}>Cancel</button>
                    <button className="primary-btn" onClick={() => onSave(profile)}>Save Changes</button>
                </div>
            </div>

            <div className="section">
                <h3>Contact Info</h3>
                <div className="form-group-row">
                    <input
                        type="text" placeholder="Full Name"
                        value={profile.name} onChange={(e) => handleChange('name', e.target.value)}
                    />
                    <input
                        type="email" placeholder="Email"
                        value={profile.email} onChange={(e) => handleChange('email', e.target.value)}
                    />
                    <input
                        type="text" placeholder="Phone"
                        value={profile.phone} onChange={(e) => handleChange('phone', e.target.value)}
                    />
                    <input
                        type="text" placeholder="LinkedIn URL"
                        value={profile.linkedin} onChange={(e) => handleChange('linkedin', e.target.value)}
                    />
                </div>
            </div>

            <div className="section">
                <h3>Experience</h3>
                {profile.experience.map((exp, i) => (
                    <div key={i} className="card-item">
                        <div className="form-group-row">
                            <input
                                placeholder="Company" value={exp.company}
                                onChange={(e) => handleExpChange(i, 'company', e.target.value)}
                            />
                            <input
                                placeholder="Role" value={exp.role}
                                onChange={(e) => handleExpChange(i, 'role', e.target.value)}
                            />
                        </div>
                        <div className="form-group-row">
                            <input
                                placeholder="Location" value={exp.location}
                                onChange={(e) => handleExpChange(i, 'location', e.target.value)}
                            />
                            <input
                                placeholder="Dates" value={exp.dates}
                                onChange={(e) => handleExpChange(i, 'dates', e.target.value)}
                            />
                        </div>
                        <div className="bullets-section">
                            <label>Key Achievements:</label>
                            {exp.bullets.map((b, bi) => (
                                <div key={bi} className="bullet-row">
                                    <textarea
                                        value={b}
                                        onChange={(e) => handleExpBulletChange(i, bi, e.target.value)}
                                        rows={2}
                                    />
                                    <button className="icon-btn" onClick={() => removeExpBullet(i, bi)}>×</button>
                                </div>
                            ))}
                            <button className="small-btn" onClick={() => addExpBullet(i)}>+ Add Bullet</button>
                        </div>
                        <button className="remove-btn" onClick={() => removeExperience(i)}>Remove Role</button>
                    </div>
                ))}
                <button className="add-btn" onClick={addExperience}>+ Add Experience</button>
            </div>

            <div className="section">
                <h3>Education</h3>
                {profile.education.map((edu, i) => (
                    <div key={i} className="card-item">
                        <div className="form-group-row">
                            <input
                                placeholder="School" value={edu.school}
                                onChange={(e) => handleEduChange(i, 'school', e.target.value)}
                            />
                            <input
                                placeholder="Degree" value={edu.degree}
                                onChange={(e) => handleEduChange(i, 'degree', e.target.value)}
                            />
                            <input
                                placeholder="Year" value={edu.year}
                                onChange={(e) => handleEduChange(i, 'year', e.target.value)}
                            />
                        </div>
                        <button className="remove-btn" onClick={() => removeEducation(i)}>Remove</button>
                    </div>
                ))}
                <button className="add-btn" onClick={addEducation}>+ Add Education</button>
            </div>

            <div className="section">
                <h3>Skills</h3>
                <div className="skills-grid">
                    {profile.skills.map((skill, i) => (
                        <div key={i} className="skill-input">
                            <input
                                value={skill}
                                onChange={(e) => handleSkillChange(i, e.target.value)}
                            />
                            <button className="icon-btn" onClick={() => removeSkill(i)}>×</button>
                        </div>
                    ))}
                    <button className="small-btn" onClick={addSkill}>+ Add Skill</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditor;
