const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let gameActive = false;

function createDeck() {
    deck = [];
    for (const suit of suits) {
        for (const value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffleDeck() {
    deck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
    if (card.value === 'ace') return 11;
    if (['king', 'queen', 'jack'].includes(card.value)) return 10;
    return parseInt(card.value);
}

function getHandValue(hand) {
    let value = 0;
    let aceCount = 0;
    for (const card of hand) {
        console.log(getCardValue(card));
        value += getCardValue(card);
        if (card.value === 'ace') aceCount++;
    }
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }
    console.log(value);
    return value;
}

function getCardImage(card) {
    return `/cards/${card.value.toLowerCase()}_of_${card.suit.toLowerCase()}.svg`;
}

function renderHand(hand, elementId) {
    const handDiv = document.getElementById(elementId);
    handDiv.innerHTML = '';
    hand.forEach(card => {
        const img = document.createElement('img');
        img.src = getCardImage(card);
        handDiv.appendChild(img);
    });
}

function updateDisplay() {
    renderHand(playerHand, 'player-hand');
    renderHand(dealerHand, 'dealer-hand');
    document.getElementById('player-score').innerText = `Total: ${getHandValue(playerHand)}`;
    document.getElementById('dealer-score').innerText = `Total: ${getHandValue(dealerHand)}`;
    document.getElementById('status').innerText = getGameStatus();
}

function getGameStatus() {
    if (playerScore > 21) return 'Player busts!';
    if (dealerScore > 21) return 'Dealer busts!';
    if (playerScore === 21 && dealerScore === 21) return 'Both have Blackjack!';
    if (playerScore === 21) return 'Player wins with Blackjack!';
    if (dealerScore === 21) return 'Dealer wins with Blackjack!';
    if (playerScore > 21) return 'Player busts!';
    if (dealerScore > 21) return 'Dealer busts!';
    if (!gameActive) return '';
    return '';
}

function playerHit() {
    if (gameActive) {
        playerHand.push(deck.pop());
        playerScore = getHandValue(playerHand);
        if (playerScore > 21) {
            updateDisplay();
            document.getElementById('message').innerText = 'Player busts!';
            gameActive = false;
        } else {
            updateDisplay();
        }
    }
}

function dealerPlay() {
    while (dealerScore < 17) {
        dealerHand.push(deck.pop());
        dealerScore = getHandValue(dealerHand);
    }
    updateDisplay();
    if (dealerScore > 21) {
        document.getElementById('message').innerText = 'Dealer busts!';
    } else {
        if (playerScore > dealerScore) {
            document.getElementById('message').innerText = 'Player wins!';
        } else if (playerScore < dealerScore) {
            document.getElementById('message').innerText = 'Dealer wins!';
        } else {
            document.getElementById('message').innerText = 'It\'s a tie!';
        }
    }
    gameActive = false;
}

function startGame() {
    createDeck();
    shuffleDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    playerScore = getHandValue(playerHand);
    dealerScore = getHandValue(dealerHand);
    gameActive = true;
    updateDisplay();
    document.getElementById('message').innerText = '';
}

function showMainScreen() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

function startNewGame() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    startGame();
}

function quitGame() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

document.getElementById('hit').addEventListener('click', playerHit);
document.getElementById('stand').addEventListener('click', () => {
    if (gameActive) {
        dealerPlay();
    }
});
document.getElementById('deal').addEventListener('click', startGame);
document.getElementById('start-game').addEventListener('click', startNewGame);
document.getElementById('quit').addEventListener('click', quitGame);

// Show main menu on page load
window.onload = showMainScreen;
