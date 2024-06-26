let playerHand = [];
let dealerHand = [];
let deckId = '';
let playerScore = 0;
let dealerScore = 0;
let gameActive = false;

function resetHands() {
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('dealer-cards').innerHTML = '';
    document.getElementById('player-score').textContent = 'Score: 0';
    document.getElementById('dealer-score').textContent = 'Score: 0';
    document.getElementById('player-total').textContent = 'Player\'s Total: 0';
    document.getElementById('dealer-total').textContent = 'Dealer\'s Total: 0';
    document.getElementById('result-message').textContent = '';
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
    document.getElementById('winning-message').style.display = 'none';
    removeWinnerHighlight();
}

async function startGame() {
    const resultMessage = document.getElementById('result-message');
    resultMessage.textContent = '';
    resetHands();

    try {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const data = await response.json();
        deckId = data.deck_id;
        
        await dealInitialCards();
        gameActive = true;
        document.getElementById('hit-button').disabled = false;
        document.getElementById('stand-button').disabled = false;
    } catch (error) {
        console.error('Error starting game:', error);
        resultMessage.textContent = 'Failed to start game. Please try again.';
        resultMessage.style.color = 'red';
    }
}

async function dealInitialCards() {
    const playerCardsElement = document.getElementById('player-cards');
    const dealerCardsElement = document.getElementById('dealer-cards');

    try {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`);
        const data = await response.json();
        const cards = data.cards;

        playerHand.push(cards[0], cards[2]);
        dealerHand.push(cards[1], cards[3]);

        updateHandDisplay(playerHand, playerCardsElement);
        updateHandDisplay(dealerHand, dealerCardsElement);

        playerScore = calculateHandValue(playerHand);
        dealerScore = calculateHandValue(dealerHand);

        document.getElementById('player-score').textContent = `Score: ${playerScore}`;
        document.getElementById('dealer-score').textContent = `Score: ${dealerScore}`;
        updateTotalScores();

        if (playerScore === 21) {
            endGame('Player has a Blackjack! Player wins!', 'player');
        } else if (dealerScore === 21) {
            endGame('Dealer has a Blackjack! Dealer wins!', 'dealer');
        }
    } catch (error) {
        console.error('Error dealing cards:', error);
        document.getElementById('result-message').textContent = 'Failed to deal cards. Please try again.';
        document.getElementById('result-message').style.color = 'red';
    }
}

function updateHandDisplay(hand, element) {
    element.innerHTML = '';
    hand.forEach(card => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card', 'show');

        const cardText = document.createElement('p');
        cardText.textContent = `${card.value} of ${card.suit}`;

        const cardImage = document.createElement('img');
        cardImage.src = card.image;
        cardImage.alt = `${card.value} of ${card.suit}`;

        cardContainer.appendChild(cardText);
        cardContainer.appendChild(cardImage);
        element.appendChild(cardContainer);

        gsap.fromTo(cardContainer, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1 });
    });
}

function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;

    hand.forEach(card => {
        if (card.value === 'ACE') {
            aces++;
            value += 11;
        } else if (['KING', 'QUEEN', 'JACK'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value, 10);
        }
    });

    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }

    return value;
}

async function hit() {
    if (!gameActive) return;

    const playerCardsElement = document.getElementById('player-cards');

    try {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        const data = await response.json();
        const card = data.cards[0];

        playerHand.push(card);
        updateHandDisplay(playerHand, playerCardsElement);

        playerScore = calculateHandValue(playerHand);
        document.getElementById('player-score').textContent = `Score: ${playerScore}`;
        updateTotalScores();

        if (playerScore > 21) {
            endGame('Player busts! Dealer wins!', 'dealer');
        } else if (playerScore === 21) {
            stand();
        }
    } catch (error) {
        console.error('Error drawing card:', error);
        document.getElementById('result-message').textContent = 'Failed to draw card. Please try again.';
        document.getElementById('result-message').style.color = 'red';
    }
}

async function stand() {
    if (!gameActive) return;

    const dealerCardsElement = document.getElementById('dealer-cards');

    try {
        while (dealerScore < 17) {
            const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
            const data = await response.json();
            const card = data.cards[0];

            dealerHand.push(card);
            updateHandDisplay(dealerHand, dealerCardsElement);

            dealerScore = calculateHandValue(dealerHand);
            document.getElementById('dealer-score').textContent = `Score: ${dealerScore}`;
            updateTotalScores();
        }

        determineWinner();
    } catch (error) {
        console.error('Error drawing card:', error);
        document.getElementById('result-message').textContent = 'Failed to draw card. Please try again.';
        document.getElementById('result-message').style.color = 'red';
    }
}

function determineWinner() {
    if (dealerScore > 21) {
        endGame('Dealer busts! Player wins!', 'player');
    } else if (dealerScore > playerScore) {
        endGame('Dealer wins!', 'dealer');
    } else if (dealerScore < playerScore) {
        endGame('Player wins!', 'player');
    } else {
        endGame('It\'s a tie!', '');
    }
}

function endGame(message, winner) {
    const resultMessage = document.getElementById('result-message');
    const winningMessage = document.getElementById('winning-message');
    resultMessage.textContent = message;
    resultMessage.style.color = 'green';
    gameActive = false;
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;

    if (winner) {
        winningMessage.textContent = `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins!`;
        winningMessage.style.display = 'block';
        highlightWinner(winner);
    }
}

function resetGame() {
    resetHands();
    gameActive = false;
}

function toggleTheme() {
    const body = document.body;
    const themeToggleButton = document.getElementById('theme-toggle');
    body.classList.toggle('light');
    if (body.classList.contains('light')) {
        themeToggleButton.textContent = 'Switch to Dark Theme';
    } else {
        themeToggleButton.textContent = 'Switch to Light Theme';
    }
}

function updateTotalScores() {
    document.getElementById('player-total').textContent = `Player's Total: ${playerScore}`;
    document.getElementById('dealer-total').textContent = `Dealer's Total: ${dealerScore}`;
}

function highlightWinner(winner) {
    const winnerContainer = document.querySelector(`.${winner}-container`);
    winnerContainer.classList.add('winner');
    setTimeout(() => {
        winnerContainer.classList.add('highlight');
    }, 500);
}

function removeWinnerHighlight() {
    document.querySelectorAll('.winner').forEach(element => {
        element.classList.remove('winner', 'highlight');
    });
}

module.exports = {
    resetHands,
    calculateHandValue,
    startGame,
    dealInitialCards,
    hit,
    stand,
    determineWinner,
    endGame,
    resetGame,
    toggleTheme,
    updateTotalScores,
    highlightWinner,
    removeWinnerHighlight,
};
