# Sales-Development-Representative
Build a web-based Grok-powered SDR system for lead qualification, personalized outreach, and pipeline management, including API integration, model evaluation, database storage, a user-friendly frontend, and containerized deployment for a client demo

Markdown# Grok-Powered SDR Tool Demo

A full-stack Sales Development Representative tool powered by xAI's Grok API.

## Features
- Lead qualification using Grok
- Personalized outreach generation (emails, LinkedIn messages)
- Pipeline dashboard
- Model comparison
- Dockerized for easy deployment

## Setup

1. Get your xAI API key: https://console.x.ai
2. Copy `.env.example` to `.env` and add your key
3. Run: `docker compose up --build`

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Tech Stack
- Backend: FastAPI + SQLAlchemy + SQLite
- Frontend: React + Tailwind CSS
- AI: xAI Grok API
