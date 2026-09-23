require("dotenv").config();

const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const pool = require("./databasepg");
const session = require("express-session");
const multer = require("multer");

const app = express();

app.use(express.json());


// =========================
// Session
// =========================

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

app.use(
    session({
        secret: process.env.SESSION_SECRET,

        // لا تعيد حفظ الـ Session إذا لم تتغير بياناتها
        resave: false,

        // لا تنشئ Session إلا إذا احتجنا نخزن شيء فيها
        saveUninitialized: false,

        cookie: {
            httpOnly: true,

            // محلياً false
            // عند النشر باستخدام HTTPS تصبح true تلقائياً
            secure: process.env.NODE_ENV === "production",

            sameSite: "lax"
        }
    })
);


// =========================
// Upload files
// =========================

const upload = multer({
    dest: "Web/uploads/"
});


// =========================
// Open Main.html
// =========================

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "Web", "Main.html")
    );
});


// =========================
// Static files
// CSS / JS / Images
// =========================

app.use(
    express.static(
        path.join(__dirname, "Web")
    )
);




// =====================================================
// REGISTER
// =====================================================

app.post("/register", async (req, res) => {

    try {

        const {

            Username,
            firstName,
            secondName,
            Age,
            email,
            password,
            Gender,
            Profile_image

        } = req.body;



        // Check required fields

        if (
            !Username ||
            !firstName ||
            !secondName ||
            !Age ||
            !email ||
            !password ||
            !Gender
        ) {

            return res.status(400).json({

                message:
                    "Please fill in all required fields"

            });

        }



        // Check if email already exists
const existingEmail = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
);
        // Check if username already exists

const existingUsername = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [Username]
);


if (
    existingEmail.rows.length > 0 &&
    existingUsername.rows.length > 0
) {

    return res.status(400).json({
        message: "Email and Username already exist"
    });

}


if (existingEmail.rows.length > 0) {

    return res.status(400).json({
        message: "Email already exists"
    });

}


if (existingUsername.rows.length > 0) {

    return res.status(400).json({
        message: "Username already exists"
    });

}

        



        // Hash password

        const hashedPassword =
            await bcrypt.hash(

                String(password),

                10

            );



        // Profile image is optional

        const profileImage =
            Profile_image || null;



        // Insert user

        await pool.query(
            `
            INSERT INTO users
            (
                username,
                firstname,
                secondname,
                age,
                email,
                password,
                gender,
                profile_image
            )

            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8)
            `,
            [

                Username,
                firstName,
                secondName,
                Age,
                email,
                hashedPassword,
                Gender,
                profileImage

            ]
        );



        res.status(201).json({

            message:
                "Account created successfully"

        });



    } catch (error) {

        console.error(
            "Register error:",
            error
        );


        res.status(500).json({

            message:
                "Server error"

        });

    }

});



// =====================================================
// LOGIN
// =====================================================

app.post("/login", async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;



        // Check required fields

        if (!username || !password) {

            return res.status(400).json({

                message:
                    "Please enter username and password"

            });

        }



        // Find user

        const result =
            await pool.query(

                "SELECT * FROM users WHERE username = $1",

                [username]

            );



        // User not found

        if (result.rows.length === 0) {

            return res.status(401).json({

                message:
                    "Invalid username or password"

            });

        }



        const user =
            result.rows[0];



        // Compare password

        const passwordMatch =
            await bcrypt.compare(

                password,

                user.password

            );



        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Invalid username or password"

            });

        }



        // Save user in session

        req.session.user = {

            user_id:
                user.user_id,

            username:
                user.username,

            firstname:
                user.firstname,

            secondname:
                user.secondname,

            email:
                user.email

        };



        res.status(200).json({

            message:
                "Login successful"

        });



    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        res.status(500).json({

            message:
                "Server error"

        });

    }

});



// =====================================================
// LOGOUT
// =====================================================

app.post("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            console.error(
                "Logout error:",
                error
            );


            return res.status(500).json({

                message:
                    "Logout failed"

            });

        }



        res.clearCookie(
            "connect.sid"
        );



        res.json({

            message:
                "Logout successful"

        });

    });

});



// =====================================================
// CHECK CURRENT USER
// =====================================================

