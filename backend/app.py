
from flask import Flask, jsonify, request
from utils.parsing import parse_resume_file
from utils.ai_client import ai_client

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(port=5000, debug=True)
