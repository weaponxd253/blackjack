# Blackjack Game

This is a web-based Blackjack game that allows players to play the classic card game against a dealer. The game is built using HTML, CSS, and JavaScript.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- Play Blackjack against a dealer
- Interactive user interface with buttons for game actions
- Displays player and dealer hands and scores
- Dynamic theme switching between light and dark modes
- Responsive design for different screen sizes

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/blackjack-game.git
    cd blackjack-game
    ```

2. Open the project directory:

    ```bash
    cd blackjack-game
    ```

3. Open the `index.html` file in your browser to start the game.

## Usage

1. Open `index.html` in your preferred web browser.
2. Click "Start Game" to begin a new game of Blackjack.
3. Use the "Hit" button to draw a new card, the "Stand" button to end your turn, and the "Reset Game" button to restart the game.
4. Switch between light and dark themes using the "Switch to Dark Theme" button.

## Running Tests

This project uses Jest for unit testing. To run the tests, follow these steps:

1. Install the required dependencies:

    ```bash
    npm install
    ```

2. Run the tests:

    ```bash
    npx jest
    ```

The tests are defined in the `script.test.js` file and cover the main functionalities of the game.

## Project Structure

```plaintext
blackjack-game/
│
├── index.html           # Main HTML file
├── script.js            # Main JavaScript file
├── styles.css           # Main CSS file
├── script.test.js       # Unit tests for the JavaScript functions
├── README.md            # Project documentation
└── package.json         # Project configuration and dependencies for Jest
