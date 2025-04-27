# Healthcare Management System


```plaintext
+----------------------------------------------------+
|                    Azure VM                        |
|                                                    |
|  +----------------------------------------------+  |
|  |                Docker Engine                |  |
|  |                                              |  |
|  |  +----------------+    +----------------+   |  |
|  |  |   Backend API   |    |   Frontend App  |   |  |
|  |  | (Express + TS)  |    | (React + Vite)  |   |  |
|  |  +----------------+    +----------------+   |  |
|  |                                              |  |
|  |        Communicate over HTTP (localhost)     |  |
|  +----------------------------------------------+  |
|                                                    |
|  +------------------+                              |
|  |  PostgreSQL DB    | (Azure Database Service)     |
|  +------------------+                              |
+----------------------------------------------------+

Key Flows
- Users access the React frontend via a public IP or domain.
- Frontend communicates with Backend API over HTTP/HTTPS.
- Backend interacts with PostgreSQL database for data storage.
- Docker containers isolate Frontend, Backend, and Database services.
- Azure VM provides hosting, networking, and monitoring capabilities.
```

A full-stack healthcare management system with a React frontend and Express/TypeScript backend, designed for scalable, containerized deployment using Docker and Azure Virtual Machines.

## Table of Contents
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Installation](#installation)
- [Development Setup](#development-setup)
- [Docker Deployment](#docker-deployment)
- [Azure VM Deployment](#azure-vm-deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite build tool
- Tailwind CSS
- React Router v6
- Axios for HTTP requests

### Backend
- Node.js 18+
- Express 4.x
- TypeScript
- JWT Authentication
- PostgreSQL/MySQL
- TypeORM
- Jest for testing

## Features

### Program Management
- **Create Health Programs**  
  Administrators can create and manage health programs such as TB, Malaria, HIV, and others.

### Client Management
- **Register New Clients**  
  Users can register a new client into the system, capturing essential demographic and contact information.
  
- **Enroll Clients into Programs**  
  Clients can be enrolled into one or multiple healthcare programs based on eligibility and diagnosis.
  
- **Search Registered Clients**  
  Quickly search and retrieve clients from the database using various filters such as name, ID, or program.

- **View Client Profiles**  
  View detailed client profiles, including personal information, enrolled programs, and service history.

### API Services
- **Expose Client Profile via API**  
  Securely expose client profiles through a RESTful API, allowing external systems to retrieve client data as needed.

### API Services
- Fully RESTful API architecture
- JWT-based authentication and session handling
- Role-based access control (RBAC)
- Secure data validation and sanitization

## Installation

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher
- Docker v20 or higher
- PostgreSQL v12+ or MySQL 8+
- Azure CLI (for VM management)

```bash
git clone https://github.com/sonnie36/HealthInformationSystem
cd healthcare-system
```

## Development Setup
### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
### Backend (Express + TypeScript)
```bash
cd backend
npm install
npm start
```

### Docker Deployment
Build and Run using Docker Compose
```bash
docker-compose up --build
```
#### Azure VM Deployment
1. Create a Virtual Machine
Create a new Ubuntu or Windows Server VM via Azure Portal

Allow inbound ports: HTTP (80), ```HTTPS (443), SSH (22), RDP (3389 if Windows)```

2. Install Required Software
Install Docker, Node.js, and Nginx (optional)

```bash
git clone https://github.com/sonnie36/HealthInformationSystem
cd healthcare-system
docker-compose up --build -d
```
3. Configure Firewall and DNS
Map public IP to a domain name (optional)

Configure Nginx as a reverse proxy (optional)  

# Monitoring
PM2 for backend process management

Grafana + Prometheus for server metrics

Azure Monitor for VM monitoring

Docker Healthchecks for container health  

# Troubleshooting

### Issue Solution
- Docker container won't start	`Check docker logs <container_id>`
- Database connection errors	`Verify .env settings and DB status`
- API not reachable	`Ensure ports 3457/8081 are open`
- Build errors in React	`Delete node_modules and reinstall`

# License
This project is licensed under the MIT License.