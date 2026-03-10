# Takeoff AI Gateway 🚀

Takeoff is a premium, unified AI Gateway platform designed for enterprise-grade LLM management and observability.

## Features

- **Unified API**: OpenAI-compatible gateway for GPT-4, Claude, Gemini, and more.
- **Observability**: Real-time request logging, cost tracking, and latency monitoring.
- **Governance**: Granular per-key rate limiting and budget enforcement.
- **Guardrails**: Integrated content moderation and prompt injection protection.
- **Advanced Integrations**: Native support for **Model Context Protocol (MCP)** and specialized AI **Agent Frameworks** (CrewAI, LangChain).
- **Prompt Registry**: Versioned template management with an integrated editor.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Lucide Icons, Recharts)
- **Database**: Prisma with SQLite
- **Language**: TypeScript

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Database Setup
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 3. Run Development Server
```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`.

## Cloud Deployment (AWS EC2)

The easiest way to deploy Takeoff to AWS is using the provided Docker configuration:

1. **Launch EC2**: Use an Ubuntu instance (t3.medium recommended) and allow port `3000` in the Security Group.
2. **Install Docker**: Run the standard Docker installation commands.
3. **Deploy**:
   ```bash
   # Upload your code and run:
   docker-compose up -d --build
   ```

### 🚀 Automated Deployment (CI/CD)

We've included a GitHub Actions workflow in `.github/workflows/deploy.yml`. To enable it:

1. **Add Secrets**: In your GitHub Repository, go to `Settings > Secrets and variables > Actions` and add:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username.
   - `DOCKERHUB_TOKEN`: A token from Docker Hub.
   - `SERVER_HOST`: Your EC2 IP address.
   - `SERVER_USER`: Typically `ubuntu`.
   - `SSH_PRIVATE_KEY`: Your SSH private key.

2. **Push to Main**: Every push to the `main` branch will now automatically build, push to Docker Hub, and pull/restart the service on your server.

### Production Considerations:
- **Database**: For heavy loads, switch Prisma from `sqlite` to `postgresql` in `schema.prisma`.
- **SSL**: Place a reverse proxy like Nginx or AWS CloudFront in front of the container for HTTPS.

## Gateway API Usage

Send requests to the Takeoff Gateway:
`POST /api/v1/gateway/chat/completions`

**Header:**
`Authorization: Bearer <takeoff_api_key>`

**Sample Payload:**
```json
{
  "model": "gpt-4-turbo",
  "messages": [{"role": "user", "content": "How can I integrate @github?"}]
}
```

---
*Built with ❤️ by the Takeoff Engineering Team.*
