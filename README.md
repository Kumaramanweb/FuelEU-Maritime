# Fuel EU Compliance Tool

## Overview
Fuel EU Compliance Tool is a web application designed to help maritime companies manage and optimize their carbon intensity compliance according to the FuelEU Maritime regulation. It allows users to track their routes, compare compliance scenarios, calculate banking/borrowing of compliance balances, and create compliance pools.

## Architecture Summary
The application is built using a **Hexagonal Architecture (Ports and Adapters)** pattern to ensure high maintainability, testability, and decoupling of core business logic from external frameworks, interfaces, and databases.

### Backend (`/backend`)
* **Core Domain (`/src/core`)**: Contains the pure business logic, entities, and use cases (e.g., Compliance Calculation, Pooling logic). This layer has no dependencies on external frameworks or databases.
* **Ports (`/src/core/ports`)**: Defines the interfaces for inbound (driving) and outbound (driven) operations.
* **Adapters (`/src/adapters`)**:
  * **Inbound (`/src/adapters/inbound`)**: Express controllers handling HTTP requests and routing them to the core use cases.
  * **Outbound (`/src/adapters/outbound`)**: Implementations of the outbound interfaces, such as Prisma Postgres Repositories connecting to the database.

### Frontend (`/fuel-eu-ui`)
* **Core Domain (`/src/core`)**: Types, domain models, and core logic for the client.
* **Adapters (`/src/adapters`)**: UI components (React) as inbound adapters, presenting data to the user.
* **Infrastructure (`/src/infrastructure`)**: API clients (Axios/Fetch) making requests to the backend, acting as outbound adapters.

## Setup & Run Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### 1. Database Setup
Ensure you have a running PostgreSQL instance.
```bash
cd backend
# Update your .env file with the connection string (DATABASE_URL)
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 2. Running the Backend
```bash
cd backend
npm install
npm run dev
```
The backend API handles all Fuel EU calculation, scenario, and pooling endpoints.

### 3. Running the Frontend
```bash
cd fuel-eu-ui
npm install
npm run dev
```
The Vite development server will start the application locally (typically on `http://localhost:5173` or `http://localhost:5174`).

## How to Execute Tests
The project relies on automated tests to verify the core domain logic independently of the infrastructure.
```bash
# In the backend directory
npm run test
```
Tests target the core use cases using standard test runners (e.g., Jest/Vitest), ensuring the calculation logic correctly aligns with FuelEU regulations.

## Sample Requests/Responses

**GET `/api/compliance/cb`**
Querying the compliance balance for a specific ship in a given year.
```json
// Request: GET /api/compliance/cb?shipId=R001&year=2024
// Response
{
  "id": "R001",
  "year": 2024,
  "cb": 1450.50,
  "intensity": "Below target",
  "status": "Surplus"
}
```

**POST `/api/pooling/create`**
Creating a compliance pool.
```json
// Request
{
  "members": [
    { "id": "R001", "cb": 5000 },
    { "id": "R002", "cb": -2000 }
  ]
}

// Response
[
  { "id": "R001", "id": "R001", "cb": 5000, "cb_after": 3000 },
  { "id": "R002", "id": "R002", "cb": -2000, "cb_after": 0 }
]
```
