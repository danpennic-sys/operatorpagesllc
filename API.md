# API Documentation

## Overview

OperatorPages provides a unified API across three microservices:
- **Go API** (Gateway)
- **Python ChatGPT** (AI Service)
- **Node Frontend** (Web Interface)

## Base URLs

- **Development**: 
  - Go API: `http://localhost:3000`
  - Python Service: `http://localhost:5000`
  - Node Frontend: `http://localhost:8080`

- **Production** (Railway): Available after deployment

---

## Go API Endpoints

### Health Check
```
GET /health
```
Returns service health status.

**Response:**
```json
{
  "status": "ok",
  "service": "go-api"
}
```

### Get Services
```
GET /api/v1/services
```
Returns list of all available services and their status.

**Response:**
```json
{
  "services": [
    {
      "name": "go-api",
      "url": "http://localhost:3000",
      "status": "active"
    },
    {
      "name": "python-chatgpt",
      "url": "http://localhost:5000",
      "status": "checking..."
    },
    {
      "name": "node-frontend",
      "url": "http://localhost:8080",
      "status": "checking..."
    }
  ]
}
```

### Proxy Chat Request
```
POST /api/v1/chat/proxy
Content-Type: application/json

{
  "message": "Your message here",
  "temperature": 0.7
}
```
Proxies chat requests to the Python ChatGPT service.

### Get Configuration
```
GET /api/v1/config
```
Returns current service configuration.

**Response:**
```json
{
  "services": {
    "go": {
      "port": "3000",
      "url": "http://localhost:3000"
    },
    "python": {
      "port": "5000",
      "url": "http://localhost:5000"
    },
    "node": {
      "port": "8080",
      "url": "http://localhost:8080"
    }
  }
}
```

---

## Python ChatGPT Service Endpoints

### Health Check
```
GET /health
```
Returns service health status.

**Response:**
```json
{
  "status": "ok",
  "service": "python-chatgpt"
}
```

### Send Chat Message
```
POST /chat
Content-Type: application/json

{
  "message": "Your message here",
  "temperature": 0.7
}
```
Sends a message to ChatGPT and returns a response.

**Parameters:**
- `message` (string, required): The user's message
- `temperature` (float, optional, default: 0.7): Controls randomness of responses (0-2)

**Response:**
```json
{
  "status": "success",
  "message": "Assistant's response here",
  "tokens_used": 45,
  "conversation_id": 12345
}
```

### Reset Conversation
```
POST /chat/reset
```
Clears conversation history.

**Response:**
```json
{
  "status": "success",
  "message": "Conversation history cleared"
}
```

### Get Summary
```
POST /chat/summary
```
Generates a summary of the current conversation.

**Response:**
```json
{
  "status": "success",
  "summary": "A brief summary of the conversation..."
}
```

### Get Configuration
```
GET /config
```
Returns service configuration.

**Response:**
```json
{
  "service": "python-chatgpt",
  "model": "gpt-3.5-turbo",
  "api_configured": true,
  "conversation_active": true,
  "endpoints": {
    "chat": "/chat",
    "reset": "/chat/reset",
    "summary": "/chat/summary",
    "health": "/health"
  }
}
```

### List Available Models
```
GET /models
```
Lists available OpenAI models.

**Response:**
```json
{
  "status": "success",
  "models": [
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-16k",
    "gpt-4",
    ...
  ]
}
```

---

## Node Frontend Endpoints

### Health Check
```
GET /health
```
Returns service health status.

**Response:**
```json
{
  "status": "ok",
  "service": "node-frontend"
}
```

### Main Interface
```
GET /
```
Returns the main web interface HTML page.

### Send Chat Message
```
POST /api/chat
Content-Type: application/json

{
  "message": "Your message here",
  "temperature": 0.7
}
```
Proxies to Python ChatGPT service.

**Response:**
```json
{
  "status": "success",
  "message": "Response from ChatGPT",
  "tokens_used": 45,
  "conversation_id": 12345
}
```

### Reset Conversation
```
POST /api/chat/reset
```
Resets conversation history.

**Response:**
```json
{
  "status": "success",
  "message": "Conversation history cleared"
}
```

### Get Conversation Summary
```
GET /api/chat/summary
```
Gets a summary of the conversation.

**Response:**
```json
{
  "status": "success",
  "summary": "Summary of conversation..."
}
```

### Check Service Status
```
GET /api/services
```
Checks the status of all services.

**Response:**
```json
{
  "services": {
    "go_api": "active",
    "python_chatgpt": "active",
    "node_frontend": "active"
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message",
  "details": "Additional details (if available)"
}
```

Common HTTP Status Codes:
- `200` - Success
- `400` - Bad Request
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## Example cURL Requests

### Chat with ChatGPT
```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the capital of France?",
    "temperature": 0.7
  }'
```

### Reset Conversation
```bash
curl -X POST http://localhost:8080/api/chat/reset
```

### Get Summary
```bash
curl -X GET http://localhost:8080/api/chat/summary
```

### Check Services
```bash
curl -X GET http://localhost:8080/api/services
```

### Direct Python Service Call
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "temperature": 0.5
  }'
```

---

## Authentication

Currently, the API does not require authentication. For production deployments, consider implementing:
- JWT token validation
- API key authentication
- OAuth 2.0

---

## Rate Limiting

Rate limiting is not currently implemented. For production, consider:
- Adding rate limiting middleware
- Using API Gateway with rate limits
- Implementing token-bucket algorithm

---

## Webhooks

Not currently implemented. Future versions may support:
- Conversation update webhooks
- Status change notifications
- Error notifications

---

## Versioning

Currently using API v1. Future versions will be accessible at:
- `/api/v2/...`
- `/api/v3/...`

---

## Support

For issues or questions about the API, please:
1. Check the [README.md](./README.md)
2. Review the service logs: `make logs`
3. Open an issue on GitHub

