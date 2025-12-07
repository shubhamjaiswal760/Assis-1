# Architecture Documentation

## Backend Architecture

### Overview
The backend is built using Node.js and Express.js, following a layered architecture pattern with clear separation of concerns.

### Folder Structure
```
backend/
├── src/
│   ├── controllers/     # Request handlers and response formatting
│   ├── services/         # Business logic and data processing
│   ├── routes/           # API route definitions
│   ├── utils/            # Utility functions and helpers
│   └── index.js          # Application entry point
├── package.json
└── README.md
```

### Module Responsibilities

#### Controllers (`controllers/salesController.js`)
- Handle HTTP requests and responses
- Validate input parameters
- Call service layer functions
- Format API responses
- Error handling and status code management

#### Services (`services/salesService.js`)
- Implement core business logic
- Data processing operations:
  - Search functionality
  - Filtering logic
  - Sorting algorithms
  - Pagination calculations
- Extract filter options from dataset
- Pure functions with no HTTP dependencies

#### Routes (`routes/salesRoutes.js`)
- Define API endpoints
- Map routes to controller functions
- Handle route-level middleware

#### Utils (`utils/dataLoader.js`)
- Data loading utilities
- CSV parsing functions
- Data transformation helpers

#### Entry Point (`index.js`)
- Initialize Express application
- Configure middleware (CORS, JSON parsing)
- Register routes
- Start HTTP server

### Data Flow

1. **Request Flow**:
   - Client sends HTTP request → Express routes → Controller → Service → Data processing
   
2. **Response Flow**:
   - Processed data → Service returns result → Controller formats response → Express sends HTTP response

3. **Data Storage**:
   - Currently uses in-memory storage (array)
   - Data is loaded via POST `/api/sales/upload` endpoint
   - Can be extended to use MongoDB, PostgreSQL, or other databases

### API Endpoints

- `GET /api/sales` - Retrieve sales data with query parameters
  - Query params: search, page, pageSize, sortBy, sortOrder, filters
- `GET /api/sales/filters` - Get available filter options
- `POST /api/sales/upload` - Upload/Set sales data

## Frontend Architecture

### Overview
The frontend is built using React 18 with Vite as the build tool. It follows a component-based architecture with custom hooks for state management and service layer for API communication.

### Folder Structure
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API communication layer
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles and Tailwind config
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
├── public/                # Static assets
├── package.json
└── README.md
```

### Module Responsibilities

#### Components
- **SearchBar**: Handles search input with debouncing
- **FilterPanel**: Multi-select and range filters with collapsible UI
- **SortingDropdown**: Sort option selection
- **TransactionTable**: Displays sales data in tabular format
- **PaginationControls**: Page navigation controls
- **DataUploader**: CSV file upload and parsing

#### Hooks (`hooks/useSalesData.js`)
- Custom hook for sales data management
- Handles API calls
- Manages loading, error, and data states
- Provides filter options fetching
- Centralized data fetching logic

#### Services (`services/api.js`)
- Axios-based HTTP client
- API endpoint definitions
- Request/response handling
- Error management

#### Utils (`utils/queryBuilder.js`)
- Constructs query parameters from state
- Handles filter serialization
- Builds API request parameters

#### App Component (`App.jsx`)
- Main application orchestrator
- Manages global state (search, filters, sort, pagination)
- Coordinates component interactions
- Handles data loading and updates

### Data Flow

1. **User Interaction Flow**:
   - User action (search/filter/sort/pagination) → State update → useEffect triggers → API call → Data update → UI re-render

2. **State Management**:
   - Local component state for UI controls
   - Custom hook manages data fetching and state
   - State updates trigger API calls via useEffect

3. **API Communication**:
   - Components call custom hook → Hook uses service layer → Service makes HTTP request → Backend processes → Response parsed → State updated

### Styling
- Tailwind CSS for utility-first styling
- Responsive design with mobile-first approach
- Consistent color scheme and spacing
- Accessible UI components

## System Integration

### Communication Flow
1. Frontend makes HTTP request to backend API
2. Backend processes request through layers
3. Backend returns JSON response
4. Frontend updates UI based on response

### State Synchronization
- Search, filters, sort, and pagination states are maintained in frontend
- All states are combined into query parameters for API calls
- Backend processes all parameters together for consistent results
- Pagination resets to page 1 when search/filter/sort changes

### Error Handling
- Backend: Try-catch blocks in controllers, error responses with status codes
- Frontend: Error states in hooks, user-friendly error messages
- Network errors handled gracefully with fallback UI

### Performance Considerations
- Search debouncing (300ms) to reduce API calls
- Pagination limits data transfer
- Efficient filtering and sorting on backend
- In-memory data storage for fast access (can be optimized with database indexing)

## Extension Points

### Backend
- Replace in-memory storage with database (MongoDB/PostgreSQL)
- Add authentication and authorization
- Implement caching layer (Redis)
- Add data validation middleware
- Implement rate limiting

### Frontend
- Add data visualization components
- Implement export functionality
- Add advanced filtering UI
- Implement saved filter presets
- Add real-time updates (WebSocket)

