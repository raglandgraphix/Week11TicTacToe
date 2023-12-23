//set up a method that only allows one player to select a box specific box.

// I wish i had more time to clean everything up. I may do so over time. This code could be much cleaner.

// a couple variables that I use because it is needed across the classes. I am sure i could eliminate thes somehow
//however i don't have the time.
let player1Wins = 0;
let player2Wins = 0;
// GameOver class has the data and function for when the game either has a winner or a tie.
class GameOver{
    // these never change so i created statics
        static celebration = document.querySelector('#winner');
        static winnerName = GameOver.celebration.querySelector('h1');
        static alert = document.querySelector('#banner');
        static alertText = document.querySelector('.alert');
    constructor(winner){
       this.winner = winner
    }
    //when someone wins you celebrate.
    celebrate(){
        GameOver.winnerName.textContent = `THIS WINNER IS ${this.winner} `;
        GameOver.alertText.textContent = `${this.winner} Wins this game.`;
        GameOver.celebration.style.display = 'block';
        GameOver.alert.style.display = 'block';
        setTimeout(()=>{
            GameOver.celebration.style.display = 'none';
            GameOver.alert.style.display = 'none';
        },3000);
        const score1 = document.querySelector('#score1');
        const score2 = document.querySelector('#score2');
        score1.textContent = player1Wins;
        score2.textContent = player2Wins;
    }
    //tie function. the class list adds and removes seem heavy. I would like to take more time to clean up the code more.
    tie(){
        GameOver.alertText.textContent = `TIE GAME, PLEASE TRY AGAIN`;
        GameOver.alert.classList.remove(`alert-success`)
        GameOver.alert.classList.add(`alert-danger`);
        GameOver.alert.style.display = 'block';
        setTimeout(()=>{
            GameOver.alert.style.display = 'none';
            GameOver.alert.classList.remove(`alert-danger`)
            GameOver.alert.classList.add(`alert-success`);
        },3000);
    }
}
// actually running the game. It comapres the box that is selected, which has an id that correspondes to its location
// the sequences is compared to which play selected which boxes. when one of the sequences match that person is the winner and calls the celebrate
class RunGame{
    static sequences = [['1','2','3'],['4','5','6'],['7','8','9'],['1','4','7'],['2','5','8'],['3','6','9'],['1','5','9'],['3','5','7']];
    constructor(){
        this.selectedBox = document.querySelectorAll(".box");
        this.element = document.querySelector('#board');
        this.clearElement = document.querySelector('#clear');
        this.attachClickListener();
        this.playerTurn = 1;
        this.playerOneCount = 0;
        this.player1=[];
        this.player2 =[];
        this.playerTwoCount = 0;
    }
    //the compare method compare the sequences to the players selections
    compare(player){
        if(player===1){
            for(let i =0;i<RunGame.sequences.length;i++){
                for(player of this.player1){
                    if( RunGame.sequences[i].includes(player)){
                        this.playerOneCount++;
                        if(this.playerOneCount===3){
                            player1Wins++;
                            const newGameOver = new GameOver('Player 1').celebrate();
                        }
                    };
                }
                // the if statement didn't return true 3 times so clear it and move to the next sequence of numbers.
                this.playerOneCount=0;
            }
        }else{
            for(let i =0;i<RunGame.sequences.length;i++){
                for(player of this.player2){
                    if( RunGame.sequences[i].includes(player)){
                        this.playerTwoCount++;
                        if(this.playerTwoCount===3){
                            player2Wins++;
                            const newGameOver = new GameOver('Player 2').celebrate();
                        }
                    };
                }
                // the if statement didn't return true 3 times so clear it and move to the next sequence of numbers.
                this.playerTwoCount=0;
            }
        }
        const boxElements = document.querySelectorAll('.box');

        const allBoxesHavePTag = Array.from(boxElements).every(box => {
            return box.querySelector('p') !== null;
        });

        if (allBoxesHavePTag) {
            const celebration = new GameOver().tie();
        }
    }
    //the runGame method.
    runGame(){
        const cell = event.target; // Access the clicked element directly
        if(this.playerTurn===1){
            if(!event.target.hasChildNodes()){
                const currentSelection = event.target.id;
                let newTag = document.createElement('p');
                newTag.textContent= 'X';
                cell.append(newTag);
                this.player1.push(currentSelection);
                this.compare(this.playerTurn);
                this.playerTurn=2;
                const currentPlayer = document.querySelector('#currentPlayer2');
                const previousPlayer = document.querySelector('#currentPlayer1');
                previousPlayer.classList.remove('text-danger');
                currentPlayer.classList.add('text-danger');
            }
        }else if(this.playerTurn===2){
            //this line looks at the available selections. if something is already selected it will not allow you to click ther as well
            if(!event.target.hasChildNodes()){
                const currentSelection = event.target.id;
                let newTag = document.createElement('p');
                newTag.textContent= 'O';
                cell.append(newTag);
                this.player2.push(currentSelection);
                this.compare(this.playerTurn);
                this.playerTurn=1;
                const currentPlayer = document.querySelector('#currentPlayer1');
                const previousPlayer = document.querySelector('#currentPlayer2');
                previousPlayer.classList.remove('text-danger');
                currentPlayer.classList.add('text-danger');
        }
    }
    }
    //works with the clear button and clears the board
    clear(){
        this.playerTurn = 1;
        this.playerOneCount = 0;
        this.player1=[];
        this.player2 =[];
        this.playerTwoCount = 0;
        const currentPlayer = document.querySelector('#currentPlayer1');
        const previousPlayer = document.querySelector('#currentPlayer2');
        previousPlayer.classList.remove('text-danger');
        currentPlayer.classList.add('text-danger');
        this.selectedBox.forEach(box=>{
        box.innerHTML='';
        });
    }
    //adds an event listiner to the clicks
    attachClickListener(){
        this.element.addEventListener('click', () => this.runGame());
        this.clearElement.addEventListener("click", () => this.clear());
    }
}
//runs the game
const runGame = new RunGame();
