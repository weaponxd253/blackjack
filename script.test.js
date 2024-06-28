const {
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
  } = require('./script');
  
  // Mocking the DOM elements for testing purposes
  document.body.innerHTML = `
    <div id="player-cards"></div>
    <div id="dealer-cards"></div>
    <p id="player-score">Score: 0</p>
    <p id="dealer-score">Score: 0</p>
    <p id="player-total">Player's Total: 0</p>
    <p id="dealer-total">Dealer's Total: 0</p>
    <p id="result-message"></p>
    <button id="hit-button"></button>
    <button id="stand-button"></button>
    <div id="winning-message"></div>
  `;
  
  const fetchMock = jest.fn((url) => {
    if (url.includes('shuffle')) {
      return Promise.resolve({
        json: () => Promise.resolve({ deck_id: 'deck123' }),
      });
    } else if (url.includes('draw')) {
      if (url.includes('count=4')) {
        return Promise.resolve({
          json: () => Promise.resolve({
            cards: [
              { value: '2', suit: 'HEARTS', image: '2H.png' },
              { value: '3', suit: 'CLUBS', image: '3C.png' },
              { value: '4', suit: 'DIAMONDS', image: '4D.png' },
              { value: '5', suit: 'SPADES', image: '5S.png' },
            ],
          }),
        });
      } else {
        return Promise.resolve({
          json: () => Promise.resolve({
            cards: [
              { value: '10', suit: 'HEARTS', image: '10H.png' },
            ],
          }),
        });
      }
    }
  });
  
  global.fetch = fetchMock;
  
  describe('Blackjack Game', () => {
    beforeEach(() => {
      fetchMock.mockClear();
      resetHands();
    });
  
    test('resetHands function should reset all game elements', () => {
      resetHands();
      expect(document.getElementById('player-cards').innerHTML).toBe('');
      expect(document.getElementById('dealer-cards').innerHTML).toBe('');
      expect(document.getElementById('player-score').textContent).toBe('Score: 0');
      expect(document.getElementById('dealer-score').textContent).toBe('Score: 0');
      expect(document.getElementById('player-total').textContent).toBe("Player's Total: 0");
      expect(document.getElementById('dealer-total').textContent).toBe("Dealer's Total: 0");
      expect(document.getElementById('result-message').textContent).toBe('');
      expect(document.getElementById('hit-button').disabled).toBe(true);
      expect(document.getElementById('stand-button').disabled).toBe(true);
      expect(document.getElementById('winning-message').style.display).toBe('none');
    });
  
    test('calculateHandValue function should correctly calculate hand value', () => {
      const hand1 = [{ value: '2' }, { value: '3' }, { value: '4' }];
      const hand2 = [{ value: 'ACE' }, { value: 'KING' }];
      const hand3 = [{ value: 'ACE' }, { value: '9' }, { value: 'ACE' }];
  
      expect(calculateHandValue(hand1)).toBe(9);
      expect(calculateHandValue(hand2)).toBe(21);
      expect(calculateHandValue(hand3)).toBe(21); // Considering the optimal value of Aces
    });
  
    test('startGame function should initialize the game correctly', async () => {
      await startGame();
      expect(fetchMock).toHaveBeenCalledWith('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      expect(document.getElementById('hit-button').disabled).toBe(false);
      expect(document.getElementById('stand-button').disabled).toBe(false);
    });
  
    test('dealInitialCards function should deal cards and update scores', async () => {
      await startGame();
      const playerCardsElement = document.getElementById('player-cards');
      const dealerCardsElement = document.getElementById('dealer-cards');
  
      expect(playerCardsElement.children.length).toBe(2);
      expect(dealerCardsElement.children.length).toBe(2);
  
      const playerScoreText = document.getElementById('player-score').textContent;
      const dealerScoreText = document.getElementById('dealer-score').textContent;
  
      expect(playerScoreText).toBe('Score: 6'); // 2 + 4
      expect(dealerScoreText).toBe('Score: 8'); // 3 + 5
    });
  
    test('hit function should draw a card and update player score', async () => {
      await startGame();
      fetchMock.mockClear(); // Clear mock count after startGame
      fetchMock.mockImplementationOnce((url) =>
        Promise.resolve({
          json: () => Promise.resolve({
            cards: [
              { value: '6', suit: 'HEARTS', image: '6H.png' },
            ],
          }),
        })
      );
  
      await hit();
      expect(fetchMock).toHaveBeenCalledTimes(1); // Only one fetch call for hit
      expect(document.getElementById('player-cards').children.length).toBe(3);
    });
  
    test('stand function should let dealer draw cards and determine winner', async () => {
      await startGame();
      fetchMock.mockClear(); // Clear mock count after startGame
      fetchMock.mockImplementation((url) => {
        if (url.includes('draw')) {
          return Promise.resolve({
            json: () => Promise.resolve({
              cards: [
                { value: '10', suit: 'HEARTS', image: '10H.png' },
              ],
            }),
          });
        }
        return Promise.resolve({
          json: () => Promise.resolve({}),
        });
      });
  
      // Simulate player standing
      await stand();
  
      expect(fetchMock).toHaveBeenCalledTimes(1); // Only one fetch call for stand
      dealerScore = 20; // Mocking a high score for dealer
      determineWinner();
      const resultMessage = document.getElementById('result-message').textContent;
      expect(resultMessage).toMatch(/Dealer wins!/);
    });
  
    // Add more tests as needed for other functions
  });
  