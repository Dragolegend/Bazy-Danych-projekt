let base = require("./base.js");
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

module.exports.init = function (connection) {
    let items = [];

    function import_items(items) {
        items.forEach((e) => {
            if (!e.Weight) {
                e.Weight = 0;
            }

            if (!e.Price) {
                e.Price = 0;
            }



            base.query(`INSERT INTO Items (Name, Info, Weight, Cost) VALUES ("${e.Name}", "${e.Type1}", ${e.Weight}, ${e.Price});`, connection);
        })
        base.query("SELECT * FROM Items", connection);
    }



    base.query("DROP DATABASE IF EXISTS DB1;", connection);
    base.query("CREATE DATABASE DB1;", connection);
    base.query("DROP TABLE IF EXISTS Equipements;", connection);
    base.query("DROP TABLE IF EXISTS FavItems;", connection);
    base.query("DROP TABLE IF EXISTS Characters;", connection);
    base.query("DROP TABLE IF EXISTS Users;", connection);
    base.query("DROP TABLE IF EXISTS Items;", connection);
    base.query("CREATE TABLE Items (ItemID int NOT NULL AUTO_INCREMENT, Name varchar(255), Info varchar(255), Weight int, Cost int, PRIMARY KEY (ItemID));", connection);

    fs.createReadStream(path.resolve(__dirname, './dndbeyond_equips.csv'))
        .pipe(csv.parse({
            headers: true
        }))
        .on('error', error => console.error(error))
        .on('data', row => items.push(row))
        .on('end', rowCount => import_items(items));



    base.query("CREATE TABLE Users (UserID int NOT NULL AUTO_INCREMENT, Name varchar(255), Password varchar(255), Email varchar(255), PRIMARY KEY (UserID));", connection);

    base.query("CREATE TABLE Characters (CharacterID int NOT NULL AUTO_INCREMENT, UserID int, Name varchar(255), Race varchar(255), Level int, PRIMARY KEY (CharacterID), FOREIGN KEY (UserID) REFERENCES Users(UserID));", connection);

    base.query("CREATE TABLE Equipements (EquipementID int NOT NULL AUTO_INCREMENT, Count int DEFAULT 1, Equipped BOOLEAN DEFAULT 0, CharacterID int, ItemID int, PRIMARY KEY (EquipementID), FOREIGN KEY (ItemID) REFERENCES Items(ItemID), FOREIGN KEY (CharacterID) REFERENCES Characters(CharacterID));", connection);

    base.query("CREATE TABLE FavItems (FavItemID int NOT NULL AUTO_INCREMENT, UserID int, ItemID int, PRIMARY KEY (FavItemID), FOREIGN KEY (ItemID) REFERENCES Items(ItemID), FOREIGN KEY (UserID) REFERENCES Users(UserID));", connection);


}
