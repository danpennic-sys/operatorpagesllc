# RETIRED — 2026-09-12

**This repository is not a product.**

Operator Pages LLC sells a frozen classical evidence verifier
(git name: QuantumGuard). That work lives in
https://github.com/danpennic-sys/quantumguard

This repo (Go API + Python ChatGPT + Node frontend) is a ChatGPT
wrapper that never forwarded a payload. `proxyChatRequest` posts
`nil` to Python. That is evidence. Do not “fix” it as a sprint.

## Kill (running surface)

1. Stop / delete Railway services `go-api`, `python-chatgpt`, `node-frontend`.
2. Revoke the OpenAI API key, then delete `OPENAI_API_KEY` from Railway.
3. Tear down any public hostname that still hits `/chat`.
4. Do not scale-to-zero and forget. Unauthenticated OpenAI relay is a billing bomb.

## Freeze (this git artifact)

- Keep the repo. Do not delete history.
- Do not rewrite the nil POST.
- Do not advertise release tag `Republic` as a lab result.
- Close remaining feature issues as not planned.

## What this is not

- Not a QuantumGuard change. No verifier files are in this tree.
- Not a PQC claim.
- Not an SBIR deliverable.
- Not IL5/IL6, CUI, or classified.
