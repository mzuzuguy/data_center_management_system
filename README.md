# Youtopia Data Center Monitor

A real-time data center monitoring system built with **NestJS**, **PostgreSQL**, **TypeORM**, and a lightweight **HTML/CSS/JavaScript dashboard**.

The system collects server metrics from monitoring agents, stores readings in a database, and displays server health information through a web dashboard.

---

# Features

## Backend

* REST API built with NestJS
* PostgreSQL database integration
* TypeORM entity management
* Server registration
* Component tracking
* Metric storage
* Health status monitoring
* Real-time metric retrieval

## Dashboard

* HTML/CSS based monitoring interface

* Displays:

  * Total servers
  * Operational servers
  * Warning states
  * Critical states
  * CPU usage
  * RAM usage
  * Disk usage
  * System alerts

* Manual refresh

* Automatic refresh mode

* Connection status monitoring

---

# System Architecture

```
Monitoring Agent
       |
       |
       v
NestJS API
       |
       |
       v
PostgreSQL Database
       |
       |
       v
HTML/CSS/JavaScript Dashboard
```

---

# Requirements

## Software Requirements

Install the following:

### Node.js

Recommended:

```
Node.js >= 18
```

Check installation:

```bash
node -v
npm -v
```

---

### PostgreSQL

Required:

```
PostgreSQL >= 14
```

Check:

```bash
psql --version
```

---

### Git

Check:

```bash
git --version
```

---

# Backend Setup

## Clone Repository

```bash
git clone <repository-url>
```

Move into the project:

```bash
cd data_center
```

---

## Install Dependencies

Run:

```bash
npm install
```

---

# Database Setup

Create the database:

```bash
createdb data_center_db
```

or using PostgreSQL:

```bash
psql -U postgres
```

Inside PostgreSQL:

```sql
CREATE DATABASE data_center_db;
```

Exit:

```sql
\q
```

---

# Database Configuration

The database connection is configured in:

```
src/app.module.ts
```

Example:

```ts
TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'data_center_db',
    username: 'postgres',
    password: 'your_password',
    entities: [
        Server,
        Component,
        MetricReading
    ],
    synchronize: true,
})
```

### Development

Use:

```ts
synchronize: true
```

This automatically creates tables.

### Production

Change to:

```ts
synchronize: false
```

Use migrations instead.

---

# Database Tables

The system creates:

## Servers

Stores registered servers.

Example fields:

```
server_id
server_name
location
server_type
created_at
```

---

## Components

Stores server components.

Example:

```
component_id
server_id
component_type
```

Examples:

```
CPU
RAM
Disk
```

---

## Metric Readings

Stores monitoring data.

Example:

```
reading_id
component_id
metric_type
metric_value
metric_unit
health_status
recorded_at
```

---

# Running the Backend

Start development server:

```bash
npm run start:dev
```

Successful startup:

```
Nest application successfully started
```

API runs on:

```
http://localhost:3000
```

---

# API Endpoints

## Servers

Get all servers:

```
GET /servers
```

Example:

```
http://localhost:3000/servers
```

---

## Components

Get all components:

```
GET /components
```

Example:

```
http://localhost:3000/components
```

---

## Metric Readings

Get all metrics:

```
GET /metric-readings
```

Example:

```
http://localhost:3000/metric-readings
```

---

# Dashboard Setup

The dashboard consists of:

```
dashboard/
│
├── index.html
├── style.css
└── app.js
```

---

## Connecting Dashboard To API

Open:

```
app.js
```

Update:

```javascript
const API_URL = "http://localhost:3000";
```

The dashboard fetches:

```
/servers
/components
/metric-readings
```

---

# Running Dashboard

You can open:

```
index.html
```

directly in a browser.

For better development use a local server.

Example:

Using VS Code Live Server:

1. Install Live Server extension
2. Right click index.html
3. Select:

```
Open with Live Server
```

---

# Monitoring Agent

The monitoring agent collects:

* CPU usage
* RAM usage
* Disk usage

Metrics are sent to:

```
POST /metric-readings
```

Example payload:

```json
{
    "component_id": 1,
    "metric_type": "usage",
    "metric_value": 45.5,
    "metric_unit": "percent"
}
```

---

# Health Status Rules

The system categorizes metrics:

## OK

Normal operation.

```
health_status = OK
```

---

## WARNING

Resource usage requires attention.

```
health_status = WARNING
```

---

## CRITICAL

Immediate action required.

```
health_status = CRITICAL
```

---

# Development Workflow

Start PostgreSQL:

```bash
sudo systemctl start postgresql
```

Start backend:

```bash
npm run start:dev
```

Open dashboard:

```
index.html
```

Send agent metrics.

Refresh dashboard.

---

# Common Problems

## Database does not exist

Error:

```
database "data_center_db" does not exist
```

Solution:

Create database:

```sql
CREATE DATABASE data_center_db;
```

---

## Missing PostgreSQL tables

Error:

```
relation "metric_readings" does not exist
```

Solution:

Enable:

```ts
synchronize:true
```

Restart NestJS.

---

## Oracle Syntax Error

Error:

```
cannot use column reference in DEFAULT expression
```

Cause:

Oracle functions are being used.

Incorrect:

```ts
SYSDATE
SYSTIMESTAMP
```

PostgreSQL equivalent:

```ts
CURRENT_TIMESTAMP
```

---

# Technology Stack

## Backend

* NestJS
* TypeScript
* TypeORM
* PostgreSQL

## Frontend

* HTML5
* CSS3
* JavaScript

## Development Tools

* Git
* VS Code
* PostgreSQL CLI

---

# Future Improvements

Possible upgrades:

* WebSocket live updates
* User authentication
* Multiple data centers
* Email/SMS alerts
* Agent auto-registration
* Historical graphs
* Prometheus integration
* Docker deployment

---

# Author

**Precious Musole**

Software Developer

Project: Youtopia Data Center Monitor

---

# License

This project is for educational and development purposes.
