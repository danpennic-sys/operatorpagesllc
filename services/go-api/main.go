package main

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	godotenv.Load("../../.env")
}

func main() {
	router := gin.Default()

	// Enable CORS
	router.Use(corsMiddleware())

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"service": "go-api",
		})
	})

	// API Routes
	api := router.Group("/api/v1")
	{
		api.GET("/services", getServices)
		api.POST("/chat/proxy", proxyChatRequest)
		api.GET("/config", getConfig)
	}

	port := os.Getenv("GO_PORT")
	if port == "" {
		port = "3000"
	}

	fmt.Printf("Go API Server running on port %s\n", port)
	router.Run(":" + port)
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func getServices(c *gin.Context) {
	services := gin.H{
		"services": []gin.H{
			{
				"name": "go-api",
				"url":  "http://localhost:3000",
				"status": "active",
			},
			{
				"name": "python-chatgpt",
				"url":  "http://localhost:5000",
				"status": "checking...",
			},
			{
				"name": "node-frontend",
				"url":  "http://localhost:8080",
				"status": "checking...",
			},
		},
	}
	c.JSON(http.StatusOK, services)
}

func proxyChatRequest(c *gin.Context) {
	// This will proxy requests to the Python ChatGPT service
	pythonServiceURL := os.Getenv("PYTHON_SERVICE_URL")
	if pythonServiceURL == "" {
		pythonServiceURL = "http://localhost:5000"
	}

	var request gin.H
	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Forward to Python service
	resp, err := http.Post(
		pythonServiceURL+"/chat",
		"application/json",
		nil,
	)

	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "ChatGPT service unavailable"})
		return
	}
	defer resp.Body.Close()

	c.JSON(http.StatusOK, gin.H{"message": "Request proxied to ChatGPT service"})
}

func getConfig(c *gin.Context) {
	config := gin.H{
		"services": gin.H{
			"go": gin.H{
				"port": os.Getenv("GO_PORT"),
				"url":  os.Getenv("GO_API_URL"),
			},
			"python": gin.H{
				"port": os.Getenv("PYTHON_PORT"),
				"url":  os.Getenv("PYTHON_SERVICE_URL"),
			},
			"node": gin.H{
				"port": os.Getenv("NODE_PORT"),
				"url":  os.Getenv("NODE_SERVICE_URL"),
			},
		},
	}
	c.JSON(http.StatusOK, config)
}
