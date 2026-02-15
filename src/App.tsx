import { useState, useEffect } from 'react'
import './App.css'
import FileUpload from './components/FileUpload'
import JobDescriptionInput from './components/JobDescriptionInput'
import ProfileEditor, { Profile } from './components/ProfileEditor'
import TemplateSelector from './components/TemplateSelector'

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('Checking backend...')
  const [resumeText, setResumeText] = useState<string>('')
  const [jobDescText, setJobDescText] = useState<string>('')

  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isParsing, setIsParsing] = useState(false)

  const [selectedTemplate, setSelectedTemplate] = useState<string>('harvard')

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setBackendStatus(data.message))
      .catch(err => setBackendStatus('Backend not connected (Launch backend/app.py manually)'))
  }, [])

  const handleResumeExtracted = async (text: string) => {
    setResumeText(text);
    setIsParsing(true);

    // Auto-parse profile
    try {
      const res = await fetch('/api/parse-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: text })
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setIsEditingProfile(true); // Auto-open editor
      } else {
        console.error("Failed to parse profile");
        alert("Could not auto-parse profile. Why? " + res.statusText);
        // Fallback: Create empty/partial profile?
        setProfile({
          name: "", email: "", phone: "", linkedin: "",
          experience: [], education: [], skills: []
        });
        setIsEditingProfile(true);
      }
    } catch (e) {
      console.error(e);
      alert("Error connecting to AI for parsing.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSaveProfile = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    setIsEditingProfile(false);
  };

  const handleGenerateResume = async () => {
    if (!profile) return;

    const jobTitle = "Software Engineer"; // TODO: Extract from JD or User Input

    try {
      const res = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          job_title: jobTitle,
          template: selectedTemplate
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${jobTitle} - Resume - Applied.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to generate resume.");
      }
    } catch (e) {
      alert("Error generating resume.");
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Resume Refiner</h1>
        <p className="status-bar">
          System Status: <span className={backendStatus.includes('healthy') ? 'status-ok' : 'status-err'}>{backendStatus}</span>
        </p>
      </header>

      {isEditingProfile && profile ? (
        <ProfileEditor
          initialProfile={profile}
          onSave={handleSaveProfile}
          onCancel={() => setIsEditingProfile(false)}
        />
      ) : (
        <main className="grid-layout">
          <section className="column">
            <FileUpload
              label="Upload Master Resume (PDF/DOCX)"
              onTextExtracted={handleResumeExtracted}
            />
            {isParsing && <p className="status-msg">Parsing profile with AI...</p>}

            {profile && (
              <div className="profile-summary">
                <h3>Profile Loaded: {profile.name}</h3>

                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onSelect={setSelectedTemplate}
                />

                <div className="button-group">
                  <button onClick={() => setIsEditingProfile(true)}>Edit Profile</button>
                  <button className="primary-btn" onClick={handleGenerateResume}>
                    Generate Resume ({selectedTemplate})
                  </button>
                </div>
              </div>
            )}

            {!profile && (
              <div className="preview-box">
                <h4>Resume Content Preview</h4>
                <textarea
                  value={resumeText}
                  readOnly
                  placeholder="Extracted resume text will appear here..."
                />
              </div>
            )}
          </section>

          <section className="column">
            <JobDescriptionInput
              onTextChange={(text) => setJobDescText(text)}
            />
          </section>
        </main>
      )}
    </div>
  )
}

export default App
