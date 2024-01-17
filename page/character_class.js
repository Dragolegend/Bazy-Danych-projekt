class Characters {
    constructor() {
        this.list_box = document.getElementById("character_list");
        this.character_box = document.getElementById("character_box");
        this.add_character_button = document.getElementById("add_character");
        this.creation_box = document.getElementById("creation_box");
        this.name = document.getElementById("name");
        this.race = document.getElementById("race");
        this.level = document.getElementById("level");
        this.confirm = document.getElementById("confirm");
        this.cancel = document.getElementById("cancel");
        this.character_name_text = document.getElementById("character_name");
        this.character_race_text = document.getElementById("character_race");
        this.character_level_text = document.getElementById("character_level");
        this.change_character_button = document.getElementById("change");
        this.equipped_box = document.getElementById("equipped_box");

        this.table_object;
        this.eq_table_object;
        this.currentColumn = -1;
        this.isAscending = true;



        this.add_character_button.addEventListener("click", () => {
            this.creation_box.classList.remove("hidden");
        });

        this.cancel.addEventListener("click", () => {
            this.creation_box.classList.add("hidden");
        });

        this.confirm.addEventListener("click", () => {
            parent.app.add_character(this.name.value, this.race.value, this.level.value);
            this.creation_box.classList.add("hidden");
        });

        this.change_character_button.addEventListener("click", () => {
            this.list_box.classList.remove("hidden");
            this.character_box.classList.add("hidden");
            parent.app.active_character = false;
            parent.app.character_items = [];
            parent.app.refresh_all();
        });
    }
}

Characters.prototype.set_active_character = function (character) {
    console.log(character)
    parent.app.active_character = character;
    this.list_box.classList.add("hidden");
    this.character_box.classList.remove("hidden");
    parent.app.refresh_all();
    this.character_name_text.innerHTML = character.Name;
    this.character_race_text.innerHTML = character.Race;
    this.character_level_text.innerHTML = character.Level;
}

Characters.prototype.generate_table = function () {
    if (document.getElementById("fav_items_table")) {
        this.list_box.removeChild(document.getElementById("fav_items_table"));
    }

    this.table_object = document.createElement("table");
    this.table_object.id = "fav_items_table";

    let fields_names = [{
        name: "Name",
        disp_name: "Nazwa postaci"
    }, {
        name: "Race",
        disp_name: "Rasa"
    }, {
        name: "Level",
        disp_name: "Poziom"
    }, {
        name: "Remove",
        disp_name: "Usuń postać"
    }];

    const tr = document.createElement("tr");
    tr.classList.add("items_table_line");

    fields_names.forEach((e, i) => {
        const th = document.createElement("th");
        th.classList.add("field");
        th.innerHTML = e.disp_name;
        th.addEventListener("click", () => {
            if (i == 0 || i == 1) {
                this.sort_table_letters(i);
            } else {
                this.sort_table_numbers(i);
            }
        });

        tr.appendChild(th);
    });

    this.table_object.appendChild(tr);


    parent.app.character_list.forEach((e) => {
        const tr = document.createElement("tr");
        tr.classList.add("items_table_line");

        const td_Name = document.createElement("td");
        td_Name.classList.add("field");
        td_Name.classList.add("field_Name");
        td_Name.innerHTML = e.Name;

        td_Name.addEventListener("click", () => {
            this.set_active_character(e);
        });

        tr.appendChild(td_Name);

        const td_Weight = document.createElement("td");
        td_Weight.classList.add("field");
        td_Weight.classList.add("field_Weight");
        td_Weight.innerHTML = e.Race;
        
        td_Weight.addEventListener("click", () => {
            this.set_active_character(e);
        });

        tr.appendChild(td_Weight);

        const td_Cost = document.createElement("td");
        td_Cost.classList.add("field");
        td_Cost.classList.add("field_Cost");
        td_Cost.innerHTML = e.Level;
        
        td_Cost.addEventListener("click", () => {
            this.set_active_character(e);
        });

        tr.appendChild(td_Cost);

        const remove_character = document.createElement("td");
        remove_character.classList.add("field");
        remove_character.classList.add("remove_character");

        const button = document.createElement("button");
        button.classList.add("add_button");
        button.innerHTML = "Usuń";

        button.addEventListener("click", () => {
            parent.app.remove_character(e);
        });

        remove_character.appendChild(button);

        tr.appendChild(remove_character);

        this.table_object.appendChild(tr);
    });

    this.list_box.prepend(this.table_object);
    this.table_object = document.getElementById("fav_items_table");


}

