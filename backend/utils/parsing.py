
import os
from pdfminer.high_level import extract_text
from docx import Document
import io

def extract_text_from_pdf(file_stream):
    """Extracts text from a PDF file stream."""
    try:
        text = extract_text(file_stream)
        return text
    except Exception as e:
        return f"Error extracting PDF: {str(e)}"

def extract_text_from_docx(file_stream):
    """Extracts text from a DOCX file stream."""
    try:
        doc = Document(file_stream)
        text = []
        for paragraph in doc.paragraphs:
            text.append(paragraph.text)
        return '\n'.join(text)
    except Exception as e:
        return f"Error extracting DOCX: {str(e)}"

def extract_text_from_txt(file_stream):
    """Extracts text from a TXT file stream."""
    try:
        # constant decoding
        return file_stream.read().decode('utf-8')
    except Exception as e:
        return f"Error extracting TXT: {str(e)}"

def parse_resume_file(file_storage):
    """
    Determines file type and extracts text accordingly.
    file_storage: Werkzeug FileStorage object.
    """
    filename = file_storage.filename.lower()
    
    # We need to read the file stream. 
    # For some libraries we might need to seek(0) if read multiple times, 
    # but here we pass it once.
    
    if filename.endswith('.pdf'):
        return extract_text_from_pdf(file_storage.stream)
    elif filename.endswith('.docx'):
        return extract_text_from_docx(file_storage.stream)
    elif filename.endswith('.txt'):
        return extract_text_from_txt(file_storage.stream)
    else:
        return "Unsupported file format. Please upload PDF, DOCX, or TXT."
