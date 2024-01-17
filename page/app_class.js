class App {
    constructor() {
        this.user_token = false;
        this.login_box = document.getElementById("user_box");
        this.message_box = document.getElementById("message_box");

        this.fav_items = [];
        this.items = [];
        this.character_items = [];
        this.character_list = "";
        this.active_character = false;

        this.fav_items_frame = document.getElementById("fav_items");
        this.items_frame = document.getElementById("items");
        this.characters_frame = document.getElementById("characters");

        this.get_items();
    }
}

App.prototype.remove_character = function (character) {
    let data = {
        character_id: character.CharacterID,
        token: this.get_user_token()
    };

    fetch("http://localhost:3000/remove_character", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.text();
    }).then(result => {
        this.get_characters();
    }).catch(err => {
        console.log(err);
    });
}

App.prototype.remove_item_from_characters_inventory = function (item, character, count = 1) {
    if (!character) {
        return false;
    }

    let data = {
        character_id: character.CharacterID,
        item_id: item.ItemID,
        count: count
    };

    fetch("http://localhost:3000/remove_item_inventory", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.text();
    }).then(result => {
        this.get_character_items(this.active_character.CharacterID);
    }).catch(err => {
        console.log(err);
    });

}

App.prototype.add_item_to_characters_inventory = function (item, character, count = 1) {
    if (!character) {
        return false;
    }

    let data = {
        character_id: character.CharacterID,
        item_id: item.ItemID,
        count: count
    };

    fetch("http://localhost:3000/add_item_inventory", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.text();
    }).then(result => {
        this.get_character_items(this.active_character.CharacterID);
    }).catch(err => {
        console.log(err);
    });
}

App.prototype.get_character_items = function (character_id) {
    let data = {
        id: character_id
    };

    console.log(character_id)

    fetch("http://localhost:3000/get_character_items", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.text();
    }).then(result => {
        this.character_items = JSON.parse(result).query_result;
        this.characters_frame.contentWindow.characters.generate_table_character_items();
    }).catch(err => {
        console.log(err);
    });
}


App.prototype.add_character = function (name, race, level) {
    this.characters_frame.contentWindow.characters.character_name_text.value = "";
    this.characters_frame.contentWindow.characters.character_race_text.value = "";
    this.characters_frame.contentWindow.characters.character_level_text.value = "";


    if (this.get_user_token()) {
        let data = {
            token: parent.app.get_user_token(),
            name: name,
            race: race,
            level: level
        };

        fetch("http://localhost:3000/add_character", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.text();
        }).then(result => {
            this.get_characters();
        }).catch(err => {
            console.log(err);
        });
    }
}

App.prototype.get_fav_items = function () {
    if (this.get_user_token()) {
        let data = {
            token: parent.app.get_user_token(),
        };

        fetch("http://localhost:3000/get_fav_items", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.text();
        }).then(result => {
            this.fav_items = JSON.parse(result).query_result;
            this.mark_fav_items();
            this.fav_items_frame.contentWindow.fav_items_table.generate_table();
        }).catch(err => {
            console.log(err);
        });
    }
}

App.prototype.mark_fav_items = function () {
    if (this.fav_items == "") {
    } else {
        this.items.forEach((e) => {
            let in_favs = false;
            this.fav_items.forEach((el) => {
                if (e.ItemID == el.ItemID) {
                    in_favs = true;
                }
            });
            if (in_favs) {
                e.Faved = 1;
            }
        });

        this.items_frame.contentWindow.items_table.generate_table();
    }
}

App.prototype.get_items = function () {
    fetch('http://localhost:3000/get_all_items')
        .then(response => response.text())
        .then(result => {
            this.items = JSON.parse(result).query_result;
            this.items.forEach((e) => {
                e.Faved = 0;
            });
            if (this.user_token) {
                this.mark_fav_items();
            } else {
                this.items_frame.contentWindow.items_table.generate_table();
            }
        })
        .catch(error => {
            console.error('Error calling Node.js function: get_all_items:', error);
        });
}

App.prototype.get_characters = function () {
    if (this.user_token) {
        let data = {
            token: this.get_user_token(),
        };

        fetch("http://localhost:3000/get_characters", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.text();
        }).then(result => {
            this.character_list = JSON.parse(result).query_result;
            this.characters_frame.contentWindow.characters.generate_table();
        }).catch(err => {
            console.log(err);
        });
    }
}


App.prototype.get_user_token = function () {
    if (this.user_token) {
        return this.user_token;
    } else {
        this.login_box.classList.remove("hidden");
        return false;
    }
}

App.prototype.set_user_token = function (token) {
    if (token != "false") {
        this.user_token = token;
        this.message_box.innerHTML = "";
        this.login_box.classList.add("hidden");
        this.characters_frame.classList.add("full_height");
        this.refresh_all();
    } else {
        this.message_box.innerHTML = "Dane niepoprawne spróbuj ponownie";
    }
}

App.prototype.refresh_all = function () {
    this.get_items();
    if (this.user_token) {
        this.get_fav_items();
    }

    if (this.active_character) {
        this.get_character_items(this.active_character.CharacterID);
        setTimeout(() => {
            this.get_character_items(this.active_character.CharacterID);
        }, 100);

    } else if (this.user_token) {
        this.get_characters();
    }
}

App.prototype.favourites_add = function (ItemID) {
    if (this.get_user_token()) {
        let data = {
            item: ItemID,
            token: parent.app.get_user_token()
        };

        fetch("http://localhost:3000/fav_add", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.text();
        }).then(result => {
            this.get_fav_items();
        }).catch(err => {
            console.log(err);
        });
    }
}

App.prototype.set_equipped = function (item, character, equipped) {
    if (this.get_user_token()) {
        let data = {
            item_id: item.ItemID,
            character_id: character.CharacterID,
            equipped: equipped
        };
        
        console.log(data);

        fetch("http://localhost:3000/set_equipped", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.text();
        }).then(result => {
            this.get_character_items(character.CharacterID);
        }).catch(err => {
            console.log(err);
        });
    }
}

App.prototype.copy_items = function () {
    if (this.get_user_token()) {
        let data = {
            token: this.get_user_token(),
            character_id: this.active_character.CharacterID
        };
        
        console.log(data);

        fetch("http://localhost:3000/copy_items", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.text();
        }).then(result => {
            this.get_character_items(this.active_character.CharacterID);
        }).catch(err => {
            console.log(err);
        });
    }
}

App.prototype.favourites_remove = function (ItemID) {
    if (this.get_user_token()) {
        let data = {
            item: ItemID,
            token: parent.app.get_user_token()
        };

        fetch("http://localhost:3000/fav_remove", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.text();
        }).then(result => {
            this.get_fav_items();
        }).catch(err => {
            console.log(err);
        });
    }
}

App.prototype.toggle_fav = function (e) {
    if (!this.get_user_token()) {
        return false;
    } else {
        if (e.Faved) {
            e.Faved = 0;
            this.favourites_remove(e.ItemID);
        } else {
            e.Faved = 1;
            this.favourites_add(e.ItemID);
        }

        return true;
    }
}
