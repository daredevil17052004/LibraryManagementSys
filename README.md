# Library Management System

This is a full-stack Library Management System built with:

- **Frontend:** Next.js with Tailwind CSS
- **Backend:** Express.js with MySQL
- **Database:** MySQL (Dockerized)
- **DevOps:** Docker for containerization, CI/CD for automation, and Nginx for reverse proxying

## Project Structure

```
/library-management-system
│── backend/   # Express.js API
│── frontend/  # Next.js UI
│── README.md  # Project documentation
```

---

## Backend Setup (Express.js + MySQL)

### Prerequisites
- Node.js (v18+ recommended)
- MySQL (Docker recommended)
- Docker (optional for containerization)

### Installation

1. Navigate to the backend folder:
   ```sh
   cd backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Configure environment variables (`.env`):
   ```env
    DB_HOST=localhost
    DB_USER=library_user
    DB_PASS=library_pass
    DB_NAME=library_db
    API_KEY=secureapikey123
   ```

4. Start the server:
   ```sh
   npm run dev
   ```
   The API will be available at `http://localhost:5000`.

---

## Frontend Setup (Next.js + Tailwind CSS)

### Prerequisites
- Node.js (v18+ recommended)

### Installation

1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the frontend:
   ```sh
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`.

---

## Running Backend, Frontend, and Database Together

For Windows (PowerShell):
```powershell
Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "cd backend; npm run dev"
Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "cd frontend; npm run dev"
docker-compose up -d
```

For macOS & Linux:
```sh
cd backend && npm run dev &
cd frontend && npm run dev &
docker-compose up -d
```

---

## API Endpoints

### 1️⃣ Get books that have never been borrowed
**Endpoint:** `GET /api/library-stats`

- Returns a list of books that have never been borrowed.

### 2️⃣ Get outstanding books (currently borrowed)
**Endpoint:** `GET /api/library-stats`

- Returns members with books currently borrowed and their return deadlines.

### 3️⃣ Get top 10 most borrowed books
**Endpoint:** `GET /api/library-stats`

- Returns the most borrowed books along with the number of times they were borrowed.

### 4️⃣ Get pending returns for today
**Endpoint:** `GET /api/library-stats`

- Returns the list of books due for return today.

### 5️⃣ Get pending returns for a specific date
**Endpoint:** `GET /api/library-stats/pending-returns/:date`

- Returns books pending return on a given date.

### 6️⃣ Add a new book issuance record
**Endpoint:** `POST /api/issuance`

- Creates a new record when a book is issued to a member.

### 7️⃣ Update book details
**Endpoint:** `PUT /api/books/:id`

- Updates details of a specific book.

---

## Docker Setup

1. Build and run the MySQL container:
   ```sh
   docker-compose up -d
   ```

2. Check running containers:
   ```sh
   docker ps
   ```

3. If needed, stop the containers:
   ```sh
   docker-compose down
   ```

---

## Contributing

1. Fork the repository.
2. Create a new branch (`feature-branch`).
3. Commit your changes.
4. Push the branch and create a Pull Request.

---
