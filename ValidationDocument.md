# Validation Document

## 1. Task Completion Summary

This document validates the completion of the Library Management System project, which includes:
- A **Next.js** frontend with Tailwind CSS
- A **Node.js + Express.js** backend with MySQL
- **Docker** for MySQL containerization and deployment
- **API Development** for book borrowing, returns, and statistics
- **DevOps Integration** with CI/CD and Nginx reverse proxy

---

## 2. Screenshots of Work Done

### Backend Running
_(Attach a screenshot of the terminal showing `npm run dev` execution)_
![alt text](./Screenshots/image-2.png)

### Frontend Running
_(Attach a screenshot of the terminal showing `npm run dev` execution and the application UI)_
![alt text](./Screenshots/image-1.png)


### MySQL Container Running
_(Attach a screenshot of `docker ps` showing the running MySQL container)_
![alt text](./Screenshots/image-3.png)

### API Testing (ThunderClient)
- `GET /api/library-stats` (Library-Stats API response)
_(Attach screenshots of API responses)_
![alt text](./Screenshots/image-4.png)



- `GET /api/books/3` (books fetching api)
![alt text](./Screenshots/image-5.png)

- `POST /api/books`(books creation api)
![alt text](./Screenshots/image-6.png)

- `PUT /api/books/29` (books updating api, 29 is the id for book returns api)
![alt text](./Screenshots/image-7.png)




- `GET /api/members/3` (members fetching api)
![alt text](./Screenshots/image-8.png)

- `POST /api/members`(members creation api)
![alt text](./Screenshots/image-9.png)

- `PUT /api/members/13` (members updating api, 13 is the id for member updating api)
![alt text](./Screenshots/image-10.png)



- `GET /api/issuance/5` (issation api )
![alt text](./Screenshots/image-11.png)

- `POST /api/issuance`(isssuaction creation api)
![alt text](./Screenshots/image-12.png)

- `PUT /api/issuance/5` (issuaction updating api, 5 is the id for issuaction api )
![alt text](./Screenshots/image-13.png)


### UI Dashboard
_(Attach a screenshot of the dashboard tracking book returns)_
![alt text](./Screenshots/image-14.png)

---

## 3. GitHub Proof of Work

### Repository Overview
_(Attach a screenshot of the GitHub repository, including backend, frontend, and Docker configurations)_
![alt text](./Screenshots/image-15.png)

### Commit History
_(Attach a screenshot showing meaningful commit messages and contributions)_
![alt text](./Screenshots/image-16.png)

---

## 4. Conclusion

The project is fully implemented with backend, frontend, database, and DevOps best practices. The above screenshots validate the completion and working state of the Library Management System.

_(End of Document)_

