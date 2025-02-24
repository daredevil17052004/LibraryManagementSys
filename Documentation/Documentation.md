# Library Management System

A RESTful API-based Library Management System built with Node.js, Express.js, MySQL, and React. This system provides a comprehensive solution for managing library operations including book management, member tracking, and issuance control.

## 🚀 Features

- Complete CRUD operations for Books, Members, and Issuances
- RESTful API architecture with Express.js
- Interactive dashboard for tracking book returns
- Dockerized MySQL database for easy setup
- Adminer for database management
- Web interface built with Next.js

## 🫠 Tech Stack

### Backend
- Node.js
- Express.js
- MySQL 8.0
- Docker & Docker Compose

### Frontend
- React
- TailwindCSS for styling
- Axios/Fetch for API calls
- Shadcn for UI elements

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

## 📚 Database Schema & Sample Data

# RUN THE FOLLOWING QUERY AFTER DOING THE COMMAND GIVEN BELOW, WRITE THIS QUERY TO CREATE DUMMY DATA AND TABLES
```
   docker-compose up -d
```

```sql
SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `book`;
CREATE TABLE `book` (
  `book_id` int NOT NULL AUTO_INCREMENT,
  `book_name` varchar(255) NOT NULL,
  `book_cat_id` int DEFAULT NULL,
  `book_collection_id` int DEFAULT NULL,
  `book_launch_date` datetime DEFAULT NULL,
  `book_publisher` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`book_id`),
  KEY `book_cat_id` (`book_cat_id`),
  KEY `book_collection_id` (`book_collection_id`),
  CONSTRAINT `book_ibfk_1` FOREIGN KEY (`book_cat_id`) REFERENCES `category` (`cat_id`) ON DELETE SET NULL,
  CONSTRAINT `book_ibfk_2` FOREIGN KEY (`book_collection_id`) REFERENCES `collection` (`collection_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `book` (`book_id`, `book_name`, `book_cat_id`, `book_collection_id`, `book_launch_date`, `book_publisher`) VALUES
(1,	'Dune',	1,	1,	'1965-08-01 00:00:00',	'Ace Books'),
(2,	'Steve Jobs Biography',	2,	2,	'2011-10-24 00:00:00',	'Simon & Schuster'),
(3,	'Introduction to Algorithms',	3,	3,	'2009-07-31 00:00:00',	'MIT Press'),
(4,	'The Great Gatsby',	1,	1,	'1925-04-10 00:00:00',	'Scribner'),
(5,	'To Kill a Mockingbird',	1,	1,	'1960-07-11 00:00:00',	'J.B. Lippincott & Co.'),
(6,	'1984',	2,	2,	'1949-06-08 00:00:00',	'Secker & Warburg'),
(7,	'The Catcher in the Rye',	1,	1,	'1951-07-16 00:00:00',	'Little, Brown and Company'),
(8,	'Moby-Dick',	3,	3,	'1851-10-18 00:00:00',	'Harper & Brothers'),
(9,	'Pride and Prejudice',	4,	3,	'1813-01-28 00:00:00',	'T. Egerton'),
(10,	'The Hobbit',	2,	2,	'1937-09-21 00:00:00',	'George Allen & Unwin'),
(11,	'Power',	8,	4,	'2004-07-12 09:30:00',	'The HellHounds'),
(12,	'The Silent Echo',	5,	2,	'2023-11-15 00:00:00',	'Penguin Random House'),
(13,	'The Silent Patient',	5,	2,	'2023-01-15 00:00:00',	'Penguin Random House'),
(14,	'The Lord of the Rings',	1,	1,	'1954-07-29 00:00:00',	'Allen & Unwin'),
(15,	'A Brief History of Time',	2,	3,	'1988-03-01 00:00:00',	'Bantam Dell'),
(16,	'Clean Code',	3,	3,	'2008-08-01 00:00:00',	'Prentice Hall'),
(17,	'The Hunger Games',	5,	1,	'2008-09-14 00:00:00',	'Scholastic Press'),
(18,	'The Da Vinci Code',	1,	2,	'2003-03-18 00:00:00',	'Doubleday'),
(19,	'Atomic Habits',	8,	4,	'2018-10-16 00:00:00',	'Penguin Random House'),
(20,	'The Design of Everyday Things',	3,	3,	'1988-01-01 00:00:00',	'Basic Books'),
(21,	'The Alchemist',	1,	2,	'1988-01-01 00:00:00',	'HarperOne'),
(22,	'Think and Grow Rich',	8,	4,	'1937-03-01 00:00:00',	'The Ralston Society'),
(23,	'Deep Work',	8,	4,	'2016-01-05 00:00:00',	'Grand Central Publishing'),
(24,	'Foundation',	1,	1,	'1951-05-01 00:00:00',	'Gnome Press'),
(25,	'The Art of War',	2,	2,	'1910-01-01 00:00:00',	'Filiquarian'),
(26,	'Rich Dad Poor Dad',	8,	4,	'1997-04-01 00:00:00',	'Warner Books'),
(27,	'The 7 Habits of Highly Effective People',	8,	4,	'1989-08-15 00:00:00',	'Free Press'),
(28,	'Neuromancer',	1,	1,	'1984-07-01 00:00:00',	'Ace Books');

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `cat_id` int NOT NULL AUTO_INCREMENT,
  `cat_name` varchar(255) NOT NULL,
  `sub_cat_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `category` (`cat_id`, `cat_name`, `sub_cat_name`) VALUES
(1,	'Fiction',	'Sci-Fi'),
(2,	'Non-Fiction',	'Biography'),
(3,	'Educational',	'Computer Science'),
(4,	'Fiction',	'Classic Fiction'),
(5,	'Science Fiction',	'Dystopian'),
(6,	'Classic Literature',	'Adventure'),
(7,	'Romance',	'Historical Romance'),
(8,	'Personal Development',	'Human Nature'),
(9,	'Technology',	'Software Development'),
(10,	'Business',	'Leadership'),
(11,	'Science',	'Physics'),
(12,	'Self-Help',	'Productivity'),
(13,	'Mystery',	'Thriller'),
(14,	'History',	'World War II'),
(15,	'Philosophy',	'Eastern Philosophy');

DROP TABLE IF EXISTS `collection`;
CREATE TABLE `collection` (
  `collection_id` int NOT NULL AUTO_INCREMENT,
  `collection_name` varchar(255) NOT NULL,
  PRIMARY KEY (`collection_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `collection` (`collection_id`, `collection_name`) VALUES
