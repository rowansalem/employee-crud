
# Employee Management System

This repository contains the code for a comprehensive Employee Management System utilizing NestJS for the backend and Next.js for the frontend. The system supports CRUD operations for employee and user data, authentication mechanisms including social login, and can be connected to either PostgreSQL or MongoDB.

## Features

- **Backend (NestJS)**
  - CRUD operations for managing employees and users.
  - Authentication and authorization including JWT and social login.
  - Support for both PostgreSQL and MongoDB databases.
  - Extensive API testing capabilities including integration and e2e tests.

- **Frontend (Next.js)**
  - Responsive user interface for managing employees and users.
  - Integrated authentication workflows.
  - Real-time data updates using React state management.

## Prerequisites

- Node.js
- PostgreSQL or MongoDB
- Docker (optional for containerization)

## Installation

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/rowansalem/employee-crud.git
   cd employee-crud
   ```

2. Install dependencies:
   ```
   cd server
   npm install
   ```

3. Set up your environment variables by copying the `.env.example` to `.env` and adjusting the database connection settings and other configurations as needed.

4. Run database migrations:
   ```
   npm run migration:run
   ```

5. Optionally seed the database:
   ```
   npm run seed:run:relational  # For PostgreSQL
   npm run seed:run:document    # For MongoDB
   ```

6. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup

1. Install dependencies:
   ```
   cd client
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

## Testing

To run the backend tests:
```
npm test
```



