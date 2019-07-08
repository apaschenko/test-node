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
}

function  removeLastEnemy() {
    const enemies = document.getElementById("enemies");
    enemies.removeChild(enemies.lastChild);
}

function collectData() {
    const data = {
        firingRange: document.getElementById("firing_range").value,
        enemies: []
    };

    const enemies = document.getElementById("enemies").children;
    for (let i = 0; i < enemies.length; i++) {
        const enemy = ["e_name", "e_dist", "e_speed"].reduce(function (acc, item) {
            acc[item] = document.getElementById(item + "_" + i).value;
            return acc;
        }, {});

        data.enemies.push(enemy);
    }

    return data;
}

function transferData() {
    const outgoingData = collectData();

    return fetch('/', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(outgoingData)
    })
    .then(function (response) {
        console.log(response.json());
    });

}
