const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {

    const {

        name,
        email,
        password

    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
    INSERT INTO users
    (name,email,password)
    VALUES(?,?,?)
    `;

    db.query(

        sql,

        [

            name,
            email,
            hashedPassword

        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    message: "Database Error"

                });

            }

            res.status(201).json({

                message: "User Registered Successfully"

            });

        }

    );

};

const loginUser = async (req, res) => {

    const {

        email,

        password

    } = req.body;

    const sql =

    "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) {

            return res.status(500).json({

                message: "Database Error"

            });

        }

        if (result.length === 0) {

            return res.status(404).json({

                message: "User Not Found"

            });

        }

        const user = result[0];

        const isMatch = await bcrypt.compare(

            password,

            user.password

        );

        if (!isMatch) {

            return res.status(401).json({

                message: "Invalid Password"

            });

        }

        const token = jwt.sign(

            {
            
            id:user.id,
            
            email:user.email
            
            },
            
            process.env.JWT_SECRET,
            
            {
            
            expiresIn:"1h"
            
            }
            
            );
            
            res.json({
                message: "Login Successful",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });

        
    });

};

module.exports = {

    registerUser,
    
    loginUser

};