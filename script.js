const url = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6'
const drawCardsBtn = document.querySelector('#drawCardsBtn');
const dealerBtn = document.querySelector('#dealerBtn');
const playerBtn = document.querySelector('#playerBtn');
const dealBtn = document.querySelector('#dealBtn');
const twistBtn = document.querySelector('#twistBtn');
const stickBtn = document.querySelector('#stickBtn');
const dealerSection = document.querySelector('.dealer-cards');
const playerSection = document.querySelector('.player-cards');
const playerScoreDisplay = document.querySelector('#playerScore');
const dealerScoreDisplay = document.querySelector('#dealerScore');
const resultDisplay = document.querySelector('#resultDisplay');
let deckID;
let count = 0;
let playerCards = [];
let dealerCards = [];
// let dealerOrPlayer = true;
let playerScore = 0;
let dealerScore = 0;
let phase = 0;

class Card {
    constructor(imageUrl, suit, value) {
        this.imageUrl = imageUrl;
        this.suit = suit;
        this.value = value
    }
}

fetch(url).then(function (response) {
    return response.json();
}).then(function (json) {
    let deck = json;
    deckID = deck.deck_id;
    // console.log(deckID);
})


function clearGame(newGameBtn) {
    count = 0;
    playerCards = [];
    dealerCards = [];
    playerScore = 0;
    dealerScore = 0;
    playerScoreDisplay.textContent = `Player score is : ${playerScore}`
    dealerScoreDisplay.textContent = `Dealer score is : ${dealerScore}`
    resultDisplay.removeChild(newGameBtn);
    resultDisplay.textContent = '';
    console.log(playerCards);
    playerSection.innerHTML = '';
    dealerSection.innerHTML = '';

    // dealBtn.disabled = 'false';
    // dealBtn.style.opacity = '1';
    // twistBtn.disabled = 'true';
    // twistBtn.style.opacity = '0.5';
    // stickBtn.disabled = 'true';
    // stickBtn.style.opacity = '0.5';

}



dealBtn.addEventListener('click', () => {

    // dealBtn.disabled = 'true';
    // dealBtn.style.opacity = '0.5';

    const myInterval = setInterval(function () {
        if (count % 2 === 0 && count !== 4) {
            getCards(1, 'player')
            count += 1
            console.log(count);
        } else if (count === 4) {
            clearTimeout(myInterval)
        } else {
            getCards(1, 'dealer')
            count += 1
            console.log(count);
        }
    }, 1000)

})

twistBtn.addEventListener('click', () => {
    if (playerScore < 21) {
        getCards(1, 'player');
    } else {
        console.log('Can\'t take any more cards');
    }
})

stickBtn.addEventListener('click', () => {
    // if (playerScore < 21 && dealerScore < 17) {
    //     getCards(1, 'dealer');
    // } else {
    //     console.log('error');
    // }

    if (playerScore < 21 && dealerScore < 17) {
        getCards(1, 'dealer')


    } else if (17 <= dealerScore <= 21) {
        let newGameBtn = document.createElement('button')
        newGameBtn.classList.add('new-game-btn')
        newGameBtn.textContent = 'Play Again'
        resultDisplay.appendChild(newGameBtn);
        newGameBtn.addEventListener('click', () => {
            clearGame(newGameBtn, playerCards, cardImgPlayer);
        })
    } else {
        let newGameBtn = document.createElement('button')
        newGameBtn.classList.add('new-game-btn')
        newGameBtn.textContent = 'Play Again'
        resultDisplay.appendChild(newGameBtn);
        newGameBtn.addEventListener('click', () => {
            clearGame(newGameBtn, playerCards, cardImgPlayer);
        })

    }
})


