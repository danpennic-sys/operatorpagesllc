# OperatorPages - ChatGPT Integration

A full-stack microservices application integrating OpenAI's ChatGPT with multiple backend services and a modern frontend. Built with Go, Python, Node.js, and deployed on Railway.

## 🏗️ Architecture

The application consists of three main services:

### Services

| Service | Technology | Port | Purpose |
|---------|-----------|------|---------|
| **Go API** | Go + Gin | 3000 | Main API gateway, service orchestration, health checks |
| **Python ChatGPT** | Python + Flask | 5000 | OpenAI ChatGPT integration, conversation management |
| **Node Frontend** | Node.js + Express | 8080 | Web interface, request proxying, UI |

## 📋 Prerequisites

- Docker & Docker Compose
- Go 1.21+
- Python 3.11+
- Node.js 18+
- OpenAI API Key

## 🚀 Quick Start

### Local Development with Docker Compose

1. **Clone the repository**
   ```bash
   cd /workspaces/operatorpagesllc
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key
   ```

3. **Start all services**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:8080
   - Go API: http://localhost:3000
   - Python Service: http://localhost:5000

### Manual Development (Individual Services)

#### Go API Service
```bash
cd services/go-api
go mod download
go run main.go
```

#### Python ChatGPT Service
```bash
cd services/python-chatgpt
pip install -r requirements.txt
python app.py
```

#### Node Frontend Service
```bash
cd services/node-frontend
npm install
npm start
```

## 📚 API Endpoints

### Go API (Port 3000)
- `GET /health` - Health check
- `GET /api/v1/services` - List all services
- `POST /api/v1/chat/proxy` - Proxy chat requests to Python service
- `GET /api/v1/config` - Get service configuration

### Python ChatGPT Service (Port 5000)
- `GET /health` - Health check
- `POST /chat` - Send message to ChatGPT
- `POST /chat/reset` - Reset conversation history
- `POST /chat/summary` - Get conversation summary
- `GET /models` - List available OpenAI models
- `GET /config` - Get service configuration

### Node Frontend (Port 8080)
- `GET /` - Main web interface
- `GET /health` - Health check
- `POST /api/chat` - Send chat message (proxied to Python)
- `POST /api/chat/reset` - Reset conversation
- `GET /api/chat/summary` - Get summary
- `GET /api/services` - Check service status

## 🧪 Testing

### Check Service Health
```bash
make check-services
```

### Run Tests
```bash
make test
```

### View Logs
```bash
make logs
```

## 🛠️ Development

### Make Commands
```bash
make help              # Show all available commands
make install           # Install all dependencies
make dev              # Start services with Docker Compose
make build            # Build Docker images
make clean            # Clean up containers and volumes
make logs             # View service logs
```

### Development Workflow

1. **Start services**
   ```bash
   make dev-detach
   ```

2. **View logs**
   ```bash
   make logs
   ```

3. **Stop services**
   ```bash
   make stop
   ```

4. **Clean everything**
   ```bash
   make clean
   ```

## 🚀 Deployment on Railway

### Prerequisites
- Railway account (https://railway.app)
- Railway CLI installed

### Deploy Steps

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Link your project**
   ```bash
   railway link
   ```

4. **Set environment variables**
   ```bash
   railway variables
   ```
   Add your `OPENAI_API_KEY` and other environment variables

5. **Deploy**
   ```bash
   railway up
   ```

6. **View deployment**
   ```bash
   railway open
   ```

### Railway Configuration

The `railway.yml` file defines the services for Railway:
- **Go API** - Main backend service
- **Python ChatGPT** - AI service
- **Node Frontend** - Web frontend

Each service is configured with:
- Build context
- Port configuration
- Environment variables
- Dependencies between services

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Service URLs (for inter-service communication)
GO_API_URL=http://localhost:3000
PYTHON_SERVICE_URL=http://localhost:5000
NODE_SERVICE_URL=http://localhost:8080

# Port Configuration
GO_PORT=3000
PYTHON_PORT=5000
NODE_PORT=8080

# Environment
NODE_ENV=development
PYTHON_ENV=development
GO_ENV=development
```

## 📦 Project Structure

```
operatorpagesllc/
├── services/
│   ├── go-api/                 # Go API Gateway
│   │   ├── main.go
│   │   ├── go.mod
│   │   └── Dockerfile
│   ├── python-chatgpt/         # Python ChatGPT Service
│   │   ├── app.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   └── node-frontend/          # Node.js Frontend
│       ├── server.js
│       ├── package.json
│       └── Dockerfile
├── docker-compose.yml          # Local development orchestration
├── railway.yml                 # Railway deployment config
├── Makefile                    # Development commands
├── .env.example                # Environment template
└── README.md                   # This file
```

## 🔄 Service Communication

```
Client Browser
    ↓
Node Frontend (8080)
    ↓
Go API (3000) ← Service Orchestration
    ↓
Python ChatGPT (5000) ← OpenAI API
```

## 💡 Features

- ✅ Full-stack microservices architecture
- ✅ OpenAI ChatGPT integration
- ✅ Multi-language backend (Go, Python)
- ✅ Modern web frontend (Node.js + Express)
- ✅ Docker containerization
- ✅ Railway deployment ready
- ✅ Health checks and monitoring
- ✅ Cross-service communication
- ✅ Conversation management
- ✅ CORS enabled

## 📝 Usage Example

### Chat with ChatGPT via cURL

```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?", "temperature": 0.7}'
```

### Reset Conversation

```bash
curl -X POST http://localhost:8080/api/chat/reset
```

### Get Conversation Summary

```bash
curl -X GET http://localhost:8080/api/chat/summary
```

### Check Service Status

```bash
curl -X GET http://localhost:8080/api/services
```

## 🐛 Troubleshooting

### Services won't start
```bash
docker-compose down -v
docker-compose up --build
```

### OpenAI API errors
- Verify your API key is valid
- Check OpenAI account has available credits
- Ensure OPENAI_API_KEY is in .env

### Port conflicts
- Change port numbers in `.env` and `docker-compose.yml`
- Check `lsof -i :PORT` to see what's using the port

### Service communication issues
- Ensure all services are running: `make check-services`
- Check logs: `make logs`
- Verify network connectivity between containers

## 📖 Documentation

- [Go Gin Documentation](https://github.com/gin-gonic/gin)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Express Documentation](https://expressjs.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Railway Documentation](https://docs.railway.app/)
- [Docker Documentation](https://docs.docker.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🎯 Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication (JWT)
- [ ] Rate limiting
- [ ] WebSocket support for real-time chat
- [ ] File upload/processing
- [ ] Advanced conversation analytics
- [ ] Multi-model support
- [ ] Caching layer (Redis)
- [ ] API versioning
- [ ] GraphQL endpoint

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for OperatorPages**