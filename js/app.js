// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null;
var flippedCouplesCount = 0;
var numClick = 0;
var bestResult = 'Start Playing';
var isProcessing = false;
var startTime;
var myName;
var username;
var result;

// This is a constant that we dont change during the game
var TOTAL_COUPLES_COUNT = 8;

// Load some audio files
var audioWin = new Audio('sound/win.mp3');
var audioRight = new Audio('sound/right.mp3');
var audioWrong = new Audio('sound/wrong.mp3');

// Checks if localstorage has the user name
if (localStorage.getItem('username') === null) {
  // If there isn't any,  call the function to get the user's name
  getname();
} else {
  // If there is a name already, update the user name on the page
  username = localStorage.getItem('username');
  myName = document.querySelector('.myname');
  myName.textContent = username;
}

// Checks if localstorage has the user score
if (localStorage.getItem('bestscore') === null) {
  // If there isn't any, set score to "start playing" on the game page
  result = document.querySelector('.besttime');
  result.textContent = bestResult;
} else {
  // If there is a score, update on the game page
  bestResult = localStorage.getItem('bestscore');
  result = document.querySelector('.besttime');
  result.textContent = bestResult;
}

// This is a function that propmts the user for his name and put it in localstorage
function getname() {
  var name = prompt('Enter your name please:');
  localStorage.setItem('username', name);

  // If the user didn't enter any character, ask again for a valid name
  while ((localStorage.getItem('username')) === '') {
    name = prompt('You have entered an invalid name. Please enter a valid name with at least one character!');
    localStorage.setItem('username', name);
  }

  // Get the username from the localstorage and gives a welcome message
  username = localStorage.getItem('username');
  alert('Welcome ' + username + ' to the coolest Memory Game! Have Fun!');
  console.log(username);

  // update the user name on the game page
  myName = document.querySelector('.myname');
  myName.textContent = username;
}

// This function is called whenever the user clicks on the button "not you?"
function notyou() {
  // Get the user's name
  getname();

  // Reset score in localstorage and on the game page if there is a score already
  // jscs:ignore maximumLineLength
  if (localStorage.getItem('bestscore') !== null && localStorage.getItem('bestscore') !== 'Start Playing') {
    bestResult = 'Start Playing';
    result = document.querySelector('.besttime');
    result.textContent = bestResult;
    localStorage.setItem('bestscore', bestResult);
  }

  // Restart the game
  restart();

  // Hide the button that Asks the user if he gives up
  document.getElementById('iGiveUp').style.display = 'none';
}

// This function is called whenever the user clicks on the button "I'm Giving Up"
function giveup() {
  //Flip the cards that are not yet flipped
  var divs = document.querySelectorAll('div.card');
  for (var i = 0; i < divs.length; ++i) {
    divs[i].classList.add('flipped');
  }

  // Show the button that Asks the user if he wants to restart the game
  document.getElementById('playagain').style.display = 'block';

  // Hide the button that Asks the user if he gives up
  document.getElementById('iGiveUp').style.display = 'none';

  //Give a message to the user to play again
  setTimeout(function () {
    alert('No shame! Try again- Click on the button "Play again" to restart the game.');
  }, 1800);
}

// Hide the play-again button
document.getElementById('playagain').style.display = 'none';

// Hide the button that Asks the user if he gives up
document.getElementById('iGiveUp').style.display = 'none';

// Shuffle
shuffle();

// This function is called whenever the user click a card
function cardClicked(elCard) {

  // Start the clock on first click
  if (numClick === 0) {
    startTime = Date.now();
    console.log(startTime);
    numClick++;

    // Show the button that Asks the user if he gives up
    document.getElementById('iGiveUp').style.display = 'block';
  }

  // If the user clicked an already flipped card - do nothing and return from the function
  if (elCard.classList.contains('flipped')) {
    return;
  }

  // Prevent the user from clicking on more the 2 cards too fast
  if (isProcessing === false) {
    // Flip it and enter processing mode
    elCard.classList.add('flipped');
    isProcessing = true;

    // This is a first card, only keep it in the global variable
    if (elPreviousCard === null) {
      elPreviousCard = elCard;
      isProcessing = false;
    } else {
      // Get the data-card attribute's value from both cards
      var card1 = elPreviousCard.getAttribute('data-card');
      var card2 = elCard.getAttribute('data-card');

      // No match, schedule to flip them back in 1 second
      if (card1 !== card2) {
        audioWrong.play();
        setTimeout(function () {
          elCard.classList.remove('flipped');
          elPreviousCard.classList.remove('flipped');
          elPreviousCard = null;
        }, 1000);

        setTimeout(function () {
          isProcessing = false;
        }, 1800);

      } else {
        // Yes! a match!
        // Play the right audio without the last maching pair
        flippedCouplesCount++;
        if (flippedCouplesCount < 8) {
          audioRight.play();
        }

        elPreviousCard = null;
        setTimeout(function () {
          isProcessing = false;
        }, 1800);

        // All cards flipped!
        if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
          audioWin.play();

          // Stop the clock
          var endTime = Date.now();
          console.log(endTime);

          // Calculate the result in seconds
          var currentResult = Math.round((endTime - startTime) / 1000);
          console.log(currentResult);

          // Alert the user about his score
          setTimeout(function () {
            alert('It took you ' + currentResult + ' seconds to complete the game!');
          }, 2000);

          // Compare results and upadate best result, and store it in localstorage
          if (currentResult < bestResult || bestResult === 'Start Playing') {
            bestResult = currentResult;
            localStorage.setItem('bestscore', bestResult);

            // Update the best result on the game page
            result = document.querySelector('.besttime');
            result.textContent = bestResult;
          }

          // Show the button that Asks the user if he wants to restart the game
          document.getElementById('playagain').style.display = 'block';

          // Hide the button that Asks the user if he gives up
          document.getElementById('iGiveUp').style.display = 'none';
        }
      }
    }
  }
}

// Shuffle function
function shuffle() {
  var board = document.querySelector('.board');
  for (var i = board.children.length; i >= 0; i--) {
    board.appendChild(board.children[Math.random() * i | 0]);
  }
}

// Restart the game if the user wants to play again
function restart() {
  // Flip all the cards;
  var divs = document.querySelectorAll('div.card');
  for (var i = 0; i < divs.length; ++i) {
    divs[i].classList.remove('flipped');
  }

  // Reset some variables
  flippedCouplesCount = 0;
  numClick = 0;

  // Hide the play-again button
  document.getElementById('playagain').style.display = 'none';

  //shuffle
  shuffle();
}
