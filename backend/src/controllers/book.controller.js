const db = require("../config/db");

const getAllBooks = (req, res) => {

    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const sort = req.query.sort === "desc" ? "DESC" : "ASC";

    const available = req.query.available;

    let sql = `
        SELECT *
        FROM books
    `;

    const values = [];

    if (available === "true") {

        sql += `
            WHERE available_copies > 0
        `;

    }

    sql += `
        ORDER BY title ${sort}
    `;

    if (page && limit) {

        const offset = (page - 1) * limit;

        sql += `
            LIMIT ?
            OFFSET ?
        `;

        values.push(limit, offset);

    }

    db.query(sql, values, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({

                message: "Database Error"

            });

        }

        res.json(result);

    });

};




const addBook = (req, res) => {

    const {

        title,

        author,

        isbn,

        total_copies,

        available_copies

    } = req.body;

    const sql = `

    INSERT INTO books

    (title,author,isbn,total_copies,available_copies)

    VALUES(?,?,?,?,?)

    `;

    db.query(

        sql,

        [

            title,

            author,

            isbn,

            total_copies,

            available_copies

        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            res.status(201).json({

                message: "Book Added Successfully"

            });

        }

    );

};



const getBookById = (req, res) => {

    const id = req.params.id;

    const sql = "SELECT * FROM books WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {

            return res.status(500).json({

                message: "Database Error"

            });

        }

        if (result.length === 0) {

            return res.status(404).json({

                message: "Book Not Found"

            });

        }

        res.json(result[0]);

    });

};



const updateBook = (req, res) => {

    const id = req.params.id;

    const {

        title,

        author,

        isbn,

        total_copies,

        available_copies

    } = req.body;

    const sql =

    `UPDATE books

    SET

    title=?,

    author=?,

    isbn=?,

    total_copies=?,

    available_copies=?

    WHERE id=?`;

    db.query(

        sql,

        [

            title,

            author,

            isbn,

            total_copies,

            available_copies,

            id

        ],

        (err, result) => {

            if(err){

                return res.status(500).json({

                    message:"Database Error"

                });

            }

            if(result.affectedRows===0){

                return res.status(404).json({

                    message:"Book Not Found"

                });

            }

            res.json({

                message:"Book Updated Successfully"

            });

        }

    );

};


const deleteBook = (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM books WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "Database Error"
            });

        }

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Book Not Found"
            });

        }

        res.json({
            message: "Book Deleted Successfully"
        });

    });

};


const borrowBook = (req, res) => {

    const bookId = req.params.id;

    const userId = req.user.id;

    const alreadyBorrowedSql = `
        SELECT *
        FROM borrow_records
        WHERE user_id = ?
        AND book_id = ?
        AND status = 'Borrowed'
    `;

    db.query(
        alreadyBorrowedSql,
        [userId, bookId],
        (err, borrowedResult) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (borrowedResult.length > 0) {
                return res.status(400).json({
                    message: "You already borrowed this book"
                });
            }

            const checkSql =
                "SELECT available_copies FROM books WHERE id = ?";

            db.query(checkSql, [bookId], (err, result) => {

                if (err) {
                    return res.status(500).json({
                        message: "Database Error"
                    });
                }

                if (result.length === 0) {
                    return res.status(404).json({
                        message: "Book Not Found"
                    });
                }

                if (result[0].available_copies <= 0) {
                    return res.status(400).json({
                        message: "Book Not Available"
                    });
                }

                const updateSql = `
                    UPDATE books
                    SET available_copies = available_copies - 1
                    WHERE id = ?
                `;

                db.query(updateSql, [bookId], (err) => {

                    if (err) {
                        return res.status(500).json({
                            message: "Database Error"
                        });
                    }

                    // Due Date (14 days)
                    const dueDate = new Date();
                    dueDate.setDate(dueDate.getDate() + 14);
                    console.log("Due Date:", dueDate);

                    const borrowSql = `
                        INSERT INTO borrow_records
                        (user_id, book_id, due_date)
                        VALUES (?, ?, ?)
                    `;

                    db.query(
                        borrowSql,
                        [
                            userId,
                            bookId,
                            dueDate
                        ],
                        (err) => {

                            if (err) {
                                return res.status(500).json({
                                    message: "Borrow Record Error"
                                });
                            }

                            res.status(200).json({
                                message: "Book Borrowed Successfully"
                            });

                        }
                    );

                });

            });

        }
    );

};