function getCards(cardsRequired, playerType) {

    let urlGetCards = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${cardsRequired}`;
    let cardImgPlayer = document.createElement('img');
    let cardImgDealer = document.createElement('img');


    fetch(urlGetCards).then(function (response) {
        return response.json();
    }).then(function (json) {
        let cards = json;
        // console.log(cards);
        let imageUrl = cards.cards[0].image;
        let suit = cards.cards[0].suit;
        let value = cards.cards[0].value;
        let card = new Card(
            imageUrl, suit, value
        )
        // console.log(card);

        if (playerType === 'player') {

            playerCards.push(card)
            // console.log(playerCards);

            let i;
            for (i = 0; i < playerCards.length; i++) {

                cardImgPlayer.src = playerCards[i].imageUrl;
                cardImgPlayer.classList.add('card');
                playerSection.appendChild(cardImgPlayer);

            }

            let newValue = convertRoyalsToValue(playerCards[playerCards.length - 1].value)
            playerScore += newValue;
            console.log(playerScore);
            if (playerScore > 21) {
                // twistBtn.disabled = true;
                // twistBtn.style.opacity = '0.4'
                resultDisplay.innerText = 'You have gone Bust!'
                let newGameBtn = document.createElement('button')
                newGameBtn.classList.add('new-game-btn')
                newGameBtn.textContent = 'Play Again'
                resultDisplay.appendChild(newGameBtn);
                newGameBtn.addEventListener('click', () => {
                    clearGame(newGameBtn, playerCards, cardImgPlayer);
                })
                // stickBtn.style.backgroundColor = 'lightgreen';
                // dealerSection.removeChild(dealerSection.lastChild);
                // dealerSection.appendChild(dealerCards[1].imageUrl)
            } else if (playerScore === 21) {
                // twistBtn.disabled = true;
                // twistBtn.style.opacity = '0.4'
                resultDisplay.innerText = 'Blackjack'
                let newGameBtn = document.createElement('button')
                newGameBtn.classList.add('new-game-btn')
                newGameBtn.textContent = 'Play Again'
                resultDisplay.appendChild(newGameBtn);
                newGameBtn.addEventListener('click', () => {
                    clearGame(newGameBtn, playerCards, cardImgPlayer);
                })
                console.log('Blackjack');
            }
            playerScoreDisplay.textContent = `Player score is : ${playerScore}`;

        } else {
            dealerCards.push(card)
            // console.log(dealerCards);
            let i;
            for (i = 0; i < dealerCards.length; i++) {
                // console.log(i);
                // console.log(dealerCards[i].imageUrl);
                // console.log(count);
                cardImgDealer.src = dealerCards[i].imageUrl;
                cardImgDealer.classList.add('card');
                dealerSection.appendChild(cardImgDealer);
                // if (dealerCards.length === 2) {
                //     let backOfCard = document.createElement('div');
                //     backOfCard.classList.add('back-of-card')
                //     dealerSection.appendChild(backOfCard);
                //     return;
                // } else if (dealerCards.length === 3) {
                //     dealerSection.removeChild(backofCard);
                //     cardImgDealer.src = dealerCards[1].imageUrl;
                //     cardImgDealer.classList.add('card');
                //     dealerSection.appendChild(cardImgDealer);
                // } else {
                //     cardImgDealer.src = dealerCards[i].imageUrl;
                //     cardImgDealer.classList.add('card');
                //     dealerSection.appendChild(cardImgDealer);
                // }
            }

            let newValue = convertRoyalsToValue(dealerCards[dealerCards.length - 1].value)
            dealerScore += newValue;
            console.log(dealerScore);
            dealerScoreDisplay.textContent = `Dealer score is : ${dealerScore}`;
        }
    });
}

function convertRoyalsToValue(value) {

    if (value === 'JACK' || value === 'QUEEN' || value === 'KING') {
        return 10;
    } else if (value === 'ACE') {
        return 11;
    } else {
        return parseInt(value, 10)
    }
}

playerScoreDisplay.textContent = `Player score is : ${playerScore}`
dealerScoreDisplay.textContent = `Dealer score is : ${dealerScore}`





// function getDealerCards(cardsRequired) {

//     let urlGetCards = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${cardsRequired}`;
//     let cardImgDealer = document.createElement('img');

//     fetch(urlGetCards).then(function (response) {
//         return response.json();
//     }).then(function (json) {
//         let cards = json;
//         let imageUrl = cards.cards[0].image;
//         let suit = cards.cards[0].suit;
//         let value = cards.cards[0].value;
//         let card = new Card(
//             imageUrl, suit, value
//         )

//         dealerCards.push(card)
//         console.log(dealerCards);

//         let i;
//         for (i = 0; i < dealerCards.length; i++) {

//             console.log(i);
//             console.log(dealerCards[i].imageUrl);
//             cardImgDealer.src = dealerCards[i].imageUrl;
//             cardImgDealer.classList.add('card');
//             dealerSection.appendChild(cardImgDealer);
//         }
//     })
// }

// function gameFlow {

//     if (count === 0) {
//         getPlayerCards(1)
//         count += 1
//     } else if (count === 1) {
//         getDealerCards(1)
//         count += 1
//     } else if (count === 2) {
//         getPlayerCards(1)
//         count += 1;
//     } else if (count === 3) {
//         getDealerCards(1)
//         count += 1;
//     }

// }




// old code

// function getCards(cardsRequired) {
//     console.log(deckID);
//     let urlGetCards = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${cardsRequired}`;
//     console.log(urlGetCards);
//     let cardImg = document.createElement('img')

//     fetch(urlGetCards).then(function (response) {
//         return response.json();
//     }).then(function (json) {
//         let cards = json;
//         // console.log(cards);
//         let imageUrl = cards.cards[0].image;
//         let suit = cards.cards[0].suit;
//         let value = cards.cards[0].value;

//         // console.log(imageUrl);
//         // console.log(suit);
//         // console.log(value);
//         // console.log(cardsInPlay);

//         let card = new Card(
//             imageUrl, suit, value
//         )

//         cardsInPlay.push(card)
//         console.log(cardsInPlay);

//         let i;
//         for (i = 0; i < cardsInPlay.length; i++) {

//             if (cardsInPlay.length % 2 === 1) {

//                 console.log(i);
//                 console.log(cardsInPlay[i].imageUrl);
//                 cardImg.src = cardsInPlay[i].imageUrl;
//                 cardImg.classList.add('card');
//                 playerSection.appendChild(cardImg);
//             }
//             else {
//                 console.log(i);
//                 console.log(cardsInPlay[i].imageUrl);
//                 cardImg.src = cardsInPlay[i].imageUrl;
//                 cardImg.classList.add('card');
//                 dealerSection.appendChild(cardImg);
//             }


//         }

//     })
// }

// drawCardsBtn.addEventListener('click', () => {

//     if (count === 0) {
//         getCards(1);
//         count += 1;
//     } else if (count === 1) {
//         getCards(1);
//         count += 1;
//     } else if (count === 2) {
//         getCards(1);
//         count += 1
//     } else if (count === 3) {
//         getCards(1);
//     }
// });








// drawCardsBtn.addEventListener('click', getCards);

// function getCards(numberOfCards) {
//     let urlGetCards = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=2`;
//     console.log(urlGetCards);

//     fetch(url).then(function (response) {
//         return response.json();
//     }).then(function (json) {
//         let deck = json;
//         deckID = deck.deck_id;
//         console.log(deckID);
//     })
// }



// Fetch data from the Deck of Cards API on the page load
// window.addEventListener('load', (event) => {
//     console.log('Page fully loaded');

//     fetch(url).then(function (response) {
//         return response.json();
//     }).then(function (json) {
//         let deck = json;
//         let deckID = deck.deck_id;
//         console.log(deckID);
//         drawCardsBtn.addEventListener('click', (event) => {
//             console.log(deckID);

//             fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=2`).then(function (responsex) {
//                 return responsex.json();
//             }).then(function (json) {
//                 let cards = json
//                 console.log(cards);
//             })
//         })
//     })
// })


