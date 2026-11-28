import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from dotenv import load_dotenv
import logging

load_dotenv('../../.env')

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

# Store conversation history for context
conversation_history = []

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'service': 'python-chatgpt'
    }), 200

@app.route('/chat', methods=['POST'])
def chat():
    """
    Main chat endpoint - integrates with OpenAI ChatGPT API
    Expected JSON: {"message": "user message", "temperature": 0.7}
    """
    try:
        data = request.get_json()
        user_message = data.get('message')
        temperature = data.get('temperature', 0.7)

        if not user_message:
            return jsonify({'error': 'Message is required'}), 400

        # Add user message to conversation history
        conversation_history.append({
            'role': 'user',
            'content': user_message
        })

        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=conversation_history,
            temperature=temperature,
            max_tokens=2000
        )

        assistant_message = response['choices'][0]['message']['content']

        # Add assistant response to conversation history
        conversation_history.append({
            'role': 'assistant',
            'content': assistant_message
        })

        return jsonify({
            'status': 'success',
            'message': assistant_message,
            'tokens_used': response['usage']['total_tokens'],
            'conversation_id': id(conversation_history)
        }), 200

    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'error': 'Failed to process chat request',
            'details': str(e)
        }), 500

@app.route('/chat/reset', methods=['POST'])
def reset_conversation():
    """Reset conversation history"""
    global conversation_history
    conversation_history = []
    return jsonify({'status': 'success', 'message': 'Conversation history cleared'}), 200

@app.route('/chat/summary', methods=['POST'])
def get_summary():
    """Get a summary of the conversation"""
    try:
        if not conversation_history:
            return jsonify({'summary': 'No conversation yet'}), 200

        summary_prompt = "Provide a brief summary of this conversation in 2-3 sentences."
        
        response = openai.ChatCompletion.create(
            model='gpt-3.5-turbo',
            messages=conversation_history + [{'role': 'user', 'content': summary_prompt}],
            temperature=0.5,
            max_tokens=500
        )

        summary = response['choices'][0]['message']['content']
        return jsonify({
            'status': 'success',
            'summary': summary
        }), 200

    except Exception as e:
        logger.error(f"Error in summary endpoint: {str(e)}")
        return jsonify({'error': 'Failed to generate summary'}), 500

@app.route('/config', methods=['GET'])
def get_config():
    """Get service configuration"""
    return jsonify({
        'service': 'python-chatgpt',
        'model': 'gpt-3.5-turbo',
        'api_configured': bool(os.getenv('OPENAI_API_KEY')),
        'conversation_active': len(conversation_history) > 0,
        'endpoints': {
            'chat': '/chat',
            'reset': '/chat/reset',
            'summary': '/chat/summary',
            'health': '/health'
        }
    }), 200

@app.route('/models', methods=['GET'])
def list_models():
    """List available OpenAI models"""
    try:
        models = openai.Model.list()
        return jsonify({
            'status': 'success',
            'models': [m['id'] for m in models['data'][:10]]
        }), 200
    except Exception as e:
        logger.error(f"Error listing models: {str(e)}")
        return jsonify({'error': 'Failed to list models'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PYTHON_PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
