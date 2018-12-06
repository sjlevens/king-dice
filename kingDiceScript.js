/*Kingdom Come Dice Game
 * 
 * The game is divided into rounds, in which players cast dice in turns. Henry always makes the first move, which also makes the game easier. By default, each game lasts until someone reaches 2000 points (the requirements may change if it's a special game, like in a quest). Whoever manages to reach the threshold first, wins.

After the game begins and the dice are cast, you have to decide which dice you want to save and put on the side, and which you want to cast again. The next move is only possible when:

One of the dice is a "one";

One of the dice is a "five";

At least three dice have the same value.

If, after the first round none of the above requirements is met, it's called a bust - the game is finished and you loose all points.

You choose the dice with the cursor make the key decision: either throw again, or pass the round to have all of the points from the round transferred to your total score. That's a very important moment - only the total score counts in the end. A correctly played round ends with the points being transferred to the scoreboard - otherwise, you bust and loose all the rounds' points.

If, by any chance, you manage to take every single dice off the table, even in a couple moves, you can always repeat the round with the same set of dice - the points scored in this manner will of course be transferred to the leaderboard. The opponent can do the same.
*/


//Player constructor

var Player = function (id, roundScore, globalScore, diceArray) {
    this.id = id;
    this.roundScore = roundScore;
    this.globalScore = globalScore;
    this.diceArray = diceArray;
    this.diceAvailable = diceArray;
    this.currentSelection = [];
    this.active = false;
    this.bust = false;
}

//Dice constructor

var Dice = function (id, value, held) {
    this.id = id;
    this.value = value;
    this.held = held;
}

var createDiceArray = function () {
    var diceArray = [];
    for (var i = 0; i < 5; i++) {
        diceArray.push(new Dice(i, 0, false));
    }
    return diceArray;
}

//Roll functions

Dice.prototype.roll = function () {
    
    this.value = Math.floor(Math.random() * 6) + 1;
    //this.DOM.src = 'dice-' + this.value + '.png';
    
    //document.querySelector('.dice-0-0').src = 'dice-' + this.value + '.png';

}

Player.prototype.rollAvailableDice = function () {
    for (var i = 0; i < this.diceAvailable.length; i++) {
        this.diceAvailable[i].roll();
        diceDOM(this,i).src = 'dice-' + this.diceAvailable[i].value + '.png';
    }
    return this.diceAvailable
}

//Dice DOM mgmt

function diceDOM(player,i) {
    return (document.querySelector('.dice-' + player.id + '-' + player.diceAvailable[i].id));
}

//Initialize players

var player0 = new Player(0, 0, 0, createDiceArray());
var player1 = new Player(1, 0, 0, createDiceArray());

//Check roll function for bust

function checkRoll(player) {
    //Assume they busted and prove they didn't
    player.bust = true;

    var numberOfEachRoll = [0, 0, 0, 0, 0, 0];

    //Store the number of each rolls and check if there is a 1 or 5
    for (var i = 0; i < player.diceAvailable.length; i++) {
        numberOfEachRoll[player.diceAvailable[i].value - 1]++;
        if (player.diceAvailable[i].value == 1 || player.diceAvailable[i].value == 5) player.bust = false;
    }

    //if three of a kind not bust
    if (numberOfEachRoll.indexOf(3) != -1) player.bust = false;

    return player.bust;
}


//Player selection of dice, highlight valid dice, only allow valid dice to be selected

//Check selection is valid
function checkSelection(diceArray) {
    var valid = true;
    var numberOfEachRoll = [0, 0, 0, 0, 0, 0];

    //Store number selections
    for (var i = 0; i < diceArray.length; i++) {
        numberOfEachRoll[diceArray[i].value - 1]++;
    }

    //Check 2s 3s 4s and 6s are either 0 or greater than or equal 3
    if (numberOfEachRoll[1] != 0 && numberOfEachRoll[1] < 3) valid = false;
    if (numberOfEachRoll[2] != 0 && numberOfEachRoll[2] < 3) valid = false;
    if (numberOfEachRoll[3] != 0 && numberOfEachRoll[3] < 3) valid = false;
    if (numberOfEachRoll[5] != 0 && numberOfEachRoll[5] < 3) valid = false;

    if (valid) activePlayer.currentSelection = diceArray;
    return valid;

}


//Player decides to roll again or hold

//Calculate Score function

function calculateScore(player) {
    var numberOfEachRoll = [0, 0, 0, 0, 0, 0];

    //Store number selections
    for (var i = 0; i < player.currentSelection.length; i++) {
        numberOfEachRoll[player.currentSelection[i].value - 1]++;
    }

    for (var i = 0; i < numberOfEachRoll.length; i++) {
        player.roundScore += (i + 1) * numberOfEachRoll[i];
    }
}

//console.log(checkRoll(player0.rollAvailableDice()));
//console.log(player0.diceAvailable);

//Assign global score if hold

//Check for winner if hold

function hold(player) {
    for (var i = 0; i < player.currentSelection; i++) {
        player.diceAvailable.splice(player.diceAvailable.indexOf(player.currentSelection[i]), 1);
    }
    if (player.diceAvailable.length == 0) {
        console.log('Refresh dice');
        player.diceAvailable = player.diceArray;
    }
}

function holdAndPass(player) {
    player.active = false;
    player.diceAvailable = player.diceArray;
    if(!player.bust) player.globalScore += player.roundScore;
    player.roundScore = 0;
    player.bust = false;

    if (player.globalScore >= 100) winner(player);
    player.active = false;
    player.id == 0 ? activePlayer = player1:activePlayer = player0;
    
    
}

//Switch players if hold (have an array and cycle through)

//Back to top

//Set up game board


function invalidSelection() {
    console.log('Invalid Selection');
}

function showActivePlayer() {
    acitvePlayer.active = true;
}
function winner(player) {
    console.log('Player ' + player.id + ' wins!!');
}

function clearBoard() {
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('.btn-hold').style.display = 'block';
    document.querySelector('.btn-roll').style.display = 'block';
    document.querySelector('#name-0').textContent = 'Player 1';
    document.querySelector('#name-1').textContent = 'Player 2';

    document.querySelector('.player-0-panel').classList.add('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');

    document.querySelector('.player-name-0').style.display = 'none';
    document.querySelector('.player-name-1').style.display = 'none';

    document.querySelector('.rules-panel').style.display = 'none';
    document.querySelector('.final-score').style.display = 'block';

}

clearBoard();

var activePlayer = player0;

//On click of Roll - roll the die and check outcome
document.querySelector('.btn-roll').addEventListener('click', function () {
    activePlayer.rollAvailableDice();
    if (checkRoll(activePlayer)) holdAndPass(activePlayer);
})
//Select to hold
document.querySelector('.btn-roll').addEventListener('click', function () {
    activePlayer.rollAvailableDice();
    if (checkRoll(activePlayer)) holdAndPass(activePlayer);
})









/*Game flow
//showActivePlayer(); // sets activePlayer var to a player
activePlayer.rollAvailableDice(); //Done by clicking a button
if (checkRoll(activePlayer)) holdAndPass(activePlayer); //checks for bust

/*Select die and push button
if (checkSelection(diceArray)) {
    calculateScore(activePlayer);
} else {
    invalidSelection();
}

//If the hold button is pushed
hold(activePlayer);
*/
    






/*
 * testing code
console.log(player0);
console.log(player0.diceArray[0]);

player0.rollAvailableDice();

console.log(player0.diceAvailable);

player0.rollAvailableDice();
console.log(player0.diceAvailable);

player1.rollAvailableDice();
console.log(player1.diceAvailable);
*/


