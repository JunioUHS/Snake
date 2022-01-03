export default function createGame() {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 1000,
            height: 1000
        }
    };

    const observers = [];

    function start() {
        const frequencyFruit = 2000;
        const frequencyAutoMove = 15;

        setInterval(addFruit, frequencyFruit);
        setInterval(autoMove, frequencyAutoMove);
    }

    function subscribe(observerFunction) {
        observers.push(observerFunction);
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command);
        }
    }

    function setState(newState) {
        Object.assign(state, newState);
    }

    function addPlayer(command) {
        const playerId = command.playerId;
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width);
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height);
        const currentMovement = command.currentMovement ? command.currentMovement : 'ArrowRight';
        const defaultBody = [];
        if (!command.body) {
            for(let i = 1; i <= 40; i++) {
                defaultBody.push({ x: playerX - i, y: playerY });
            }
        }
        const body = command.body ? command.body : defaultBody;

        state.players[playerId] = {
            x: playerX,
            y: playerY,
            currentMovement: currentMovement,
            body: body
        };

        notifyAll({
            type: 'add-player',
            playerId,
            playerX,
            playerY,
            currentMovement,
            body
        });
    }

    function addBodyPlayer(player) {
        player.body.push({ x: player.x, y: player.y });
    }

    function removePlayer(command) {
        const playerId = command.playerId;

        delete state.players[playerId];

        notifyAll({
            type: 'remove-player',
            playerId
        });
    }

    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000);
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width);
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height);

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        };

        notifyAll({
            type: 'add-fruit',
            fruitId,
            fruitX,
            fruitY
        });
    }

    function removeFruit(command) {
        const fruitId = command.fruitId;

        delete state.fruits[fruitId];

        notifyAll({
            type: 'remove-fruit',
            fruitId
        });
    }

    function movePlayer(command) {
        notifyAll(command);

        const acceptedMoves = {
            ArrowUp(player) {
                if (player.currentMovement !== 'ArrowDown') {
                    player.currentMovement = 'ArrowUp';
                    moveBody(player);
                    player.y - 1 >= 0 ? player.y -= 1 : player.y += 999;
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
                    player.x - 1 >= 0 ? player.x -= 1 : player.x += 999;
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
            movePlayer({ type: 'auto-move', playerId: playerId, keyPressed: player.currentMovement });
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
        start,
        subscribe,
        setState,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        autoMove,
        state
    };
}