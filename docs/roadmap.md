
# Resume Refiner - Product Roadmap & Strategy

## 1. Goal Description
Build a local desktop application that customizes resumes and cover letters based on a master profile and job description, utilizing AI (Gemini/Claude) to optimize for keywords and generate interview preparation materials.

## 2. Technical Strategy & Architecture
- **Frontend**: React (Typescript) wrapped in Electron. 
    - *Why*: Ensures a cross-platform desktop experience (Windows/Mac/Linux) while allowing for easy transition to a web application in the future.
- **Backend (Local)**: Python (Flask).
    - *Why*: Python offers superior libraries for natural language processing (`pdfminer.six`) and document generation (`python-docx`). Run locally to keep user data private initially.
- **AI Integration**: Modular API interface.
    - *Why*: Supports switching between providers (Google Gemini, Anthropic Claude) to avoid vendor lock-in and optimize for cost/performance.

## 3. Implementation Phases

### Phase 0: Initialization & Security (Completed)
- [x] Git Repository Setup & .gitignore
- [x] Security: Secure API key storage (.env)

### Phase 1: Foundation & Setup (Completed)
- [x] Project Repository: Electron + React boilerplate.
- [x] Backend Integration: Local Python Flask server.
- [x] Basic UI Skeleton: Profile Upload, Job Description Input, Results View.
- [x] Design System: "Tokyo Night" Theme (Minimalist, No Icons).

### Phase 2: Core Processing Engine (Completed)
- [x] Document Ingestion: PDF/DOCX/TXT parsing.
- [x] AI Orchestrator: Unified API handler for Gemini/Claude.
- [x] Job Analysis: `analyze-job` endpoint to extract requirements.

### Phase 3: Template & Document Generation (In Progress)
- [ ] **Resume Builder**:
    -   "Master Profile" data structure.
    -   Harvard Style Template engine.
    -   Section Toggles (Skills, Volunteer, Hobbies).
    -   Page Limit Enforcer (Max 2 pages).
    -   **File Naming**: `[Job Title] - Resume - Applied`.
- [ ] **Cover Letter Generator**:
    -   Length Control (Max 2 pages).
    -   Header/Footer toggles.
    -   **File Naming**: `[Job Title] - Cover Letter - Applied`.

### Phase 4: User Experience & Features (Planned)
- [ ] **Profile Management**: Manual edit of parsed profile data.
- [ ] **Template Selection**: Visual picker for layouts.
- [ ] **Application Helper UI**:
    -   Salary Research (Market & Level selection).
    -   Application Q&A (Visa status, "Why us?").
- [ ] **Interview Prep Module**: On-demand Q&A generation.

### Phase 5: Testing & Packaging (Planned)
- [ ] Validation with various resume formats.
- [ ] Packaging (.exe/.dmg) using `electron-builder`.

## 4. Future Expansion (Web/Mobile)
-   **Web Port**: Host React frontend on Vercel/Netlify; deploy Python backend to AWS Lambda/GCP Cloud Run.
-   **Mobile**: Use React Native for frontend; reuse cloud backend API.
