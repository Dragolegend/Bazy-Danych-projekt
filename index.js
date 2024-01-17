var mysql = require('mysql2');

let connection = require("./database/connect.js");
let base = require("./database/base.js");
let init = require("./database/init.js");
let app = require("./app/functions.js");

let con = connection.connect(mysql);

function print(result) {
    console.log(result);
}

const express = require('express');
const cors = require('cors');
const exp = express();
const port = 3000;

function respond(res, result) {
    console.log(result)
    res.send(result);
}

exp.use(express.json());
exp.use(cors());

exp.get('/get_all_items', (req, res) => {
    console.log("get_all_items");
    const result = app.get.get_all_items(con, res, respond);
});

exp.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

exp.post("/login", (req, res) => {
    console.log("login");
    app.user.login(req.body.login, req.body.password, con, res, respond);
});

exp.post("/get_fav_items", (req, res) => {
    console.log("get_fav_items");
    app.get.get_items_from_favourites(req.body.token, con, res, respond);
});

exp.post("/register", (req, res) => {
    console.log("register");
    app.user.add_user(req.body.login, req.body.password, req.body.email, con, res, respond);
});

exp.post("/fav_add", (req, res) => {
    console.log("fav_add");
    app.add.add_item_favourites(req.body.item, req.body.token, con, res, respond);
});

exp.post("/fav_remove", (req, res) => {
    console.log("fav_remove");
    app.remove.remove_item_favourites(req.body.item, req.body.token, con, res, respond);
});

exp.post("/get_characters", (req, res) => {
    console.log("get_characters");
    app.get.get_characters_by_user(req.body.token, con, res, respond);
});

exp.post("/get_character_items", (req, res) => {
    console.log("get_character_items");
    app.get.get_items_from_equipement(req.body.id, con, res, respond);
});

exp.post("/add_character", (req, res) => {
    console.log("add_character");
    app.add.add_character(req.body.token, req.body.name, req.body.race, req.body.level, con, res, respond);
});

exp.post("/add_item_inventory", (req, res) => {
    console.log("add_item_inventory");
    app.add.add_item_equipement(req.body.item_id, req.body.character_id, req.body.count, con, res, respond);
});

exp.post("/remove_item_inventory", (req, res) => {
    console.log("remove_item_inventory");
    app.remove.remove_item_equpiement(req.body.item_id, req.body.character_id, req.body.count, con, res, respond);
});

exp.post("/remove_item_inventory", (req, res) => {
    console.log("remove_item_inventory");
    app.remove.remove_item_equpiement(req.body.item_id, req.body.character_id, req.body.count, con, res, respond);
});

exp.post("/remove_character", (req, res) => {
    console.log("remove_character");
    app.remove.remove_character(req.body.token, req.body.character_id, con, res, respond);
});


exp.post("/set_equipped", (req, res) => {
    console.log("set_equipped");
    app.add.set_equipped(req.body.item_id, req.body.character_id, req.body.equipped, con, res, respond);
});

exp.post("/copy_items", (req, res) => {
    console.log("copy_items");
    app.add.copy_items(req.body.token, req.body.character_id, con, res, respond);
});
