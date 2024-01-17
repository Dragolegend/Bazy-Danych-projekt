let base = require("./../database/base.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const users_tokens = [];

function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

function generate_token(length = 10) {
    token = "";

    for (let i = 0; i < length; ++i) {
        token += Math.floor(Math.random() * 10);
    }

    return token;
}

module.exports.get_user_id = function (token) {
    let exist = null;

    users_tokens.forEach((e) => {
        if (e.UserToken == token) {
            exist = e;
        }
    });

    if (exist) {
        return exist.UserID;
    } else {
        return null
    }
}

module.exports.login = function (user_login, user_password, connection, res, function_callback = () => {}) {
    const sql = `SELECT * FROM Users WHERE (Name = "${user_login}" OR Email = "${user_login}")`;
    
    function login(match, user) {
        if (match) {
            let exist = null;

            users_tokens.forEach((e) => {
                if (e.UserID == user.UserID) {
                    exist = e;
                }
            });

            if (exist) {
                function_callback(res, exist.UserToken);
            } else {
                let token = generate_token();
                users_tokens.push({
                    UserID: user.UserID,
                    UserToken: token
                });
                function_callback(res, token);
            }
        } else {
            function_callback(res, false);
        }
    }

    function callback(result) {

        function validateUser(password, hash, user) {
            bcrypt
                .compare(password, hash)
                .then(resp => {
                    login(resp, user);
                })
                .catch(err => console.error(err.message))
        }
        
        if(!result.query_result.length){
            function_callback(res, false);
        }

        result.query_result.forEach((e) => {
            validateUser(user_password, e.Password, e)
        });


    }

    base.query(sql, connection, callback);
}

module.exports.add_user = function (user_name, password, email, connection, res, function_callback = () => {}) {
    let valid = {
        name: false,
        email: false,
        password: true,
        valid: 0
    }

    function create_user(password) {
        bcrypt
            .hash(password, saltRounds)
            .then(hash => {
                base.query(`INSERT INTO Users (Name, Password, Email) 
                VALUES ("${user_name}", "${hash}", "${email}");`, connection);
            })
            .catch(err => console.error(err.message))
    }


    function validate(result) {
        if (result.query_result.length == 0) {
            valid.name = true;
        }

        if (validateEmail(email)) {
            valid.email = true;
        }

        if (valid.name && valid.email && valid.password) {
            valid.valid = 1;
        }

        return valid;

    }

    function callback(result) {
        let valid_status = validate(result);
        if (valid_status.valid) {


            create_user(password);

        }
        function_callback(res, valid_status);
    }

    base.query(`SELECT * FROM Users WHERE Name = "${user_name}"`, connection, callback);

}
