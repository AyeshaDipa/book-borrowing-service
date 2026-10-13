# Book Borrowing Service

## Project Overview

Book Borrowing Service is a backend-focused application for managing books, user authentication, borrowing, returning, and borrowing history.

## Features

* User registration and login
* JWT-based authentication
* Book management (Create, Read, Update, Delete)
* Search books
* Borrow and return books
* Borrowing history
* Overdue books
* Dashboard endpoints

## Technology Stack

* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Authentication:** JWT
* **Password Hashing:** bcrypt
* **API Testing:** Postman
* **Performance Testing:** Locust
* **Version Control:** Git and GitHub

## Project Structure

* `backend/` — Backend application and API
* `frontend/` — Frontend application
* `docs/` — Project documentation
* `performance-testing/` — Performance-testing files and reports

## Performance Testing

Performance testing is performed using Locust to evaluate API response times, request throughput, and failure rates under simulated concurrent users.

Test results and screenshots are maintained in the `performance-testing/` directory.

## Security

Sensitive configuration values, including database credentials and JWT secrets, should be stored in environment variables and must not be committed to GitHub.

## Setup

1. Clone this repository.
2. Install backend dependencies using `npm install` inside the backend directory.
3. Configure the required environment variables in a local `.env` file.
4. Configure the MySQL database.
5. Start the backend using the appropriate npm script or Node.js command.

## Author

GitHub: [AyeshaDipa](https://github.com/AyeshaDipa)
