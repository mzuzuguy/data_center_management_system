# Youtopia Data Center Monitor

A real-time data center monitoring system built with **NestJS, PostgreSQL, TypeORM, and a lightweight HTML/CSS/JavaScript dashboard**.

The system is designed to collect server performance metrics from monitoring agents, store the data in a PostgreSQL database, and visualize infrastructure health through a web-based monitoring dashboard.

Currently, the dashboard interface and monitoring features are implemented. The remaining development task is ensuring reliable communication between monitoring agents, the backend API, and the dashboard data layer.

---

# Features

## Backend

- REST API built with NestJS
- PostgreSQL database integration
- TypeORM entity management
- Server registration
- Component tracking
- Metric storage
- Health status evaluation
- Metric retrieval API
- Monitoring agent support

---

# Dashboard

A lightweight HTML/CSS/JavaScript monitoring interface.

The dashboard displays:

- Total registered servers
- Operational servers
- Warning states
- Critical states
- CPU utilization
- RAM utilization
- Disk utilization
- System alerts
- Server status cards
- Connection monitoring
- Manual refresh
- Automatic refresh mode

---

# System Architecture

Monitoring Agent
|
|
v
NestJS REST API
|
|
v
PostgreSQL Database
|
|
v
HTML/CSS/JavaScript Dashboard

---

# Requirements

## Software Requirements

Install the following:

### Node.js

Recommended:

Node.js >= 18


Check installation:

```bash
node -v
npm -v

PostgreSQL

Required:

PostgreSQL >= 14

Check:

psql --version
Git

Check:

git --version
Backend Setup
Clone Repository
git clone <repository-url>

Move into the project:

cd data_center
Install Dependencies
npm install
Database Setup

Create the database:

createdb data_center_db

or using PostgreSQL:

psql -U postgres

Inside PostgreSQL:

CREATE DATABASE data_center_db;

Exit:

\q
Database Configuration

Database configuration is located in:

src/app.module.ts

Example:

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

    synchronize: true

})
Development Configuration

During development:

synchronize: true

This automatically creates database tables.

For production:

synchronize: false

Use TypeORM migrations instead.

Database Structure

The system contains the following tables:

Servers

Stores registered servers.

Example fields:

server_id
server_name
location
server_type
created_at
Components

Stores hardware components belonging to servers.

Example:

component_id
server_id
component_type

Supported components:

CPU
RAM
Disk
Metric Readings

Stores collected monitoring data.

Example fields:

reading_id
component_id
metric_type
metric_value
metric_unit
health_status
recorded_at
Running the Backend

Start development server:

npm run start:dev

Successful startup:

Nest application successfully started

API available at:

http://localhost:3000
API Endpoints
Servers

Retrieve registered servers:

GET /servers

Example:

http://localhost:3000/servers
Components

Retrieve server components:

GET /components

Example:

http://localhost:3000/components
Metric Readings

Retrieve monitoring data:

GET /metric-readings

Example:

http://localhost:3000/metric-readings
Dashboard Setup

Dashboard structure:

dashboard/

├── index.html
├── style.css
└── app.js
Connecting Dashboard To Backend

Open:

app.js

Configure API URL:

const API_URL = "http://localhost:3000";

The dashboard consumes:

GET /servers

GET /components

GET /metric-readings
Running Dashboard

The dashboard can be opened directly:

index.html

For development, use a local server.

Example using VS Code:

Install Live Server extension
Right click:
index.html
Select:
Open with Live Server
Monitoring Agent

The monitoring agent collects system metrics:

CPU usage
RAM usage
Disk usage

Collected data is sent to:

POST /metric-readings

Example payload:

{
    "component_id": 1,
    "metric_type": "usage",
    "metric_value": 45.5,
    "metric_unit": "percent"
}
Health Status Rules

The monitoring system classifies server health.

OK

Normal operation.

health_status = OK
WARNING

Resource usage requires attention.

health_status = WARNING
CRITICAL

Immediate action required.

health_status = CRITICAL
Development Workflow

Start PostgreSQL:

sudo systemctl start postgresql

Start backend:

npm run start:dev

Open dashboard:

index.html

Start monitoring agent.

Verify metrics appear through:

GET /metric-readings
Known Development Issue

The dashboard interface has been implemented with:

Server cards
Metric visualizations
Alerts
Connection monitoring
Auto refresh support

However, the current development stage requires further testing of the complete data pipeline:

Monitoring Agent
        |
        v
NestJS API
        |
        v
PostgreSQL
        |
        v
Dashboard

The next debugging step is verifying that agent-generated metrics are correctly received by the API and stored in the database.

Common Problems
Database does not exist

Error:

database "data_center_db" does not exist

Solution:

CREATE DATABASE data_center_db;
Missing PostgreSQL tables

Error:

relation "metric_readings" does not exist

Solution:

Enable:

synchronize:true

Restart NestJS.

PostgreSQL Syntax Issues

Avoid Oracle-specific functions:

Incorrect:

SYSDATE
SYSTIMESTAMP

PostgreSQL equivalent:

CURRENT_TIMESTAMP
Technology Stack
Backend
NestJS
TypeScript
TypeORM
PostgreSQL
Frontend
HTML5
CSS3
JavaScript
Development Tools
Git
VS Code
PostgreSQL CLI
Future Improvements

Planned upgrades:

WebSocket real-time updates
Authentication system
Multiple data center support
Email/SMS notifications
Agent auto-registration
Historical performance graphs
Prometheus integration
Docker deployment
Infrastructure analytics
Author

Precious Musole

Software Developer

Project:

Youtopia Data Center Monitor

License

This project is for educational and development purposes.
