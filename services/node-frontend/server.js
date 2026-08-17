const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config('../../.env');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuration
const GO_API_URL = process.env.GO_API_URL || 'http://localhost:3000';
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';
const NODE_PORT = process.env.NODE_PORT || 8080;

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'node-frontend'
  });
});

// Proxy requests to ChatGPT service
app.post('/api/chat', async (req, res) => {
  try {
    const { message, temperature } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await axios.post(`${PYTHON_SERVICE_URL}/chat`, {
      message,
      temperature: temperature || 0.7
    });

    res.json(response.data);
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({
      error: 'Failed to process chat request',
      details: error.message
    });
  }
});

// Reset conversation
app.post('/api/chat/reset', async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_SERVICE_URL}/chat/reset`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset conversation' });
  }
});

// Get conversation summary
app.get('/api/chat/summary', async (req, res) => {
  try {
    const response = await axios.post(`${PYTHON_SERVICE_URL}/chat/summary`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get summary' });
  }
});

// Get service status
app.get('/api/services', async (req, res) => {
  try {
    const goResponse = await axios.get(`${GO_API_URL}/health`).catch(() => null);
    const pythonResponse = await axios.get(`${PYTHON_SERVICE_URL}/health`).catch(() => null);

    res.json({
      services: {
        go_api: goResponse ? 'active' : 'inactive',
        python_chatgpt: pythonResponse ? 'active' : 'inactive',
        node_frontend: 'active'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check services' });
  }
});

// Serve main page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>OperatorPages - ChatGPT Integration</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .content { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .chat-box { grid-column: 1 / -1; }
        .messages { height: 400px; overflow-y: auto; margin-bottom: 20px; border: 1px solid #ddd; padding: 10px; border-radius: 4px; }
        .message { margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 4px; }
        .message.user { background: #007bff; color: white; text-align: right; }
        .message.assistant { background: #28a745; color: white; }
        input, button { padding: 10px; margin: 5px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #007bff; color: white; cursor: pointer; }
        button:hover { background: #0056b3; }
        h1 { color: #333; margin-bottom: 20px; }
        .status { margin: 10px 0; padding: 10px; border-radius: 4px; }
        .status.active { background: #d4edda; color: #155724; }
        .status.inactive { background: #f8d7da; color: #721c24; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>OperatorPages - ChatGPT Integration</h1>
          <p>Integrated with Python ChatGPT, Go API, and Node.js Frontend</p>
        </div>

        <div class="content">
          <div class="card">
            <h2>Service Status</h2>
            <div id="status-container"></div>
          </div>

          <div class="card">
            <h2>Configuration</h2>
            <div id="config-container"></div>
          </div>

          <div class="chat-box">
            <h2>Chat with ChatGPT</h2>
            <div class="messages" id="messages"></div>
            <div>
              <input type="text" id="message-input" placeholder="Type your message..." />
              <button onclick="sendMessage()">Send</button>
              <button onclick="resetConversation()">Reset</button>
              <button onclick="getSummary()">Summary</button>
            </div>
          </div>
        </div>
      </div>

      <script>
        async function loadStatus() {
          try {
            const response = await fetch('/api/services');
            const data = await response.json();
            const container = document.getElementById('status-container');
            container.innerHTML = Object.entries(data.services).map(([service, status]) => 
              \`<div class="status \${status === 'active' ? 'active' : 'inactive'}">\${service}: \${status}</div>\`
            ).join('');
          } catch (error) {
            console.error('Failed to load status:', error);
          }
        }

        async function sendMessage() {
          const input = document.getElementById('message-input');
          const message = input.value.trim();
          if (!message) return;

          addMessage(message, 'user');
          input.value = '';

          try {
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message })
            });
            const data = await response.json();
            if (data.message) {
              addMessage(data.message, 'assistant');
            }
          } catch (error) {
            addMessage('Error: ' + error.message, 'assistant');
          }
        }

        async function resetConversation() {
          try {
            await fetch('/api/chat/reset', { method: 'POST' });
            document.getElementById('messages').innerHTML = '';
            addMessage('Conversation reset', 'assistant');
          } catch (error) {
            console.error('Reset failed:', error);
          }
        }

        async function getSummary() {
          try {
            const response = await fetch('/api/chat/summary');
            const data = await response.json();
            addMessage('Summary: ' + data.summary, 'assistant');
          } catch (error) {
            console.error('Summary failed:', error);
          }
        }

        function addMessage(text, role) {
          const messages = document.getElementById('messages');
          const div = document.createElement('div');
          div.className = 'message ' + role;
          div.textContent = text;
          messages.appendChild(div);
          messages.scrollTop = messages.scrollHeight;
        }

        // Load status on page load
        loadStatus();
        setInterval(loadStatus, 10000);
      </script>
    </body>
    </html>
  `);
});

app.listen(NODE_PORT, () => {
  console.log(`Node Frontend running on port ${NODE_PORT}`);
});