app.get("/me", (req, res) => {

    if (req.session.user) {

        return res.json({

            loggedIn: true,

            user:
                req.session.user

        });

    }



    res.json({

        loggedIn: false

    });

});



// =====================================================
// ACCOUNT INFORMATION
// =====================================================

app.get("/api/account", async (req, res) => {

    try {

        // User must be logged in

        if (!req.session.user) {

            return res.status(401).json({

                error:
                    "You must login first"

            });

        }



        const userId =
            req.session.user.user_id;



        const result =
            await pool.query(
                `
                SELECT

                    user_id,
                    username,
                    firstname,
                    secondname,
                    email,
                    profile_image,
                    bio,
                    cover_image,
                    theme_color
            

                FROM users

                WHERE user_id = $1
                `,
                [userId]
            );



        if (result.rows.length === 0) {

            return res.status(404).json({

                error:
                    "User not found"

            });

        }



        res.json(
            result.rows[0]
        );



    } catch (error) {

        console.error(
            "Error loading account:",
            error
        );


        res.status(500).json({

            error:
                "Server error"

        });

    }

});



// =====================================================
// UPDATE CURRENT USER BIO + theme COLOR
// =====================================================

app.put("/api/account/bio", async (req, res) => {

    try {

        if (!req.session.user) {

            return res.status(401).json({
                error: "You must login first"
            });

        }


        const userId =
            req.session.user.user_id;


        const {
            bio,
            theme_color
        } = req.body;


        if (typeof bio !== "string") {

            return res.status(400).json({
                error: "Invalid bio"
            });

        }


        const cleanBio =
            bio.trim();


        if (cleanBio.length > 200) {

            return res.status(400).json({
                error: "Bio cannot be more than 200 characters"
            });

        }


        const result =
            await pool.query(
                `
                UPDATE users

                SET
                    bio = $1,
                    theme_color = $2

                WHERE user_id = $3

                RETURNING
                    bio,
                    theme_color
                `,
                [
                    cleanBio,
                    theme_color,
                    userId
                ]
            );


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "User not found"
            });

        }


        res.json({

            bio:
                result.rows[0].bio,

            theme_color:
                result.rows[0].theme_color

        });


    } catch (error) {

        console.error(
            "Error updating profile:",
            error
        );


        res.status(500).json({
            error: "Server error"
        });

    }

});


// =====================================================
// CREATE POST
// =====================================================

app.post(
    "/api/posts",

    upload.array(
        "contentPhotos",
        10
    ),

    async (req, res) => {

        try {

            // User must be logged in

            if (!req.session.user) {

                return res.status(401).json({

                    error:
                        "You must login first"

                });

            }



            const {

                title,
                contents

            } = req.body;



            if (!title || !contents) {

                return res.status(400).json({

                    error:
                        "Title and content are required"

                });

            }



            const user_id =
                req.session.user.user_id;



            // Save uploaded image paths

            const content_photos =
                req.files
                    ? JSON.stringify(

                        req.files.map(

                            file =>
                                `/uploads/${file.filename}`

                        )

                    )
                    : null;



            const result =
                await pool.query(
                    `
                    INSERT INTO Posts
                    (
                        Title,
                        Contents,
                        Content_Photos,
                        user_id
                    )

                    VALUES
                    ($1, $2, $3, $4)

                    RETURNING *
                    `,
                    [

                        title,
                        contents,
                        content_photos,
                        user_id

                    ]
                );



            res.status(201).json({

                message:
                    "Post created successfully",

                post:
                    result.rows[0]

            });



        } catch (error) {

            console.error(
                "Create post error:",
                error
            );


            res.status(500).json({

                error:
                    "Server error"

            });

        }

    }
);



// =====================================================
// GET POSTS
// =====================================================

app.get("/api/posts", async (req, res) => {

    try {

        const result =
            await pool.query(
                `
                SELECT

                    Posts.post_id,
                    Posts.Title,
                    Posts.Contents,
                    Posts.Content_Photos,
                    Posts.user_id,
                    users.Username,
                    users.Profile_image,
                    users.Theme_color

                FROM Posts

                JOIN users
                ON Posts.user_id = users.user_id

                ORDER BY Posts.post_id DESC
                `
            );



        res.json(
            result.rows
        );



    } catch (error) {

        console.error(
            "Error loading posts:",
            error
        );


        res.status(500).json({

            error:
                "Server error"

        });

    }

});





