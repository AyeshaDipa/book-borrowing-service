import uuid
from locust import FastHttpUser, HttpUser, task, between


class BookBorrowingUser(HttpUser):
    host = "http://localhost:3000"

    wait_time = between(1, 3)

    # @task(30)
    # def get_books(self):
    #     self.client.get("/books")
        

    # @task(70)
    # def get_books_dashboard(self):
    #    self.client.get("/books/dashboard")

    @task
    def add_book(self):
        unique_id = uuid.uuid4().hex[:8]

        self.client.post(
            "/books",
            json={
                "title": f"Locust Test Book {unique_id}",
                "author": "Test Author",
                "isbn": f"LOCUST-{unique_id}",
                "total_copies": 10,
                "available_copies": 10
            }
        )