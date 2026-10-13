const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const verifyToken = require("../middlewares/auth.middleware");

const {

getAllBooks,
getBookById,
addBook,
updateBook,
deleteBook,
borrowBook,
returnBook,
getMyBorrowHistory,
getDashboard,
searchBooks,
getOverdueBooks



} = require("../controllers/book.controller");

router.get("/", getAllBooks);
router.post("/",addBook);
router.get("/dashboard",getDashboard);
router.get("/my/history", auth, getMyBorrowHistory);
router.get("/search", searchBooks);
router.get("/overdue", verifyToken, getOverdueBooks);
router.get("/:id", getBookById);
router.put("/:id",updateBook);
router.delete("/:id", deleteBook);
router.post("/:id/borrow", auth, borrowBook);
router.post("/:id/return", auth, returnBook);


module.exports = router;

console.log("Book Routes Loaded");