# Retail Sales Management System

## Overview

A comprehensive Retail Sales Management System built with MERN stack that enables efficient management and analysis of sales data. The system provides advanced search, filtering, sorting, and pagination capabilities to handle large datasets with optimal performance and user experience.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: In-memory storage (can be extended to MongoDB/PostgreSQL)

## Search Implementation Summary

Full-text search is implemented across Customer Name and Phone Number fields. The search is case-insensitive and works seamlessly with filters and sorting. The backend performs string matching using JavaScript's `includes()` method with lowercase conversion for optimal performance. Search results are debounced on the frontend (300ms) to reduce unnecessary API calls.

## Filter Implementation Summary

Multi-select filtering is implemented for Customer Region, Gender, Product Category, Tags, and Payment Method. Range-based filtering is available for Age and Date ranges. All filters work independently and can be combined. Filter state is maintained alongside search and sorting operations. The backend processes filters sequentially, applying each filter condition to narrow down results.

## Sorting Implementation Summary

Sorting is implemented for Date (newest first by default), Quantity, and Customer Name (A-Z). The sorting preserves active search and filter states. The backend uses JavaScript's native `sort()` method with custom comparison functions. Date sorting uses Date objects, numeric fields use parseFloat, and text fields use case-insensitive string comparison.

## Pagination Implementation Summary

Pagination is implemented with a fixed page size of 10 items per page. The system supports Next/Previous navigation and maintains active search, filter, and sort states across page changes. Pagination metadata includes current page, total pages, total items, and navigation flags. The backend calculates pagination indices and returns both the paginated data subset and pagination metadata.

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

The backend server will run on `https://assis-1.onrender.com`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend application will run on `http://localhost:3000`

### Data Upload

1. Once both servers are running, open the frontend application
2. Use the "Upload Sales Data" component to upload your CSV file
3. The system will parse and load the data for use

### Production Build

To build the frontend for production:

```bash
cd frontend
npm run build
```
