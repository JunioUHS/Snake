export default function createGame(document) {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 30,
            height: 30
        }
    };

    function addPlayer(command) {
        const playerId = command.playerId;
        const playerX = command.playerX;
        const playerY = command.playerY;
        const currentMovement = command.currentMovement;
        const body = command.body;

        state.players[playerId] = {
            x: playerX,
            y: playerY,
            currentMovement: currentMovement,
            body: body
        };
    }

    function addBodyPlayer(player) {
        player.body.push({ x: player.x, y: player.y });
    }

    function removePlayer(command) {
        const playerId = command.playerId;

        delete state.players[playerId];
    }

    function addFruit(command) {
        const fruitId = command.fruitId;
        const fruitX = command.fruitX;
        const fruitY = command.fruitY;

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        };
    }

    function removeFruit(command) {
        const fruitId = command.fruitId;

        delete state.fruits[fruitId];
    }

    function movePlayer(command) {
        const acceptedMoves = {
            ArrowUp(player) {
                if (player.currentMovement !== 'ArrowDown') {
                    player.currentMovement = 'ArrowUp';
                    moveBody(player);
                    player.y - 1 >= 0 ? player.y -= 1 : player.y += 29;
                }
            },
            ArrowRight(player) {
                if (player.currentMovement !== 'ArrowLeft') {
                    player.currentMovement = 'ArrowRight';
                    moveBody(player);
                    player.x + 1 < state.screen.width ? player.x += 1 : player.x = 0;
                }
            },
            ArrowDown(player) {
                if (player.currentMovement !== 'ArrowUp') {
                    player.currentMovement = 'ArrowDown';
                    moveBody(player);
                    player.y + 1 < state.screen.height ? player.y += 1 : player.y = 0;
                }
            },
            ArrowLeft(player) {
                if (player.currentMovement !== 'ArrowRight') {
                    player.currentMovement = 'ArrowLeft';
                    moveBody(player);
                    player.x - 1 >= 0 ? player.x -= 1 : player.x += 29;
                }
            }
        }

        function moveBody(player) {
            const maxPosition = player.body.length - 1;
            for (let i = maxPosition; i >= 0; i--) {
                const body = player.body[i];
                if (i > 0) {
                    body.x = player.body[i - 1].x;
                    body.y = player.body[i - 1].y;
                } else {
                    body.x = player.x;
                    body.y = player.y;
                }
            }
            console.log(player.body);
        }

        const keyPressed = command.keyPressed;
        const playerId = command.playerId;
        const player = state.players[playerId];
        const moveFunction = acceptedMoves[keyPressed];
        
        if (player && moveFunction) {
            moveFunction(player);
            checkForFruitCollision(playerId);
        }
    }

    function autoMove() {
        for (const playerId in state.players) {
            const player = state.players[playerId];
            console.log(player);
            movePlayer({ playerId: playerId, keyPressed: player.currentMovement });
        }
    }

    function checkForFruitCollision(playerId) {
        const player = state.players[playerId];

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId];

            if (player.x === fruit.x && player.y === fruit.y) {
                addBodyPlayer(player);
                removeFruit({ fruitId });
            }
        }
    }

    

    return {
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        autoMove,
        state
    };
}