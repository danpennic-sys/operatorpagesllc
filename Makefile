.PHONY: help install dev build deploy test clean

help:
	@echo "OperatorPages - ChatGPT Integration"
	@echo "===================================="
	@echo "Available commands:"
	@echo "  make install   - Install dependencies for all services"
	@echo "  make dev       - Run services in development mode (Docker Compose)"
	@echo "  make build     - Build all Docker images"
	@echo "  make deploy    - Deploy to Railway"
	@echo "  make test      - Run tests"
	@echo "  make clean     - Clean up containers and volumes"
	@echo "  make logs      - View service logs"

install:
	@echo "Installing Go API dependencies..."
	cd services/go-api && go mod download

	@echo "Installing Python dependencies..."
	cd services/python-chatgpt && pip install -r requirements.txt

	@echo "Installing Node.js dependencies..."
	cd services/node-frontend && npm install

dev:
	@echo "Starting services with Docker Compose..."
	docker-compose up --build

dev-detach:
	@echo "Starting services in background..."
	docker-compose up --build -d

logs:
	docker-compose logs -f

build:
	@echo "Building Docker images..."
	docker-compose build

stop:
	@echo "Stopping services..."
	docker-compose stop

clean:
	@echo "Cleaning up..."
	docker-compose down -v
	rm -rf services/go-api/go-api
	rm -rf services/python-chatgpt/__pycache__
	rm -rf services/node-frontend/node_modules

deploy:
	@echo "Deploying to Railway..."
	@echo "1. Make sure you have Railway CLI installed: npm i -g @railway/cli"
	@echo "2. Run: railway link"
	@echo "3. Run: railway up"

test:
	@echo "Running tests..."
	@echo "Go tests..."
	cd services/go-api && go test ./...

	@echo "Python tests..."
	cd services/python-chatgpt && pytest

	@echo "Node tests..."
	cd services/node-frontend && npm test

run-go:
	cd services/go-api && go run main.go

run-python:
	cd services/python-chatgpt && python app.py

run-node:
	cd services/node-frontend && npm start

check-services:
	@echo "Checking service health..."
	@curl -s http://localhost:3000/health | python -m json.tool || echo "Go API: DOWN"
	@curl -s http://localhost:5000/health | python -m json.tool || echo "Python Service: DOWN"
	@curl -s http://localhost:8080/health | python -m json.tool || echo "Node Frontend: DOWN"
