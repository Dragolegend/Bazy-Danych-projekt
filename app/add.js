let base = require("./../database/base.js");
let user = require("./user.js");
let get = require("./get.js");

module.exports.add_character = function (user_token, name, race, level, connection, res, function_callback = () => {}) {
    let user_id = user.get_user_id(user_token);

    console.log(user_id);

    base.query(`INSERT INTO Characters (UserID, Name, Race, Level) 
                VALUES (${user_id}, "${name}", "${race}", ${level});`, connection);

    function_callback(res, {
        query_result: []
    });
}

module.exports.add_item_equipement = function (item_id, character_id, count, connection, res, function_callback = () => {}) {
    function callback(result) {
        if (result.query_result.length) {
            base.query(`UPDATE Equipements
                        SET Count = ${parseInt(result.query_result[0].Count) + count}
                        WHERE EquipementID = ${result.query_result[0].EquipementID};`, connection)
        } else {
            base.query(`INSERT INTO Equipements (Count, ItemID, CharacterID) 
                        VALUES (${count}, ${item_id}, ${character_id});`, connection);
        }

        function_callback(res, {});
    }

    base.query(`SELECT * FROM Equipements WHERE ItemID = ${item_id} AND CharacterID = ${character_id}`, connection, callback);

}

module.exports.add_item_favourites = function (item_id, user_token, connection, res, funtion_callback = () => {}) {
    let user_id = user.get_user_id(user_token);


    function callback(result) {
        if (result.query_result.length == 0) {
            base.query(`INSERT INTO FavItems (ItemID, UserID) 
                        VALUES (${item_id}, ${user_id});`, connection);
        }
        funtion_callback(res, true);
    }

    base.query(`SELECT * FROM FavItems WHERE ItemID = ${item_id} AND UserID = ${user_id}`, connection, callback);
}

module.exports.set_equipped = function (item_id, character_id, equipped, connection, res, funtion_callback = () => {}) {
    let eq = 0;

    if (equipped) {
        eq = 1;
    }


    function callback(result) {
        if (result.query_result.length) {
            base.query(`UPDATE Equipements
                        SET Equipped = ${eq}
                        WHERE EquipementID = ${result.query_result[0].EquipementID};`, connection)
        }
        funtion_callback(res, true);
    }

    base.query(`SELECT * FROM Equipements WHERE ItemID = ${item_id} AND CharacterID = ${character_id}`, connection, callback);
}

module.exports.copy_items = function (user_token, character_id, connection, res, function_callback = () => {}) {
    let user_id = user.get_user_id(user_token);

    let fav_items = [];
    let char_items = [];



    function callback(res, result) {
        fav_items = result.query_result;


        function add_item(result) {

            if (!result.query_result.length && result.eqpd) {
                base.query(`INSERT INTO Equipements (Count, ItemID, CharacterID) 
                        VALUES (${1}, ${result.item_id}, ${character_id});`, connection);
                if (result.last) {
                    base.query(`COMMIT;`, connection);
                    function_callback(res, true);
                }
            } else if (!result.query_result.length && !result.eqpd) {
                base.query(`INSERT INTO Equipements (Count, ItemID, CharacterID, Equipped) 
                        VALUES (${1}, ${result.item_id}, ${character_id}, ${1});`, connection);
                if (result.last) {
                    base.query(`COMMIT;`, connection);
                    function_callback(res, true);
                }
            } else if (result.last) {
                base.query(`COMMIT;`, connection);
                function_callback(res, true);
            }

        }



        function callback_items(res, result) {
            char_items = result.query_result;
            fav_items.forEach((e, i) => {
                

                function remove_duplicates(result) {
                    let eqpd = false;

                char_items.forEach((el) => {
                    if (e.Info == el.Info && el.Equipped) {
                        console.log(e);
                        console.log(el);
                        eqpd = true;
                    }
                });
                    
                    if (!eqpd && !result.query_result.length) {
                        e.Equipped = 1;
                        char_items.push(e);
                    }



                    if (fav_items.length - 1 == i) {
                        base.query(`SELECT * FROM Equipements WHERE ItemID = ${e.ItemID} AND CharacterID = ${character_id}`, connection, add_item, {
                            item_id: e.ItemID,
                            eqpd: eqpd,
                            last: true
                        });
                    } else {
                        base.query(`SELECT * FROM Equipements WHERE ItemID = ${e.ItemID} AND CharacterID = ${character_id}`, connection, add_item, {
                            item_id: e.ItemID,
                            eqpd: eqpd,
                            last: false
                        });
                    }
                }

                base.query(`SELECT * FROM Equipements WHERE ItemID = ${e.ItemID} AND CharacterID = ${character_id}`, connection, remove_duplicates);
            });
        }

        if (fav_items.length) {
            get.get_items_from_equipement(character_id, connection, res, callback_items);
        }
    }

    base.query(`START TRANSACTION;`, connection);
    get.get_items_from_favourites(user_token, connection, res, callback);

}
