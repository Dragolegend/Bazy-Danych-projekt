let base = require("./../database/base.js");
let user = require("./user.js");

module.exports.get_items_from_equipement = function (character_id, connection, res, function_callback = () => {}) {

    const sql = `SELECT * FROM Equipements WHERE CharacterID = ${character_id}`;

    items = [];

    function callback(result_object) {

        function item_callback(result_object) {
            result_object.query_result[0].Count = result_object.count;
            result_object.query_result[0].Equipped = result_object.equipped;
            if (result_object.query_result[0].Count != undefined && result_object.query_result[0].Equipped != undefined) {
                items.push(result_object.query_result[0]);
            }

            if (items.length === result_object.length) {
                function_callback(res, {
                    query_result: items
                });
            }


        }

        if (!result_object.query_result.length) {
            function_callback(res, {
                query_result: []
            });

        }

        result_object.query_result.forEach((e) => {
            const sql = `SELECT * from Items WHERE ItemID = ${e.ItemID}`;

            base.query(sql, connection, item_callback, {
                length: result_object.query_result.length,
                count: e.Count,
                equipped: e.Equipped
            });
        });
    }

    if (character_id) {

        base.query(sql, connection, callback);
    } else {
        function_callback(res, {
            query_result: []
        });

    }
}

module.exports.get_items_from_favourites = function (user_token, connection, res, function_callback = () => {}) {
    let user_id = user.get_user_id(user_token);

    const sql = `SELECT * FROM FavItems WHERE UserID = ${user_id}`;

    items = [];

    function callback(result_object) {
        // console.log(result_object)

        function item_callback(result_object) {
            items.push(result_object.query_result[0]);

            if (items.length === result_object.length) {
                function_callback(res, {
                    query_result: items
                });
            }
        }

        if (!result_object.query_result.length) {
            function_callback(res, {
                query_result: items
            });
        }

        result_object.query_result.forEach((e) => {
            const sql = `SELECT * from Items WHERE ItemID = ${e.ItemID}`;

            base.query(sql, connection, item_callback, {
                length: result_object.query_result.length
            });
        });
    }

    base.query(sql, connection, callback);
}

module.exports.get_characters_by_user = function (user_token, connection, res, function_callback = () => {}) {
    let user_id = user.get_user_id(user_token);

    const sql = `SELECT * FROM Characters WHERE UserID = ${user_id}`;

    function callback(result) {
        function_callback(res, result);
    }

    base.query(sql, connection, callback);
}

module.exports.get_all_items = function (connection, res, function_callback = () => {}) {
    const sql = `SELECT * FROM Items`;

    function callback(result) {
        function_callback(res, result);
        return result;
    }

    base.query(sql, connection, callback);
}
