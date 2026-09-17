# Database Schema

## 1. Users Collection (`users`)
Stores admin credentials.
- `_id`: ObjectId
- `name`: String (Required)
- `email`: String (Required, Unique)
- `password`: String (Required, Hashed, select: false)
- `role`: Enum ['admin'] (Default: 'admin')
- `createdAt`, `updatedAt`: Date

## 2. Projects Collection (`projects`)
Stores portfolio projects.
- `_id`: ObjectId
- `title`: String (Required)
- `slug`: String (Required, Unique)
- `description`: String (Required - short summary)
- `content`: String (Markdown/HTML content)
- `techStack`: Array of Strings
- `image`: String (URL to Cloudinary)
- `demoUrl`: String
- `repoUrl`: String
- `isPublished`: Boolean (Default: false)
- `createdAt`, `updatedAt`: Date

## 3. Skills Collection (`skills`)
Stores technical skills.
- `_id`: ObjectId
- `name`: String (Required)
- `category`: String (Required e.g., 'Frontend', 'Backend')
- `proficiency`: Number (1-100)
- `icon`: String (URL or icon class)

## 4. Experiences Collection (`experiences`)
Stores work history and education.
- `_id`: ObjectId
- `company`: String (Required)
- `role`: String (Required)
- `startDate`: Date (Required)
- `endDate`: Date (Null if current)
- `current`: Boolean (Default: false)
- `description`: Array of Strings (Bullet points)

## 5. Settings Collection (`settings`)
Singleton collection (only 1 document) for global portfolio config.
- `_id`: ObjectId
- `cvUrl`: String (URL to Cloudinary PDF)
- `contactEmail`: String
- `githubUrl`: String
- `linkedinUrl`: String