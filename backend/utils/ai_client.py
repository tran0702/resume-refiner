
import os
import google.generativeai as genai
import anthropic
from dotenv import load_dotenv

load_dotenv()

class AIClient:
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.claude_key = os.getenv("CLAUDE_API_KEY")
        
        self.gemini_configured = False
        if self.gemini_key:
            genai.configure(api_key=self.gemini_key)
            self.gemini_model = genai.GenerativeModel('gemini-pro')
            self.gemini_configured = True
            
        self.claude_client = None
        if self.claude_key:
            self.claude_client = anthropic.Anthropic(api_key=self.claude_key)

    def generate_content(self, prompt, provider="gemini"):
        """
        Generates content using the specified provider.
        provider: "gemini" or "claude"
        """
        if provider == "gemini":
            if not self.gemini_configured:
                return "Error: Gemini API key not found. Please check .env file."
            try:
                response = self.gemini_model.generate_content(prompt)
                return response.text
            except Exception as e:
                return f"Gemini Error: {str(e)}"
        
        elif provider == "claude":
            if not self.claude_client:
                return "Error: Claude API key not found. Please check .env file."
            try:
                message = self.claude_client.messages.create(
                    model="claude-3-opus-20240229",
                    max_tokens=2000,
                    messages=[
                        {"role": "user", "content": prompt}
                    ]
                )
                return message.content[0].text
            except Exception as e:
                return f"Claude Error: {str(e)}"
        
        else:
            return "Error: Unknown provider specified."

# Singleton instance
ai_client = AIClient()
