# API Documentation

## Authentication Endpoints

### POST /api/v1/auth/register
- **Purpose**: Register an admin user.
- **Authentication**: Public
- **Request Body**:
  ```json
  {
    "name": "Admin Name",
    "email": "admin@example.com",
    "password": "strongPassword123"
  }

  ## Projects Endpoints

### GET /api/v1/projects
- **Purpose**: Get all published projects (or all projects if authenticated admin).
- **Authentication**: Public
- **Response (200)**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "...",
        "title": "Dynamic Portfolio Website",
        "slug": "dynamic-portfolio-website",
        "description": "...",
        "techStack": ["Next.js", "TypeScript"],
        "isPublished": true,
        "createdAt": "..."
      }
    ]
  }

  ## Skills Endpoints

### GET /api/v1/skills
- **Purpose**: Get all skills ordered by category and proficiency.
- **Authentication**: Public
- **Response (200)**: Array of skill objects.

### POST /api/v1/skills
- **Purpose**: Add a new skill.
- **Authentication**: Protected (Admin)
- **Request Body**:
  ```json
  {
    "name": "TypeScript",
    "category": "Frontend",
    "proficiency": 90,
    "icon": "devicon-typescript-plain"
  }

  ## Settings & CV Endpoints

### GET /api/v1/settings
- **Purpose**: Get global portfolio configuration and public CV URL.
- **Authentication**: Public
- **Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "...",
      "cvUrl": "[https://res.cloudinary.com/.../cv_1710000000.pdf](https://res.cloudinary.com/.../cv_1710000000.pdf)",
      "contactEmail": "owner@example.com",
      "githubUrl": "[https://github.com/](https://github.com/)...",
      "linkedinUrl": "[https://linkedin.com/in/](https://linkedin.com/in/)...",
      "updatedAt": "..."
    }
  }

  ## Contact Endpoints

### POST /api/v1/contact
- **Purpose**: Send a message from public portfolio visitors to the portfolio owner.
- **Authentication**: Public
- **Request Body**:
  ```json
  {
    "name": "Visitor Name",
    "email": "visitor@example.com",
    "subject": "Optional Subject",
    "message": "Message body containing at least 10 characters."
  }
  