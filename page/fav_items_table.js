class Fav_items_table {
    constructor() {
        this.items = "";

        this.table_object;
        this.currentColumn = -1;
        this.isAscending = true;
        
        this.copy_button = document.getElementById("copy_button");
        
        this.copy_button.addEventListener("click", () => {
            if(parent.app.active_character && parent.app.user_token){
                parent.app.copy_items();
            }
        });
    }
}




Fav_items_table.prototype.generate_table = function () {
    if(document.getElementById("fav_items_table")){
        document.body.removeChild(document.getElementById("fav_items_table"));
    }
    
    this.table_object = document.createElement("table");
    this.table_object.id = "fav_items_table";

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
        name: "Add",
        disp_name: "Doaj do ekwipunku"
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
    

    parent.app.fav_items.forEach((e) => {
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
        td_Info.classList.add("field_Cost");
        td_Info.innerHTML = e.Info;

        tr.appendChild(td_Info);
        
        if (parent.app.active_character) {
            const add_item = document.createElement("td");
            add_item.classList.add("field");
            add_item.classList.add("add_item");
            
            const button = document.createElement("button");
            button.classList.add("add_button");
            button.innerHTML = "Dodaj";
            
            button.addEventListener("click", () => {
                parent.app.add_item_to_characters_inventory(e, parent.app.active_character);
            });
            
            add_item.appendChild(button);

            tr.appendChild(add_item);
        }


        this.table_object.appendChild(tr);
    });

    document.body.appendChild(this.table_object);
    this.table_object = document.getElementById("fav_items_table");
    
    this.filter_table();
}

Fav_items_table.prototype.sort_table_letters = function (columnIndex) {
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

Fav_items_table.prototype.sort_table_numbers = function (columnIndex) {
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

Fav_items_table.prototype.parse_cell = function (value) {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? value : parsedValue;
}

Fav_items_table.prototype.filter_table = function () {
    var inputName, inputWeight, inputCost, inputType, filterName, filterWeight, filterCost, filterType, table, tr, tdName, tdWeight, tdCost, tdType, i, txtValueName, txtValueWeight, txtValueCost, txtValueType;

    inputName = document.getElementById("nameInput");
    inputWeight = document.getElementById("weightInput");
    inputCost = document.getElementById("costInput");
    inputType = document.getElementById("typeInput");

    filterName = inputName.value.toUpperCase();
    filterWeight = inputWeight.value.toUpperCase();
    filterCost = inputCost.value.toUpperCase();
    filterType = inputType.value.toUpperCase();

    table = this.table_object;
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tdName = tr[i].getElementsByTagName("td")[0];
        tdWeight = tr[i].getElementsByTagName("td")[1];
        tdCost = tr[i].getElementsByTagName("td")[2];
        tdType = tr[i].getElementsByTagName("td")[3];

        if (tdName && tdWeight && tdCost && tdType) {
            txtValueName = tdName.textContent || tdName.innerText;
            txtValueWeight = tdWeight.textContent || tdWeight.innerText;
            txtValueCost = tdCost.textContent || tdCost.innerText;
            txtValueType = tdType.textContent || tdType.innerText;

            if ((filterName === "" || txtValueName.toUpperCase().indexOf(filterName) > -1) &&
                (filterWeight === "" || txtValueWeight.toUpperCase().indexOf(filterWeight) > -1) &&
                (filterCost === "" || txtValueCost.toUpperCase().indexOf(filterCost) > -1) &&
                (filterType === "" || txtValueType.toUpperCase().indexOf(filterType) > -1)) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }

    }
}

