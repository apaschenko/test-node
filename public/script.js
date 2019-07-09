function addEnemy() {
    const numOfEnemies = document.getElementById("enemies").childElementCount;

    const firstEnemy = document.getElementById("enemy_0");
    const newEnemy = firstEnemy.cloneNode(true);

    newEnemy.id = "enemy_" + numOfEnemies;

    ["e_name", "e_dist", "e_speed"].forEach(function (item) {
        const node = newEnemy.querySelector("." + item);
        node.id = item + "_" + numOfEnemies;
        node.value = "";
    });

    document.getElementById("enemies").appendChild(newEnemy);

    setRemButtonVisibility();
}

function  removeLastEnemy() {
    const enemies = document.getElementById("enemies");
    if (enemies.childElementCount > 1) {
        enemies.removeChild(enemies.lastChild);
    }

    setRemButtonVisibility();
}

function setRemButtonVisibility() {
    const numOfEnemies = document.getElementById("enemies").childElementCount;
    document.getElementById("remove_button").style.display =
        (numOfEnemies > 1) ? "block" : "none"
}

function collectData() {
    const data = {
        firingRange: parseFloat( document.getElementById("firing_range").value ),
        enemies: []
    };

    const enemies = document.getElementById("enemies").children;
    for (let i = 0; i < enemies.length; i++) {
        data.enemies.push({
            name: document.getElementById("e_name_" + i).value,
            distance: parseFloat( document.getElementById("e_dist_" + i).value ),
            speed: parseFloat( document.getElementById("e_speed_" + i).value )
        });
    }

    return data;
}

function transferData() {
    const outgoingData = collectData();

    const isDataValid = validator(outgoingData);
    showHideError(isDataValid);

    if (isDataValid) {
        fetch('/', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(outgoingData)
        })
            .then(function(response) {
                return response.json();
            })
            .then(function (data) {
                showResults(data);
            });
    }
}

function showResults(response) {
    document.getElementById('o_firing_range').innerText = `${response.firingRange}m`;

    const historyNode = document.getElementById('o_history');
    historyNode.innerHTML = '';

    response.firstRoundHistory.forEach(rowData => {
        const rowNode = document.getElementById('row_pattern').cloneNode(true);

        rowNode.querySelector(".o_turn_number").textContent = rowData.turn;
        rowNode.querySelector(".o_name").textContent = rowData.name;
        rowNode.querySelector(".o_dist").textContent = `${rowData.distance}m`;

        rowNode.style.display = 'block';

        historyNode.appendChild(rowNode);
    });

    document.getElementById('o_status').textContent = response.firstRoundStatus;
    document.getElementById('o_turns').textContent = response.turns;

    const minNode = document.getElementById('o_minimum');
    if (response.firstRoundStatus === "WIN") {
        minNode.style.display = "none";
    } else {
        document.getElementById('o_min_fr').textContent = response.minFiringRangeForWin;
        minNode.style.display = 'block';
    }

    document.getElementById('output').style.display = 'block';
}

function showHideError(isDataValid) {
    const errorNode = document.getElementById('error');
    errorNode.style.display = isDataValid ? 'none' : 'block';
}

function validator(data) {
    if (data.enemies.length === 0) {
        return false;
    }

    if ( isNotAPositiveNumber(data.firingRange) ) {
        return false;
    }

    let isDataValid = true;
    for (let i = 0; i < data.enemies.length; i++) {
        const enemy = data.enemies[i];
        if ( isNotAPositiveNumber(enemy.distance) || isNotAPositiveNumber(enemy.speed) ) {
            isDataValid = false;
            break;
        }
    }
    return isDataValid;
}

function isNotAPositiveNumber(number) {
    return isNaN(number) || number <= 0;
}