// =====================================================
// OPEN PUBLIC PROFILE PAGE
// =====================================================

app.get("/profile/:userId", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "web",
            "profile.html"
        )
    );

});




// =====================================================
// GET USER PUBLIC PROFILE
// =====================================================

app.get("/api/users/:userId", async (req, res) => {

    try {

        const userId = req.params.userId;

        const result = await pool.query(
            `
            SELECT

                user_id,
                username,
                firstname,
                secondname,
                profile_image,
                bio,
                cover_image,
                theme_color
                

            FROM users

            WHERE user_id = $1
            `,
            [userId]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "User not found"
            });

        }


        res.json(result.rows[0]);


    } catch (error) {

        console.error(
            "Error loading user:",
            error
        );


        res.status(500).json({
            error: "Server error"
        });

    }

});





app.put(
    "/api/account/profile-image",

    upload.single("profileImage"),

    async (req, res) => {

        try {

            if (!req.session.user) {

                return res.status(401).json({
                    error: "You must login first"
                });

            }


            if (!req.file) {

                return res.status(400).json({
                    error: "Please choose an image"
                });

            }


            const userId =
                req.session.user.user_id;


            const imagePath =
                `/uploads/${req.file.filename}`;


            const result =
                await pool.query(
                    `
                    UPDATE users

                    SET profile_image = $1

                    WHERE user_id = $2

                    RETURNING profile_image
                    `,
                    [
                        imagePath,
                        userId
                    ]
                );


            if (result.rows.length === 0) {

                return res.status(404).json({
                    error: "User not found"
                });

            }


            res.json({

                message:
                    "Profile picture updated",

                profile_image:
                    result.rows[0].profile_image

            });


        } catch (error) {

            console.error(
                "Error updating profile image:",
                error
            );


            res.status(500).json({
                error: "Server error"
            });

        }

    }
);

// =====================================================
// UPDATE COVER IMAGE
// =====================================================

app.put(
    "/api/account/cover-image",

    upload.single("coverImage"),

    async (req, res) => {

        try {

            // نتأكد أن المستخدم مسجل دخول
            if (!req.session.user) {

                return res.status(401).json({
                    error: "You must login first"
                });

            }


            // نتأكد أنه اختار صورة
            if (!req.file) {

                return res.status(400).json({
                    error: "Please choose an image"
                });

            }


            const userId =
                req.session.user.user_id;


            // مسار الصورة بعد رفعها
            const imagePath =
                `/uploads/${req.file.filename}`;


            // نحفظ الصورة في قاعدة البيانات
            const result =
                await pool.query(
                    `
                    UPDATE users

                    SET cover_image = $1

                    WHERE user_id = $2

                    RETURNING cover_image
                    `,
                    [
                        imagePath,
                        userId
                    ]
                );


            // المستخدم غير موجود
            if (result.rows.length === 0) {

                return res.status(404).json({
                    error: "User not found"
                });

            }


            // نرجع الصورة الجديدة للـ JS
            res.json({

                message:
                    "Cover image updated",

                cover_image:
                    result.rows[0].cover_image

            });


        } catch (error) {

            console.error(
                "Error updating cover image:",
                error
            );


            res.status(500).json({
                error: "Server error"
            });

        }

    }
);








// =====================================================
// DELETE POST
// =====================================================

app.delete("/api/posts/:postId", async (req, res) => {

    try {

        if (!req.session.user) {
            return res.status(401).json({
                error: "You must login first"
            });
        }

        const userId =
            req.session.user.user_id;

        const postId =
            req.params.postId;


        const result =
            await pool.query(
                `
                DELETE FROM posts

                WHERE post_id = $1
                AND user_id = $2

                RETURNING post_id
                `,
                [
                    postId,
                    userId
                ]
            );


        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Post not found"
            });

        }


        res.json({
            message: "Post deleted"
        });


    } catch (error) {

        console.error(
            "Error deleting post:",
            error
        );

        res.status(500).json({
            error: "Server error"
        });

    }

});











// =====================================================
// START SERVER
// =====================================================


const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});