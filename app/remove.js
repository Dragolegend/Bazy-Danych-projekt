let base = require("./../database/base.js");
let user = require("./user.js");

module.exports.remove_item_favourites = function (item_id, user_token, connection, res, function_callback = () => {}) {
    let user_id = user.get_user_id(user_token);

    function callback() {
        function_callback(res, true);
    }


    base.query(`DELETE FROM FavItems WHERE ItemID = ${item_id} AND UserID = ${user_id}`, connection, callback);
}

module.exports.remove_character = function (user_token, character_id, connection, res, function_callback = () => {}) {
    let user_id = user.get_user_id(user_token);

    function callback() {
        function clb() {
            function_callback(res, true);
        }
        base.query(`DELETE FROM Characters WHERE CharacterID = ${character_id} AND UserID = ${user_id}`, connection, clb);
    }
    base.query(`DELETE FROM Equipements WHERE CharacterID = ${character_id}`, connection, callback);

}

module.exports.remove_item_equpiement = function (item_id, character_id, count, connection, res, function_callback = () => {}) {
    function callback(result) {
        console.log(result)
        if (result.query_result.length) {
            if (parseInt(result.query_result[0].Count) > count) {
                base.query(`UPDATE Equipements
                            SET Count = ${parseInt(result.query_result[0].Count) - count}
                            WHERE EquipementID = ${result.query_result[0].EquipementID};`, connection)
            } else {
                base.query(`DELETE FROM Equipements WHERE EquipementID = ${result.query_result[0].EquipementID};`, connection);
            }

            function_callback(res, true);

        }
    }

    base.query(`SELECT * FROM Equipements WHERE ItemID = ${item_id} AND CharacterID = ${character_id};`, connection, callback);
}
