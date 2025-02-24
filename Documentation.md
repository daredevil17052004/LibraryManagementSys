# Library Management System

A RESTful API-based Library Management System built with Node.js, Express.js, MySQL, and React. This system provides a comprehensive solution for managing library operations including book management, member tracking, and issuance control.

## 🚀 Features

- Complete CRUD operations for Books, Members, and Issuances
- RESTful API architecture with Express.js
- Interactive dashboard for tracking book returns
- Dockerized MySQL database for easy setup
- Adminer for database management
- Web interface built with Next.js

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MySQL 8.0
- Docker & Docker Compose

### Frontend
- React
- TailwindCSS for styling
- Axios/Fetch for API calls
- Shadcn for ui elements

### Database Management
- Adminer
- MySQL in Docker


## 📋 Prerequisites

- Node.js 14.x or higher
- Docker and Docker Compose (for local database)
- Git

## 🔧 Installation & Setup

### Database Setup (Local Development)
1. Start the MySQL container:
```bash
cd database
docker-compose up -d
```

2. Access Adminer at `http://localhost:8080` with:
   - System: MySQL
   - Server: mysql
   - Username: library_user
   - Password: library_pass
   - Database: library_db

### Backend Setup
1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file:
```env
DB_HOST=localhost
DB_USER=library_user
DB_PASSWORD=library_pass
DB_NAME=library_db
PORT=5000
```

3. Start the server:
```bash
npm run dev
```

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:3000
```

3. Start the development server:
```bash
npm start
```

## 📚 API Endpoints

### Books
```
GET    /api/books     - Get all books
GET    /api/books/:id - Get book by ID
POST   /api/books     - Create new book
PUT    /api/books/:id - Update book
```

### Members
```
GET    /api/members/:id - Get member by ID
POST   /api/members     - Create new member
PUT    /api/members/:id - Update member
```

### Issuances
```
GET    /api/issuances/:id - Get issuance by ID
POST   /api/issuances     - Create new issuance
PUT    /api/issuances/:id - Update issuance
```

*Answer to all the Question*
### Library-Stats
```
GET     /api/library-stats - Get all library-stats 
```

## 💡 Key SQL Queries

### Books Never Borrowed
```sql
SELECT b.name as book_name, b.author 
FROM books b 
LEFT JOIN issuances i ON b.id = i.book_id 
WHERE i.id IS NULL;
```

### Outstanding Books
```sql
SELECT m.name as member_name, b.name as book_name, 
       i.issue_date, i.return_date, b.author
FROM issuances i
JOIN members m ON i.member_id = m.id
JOIN books b ON i.book_id = b.id
WHERE i.actual_return_date IS NULL
AND CURRENT_DATE > i.return_date;
```

### Top 10 Most Borrowed Books
```sql
SELECT b.name as book_name,
       COUNT(i.id) as times_borrowed,
       COUNT(DISTINCT i.member_id) as unique_members
FROM books b
JOIN issuances i ON b.id = i.book_id
GROUP BY b.id, b.name
ORDER BY times_borrowed DESC
LIMIT 10;
```

## 🔒 Security Features
- Environment variables for sensitive data
- Network isolation in Docker
- API request validation
- Error handling middleware

## 📝 Development Notes
- Backend follows MVC architecture
- Frontend uses component-based architecture
- Database schema version controlled
- API endpoints follow RESTful conventions

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