Characters.prototype.generate_table_character_items = function () {
    if (document.getElementById("character_items_table")) {
        this.character_box.removeChild(document.getElementById("character_items_table"));
    }

    if (document.getElementById("character_equipped_table")) {
        this.equipped_box.removeChild(document.getElementById("character_equipped_table"));
    }

    this.table_object = document.createElement("table");
    this.table_object.id = "character_items_table";

    this.equipped_table_object = document.createElement("table");
    this.equipped_table_object.id = "character_equipped_table";

    let fields_names = [{
        name: "Name",
        disp_name: "Nazwa przedmiotu"
    }, {
        name: "Weight",
        disp_name: "Waga"
    }, {
        name: "Cost",
        disp_name: "Koszt"
    }, {
        name: "Info",
        disp_name: "Typ"
    }, {
        name: "Count",
        disp_name: "Ilość"
    }, {
        name: "Remove",
        disp_name: "Usuń z ekwipunku"
    }, {
        name: "Equipp",
        disp_name: "Wyposaż"
    }];

    const tr = document.createElement("tr");
    tr.classList.add("items_table_line");

    fields_names.forEach((e, i) => {
        const th = document.createElement("th");
        th.classList.add("field");
        th.innerHTML = e.disp_name;
        th.addEventListener("click", () => {
            if (i == 0 || i == 3) {
                this.sort_table_letters(i);
            } else {
                this.sort_table_numbers(i);
            }
        });

        tr.appendChild(th);
    });

    this.table_object.appendChild(tr);

    parent.app.character_items.forEach((e) => {
        const tr = document.createElement("tr");
        tr.classList.add("items_table_line");

        const td_Name = document.createElement("td");
        td_Name.classList.add("field");
        td_Name.classList.add("field_Name");
        td_Name.innerHTML = e.Name;

        tr.appendChild(td_Name);

        const td_Weight = document.createElement("td");
        td_Weight.classList.add("field");
        td_Weight.classList.add("field_Weight");
        td_Weight.innerHTML = e.Weight;

        tr.appendChild(td_Weight);

        const td_Cost = document.createElement("td");
        td_Cost.classList.add("field");
        td_Cost.classList.add("field_Cost");
        td_Cost.innerHTML = e.Cost;

        tr.appendChild(td_Cost);

        const td_Info = document.createElement("td");
        td_Info.classList.add("field");
        td_Info.classList.add("field_Info");
        td_Info.innerHTML = e.Info;

        tr.appendChild(td_Info);



        if (parent.app.active_character && !e.Equipped) {
            const td_Count = document.createElement("td");
            td_Count.classList.add("field");
            td_Count.classList.add("field_Count");
            td_Count.innerHTML = e.Count;

            tr.appendChild(td_Count);

            const remove_item = document.createElement("td");
            remove_item.classList.add("field");
            remove_item.classList.add("remove_item");

            const button = document.createElement("button");
            button.classList.add("add_button");
            button.innerHTML = "Usuń";

            button.addEventListener("click", () => {
                parent.app.remove_item_from_characters_inventory(e, parent.app.active_character);
            });

            remove_item.appendChild(button);

            tr.appendChild(remove_item);

            const equip_item = document.createElement("td");
            equip_item.classList.add("field");
            equip_item.classList.add("equip_item");

            const button2 = document.createElement("button");
            button2.classList.add("add_button2");
            button2.innerHTML = "Wyposaż";

            button2.addEventListener("click", () => {
                parent.app.set_equipped(e, parent.app.active_character, 1);
            });

            equip_item.appendChild(button2);

            tr.appendChild(equip_item);
        } else if (parent.app.active_character) {
            const remove_item = document.createElement("td");
            remove_item.classList.add("field");
            remove_item.classList.add("remove_item");

            const button = document.createElement("button");
            button.classList.add("add_button");
            button.innerHTML = "Usuń z wyposażenia";

            button.addEventListener("click", () => {
                parent.app.set_equipped(e, parent.app.active_character, 0);
            });

            remove_item.appendChild(button);

            tr.appendChild(remove_item);
        }

        if (!e.Equipped) {
            this.table_object.appendChild(tr);
        } else {
            this.equipped_table_object.appendChild(tr);
        }
    });

    this.character_box.appendChild(this.table_object);
    this.equipped_box.appendChild(this.equipped_table_object);
    this.table_object = document.getElementById("character_items_table");
    this.equipped_table_object = document.getElementById("character_equipped_table");
}



