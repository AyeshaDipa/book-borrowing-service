# Book Borrowing Service - Performance Testing

## 1. Project Overview

This project focuses on performance testing of the Book Borrowing Service backend APIs using Locust.

The objective is to evaluate API response times, request throughput, and failures under concurrent user load.

## 2. Tools and Technologies

* Locust
* Python
* Node.js
* Express.js
* MySQL

## 3. Application Under Test

**Application:** Book Borrowing Service

**Base URL:** `http://localhost:3000`

## 4. Performance Testing Scope

The following API categories are planned for testing:

* Authentication APIs
* Book management APIs
* Book borrowing and returning APIs
* Dashboard APIs

## 5. Initial Test Scenario

**Test ID:** PT-001

**API:** `GET /books`

**Virtual Users:** 10

**Ramp Up:** 2 users per second

**Purpose:** To observe the API's response time and behavior under a small concurrent load.

## 6. Initial Test Results

| Metric                | Result |
| --------------------- | -----: |
| Total Requests        |   3169 |
| Failed Requests       |      0 |
| Average Response Time |  12 ms |
| Median Response Time  |   9 ms |
| Minimum Response Time |   2 ms |
| Maximum Response Time |  34 ms |

**Observation:** No request failures were reported during this initial test. The observed average response time was 12 ms.

These results apply only to this test configuration and do not establish the application's maximum capacity.

## 7. How to Run Locust

1. Start the backend server and database.

2. Open a terminal in the `performance-testing/locust` directory.

3. Run the following command:

   `py -m locust -f locustfile.py`

4. Open `http://localhost:8089` in a browser.

5. Enter the target host: `http://localhost:3000`.

6. Configure the number of users and ramp-up rate.

7. Start the test and review the Statistics tab.

## 8. Planned Testing

* Test individual API endpoints.
* Gradually increase concurrent users.
* Compare response times and failure rates.
* Test realistic user workflows.
* Perform stress testing after establishing safe load-test limits.

## 9. Test Artifacts

Test scripts, test cases, result screenshots, and the final performance report will be maintained in this directory as testing progresses.
