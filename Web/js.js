document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // NAVBAR
    // =====================================================

    const navbarToggle =
        document.getElementById("navbarToggle");

    const navbarMenu =
        document.getElementById("navbarMenu");


    if (navbarToggle && navbarMenu) {

        navbarToggle.addEventListener("click", function () {

            navbarToggle.classList.toggle("is-active");

            navbarMenu.classList.toggle("is-active");

            const isExpanded =
                navbarToggle.getAttribute("aria-expanded") === "true";

            navbarToggle.setAttribute(
                "aria-expanded",
                !isExpanded
            );

        });

    }
document.querySelectorAll(".navbar__link").forEach(link => {

    link.addEventListener("click", function () {

        navbarMenu.classList.remove("is-active");

        navbarToggle.classList.remove("is-active");

        navbarToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    });

});


    // =====================================================
    // LOGIN MODAL
    // =====================================================

    const loginModal =
        document.getElementById("loginModal");

    const openBtnLogin =
        document.getElementById("openModalLogin");

    const closeBtnLogin =
        document.getElementById("closeModalLogin");



    // =====================================================
    // REGISTER MODAL
    // =====================================================

    const registerModal =
        document.getElementById("registerModal");

    const openBtnCreateAccount =
        document.getElementById("newAccount");

    const closeBtnRegister =
        document.getElementById("closeModalRegister");



    // =====================================================
    // OPEN LOGIN
    // =====================================================

    if (openBtnLogin && loginModal) {

        openBtnLogin.addEventListener("click", function (e) {

            e.preventDefault();

            loginModal.classList.add("active");

        });

    }



    // =====================================================
    // CLOSE LOGIN
    // =====================================================

    if (closeBtnLogin && loginModal) {

        closeBtnLogin.addEventListener("click", function () {

            loginModal.classList.remove("active");

        });

    }



    // =====================================================
    // OPEN REGISTER
    // =====================================================

    if (openBtnCreateAccount && registerModal) {

        openBtnCreateAccount.addEventListener("click", function () {

            if (loginModal) {

                loginModal.classList.remove("active");

            }

            registerModal.classList.add("active");

        });

    }



    // =====================================================
    // CLOSE REGISTER
    // =====================================================

    if (closeBtnRegister && registerModal) {

        closeBtnRegister.addEventListener("click", function () {

            registerModal.classList.remove("active");

        });

    }



    // =====================================================
    // CLOSE LOGIN WHEN CLICKING OUTSIDE
    // =====================================================

    if (loginModal) {

        loginModal.addEventListener("click", function (event) {

            if (event.target === loginModal) {

                loginModal.classList.remove("active");

            }

        });

    }



    // =====================================================
    // CLOSE REGISTER WHEN CLICKING OUTSIDE
    // =====================================================

    if (registerModal) {

        registerModal.addEventListener("click", function (event) {

            if (event.target === registerModal) {

                registerModal.classList.remove("active");

            }

        });

    }



    // =====================================================
    // REGISTER FORM
    // =====================================================

    const registerForm =
        document.getElementById("registerForm");


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const Username =
                    document.getElementById("Username").value;

                const firstName =
                    document.getElementById("firstName").value;

                const secondName =
                    document.getElementById("secondName").value;

                const Age =
                    document.getElementById("Age").value;

                const email =
                    document.getElementById("email").value;

                const password =
                    document.getElementById("password").value;


                const genderInput =
                    document.querySelector(
                        'input[name="Gender"]:checked'
                    );


                const Gender =
                    genderInput
                        ? genderInput.value
                        : "";


                const data = {

                    Username,
                    firstName,
                    secondName,
                    Age,
                    email,
                    password,
                    Gender,
                    Profile_image: null

                };


                console.log("Data sent:", data);


                try {

                    const response = await fetch(
                        "/register",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify(data)

                        }
                    );


                    const result =
                        await response.json();


                    const message =
                        document.getElementById("message");

                    if (response.ok) {

                        if (message) {
                            message.textContent = result.message;
                            message.style.color = "green";
                        }

                        registerForm.reset();

                        setTimeout(() => {

                            if (registerModal) {
                                registerModal.classList.remove("active");
                            }

                        }, 1500);

                    } else {

                        if (message) {
                            message.textContent = result.message;
                            message.style.color = "red";
                        }

                    }


                } catch (error) {

                    console.error(error);


                    const message =
                        document.getElementById("message");


                    if (message) {

                        message.textContent =
                            "Something went wrong";

                    }

                }

            }
        );

    }



    // =====================================================
    // LOGIN FORM
    // =====================================================

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const username =
                    document.getElementById("UsernameL").value;


                const password =
                    document.getElementById("PasswordL").value;


                const data = {

                    username,
                    password

                };


                try {

                    const response = await fetch(
                        "/login",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify(data)

                        }
                    );


                    const result =
                        await response.json();


                    const message =
                        document.getElementById("loginMessage");


                    if (message) {

                        message.textContent =
                            result.message;

                    }


                    if (response.ok) {

                        console.log("Login successful");


                        if (loginModal) {

                            loginModal.classList.remove("active");

                        }


                        loginForm.reset();


                        const accountNavItem =
                            document.getElementById("accountNavItem");

                        if (accountNavItem) {

                            accountNavItem.style.display =
                                "block";

                        }


                        const loginButton =
                            document.getElementById(
                                "openModalLogin"
                            );


                        const logoutButton =
                            document.getElementById(
                                "logoutButton"
                            );


                        if (loginButton) {

                            loginButton.style.display =
                                "none";

                        }


                        if (logoutButton) {

                            logoutButton.style.display =
                                "inline-block";

                        }

                    }


                } catch (error) {

                    console.error(error);


                    const message =
                        document.getElementById(
                            "loginMessage"
                        );


                    if (message) {

                        message.textContent =
                            "Something went wrong";

                    }

                }

            }
        );

    }



    // =====================================================
    // UPDATE NAVBAR
    // =====================================================

    async function updateNavbar() {

        const loginButton =
            document.getElementById("openModalLogin");

        const logoutButton =
            document.getElementById("logoutButton");

        const accountNavItem =
            document.getElementById("accountNavItem");


        try {

            const response =
                await fetch("/me");

            const result =
                await response.json();


            if (result.loggedIn) {

                if (loginButton) {

                    loginButton.style.display =
                        "none";

                }

                if (logoutButton) {

                    logoutButton.style.display =
                        "inline-block";

                }

                if (accountNavItem) {

                    accountNavItem.style.display =
                        "block";

                }


            } else {

                if (loginButton) {

                    loginButton.style.display =
                        "inline-block";

                }

                if (logoutButton) {

                    logoutButton.style.display =
                        "none";

                }

                if (accountNavItem) {

                    accountNavItem.style.display =
                        "none";

                }

            }


        } catch (error) {

            console.error(
                "Error checking login status:",
                error
            );

        }

    }



    // =====================================================
    // LOGOUT
    // =====================================================

    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async function () {

                try {

                    const response =
                        await fetch(
                            "/logout",
                            {

                                method: "POST"

                            }
                        );


                    const result =
                        await response.json();


                    console.log(result.message);


                    if (response.ok) {

                        const loginButton =
                            document.getElementById(
                                "openModalLogin"
                            );


                        if (loginButton) {

                            loginButton.style.display =
                                "inline-block";

                        }


                        logoutButton.style.display =
                            "none";


                        window.location.href =
                            "/Main.html";

                    }


                    const accountNavItem =
                        document.getElementById("accountNavItem");

                    if (accountNavItem) {

                        accountNavItem.style.display =
                            "none";

                    }


                } catch (error) {

                    console.error(
                        "Logout error:",
                        error
                    );

                }

            }
        );

    }



    // =====================================================
    // CREATE POST MODAL
    // =====================================================

    const openCreatePost =
        document.getElementById("openCreatePost");


    const createPostModal =
        document.getElementById("createPostModal");


    const closeCreatePost =
        document.getElementById("closeCreatePost");



    if (openCreatePost && createPostModal) {

        openCreatePost.addEventListener(
            "click",
            function () {

                createPostModal.classList.add(
                    "active"
                );

            }
        );

    }



    if (closeCreatePost && createPostModal) {

        closeCreatePost.addEventListener(
            "click",
            function () {

                createPostModal.classList.remove(
                    "active"
                );

            }
        );

    }



    if (createPostModal) {

        createPostModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    createPostModal
                ) {

                    createPostModal.classList.remove(
                        "active"
                    );

                }

            }
        );

    }



    // =====================================================
    // CREATE POST FORM
    // =====================================================

    const postForm =
        document.getElementById("postForm");


    if (postForm) {

        postForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const formData =
                    new FormData(postForm);


                try {

                    const response =
                        await fetch(
                            "/api/posts",
                            {

                                method: "POST",

                                body: formData

                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        alert(data.error);

                        return;

                    }


                    


                    postForm.reset();


                    if (createPostModal) {

                        createPostModal.classList.remove(
                            "active"
                        );

                    }


                    loadPosts();


                } catch (error) {

                    console.error(error);


                    alert(
                        "Something went wrong"
                    );

                }

            }
        );

    }



    // =====================================================
    // ALL POSTS
    // =====================================================

    const postsContainer =
        document.getElementById("postsContainer");



    async function loadPosts() {

        if (!postsContainer) {

            return;

        }


        try {

            const response =
                await fetch("/api/posts");


            const posts =
                await response.json();


            if (!response.ok) {

                console.error(
                    posts.error
                );

                return;

            }


            postsContainer.innerHTML = "";


            posts.forEach(post => {

                const postElement =
                    document.createElement(
                        "div"
                    );


                postElement.classList.add(
                    "post"
                );



                // =========================================
                // IMAGES
                // =========================================

                let images = [];


                if (post.content_photos) {

                    try {

                        images =
                            JSON.parse(
                                post.content_photos
                            );


                        if (!Array.isArray(images)) {

                            images = [];

                        }


                    } catch (error) {

                        console.error(
                            "Error parsing post images:",
                            error
                        );

                        images = [];

                    }

                }


                const imagesHTML =
                    images.map(image => {

                        return `

                            <img
                                class="post-image"
                                src="${image}"
                                alt="Post image"
                            >

                        `;

                    }).join("");



                // =========================================
                // POST HTML
                // =========================================

                postElement.innerHTML = `

    <div class="post-header">

        <div class="postusertheme"></div>

        <div class="post-user">

            <img 
                src="${post.profile_image || "/default-profile.png"}"
                alt="Profile picture"
            >

            <a 
                href="/profile/${post.user_id}"
                class="post-username"
                dir="auto"
            >
                ${post.username}
            </a>

        </div>

    </div>


    <h2 dir="auto">
        ${post.title}
    </h2>


    <p dir="auto">
        ${post.contents}
    </p>


    <div class="post-images">
        ${imagesHTML}
    </div>

`;


const postTheme =
    postElement.querySelector(".postusertheme");


if (postTheme && post.theme_color) {

    postTheme.style.backgroundColor =
        post.theme_color;

}


postsContainer.appendChild(
    postElement
);

            });
           
           


        } catch (error) {

            console.error(
                "Error loading posts:",
                error
            );

        }

    }



    // =====================================================
    // IMAGE MODAL
    // =====================================================

    const imageModal =
        document.getElementById("imageModal");


    const expandedImage =
        document.getElementById("expandedImage");


    const closeImageModal =
        document.getElementById(
            "closeImageModal"
        );



    document.addEventListener(
        "click",
        function (event) {

            if (
                event.target.classList &&
                event.target.classList.contains(
                    "post-image"
                )
            ) {

                if (
                    expandedImage &&
                    imageModal
                ) {

                    expandedImage.src =
                        event.target.src;


                    imageModal.classList.add(
                        "active"
                    );

                }

            }

        }
    );



    if (imageModal) {

        imageModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === imageModal ||
                    event.target === closeImageModal
                ) {

                    imageModal.classList.remove(
                        "active"
                    );


                    if (expandedImage) {

                        expandedImage.src = "";

                    }

                }

            }
        );

    }



    // =====================================================
    // PUBLIC PROFILE PAGE
    // =====================================================

    async function loadPublicProfile() {

        const pathParts =
            window.location.pathname
                .split("/")
                .filter(Boolean);


        const userId =
            pathParts[
                pathParts.length - 1
            ];


        if (
            !userId ||
            isNaN(userId)
        ) {

            console.error(
                "Invalid user ID"
            );

            return;

        }


        try {

            const response =
                await fetch(
                    `/api/users/${userId}`
                );


            const user =
                await response.json();


            if (!response.ok) {

                console.error(
                    user.error
                );

                return;

            }


            const username =
                document.getElementById(
                    "usernameTitle"
                );


            const profileImage =
                document.getElementById(
                    "accountProfileImage"
                );


            const bio =
                document.getElementById(
                    "bioDisplay"
                );


            const coverImage =
                document.getElementById(
                    "coverImage"
                );




const bioSection =
    document.querySelector(
        ".account-bio-section"
    );


            if (username) {

                username.textContent =
                    user.username;

            }


            if (profileImage) {

                profileImage.src =
                    user.profile_image ||
                    "/default-profile.png";

            }


            if (bio) {

                bio.textContent =
                    user.bio ||
                    "No bio yet.";

            }




            if (coverImage) {

                coverImage.src =
                    user.cover_image ||
                    "/default-cover.jpg";

            }
// ==========================
        // USER THEME COLOR
        // ==========================
if (bioSection && user.theme_color) {

    bioSection.style.backgroundColor =
        user.theme_color;

}
      

        } catch (error) {

            console.error(
                "Error loading public profile:",
                error
            );

        }

    }



    // =====================================================
    // ACCOUNT PAGE
    // =====================================================

    const bioInput =
        document.getElementById("bioInput");


    const saveBioButton =
        document.getElementById("saveBio");


    const bioMessage =
        document.getElementById("bioMessage");


    const bioDisplay =
        document.getElementById("bioDisplay");


    const toggleBioEdit =
        document.getElementById("toggleBioEdit");


    const editControls =
        document.getElementById("editControls");


    const themeColorPicker =
        document.getElementById("themeColorPicker");


    const bioCard =
        document.getElementById("bioCard");


    const usernameTitle =
        document.getElementById("usernameTitle");


    const accountProfileImage =
        document.getElementById(
            "accountProfileImage"
        );


    const profileImageButton =
        document.getElementById(
            "profileImageButton"
        );


    const profileImageInput =
        document.getElementById(
            "profileImageInput"
        );


    const imageMessage =
        document.getElementById(
            "imageMessage"
        );


    const coverImage =
        document.getElementById(
            "coverImage"
        );


    const coverImageButton =
        document.getElementById(
            "coverImageButton"
        );


    const coverImageInput =
        document.getElementById(
            "coverImageInput"
        );


    const userPosts =
        document.getElementById(
            "userPosts"
        );


    const userPostsSection =
        document.querySelector(
            ".user-posts-section"
        );


    let accountUser = null;

    let accountEditMode = false;



    // =====================================================
    // EDIT MODE
    // =====================================================

    function setAccountEditMode(mode) {

        accountEditMode = mode;


        if (
            !bioInput ||
            !bioDisplay ||
            !editControls ||
            !toggleBioEdit
        ) {

            return;

        }


        if (accountEditMode) {

            bioInput.classList.remove(
                "hidden"
            );


            editControls.classList.remove(
                "hidden"
            );


            bioDisplay.classList.add(
                "hidden"
            );


            toggleBioEdit.textContent =
                "Cancel";


        } else {

            bioInput.classList.add(
                "hidden"
            );


            editControls.classList.add(
                "hidden"
            );


            bioDisplay.classList.remove(
                "hidden"
            );


            toggleBioEdit.textContent =
                "Edit";

        }

    }



    if (toggleBioEdit) {

        toggleBioEdit.addEventListener(
            "click",
            function () {

                setAccountEditMode(
                    !accountEditMode
                );

            }
        );

    }



    // =====================================================
    // CHANGE COLOR PREVIEW
    // =====================================================

    if (themeColorPicker) {

        themeColorPicker.addEventListener(
            "input",
            function () {

                const selectedColor =
                    themeColorPicker.value;


                if (bioCard) {

                    bioCard.style.backgroundColor =
                        selectedColor;

                }


                if (userPostsSection) {

                    userPostsSection.style.backgroundColor =
                        selectedColor;

                }

            }
        );

    }



    // =====================================================
    // LOAD ACCOUNT
    // =====================================================

    async function loadAccount() {

        // مهم:
        // لا نشغل حساب المستخدم الحالي
        // إلا إذا كانت عناصر صفحة Account موجودة

        if (
            !bioInput &&
            !profileImageButton &&
            !coverImageButton &&
            !userPosts
        ) {

            return;

        }


        try {

            const response =
                await fetch("/api/account");


            const user =
                await response.json();


            if (!response.ok) {

                if (bioMessage) {

                    bioMessage.textContent =
                        user.error ||
                        "Unable to load account";

                }

                return;

            }


            accountUser = user;


            if (usernameTitle) {

                usernameTitle.textContent =
                    user.username ||
                    user.Username ||
                    "name";

            }


            const savedBio =
                user.bio || "";


            if (bioInput) {

                bioInput.value =
                    savedBio;

            }


            if (bioDisplay) {

                bioDisplay.textContent =
                    savedBio.trim() !== ""
                        ? savedBio
                        : "Write something about yourself...";

            }


            if (accountProfileImage) {

                accountProfileImage.src =
                    user.profile_image ||
                    user.Profile_image ||
                    "/default-profile.png";

            }


            if (coverImage) {

                coverImage.src =
                    user.cover_image ||
                    "/default-cover.jpg";

            }


            const savedColor =
                user.theme_color || "#b8e7f2";


            if (themeColorPicker) {

                themeColorPicker.value =
                    savedColor;

            }


            if (bioCard) {

                bioCard.style.backgroundColor =
                    savedColor;

            }


            if (userPostsSection) {

                userPostsSection.style.backgroundColor =
                    savedColor;

            }


            if (userPosts) {

                loadMyPosts(user);

            }


        } catch (error) {

            console.error(
                "Error loading account:",
                error
            );


            if (bioMessage) {

                bioMessage.textContent =
                    "Server error";

            }

        }

    }



    // =====================================================
    // SAVE BIO + PROFILE COLOR
    // =====================================================

    if (
        saveBioButton &&
        bioInput
    ) {

        saveBioButton.addEventListener(
            "click",
            async function () {

                const bio =
                    bioInput.value.trim();


                const themeColor =
                    themeColorPicker.value;


                if (bio.length > 200) {

                    if (bioMessage) {

                        bioMessage.textContent =
                            "Bio cannot be more than 200 characters.";

                    }

                    return;

                }


                if (bioMessage) {

                    bioMessage.textContent =
                        "";

                }


                try {

                    const response =
                        await fetch(
                            "/api/account/bio",
                            {

                                method: "PUT",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify({

                                        bio: bio,

                                        theme_color:
                                            themeColor

                                    })

                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        if (bioMessage) {

                            bioMessage.textContent =
                                data.error ||
                                "Unable to save profile";

                        }

                        return;

                    }


                    if (bioDisplay) {

                        bioDisplay.textContent =
                            bio !== ""
                                ? bio
                                : "Write something about yourself...";

                    }


                    if (bioCard) {

                        bioCard.style.backgroundColor =
                            themeColor;

                    }


                    if (userPostsSection) {

                        userPostsSection.style.backgroundColor =
                            themeColor;

                    }


                } catch (error) {

                    console.error(
                        "Error saving profile:",
                        error
                    );


                    if (bioMessage) {

                        bioMessage.textContent =
                            "Server error";

                    }

                }

            }
        );

    }



    // =====================================================
    // CLICK PROFILE IMAGE
    // =====================================================

    if (
        profileImageButton &&
        profileImageInput
    ) {

        profileImageButton.addEventListener(
            "click",
            function () {

                profileImageInput.click();

            }
        );

    }



    // =====================================================
    // USER CHOOSES PROFILE IMAGE
    // =====================================================

    if (profileImageInput) {

        profileImageInput.addEventListener(
            "change",
            async function () {


                const file =
                    profileImageInput.files[0];


                if (!file) {

                    return;

                }


                if (!file.type.startsWith("image/")) {

                    if (imageMessage) {

                        imageMessage.textContent =
                            "Please choose an image";

                    }

                    profileImageInput.value = "";

                    return;

                }


                const maxSize =
                    5 * 1024 * 1024;


                if (file.size > maxSize) {

                    if (imageMessage) {

                        imageMessage.textContent =
                            "Image must be smaller than 5MB";

                    }

                    profileImageInput.value = "";

                    return;

                }


                const oldImage =
                    accountProfileImage
                        ? accountProfileImage.src
                        : "";


                const previewURL =
                    URL.createObjectURL(file);


                if (accountProfileImage) {

                    accountProfileImage.src =
                        previewURL;

                }


                if (imageMessage) {

                    imageMessage.textContent =
                        "Uploading profile picture...";

                }


                const formData =
                    new FormData();


                formData.append(
                    "profileImage",
                    file
                );


                try {

                    const response =
                        await fetch(
                            "/api/account/profile-image",
                            {

                                method: "PUT",

                                body: formData

                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        if (accountProfileImage) {

                            accountProfileImage.src =
                                oldImage;

                        }


                        if (imageMessage) {

                            imageMessage.textContent =
                                data.error ||
                                "Unable to upload image";

                        }


                        URL.revokeObjectURL(
                            previewURL
                        );


                        return;

                    }


                    if (accountProfileImage) {

                        accountProfileImage.src =
                            data.profile_image ||
                            data.imagePath ||
                            previewURL;

                    }


                    if (imageMessage) {

                        imageMessage.textContent =
                            "Profile picture updated";

                    }


                    URL.revokeObjectURL(
                        previewURL
                    );


                } catch (error) {

                    console.error(
                        "Error uploading profile image:",
                        error
                    );


                    if (accountProfileImage) {

                        accountProfileImage.src =
                            oldImage;

                    }


                    if (imageMessage) {

                        imageMessage.textContent =
                            "Server error";

                    }


                    URL.revokeObjectURL(
                        previewURL
                    );

                }


                profileImageInput.value = "";

            }
        );

    }



    // =====================================================
    // CLICK COVER IMAGE
    // =====================================================

    if (
        coverImageButton &&
        coverImageInput
    ) {

        coverImageButton.addEventListener(
            "click",
            function () {

                coverImageInput.click();

            }
        );

    }



    // =====================================================
    // USER CHOOSES COVER IMAGE
    // =====================================================

    if (coverImageInput) {

        coverImageInput.addEventListener(
            "change",
            async function () {


                const file =
                    coverImageInput.files[0];


                if (!file) {

                    return;

                }


                if (!file.type.startsWith("image/")) {

                    if (imageMessage) {

                        imageMessage.textContent =
                            "Please choose an image";

                    }

                    coverImageInput.value = "";

                    return;

                }


                const maxSize =
                    5 * 1024 * 1024;


                if (file.size > maxSize) {

                    if (imageMessage) {

                        imageMessage.textContent =
                            "Cover image must be smaller than 5MB";

                    }

                    coverImageInput.value = "";

                    return;

                }


                const oldCover =
                    coverImage
                        ? coverImage.src
                        : "";


                const previewURL =
                    URL.createObjectURL(file);


                if (coverImage) {

                    coverImage.src =
                        previewURL;

                }


                if (imageMessage) {

                    imageMessage.textContent =
                        "Uploading cover image...";

                }


                const formData =
                    new FormData();


                formData.append(
                    "coverImage",
                    file
                );


                try {

                    const response =
                        await fetch(
                            "/api/account/cover-image",
                            {

                                method: "PUT",

                                body: formData

                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        if (coverImage) {

                            coverImage.src =
                                oldCover;

                        }


                        if (imageMessage) {

                            imageMessage.textContent =
                                data.error ||
                                "Unable to upload cover image";

                        }


                        URL.revokeObjectURL(
                            previewURL
                        );


                        return;

                    }


                    if (coverImage) {

                        coverImage.src =
                            data.cover_image ||
                            data.imagePath ||
                            previewURL;

                    }


                    if (imageMessage) {

                        imageMessage.textContent =
                            "Cover image updated";

                    }


                    URL.revokeObjectURL(
                        previewURL
                    );


                } catch (error) {

                    console.error(
                        "Error uploading cover image:",
                        error
                    );


                    if (coverImage) {

                        coverImage.src =
                            oldCover;

                    }


                    if (imageMessage) {

                        imageMessage.textContent =
                            "Server error";

                    }


                    URL.revokeObjectURL(
                        previewURL
                    );

                }


                coverImageInput.value = "";

            }
        );

    }



    // =====================================================
    // LOAD ONLY CURRENT USER POSTS
    // =====================================================

    async function loadMyPosts(user) {

        if (!userPosts) {

            return;

        }


        userPosts.innerHTML =
            "<p>Loading posts...</p>";


        try {

            const response =
                await fetch("/api/posts");


            const posts =
                await response.json();


            if (!response.ok) {

                userPosts.innerHTML =
                    "<p>Unable to load posts.</p>";

                return;

            }


            const currentUserId =
                user.user_id ??
                user.id;


            const currentUsername =
                user.username ??
                user.Username;


            const myPosts =
                posts.filter(post => {


                    if (
                        currentUserId !== undefined &&
                        currentUserId !== null
                    ) {

                        return (
                            String(post.user_id) ===
                            String(currentUserId)
                        );

                    }


                    if (currentUsername) {

                        return (
                            post.username ===
                            currentUsername
                        );

                    }


                    return false;

                });


            if (myPosts.length === 0) {

                userPosts.innerHTML =
                    '<p class="no-posts">No posts yet.</p>';

                return;

            }


            userPosts.innerHTML = "";


            myPosts.forEach(post => {

                const postCard =
                    document.createElement(
                        "div"
                    );


                postCard.classList.add(
                    "user-post-card"
                );


                const deleteButton =
                    document.createElement(
                        "button"
                    );


                deleteButton.classList.add(
                    "delete-post-btn"
                );


                deleteButton.textContent =
                    "×";


                deleteButton.addEventListener(
                    "click",
                    async function () {

                        try {

                            const response =
                                await fetch(
                                    `/api/posts/${post.post_id}`,
                                    {
                                        method: "DELETE"
                                    }
                                );


                            const data =
                                await response.json();


                            if (!response.ok) {

                                console.error(
                                    data.error
                                );

                                return;

                            }


                            postCard.remove();


                            if (
                                userPosts.children.length === 0
                            ) {

                                userPosts.innerHTML =
                                    '<p class="no-posts">No posts yet.</p>';

                            }


                        } catch (error) {

                            console.error(
                                "Error deleting post:",
                                error
                            );

                        }

                    }
                );


                postCard.appendChild(
                    deleteButton
                );


                const title =
                    document.createElement(
                        "h4"
                    );


                title.textContent =
                    post.title ||
                    "Untitled Post";


                title.dir =
                    "auto";


                postCard.appendChild(
                    title
                );


                let images = [];


                if (post.content_photos) {

                    try {

                        images =
                            JSON.parse(
                                post.content_photos
                            );


                        if (!Array.isArray(images)) {

                            images = [];

                        }


                    } catch (error) {

                        console.error(
                            "Error parsing user post images:",
                            error
                        );


                        images = [];

                    }

                }


                images.forEach(imagePath => {

                    const image =
                        document.createElement(
                            "img"
                        );


                    image.src =
                        imagePath;


                    image.alt =
                        "Post image";


                    image.classList.add(
                        "post-image"
                    );


                    postCard.appendChild(
                        image
                    );

                });


                const content =
                    document.createElement(
                        "p"
                    );


                content.textContent =
                    post.contents || "";


                content.dir =
                    "auto";


                postCard.appendChild(
                    content
                );


                userPosts.appendChild(
                    postCard
                );

            });


        } catch (error) {

            console.error(
                "Error loading user posts:",
                error
            );


            userPosts.innerHTML =
                '<p class="no-posts">Server error while loading posts.</p>';

        }

    }



    // =====================================================
    // START FUNCTIONS
    // =====================================================

    updateNavbar();


    // صفحة Home
    if (postsContainer) {

        loadPosts();

    }


    // صفحة Profile الخاصة بمستخدم آخر
    if (
        window.location.pathname.startsWith(
            "/profile/"
        )
    ) {

        loadPublicProfile();

    }


    // صفحة Account الخاصة بالمستخدم الحالي
    if (
        bioInput ||
        profileImageButton ||
        coverImageButton ||
        userPosts
    ) {

        loadAccount();

    }

});