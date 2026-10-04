# 17. Deployment & Production Operations Guide

## Local Run Instructions
1. **Backend**:
   ```bash
   cd backend
   ../venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm run dev -- --port 8089
   ```

## Docker Container Deployment
```bash
docker-compose up --build -d
```

## Cloud Platform Hosting Options
- **Frontend**: Vercel / Netlify / Cloudflare Pages.
- **Backend**: Render / Railway / Fly.io / AWS ECS.
- **Database**: Managed PostgreSQL (Neon / Supabase / AWS RDS).
