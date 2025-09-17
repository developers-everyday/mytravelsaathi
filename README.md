# My Travel Saathi – MVP 🧳

An **AI-powered trip planner MVP** that helps users register, search for hotels, make bookings, and review their trips — all through a conversational agent.

The system combines **Google Gemini**, **MCP Toolbox**, **Cloud SQL (Postgres)**, and **BigQuery**.

---

## 🌐 Tech Stack

* **Google Gemini 2.5 Flash** → Large Language Model powering the agent
* **MCP Toolbox** → Framework for exposing tools (SQL + BigQuery)
* **Cloud SQL (Postgres)** → Stores users, hotels, and bookings
* **BigQuery** → Curated hotel dataset for recommendations
* **Google ADK (Agent Development Kit)** → For agent orchestration

---

## 📂 Project Structure

```
.
├── mcp-toolbox/
│   └── tools.yaml              # MCP tool definitions (Cloud SQL + BigQuery)
├── my-agents/
│   └── hotel-agent-app/
│       ├── agent.py            # Agent definition
│       └── __init__.py
├── cloudSql.txt                 # Cloud SQL setup commands
├── README-cloudshell.txt        # Cloud Shell helper commands
└── README.md                    # Project documentation
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

---

### 2. Set up Cloud SQL (Postgres)

1. Create a Cloud SQL instance (`hoteldb-instance`).
2. Run the following SQL to initialize the schema:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    phone VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    price_tier VARCHAR NOT NULL,
    checkin_date DATE NOT NULL,
    checkout_date DATE NOT NULL,
    booked BIT NOT NULL
);

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    hotel_id INT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3. Configure MCP Toolbox

Edit `mcp-toolbox/tools.yaml` with your project details:

```yaml
sources:
  my-cloud-sql-source:
    kind: cloud-sql-postgres
    project: mytravelsaathi-472115
    region: us-central1
    instance: hoteldb-instance
    database: postgres
    user: postgres
    password: "postgres"
```

Run Toolbox:

```bash
cd mcp-toolbox
./toolbox --tools-file "tools.yaml" --ui
```

---

### 4. Run the Agent

```bash
cd my-agents/hotel-agent-app
python agent.py
```

---

## 🧪 Example Agentic Flow

**User:** Hi, I want to plan a trip.
**Agent:** Please share your name, email, and phone to register.

➡️ Calls `create-user` → stores `user_id`

---

**User:** I’m traveling to Goa with my infant, suggest hotels under ₹4000/night.
➡️ Calls `search-hotels-by-traveler-type` (BigQuery) → family-friendly hotels

---

**User:** Book Family Haven Resort from Jan 10–15 for 2 people.
➡️ Calls `book-hotel` (Cloud SQL) → returns booking ID

---

**User:** Show me my bookings.
➡️ Calls `list-bookings` → returns booking history

---

🚀 **You’re now ready to build and test the My Travel Saathi MVP!**