const returnBook = (req, res) => {

    const bookId = req.params.id;

    const userId = req.user.id;

    const checkBorrowSql = `
    SELECT *
    FROM borrow_records
    WHERE
    user_id = ?
    AND
    book_id = ?
    AND
    status = 'Borrowed'
    `;

    db.query(

        checkBorrowSql,

        [userId, bookId],

        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            if (result.length === 0) {

                return res.status(404).json({
                    message: "Borrow Record Not Found"
                });

            }

            const dueDate = new Date(result[0].due_date);

            const today = new Date();

            const diffTime = today - dueDate;

            const lateDays = Math.floor(
                diffTime / (1000 * 60 * 60 * 24)
            );

            let fine = 0;

            if (lateDays > 0) {

                fine = lateDays * 10;

            }

            const updateBorrowSql = `
            UPDATE borrow_records
            SET
            status='Returned',
            return_date=NOW()
            WHERE id=?
            `;

            db.query(

                updateBorrowSql,

                [result[0].id],

                (err) => {

                    if (err) {

                        return res.status(500).json({
                            message: "Database Error"
                        });

                    }

                    const updateBookSql = `
                    UPDATE books
                    SET
                    available_copies=available_copies+1
                    WHERE id=?
                    `;

                    db.query(

                        updateBookSql,

                        [bookId],

                        (err) => {

                            if (err) {

                                return res.status(500).json({
                                    message: "Database Error"
                                });

                            }

                            res.json({

                                message: "Book Returned Successfully",

                                lateDays:
                                    lateDays > 0 ? lateDays : 0,

                                fine

                            });

                        }

                    );

                }

            );

        }

    );

};


const getOverdueBooks = (req, res) => {

    const sql = `
        SELECT
            borrow_records.id,
            users.name,
            users.email,
            books.title,
            borrow_records.borrow_date,
            borrow_records.due_date,

            DATEDIFF(CURDATE(), borrow_records.due_date) AS overdue_days

        FROM borrow_records

        JOIN users
            ON borrow_records.user_id = users.id

        JOIN books
            ON borrow_records.book_id = books.id

        WHERE
            borrow_records.status = 'Borrowed'
            AND borrow_records.due_date < CURDATE()

        ORDER BY borrow_records.due_date ASC
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });

        }

        res.json(result);

    });

};


const getMyBorrowHistory = (req, res) => {

    const userId = req.user.id;

    const sql = `

    SELECT

    books.title,

    books.author,

    borrow_records.borrow_date,

    borrow_records.return_date,

    borrow_records.status

    FROM borrow_records

    JOIN books

    ON books.id = borrow_records.book_id

    WHERE borrow_records.user_id = ?

    ORDER BY borrow_records.borrow_date DESC

    `;

    db.query(

        sql,

        [userId],

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            res.json(result);

        }

    );

};


const searchBooks = (req, res) => {

    const keyword = req.query.keyword;

    const sql = `

    SELECT *

    FROM books

    WHERE

    title LIKE ?

    OR

    author LIKE ?

    OR

    isbn LIKE ?

    `;

    db.query(

        sql,

        [

            `%${keyword}%`,

            `%${keyword}%`,

            `%${keyword}%`

        ],

        (err, result) => {

            if (err) {

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            res.json(result);

        }

    );

};


const getDashboard = (req,res)=>{

    const sql=`
    
    SELECT
    
    (SELECT COUNT(*) FROM books) AS totalBooks,
    
    (SELECT COUNT(*) FROM users) AS totalUsers,
    
    (SELECT COUNT(*) FROM borrow_records WHERE status='Borrowed')
    
    AS borrowedBooks,
    
    (SELECT SUM(available_copies) FROM books)
    
    AS availableBooks
    
    `;
    
    db.query(
    
    sql,
    
    (err,result)=>{
    
    if(err){
    
    return res.status(500).json({
    
    message:"Database Error"
    
    });
    
    }
    
    res.json(result[0]);
    
    }
    
    );
    
    };

   


module.exports = {

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



};