# Build stage
FROM golang:1.26-alpine AS builder

WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o go-api main.go

# Runtime stage
FROM alpine:3.20

RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/go-api .

EXPOSE 3000

CMD ["./go-api"]