Characters.prototype.sort_table_letters = function (columnIndex) {
    const table = this.table_object;
    const rows = Array.from(table.rows).slice(1);

    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].innerText.trim();
        const bValue = b.cells[columnIndex].innerText.trim();

        return aValue.localeCompare(bValue) * (this.isAscending ? 1 : -1);
    });

    if (!table.tBodies[0]) {
        table.appendChild(document.createElement('tbody'));
    }

    rows.forEach((row, index) => {
        table.tBodies[0].appendChild(row);
    });

    this.isAscending = !this.isAscending;

    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
        header.classList.remove('asc', 'desc');
    });

    const clickedHeader = headers[columnIndex];
    clickedHeader.classList.add(this.isAscending ? 'asc' : 'desc');
}

Characters.prototype.sort_table_numbers = function (columnIndex) {
    const table = this.table_object;
    const rows = Array.from(table.rows).slice(1);

    rows.sort((a, b) => {
        const aValue = this.parse_cell(a.cells[columnIndex].innerText.trim());
        const bValue = this.parse_cell(b.cells[columnIndex].innerText.trim());

        return this.isAscending ? aValue - bValue : bValue - aValue;
    });

    if (!table.tBodies[0]) {
        table.appendChild(document.createElement('tbody'));
    }

    rows.forEach((row, index) => {
        table.tBodies[0].appendChild(row);
    });

    if (this.currentColumn === columnIndex) {
        this.isAscending = !this.isAscending;
    } else {
        this.isAscending = true;
        this.currentColumn = columnIndex;
    }

    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
        header.classList.remove('asc', 'desc');
    });

    const clickedHeader = headers[columnIndex];
    clickedHeader.classList.add(this.isAscending ? 'asc' : 'desc');
}

Characters.prototype.parse_cell = function (value) {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? value : parsedValue;
}

Characters.prototype.filter_table = function () {
    var inputName, inputWeight, inputCost, inputType, inputCount, filterName, filterWeight, filterCost, filterType, filterCount, table, tr, tdName, tdWeight, tdCost, tdType, tdCount, i, txtValueName, txtValueWeight, txtValueCost, txtValueType, txtValueCount;

    inputName = document.getElementById("nameInput");
    inputWeight = document.getElementById("weightInput");
    inputCost = document.getElementById("costInput");
    inputType = document.getElementById("typeInput");
    inputCount = document.getElementById("countInput");

    filterName = inputName.value.toUpperCase();
    filterWeight = inputWeight.value.toUpperCase();
    filterCost = inputCost.value.toUpperCase();
    filterType = inputType.value.toUpperCase();
    filterCount = inputCount.value.toUpperCase();

    table = this.table_object;
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tdName = tr[i].getElementsByTagName("td")[0];
        tdWeight = tr[i].getElementsByTagName("td")[1];
        tdCost = tr[i].getElementsByTagName("td")[2];
        tdType = tr[i].getElementsByTagName("td")[3];
        tdCount = tr[i].getElementsByTagName("td")[4];

        if (tdName && tdWeight && tdCost && tdType) {
            txtValueName = tdName.textContent || tdName.innerText;
            txtValueWeight = tdWeight.textContent || tdWeight.innerText;
            txtValueCost = tdCost.textContent || tdCost.innerText;
            txtValueType = tdType.textContent || tdType.innerText;
            txtValueCount = tdCount.textContent || tdCount.innerText;

            if ((filterName === "" || txtValueName.toUpperCase().indexOf(filterName) > -1) &&
                (filterWeight === "" || txtValueWeight.toUpperCase().indexOf(filterWeight) > -1) &&
                (filterCost === "" || txtValueCost.toUpperCase().indexOf(filterCost) > -1) &&
                (filterType === "" || txtValueType.toUpperCase().indexOf(filterType) > -1) &&
                (filterCount === "" || txtValueCount.toUpperCase().indexOf(filterType) > -1)) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }

    }
}
