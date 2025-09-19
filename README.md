# My Travel Saathi – AI Travel Assistant 🧳

An **AI-powered travel assistant** that helps users plan trips, search for hotels, make bookings, and manage their travel experiences through a conversational agent with both CLI and API interfaces.

The system combines **Google Gemini**, **MCP Toolbox**, **Cloud SQL (Postgres)**, **FastAPI**, and **Google Cloud Run**.

---

## 🌐 Tech Stack

* **Google Gemini 2.5 Flash** → Large Language Model powering the agent
* **Google ADK (Agent Development Kit)** → For agent orchestration
* **MCP Toolbox** → Framework for exposing tools (SQL + BigQuery)
* **FastAPI** → High-performance API framework for agent endpoints
* **Cloud SQL (Postgres)** → Stores users, hotels, and bookings
* **Google Cloud Run** → Serverless deployment platform
* **BigQuery** → Curated hotel dataset for recommendations

---

## 📂 Project Structure

```
mytravelsaathi/
├── 🤖 my_agents/main_agent/           # Main Travel Saathi Agent
│   ├── agent.py                       # Core agent implementation
│   ├── server_fastapi.py             # FastAPI server for API access
│   ├── server.py                     # Flask server (alternative)
│   ├── deploy_fastapi.sh             # FastAPI deployment script
│   ├── deploy_standalone_agent.sh    # Standalone agent deployment
│   ├── Dockerfile                    # Container configuration
│   └── requirements_fastapi.txt      # FastAPI dependencies
├── 🗄️ database/                      # Database management
│   ├── schemas/                      # SQL table definitions
│   ├── sample-data/                  # Sample hotel data
│   ├── setup/                        # Database setup scripts
│   └── README.md                     # Database documentation
├── 🏗️ infrastructure/                # Infrastructure setup
│   └── gcp-setup/                    # Google Cloud setup scripts
├── 🔧 mcp-toolbox/                   # MCP Toolbox component
│   ├── tools.yaml                    # Tool definitions
│   ├── cloudbuild.toolbox.yaml       # Toolbox deployment
│   └── deployment_setup_toolbox.sh   # Toolbox setup
├── 🗺️ tools/                         # Maps service component
│   ├── maps_service.py               # Maps service implementation
│   ├── cloudbuild.yaml               # Maps service deployment
│   └── Dockerfile                    # Maps service container
└── README.md                         # Project documentation
```

---

## ⚙️ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/mytravelsaathi.git
cd mytravelsaathi
```

---

### 2. Database Setup

#### Option A: Automated Setup (Recommended)
```bash
# Create Cloud SQL instance
./infrastructure/gcp-setup/cloud-sql-setup.sh

# Setup database schema and sample data
psql -h YOUR_INSTANCE_IP -U postgres -f database/setup/01-create-all-tables.sql
```

#### Option B: Manual Setup
See detailed instructions in [`database/README.md`](database/README.md)

---

### 3. Deploy Components

#### Deploy MCP Toolbox
```bash
cd mcp-toolbox
./deployment_setup_toolbox.sh
```

#### Deploy Maps Service
```bash
cd tools
gcloud builds submit --config cloudbuild.yaml
```

---

### 4. Run the Travel Saathi Agent

#### Option A: FastAPI Server (Recommended)
```bash
cd my_agents/main_agent

# Create virtual environment
python -m venv fastapi_env
source fastapi_env/bin/activate

# Install dependencies
pip install -r requirements_fastapi.txt

# Run FastAPI server
uvicorn server_fastapi:app --host 0.0.0.0 --port 8080 --reload
```

**API Endpoints:**
- **Health Check**: `GET http://localhost:8080/health`
- **Agent Info**: `GET http://localhost:8080/info`
- **Chat**: `POST http://localhost:8080/chat`
- **Streaming Chat**: `POST http://localhost:8080/chat/stream`
- **API Docs**: `http://localhost:8080/docs`

#### Option B: Standalone Agent
```bash
cd my_agents/main_agent
python agent.py
```

#### Option C: Deploy to Cloud Run
```bash
cd my_agents/main_agent

# Deploy FastAPI version
./deploy_fastapi.sh

# Or deploy Flask version
./deploy.sh
```

---

## 🧪 Example Usage

### CLI Agent Flow
```bash
# Start the agent
cd my_agents/main_agent
python agent.py

# Example conversation:
User: Hi, I want to plan a trip.
Agent: Please share your name, email, and phone to register.

User: I'm traveling to Goa with my infant, suggest hotels under ₹4000/night.
Agent: ➡️ Calls search-hotels-by-traveler-type → family-friendly hotels

User: Book Family Haven Resort from Jan 10–15 for 2 people.
Agent: ➡️ Calls book-hotel → returns booking ID
```

### API Usage
```bash
# Health check
curl -X GET http://localhost:8080/health

# Chat with agent
curl -X POST http://localhost:8080/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hi, I want to plan a trip to Goa"}'

# Streaming chat
curl -X POST http://localhost:8080/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "Suggest hotels in Goa"}'
```

---

## 🌐 Deployment Status

### ✅ Currently Deployed
- **Travel Saathi Agent (FastAPI)**: `https://travel-saathi-agent-fastapi-345761725129.us-central1.run.app`
- **Travel Saathi Agent (Flask)**: `https://travel-saathi-agent-flask-345761725129.us-central1.run.app`
- **MCP Toolbox**: `https://toolbox-345761725129.us-central1.run.app`
- **Maps Service**: `https://maps-service-345761725129.us-central1.run.app`

### 📊 Sample Data Available
- **20 Swiss Hotels**: Basel, Zurich, Lucerne, Bern, Geneva
- **20 Goa Hotels**: North and South Goa locations
- **Price Tiers**: Luxury, Upscale, Midscale, Upper Midscale

---

## 🔧 API Documentation

Visit the interactive API documentation:
- **FastAPI Docs**: `http://localhost:8080/docs` (local) or deployed URL + `/docs`
- **ReDoc**: `http://localhost:8080/redoc` (local) or deployed URL + `/redoc`

---

## 🚀 Ready to Use!

Your **My Travel Saathi** AI travel assistant is now ready with:
- ✅ **FastAPI endpoints** for easy integration
- ✅ **Cloud Run deployment** for scalability
- ✅ **Organized database** with sample data
- ✅ **Professional project structure**
- ✅ **Comprehensive documentation**

Start planning amazing trips with your AI travel companion! 🧳✈️