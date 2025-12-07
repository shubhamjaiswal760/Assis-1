# Retail Sales Management System - Backend

## Overview

Backend API server for the Retail Sales Management System. Provides RESTful endpoints for search, filtering, sorting, and pagination of sales data.

## Tech Stack

- Node.js
- Express.js
- CORS

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

3. The server will run on `http://localhost:5000`

## API Endpoints

- `GET /api/sales` - Get sales data with query parameters for search, filter, sort, and pagination
- `GET /api/sales/filters` - Get available filter options
- `POST /api/sales/upload` - Upload sales data (expects JSON array in request body)
