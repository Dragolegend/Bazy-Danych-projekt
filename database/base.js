module.exports.query = function (query, connection, callback = () => {}, result_object = {}) {
    let result;
    
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(query, function (err, result) {
            if (err) console.log(err);
            result_object.query_result = result;
            return callback(result_object);
        });
    });
}

