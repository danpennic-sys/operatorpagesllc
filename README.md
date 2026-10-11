# RETIRED — Do not deploy

**Status:** Frozen 2026-09-12  
**Product:** None. This is a ChatGPT proxy that posted a nil body.  
**Do not run on Railway. Do not add `OPENAI_API_KEY`.**

Operator Pages LLC commercial work is the frozen Ed25519 evidence
verifier (project name QuantumGuard — not a PQC claim):

https://github.com/danpennic-sys/quantumguard

See [`FREEZE.md`](FREEZE.md) for kill vs freeze.

The chat proxy is left broken on purpose. It is evidence that this
stack was never the product.

---

# OperatorPages - ChatGPT Integration (historical)

A full-stack microservices application integrating OpenAI's ChatGPT with multiple backend services and a modern frontend. Built with Go, Python, Node.js, and deployed on Railway.

> Historical README below this line. Instructions are **not** current. Do not follow them.

## Architecture

The application consists of three main services:

### Services

| Service | Technology | Port | Purpose |
|---------|-----------|------|---------|
| **Go API** | Go + Gin | 3000 | Main API gateway, service orchestration, health checks |
| **Python ChatGPT** | Python + Flask | 5000 | OpenAI ChatGPT integration, conversation management |
| **Node Frontend** | Node.js + Express | 8080 | Web interface, request proxying, UI |

The Go `/api/v1/chat/proxy` handler posts a nil body to Python.
Node talks to Python directly. Python uses a process-global
conversation history with no auth.

## License note

README previously claimed MIT. Confirm whether a LICENSE file exists
before redistributing. Do not invent one in a freeze commit.
