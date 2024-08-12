const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'A'];
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;

function createDeck() {
    deck = [];
    for (const suit of suits) {
        for (const value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffleDeck() {
    deck = deck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
    if (card.value === 'A') return 11;
    if (['K', 'Q', 'J'].includes(card.value)) return 10;
    return parseInt(card.value);
}

function getHandValue(hand) {
    let value = 0;
    let aceCount = 0;
    for (const card of hand) {
        value += getCardValue(card);
        if (card.value === 'A') aceCount++;
    }
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }
    return value;
}

function getCardImage(card) {
    return `/cards/${card.value}_of_${card.suit}.svg`;
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

function startGame() {
    createDeck();
    shuffleDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    playerScore = getHandValue(playerHand);
    dealerScore = getHandValue(dealerHand);
    updateDisplay();
}

function updateDisplay() {
    renderHand(playerHand, 'player-hand');
    renderHand(dealerHand, 'dealer-hand');
    document.getElementById('status').innerText = `Status: ${getGameStatus()}`;
}

function getGameStatus() {
    if (playerScore > 21) return 'Player busts!';
    if (dealerScore > 21) return 'Dealer busts!';
    if (playerScore === 21) return 'Player wins with Blackjack!';
    if (dealerScore === 21) return 'Dealer wins with Blackjack!';
    return '';
}

function playerHit() {
    playerHand.push(deck.pop());
    playerScore = getHandValue(playerHand);
    if (playerScore > 21) {
        updateDisplay();
        document.getElementById('message').innerText = 'Player busts!';
    } else {
        updateDisplay();
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
}

document.getElementById('hit').addEventListener('click', playerHit);
document.getElementById('stand').addEventListener('click', () => {
    dealerPlay();
});
document.getElementById('deal').addEventListener('click', startGame);

// Start game on page load
window.onload = startGame;
