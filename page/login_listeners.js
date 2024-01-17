let login_input = document.getElementById("login");
let r_login_input = document.getElementById("r_login");
let r_email_input = document.getElementById("r_email");
let password_input = document.getElementById("password");
let r_password_input = document.getElementById("r_password");
let login_button = document.getElementById("login_button");
let register_button = document.getElementById("register_button");
let switch_menu_login = document.getElementById("switch_menu_login");
let switch_menu_register = document.getElementById("switch_menu_register");
let login_box = document.getElementById("login_box");
let register_box = document.getElementById("register_box");
let user_box = document.getElementById("user_box");
let message_box = document.getElementById("message_box");

switch_menu_login.addEventListener("click", () => {
    login_box.classList.add("hidden");
    register_box.classList.remove("hidden");
});

switch_menu_register.addEventListener("click", () => {
    login_box.classList.remove("hidden");
    register_box.classList.add("hidden");
});

login_button.addEventListener("click", () => {
    let data = {
        login: login_input.value,
        password: password_input.value
    };

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.text();
    }).then(result => {
        app.set_user_token(result);
    }).catch(err => {
        console.log(err);
    });
});

register_button.addEventListener("click", () => {
    let data = {
        login: r_login_input.value,
        password: r_password_input.value,
        email: r_email_input.value
    };

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.text();
    }).then(result => {
        console.log(result)
        let respond = JSON.parse(result);
        if (!respond.valid) {
            if (!respond.name) {
                r_login_input.style.backgroundColor = "red";
            } else if (!respond.email) {
                r_email_input.style.backgroundColor = "red";
            } else if (!respond.password) {
                r_password_input.style.backgroundColor = "red";
            }
        } else {
            login_box.classList.remove("hidden");
            register_box.classList.add("hidden");
            message_box.innerHTML = "Konto utworzone, możesz się zalogować";
        }
    }).catch(err => {
        console.log(err);
    });
})
