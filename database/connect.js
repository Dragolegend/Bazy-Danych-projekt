module.exports.connect = function (mysql) {
    return mysql.createConnection({
        host: "localhost",
        user: "***",
        password: "***",
        database: "***",
        port: 1234
    });
}