(1,	'Science Fiction'),
(2,	'History'),
(3,	'Technology'),
(4,	'PD'),
(5,	'Business & Economics'),
(6,	'Self Development'),
(7,	'Classic Literature'),
(8,	'Modern Fiction');

DROP TABLE IF EXISTS `issuance`;
CREATE TABLE `issuance` (
  `issuance_id` int NOT NULL AUTO_INCREMENT,
  `book_id` int NOT NULL,
  `issuance_member` int NOT NULL,
  `issuance_date` datetime NOT NULL,
  `issued_by` varchar(255) DEFAULT NULL,
  `target_return_date` datetime DEFAULT NULL,
  `issuance_status` enum('issued','returned','pending') NOT NULL,
  PRIMARY KEY (`issuance_id`),
  KEY `book_id` (`book_id`),
  KEY `issuance_member` (`issuance_member`),
  CONSTRAINT `issuance_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `book` (`book_id`) ON DELETE CASCADE,
  CONSTRAINT `issuance_ibfk_2` FOREIGN KEY (`issuance_member`) REFERENCES `member` (`mem_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `issuance` (`issuance_id`, `book_id`, `issuance_member`, `issuance_date`, `issued_by`, `target_return_date`, `issuance_status`) VALUES
(1,	1,	1,	'2025-02-20 10:00:00',	'Librarian A',	'2025-03-05 10:00:00',	'issued'),
(2,	2,	2,	'2025-02-18 15:30:00',	'Librarian B',	'2025-03-04 15:30:00',	'returned'),
(3,	3,	3,	'2025-02-22 12:45:00',	'Librarian C',	'2025-03-08 12:45:00',	'issued'),
(4,	4,	1,	'2025-02-15 09:30:00',	'Librarian A',	'2025-03-01 09:30:00',	'pending'),
(5,	5,	2,	'2025-02-14 14:45:00',	'Librarian B',	'2025-02-28 14:45:00',	'returned'),
(6,	6,	3,	'2025-02-16 11:15:00',	'Librarian C',	'2025-03-02 11:15:00',	'pending'),
(7,	7,	4,	'2025-02-18 16:00:00',	'Librarian A',	'2025-03-04 16:00:00',	'pending'),
(8,	8,	1,	'2025-02-10 10:00:00',	'Librarian B',	'2025-02-24 10:00:00',	'returned'),
(9,	9,	2,	'2025-02-12 13:20:00',	'Librarian C',	'2025-02-26 13:20:00',	'pending'),
(10,	10,	3,	'2025-02-20 15:30:00',	'Librarian A',	'2025-03-06 15:30:00',	'pending'),
(11,	11,	5,	'2025-02-21 10:00:00',	'Librarian A',	'2025-02-22 10:00:00',	'pending'),
(12,	2,	5,	'2025-01-12 10:00:00',	'Librarian C',	'2025-02-21 10:00:00',	'pending'),
(13,	2,	3,	'2025-02-12 10:00:00',	'Librarian A',	'2025-02-21 10:00:00',	'pending'),
(14,	1,	5,	'2025-02-24 00:00:00',	'Librarian A',	'2025-03-10 00:00:00',	'pending'),
(15,	3,	2,	'2025-02-24 00:00:00',	'Librarian B',	'2025-03-10 00:00:00',	'pending'),
(16,	5,	4,	'2025-02-24 00:00:00',	'Librarian C',	'2025-03-10 00:00:00',	'pending'),
(17,	7,	1,	'2025-02-24 00:00:00',	'Librarian A',	'2025-03-10 00:00:00',	'pending'),
(18,	9,	3,	'2025-02-24 00:00:00',	'Librarian B',	'2025-03-10 00:00:00',	'pending'),
(19,	2,	1,	'2025-02-25 00:00:00',	'Librarian C',	'2025-03-11 00:00:00',	'pending'),
(20,	4,	3,	'2025-02-25 00:00:00',	'Librarian A',	'2025-03-11 00:00:00',	'pending'),
(21,	6,	5,	'2025-02-25 00:00:00',	'Librarian B',	'2025-03-11 00:00:00',	'pending'),
(22,	8,	2,	'2025-03-01 00:00:00',	'Librarian C',	'2025-03-15 00:00:00',	'pending'),
(23,	10,	4,	'2025-03-01 00:00:00',	'Librarian A',	'2025-03-15 00:00:00',	'pending'),
(24,	14,	1,	'2025-02-10 00:00:00',	'Librarian A',	'2025-02-24 00:00:00',	'issued'),
(25,	15,	2,	'2025-02-12 00:00:00',	'Librarian B',	'2025-02-26 00:00:00',	'issued'),
(26,	16,	3,	'2025-02-15 00:00:00',	'Librarian C',	'2025-02-25 00:00:00',	'issued'),
(27,	17,	4,	'2025-02-18 00:00:00',	'Librarian A',	'2025-02-25 00:00:00',	'issued'),
(28,	18,	5,	'2025-02-20 00:00:00',	'Librarian B',	'2025-02-24 00:00:00',	'issued'),
(29,	19,	1,	'2025-01-15 00:00:00',	'Librarian C',	'2025-02-15 00:00:00',	'returned'),
(30,	20,	2,	'2025-01-20 00:00:00',	'Librarian A',	'2025-02-20 00:00:00',	'returned'),
(31,	21,	3,	'2025-01-25 00:00:00',	'Librarian B',	'2025-02-20 00:00:00',	'returned'),
(32,	22,	4,	'2025-01-28 00:00:00',	'Librarian C',	'2025-02-18 00:00:00',	'returned'),
(33,	1,	2,	'2024-12-01 00:00:00',	'Librarian A',	'2024-12-15 00:00:00',	'returned'),
(34,	1,	3,	'2024-12-20 00:00:00',	'Librarian B',	'2025-01-03 00:00:00',	'returned'),
(35,	1,	4,	'2025-01-10 00:00:00',	'Librarian C',	'2025-01-24 00:00:00',	'returned'),
(36,	2,	1,	'2024-11-15 00:00:00',	'Librarian A',	'2024-11-29 00:00:00',	'returned'),
(37,	2,	3,	'2024-12-05 00:00:00',	'Librarian B',	'2024-12-19 00:00:00',	'returned'),
(38,	2,	5,	'2025-01-05 00:00:00',	'Librarian C',	'2025-01-19 00:00:00',	'returned'),
(39,	3,	4,	'2025-01-01 00:00:00',	'Librarian A',	'2025-02-15 00:00:00',	'issued'),
(40,	4,	5,	'2025-01-10 00:00:00',	'Librarian B',	'2025-02-20 00:00:00',	'issued'),
(41,	5,	1,	'2025-01-15 00:00:00',	'Librarian C',	'2025-02-22 00:00:00',	'issued');

DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `mem_id` int NOT NULL AUTO_INCREMENT,
  `mem_name` varchar(255) NOT NULL,
  `mem_phone` varchar(20) DEFAULT NULL,
  `mem_email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`mem_id`),
  UNIQUE KEY `mem_email` (`mem_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `member` (`mem_id`, `mem_name`, `mem_phone`, `mem_email`) VALUES
(1,	'Alice Johnson',	'9876543210',	'alice@example.com'),
(2,	'Bob Smith',	'8765432109',	'bob@example.com'),
(3,	'Charlie Brown',	'7654321098',	'charlie@example.com'),
(4,	'Ansh Sharma',	'8058330898',	'ansh@gmail.com'),
(5,	'Rahul Kumar',	'9988778899',	'rahul@example.com'),
(6,	'David Wilson',	'7778889999',	'david@example.com'),
(7,	'Emma Davis',	'6667778888',	'emma@example.com'),
(8,	'Frank Miller',	'5556667777',	'frank@example.com'),
(9,	'Grace Taylor',	'4445556666',	'grace@example.com'),
(10,	'Henry Clark',	'3334445555',	'henry@example.com'),
(11,	'Ivy Anderson',	'2223334444',	'ivy@example.com'),
(12,	'Jack Thomas',	'1112223333',	'jack@example.com');

DROP TABLE IF EXISTS `membership`;
CREATE TABLE `membership` (
  `membership_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`membership_id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `membership_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`mem_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `membership` (`membership_id`, `member_id`, `status`) VALUES
(1,	1,	'active'),
(2,	2,	'inactive'),
(3,	3,	'active');

```

