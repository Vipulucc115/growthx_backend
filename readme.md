# Assignment Submission Portal

This is a backend system for an assignment submission portal where users can upload assignments and admins can accept or reject them.

## Prerequisites

- Node.js (v14 or later)
- MongoDB

  ```
  npm start
  ```

  For development with auto-restart:

  ```
  npm run dev
  ```

## API Endpoints

### User Endpoints

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `POST /api/users/upload` - Upload an assignment (requires authentication)
- `GET /api/users/admins` - Fetch all admins (requires authentication)

### Admin Endpoints

- `POST /api/admins/register` - Register a new admin
- `POST /api/admins/login` - Admin login
- `GET /api/admins/assignments` - View assignments tagged to the admin (requires admin authentication)
- `POST /api/admins/assignments/:id/accept` - Accept an assignment (requires admin authentication)
- `POST /api/admins/assignments/:id/reject` - Reject an assignment (requires admin authentication)

## Authentication

This system uses JWT (JSON Web Tokens) for authentication. To access protected routes, include the JWT token in the Authorization header of your request:

```
Authorization: Bearer <your_token_here>
```

## Error Handling

The system provides proper error messages for invalid inputs and server errors. Check the response status code and error message in the JSON response body.

## Modularity

The code is structured in a modular way:

- `models/` - Database models
- `routes/` - API routes
- `controllers/` - Request handlers
- `middleware/` - Custom middleware (error handling, authentication)
- `auth/` - Authentication-related code

## Security

- Passwords are hashed using bcrypt before storing in the database.
- JWT is used for secure authentication.
- Input validation is performed to prevent invalid data.

## Future Improvements

- Implement rate limiting to prevent abuse of the API.
- Add unit and integration tests.
- Implement OAuth2 for user authentication (optional requirement).
