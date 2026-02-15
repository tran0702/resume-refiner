
import { useState, useEffect } from 'react'
import './App.css'
import FileUpload from './components/FileUpload'
import JobDescriptionInput from './components/JobDescriptionInput'

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('Checking backend...')
  const [resumeText, setResumeText] = useState<string>('')
  const [jobDescText, setJobDescText] = useState<string>('')

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setBackendStatus(data.message))
      .catch(err => setBackendStatus('Backend not connected (Launch backend/app.py manually)'))
  }, [])

  return (
    <div className="container">
      <header>
        <h1>Resume Refiner</h1>
        <p className="status-bar">
          System Status: <span className={backendStatus.includes('healthy') ? 'status-ok' : 'status-err'}>{backendStatus}</span>
        </p>
      </header>

      <main className="grid-layout">
        <section className="column">
          <FileUpload
            label="Upload Master Resume (PDF/DOCX)"
            onTextExtracted={(text) => setResumeText(text)}
          />
          <div className="preview-box">
            <h4>Resume Content Preview</h4>
            <textarea
              value={resumeText}
              readOnly
              placeholder="Extracted resume text will appear here..."
            />
          </div>
        </section>

        <section className="column">
          <JobDescriptionInput
            onTextChange={(text) => setJobDescText(text)}
          />
        </section>
      </main>
    </div>
  )
}

export default App
