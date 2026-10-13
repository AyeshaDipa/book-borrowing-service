const db = require("../config/db");

const getDashboardStats = (req, res) => {

    const sql = `
    SELECT
    (SELECT COUNT(*) FROM books) AS totalBooks,
    (SELECT COUNT(*) FROM users) AS totalUsers,
    (SELECT COUNT(*) FROM borrow_records WHERE status='Borrowed') AS borrowedBooks,
    (SELECT COUNT(*) FROM borrow_records WHERE status='Returned') AS returnedBooks
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({

                message: "Database Error"

            });

        }

        res.json(result[0]);

    });

};

module.exports = {

    getDashboardStats

};