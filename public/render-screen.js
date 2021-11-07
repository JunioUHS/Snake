export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {
    const context = screen.getContext('2d');
    context.fillStyle = 'white';
    context.clearRect(0, 0, 30, 30);

    for (const playerId in game.state.players) {
        const player = game.state.players[playerId];

        for(let i = player.body.length - 1; i >= 0; i--) {
            context.fillStyle = 'gray';
            context.fillRect(player.body[i].x, player.body[i].y, 1, 1);
        }

        context.fillStyle = 'black';
        context.fillRect(player.x, player.y, 1, 1);
    }
    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId];
        context.fillStyle = '#F0DB4F';
        context.fillRect(fruit.x, fruit.y, 1, 1);
    }

    const currentPlayer = game.state.players[currentPlayerId];

    if (currentPlayer) {
        for(let i = currentPlayer.body.length - 1; i >= 0; i--) {
            context.fillStyle = '#00FA9F';
            context.fillRect(currentPlayer.body[i].x, currentPlayer.body[i].y, 1, 1);
        }

        context.fillStyle = '#006F45'
        context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1);
    }

    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId);
    });
}