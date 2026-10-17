# JobPulse API Guide

All business API endpoints are versioned under `/api/v1`.

## Interactive OpenAPI Documentation
When the backend server is running, navigate to:
```
http://localhost:5000/api/docs
```

## Standard Response Conventions

### 1. Success Data Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "requestId": "a7b8c9d0-...",
  "timestamp": "2026-10-17T12:00:00.000Z"
}
```

### 2. Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 48,
    "page": 1,
    "limit": 12,
    "totalPages": 4,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "requestId": "...",
  "timestamp": "..."
}
```

### 3. Standardized Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "errorCode": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "errors": [
    {
      "field": "body.email",
      "message": "Please enter a valid email address"
    }
  ],
  "requestId": "...",
  "timestamp": "..."
}
```
