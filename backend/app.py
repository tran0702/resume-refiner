
from flask import Flask, jsonify, request, send_file
from utils.parsing import parse_resume_file
from utils.ai_client import ai_client
from utils.resume_builder import ResumeBuilder
from utils.cover_letter_builder import CoverLetterBuilder
import tempfile
import os

app = Flask(__name__)

# ... existing routes ...

@app.route('/api/generate-cover-letter', methods=['POST'])
def generate_cover_letter():
    data = request.json
    if not data or 'profile' not in data or 'letter_body' not in data:
        return jsonify({"error": "Missing profile or letter body"}), 400
    
    profile = data['profile']
    letter_body = data['letter_body']
    job_title = data.get('job_title', 'Role')
    
    # Clean job title for filename
    safe_title = "".join([c for c in job_title if c.isalnum() or c in (' ', '-', '_')]).strip()
    filename = f"{safe_title} - Cover Letter - Applied.docx"
    
    try:
        builder = CoverLetterBuilder(profile, letter_body)
        
        # Create a temp file
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, filename)
        
        builder.build(file_path)
        
        return send_file(file_path, as_attachment=True, download_name=filename)
        
    except Exception as e:
        return jsonify({"error": f"Generation failed: {str(e)}"}), 500

# ... existing routes ...

@app.route('/api/generate-resume', methods=['POST'])
def generate_resume():
    data = request.json
    if not data or 'profile' not in data:
        return jsonify({"error": "No profile data provided"}), 400
    
    profile = data['profile']
    job_title = data.get('job_title', 'Role')
    template_name = data.get('template', 'harvard')
    
    # Clean job title for filename
    safe_title = "".join([c for c in job_title if c.isalnum() or c in (' ', '-', '_')]).strip()
    filename = f"{safe_title} - Resume - Applied.docx"
    
    try:
        builder = ResumeBuilder(profile, template_name=template_name)
        
        # Create a temp file
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, filename)
        
        builder.build(file_path)
        
        return send_file(file_path, as_attachment=True, download_name=filename)
        
    except Exception as e:
        return jsonify({"error": f"Generation failed: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running!"})

@app.route('/api/upload-resume', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    extracted_text = parse_resume_file(file)
    
    return jsonify({
        "message": "File processed successfully",
        "filename": file.filename,
        "extracted_text": extracted_text
    })

@app.route('/api/analyze-job', methods=['POST'])
def analyze_job():
    data = request.json
    if not data or 'job_description' not in data:
        return jsonify({"error": "No job description provided"}), 400
    
    job_description = data['job_description']
    provider = data.get('provider', 'gemini')
    
    prompt = f"""
    Analyze the following job description. 
    1. Extract key skills and requirements.
    2. Summarize the role in 2 sentences.
    
    Job Description:
    {job_description}
    """
    
    result = ai_client.generate_content(prompt, provider=provider)
    
    return jsonify({
        "analysis": result
    })

@app.route('/api/parse-profile', methods=['POST'])
def parse_profile():
    data = request.json
    if not data or 'resume_text' not in data:
        return jsonify({"error": "No resume text provided"}), 400
    
    resume_text = data['resume_text']
    provider = data.get('provider', 'gemini')
    
    prompt = f"""
    Extract the following information from the resume text and return it as a VALID JSON object.
    Do not include markdown formatting (like ```json). Just the raw JSON string.
    
    Structure:
    {{
        "name": "Full Name",
        "email": "email@example.com",
        "phone": "phone number",
        "linkedin": "linkedin url",
        "education": [
            {{ "school": "School Name", "degree": "Degree", "year": "Year" }}
        ],
        "experience": [
            {{ 
                "company": "Company Name", 
                "role": "Job Title", 
                "location": "Location", 
                "dates": "Date Range", 
                "bullets": ["bullet 1", "bullet 2"] 
            }}
        ],
        "skills": ["skill 1", "skill 2", "skill 3"]
    }}
    
    Resume Text:
    {resume_text}
    """
    
    try:
        result_text = ai_client.generate_content(prompt, provider=provider)
        # Clean up if AI adds markdown
        cleaned_text = result_text.replace('```json', '').replace('```', '').strip()
        import json
        profile_json = json.loads(cleaned_text)
        return jsonify(profile_json)
    except Exception as e:
        return jsonify({"error": f"Failed to parse profile: {str(e)}", "raw_response": result_text if 'result_text' in locals() else ""}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
