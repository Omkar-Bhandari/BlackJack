//Blackjack Code

let  blackjackgame = {
    'you':{'scoreSpan': '#your-score', 'div':'#your-box','score':0},
    'dealer':{'scoreSpan': '#dealers-score', 'div':'#dealers-box','score':0},
    'cards' :['2','3','4','5','6','7','8','9','10','K','Q','J','A'],
    'cardsMap': {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'Q':10,'J':10,'A':[1,11]},
    'wins':0,
    'losses':0,
    'draws':0,
    'isStand': false,
    'isturnsOver':false,
    'isResult':false,
    'isHit':false,
};

const YOU = blackjackgame['you'];
const DEALER = blackjackgame['dealer'];

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3');
const lossSound = new Audio('static/sounds/aww.mp3');

document.querySelector("#hit-btn").addEventListener("click",hit);
document.querySelector("#stand-btn").addEventListener("click",stand);
document.querySelector("#deal-btn").addEventListener("click",deal);

function hit(){
    if (blackjackgame['isStand']===false){
        let cardName = randomCard();
        showCard(cardName,YOU);
        updateScore(cardName,YOU);
        showScore(YOU);
    }
    blackjackgame['isHit']=true;
}

function deal(){
    if (blackjackgame['isturnsOver']===true){
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector("#dealers-box").querySelectorAll('img');
        // console.log(yourImages);
        // console.log(dealerImages);
        for (i=0;i<yourImages.length;i++){
            yourImages[i].remove();
        }
        for (i=0;i<dealerImages.length;i++){
            dealerImages[i].remove();
        }
        resetScore();
    }
}

function randomCard(){
    let randomIndex = Math.floor(Math.random()*13);
    // console.log(randomIndex);
    // console.log(blackjackgame['cards'][randomIndex]);
    return blackjackgame['cards'][randomIndex];
}

function showCard(card ,activePlayer){
    if (activePlayer['score'] <= 21){
        let cardImage = document.createElement('img');
        cardImage.src= 'static/images/'+ card +'.png';
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function updateScore(card,activePlayer){
    if (card === 'A'){
        if(activePlayer['score']+blackjackgame['cardsMap'][card][1] <= 21){
            activePlayer['score'] += blackjackgame['cardsMap'][card][1];  
        }
        else{
            activePlayer['score'] += blackjackgame['cardsMap'][card][0];    
        }
    }
    else{
        activePlayer['score'] += blackjackgame['cardsMap'][card];
    }
}

function showScore(activePlayer){
    if (activePlayer['score']>21){
        document.querySelector(activePlayer['scoreSpan']).textContent = "BUST!!!!";
        document.querySelector(activePlayer['scoreSpan']).style.color = "red";
    }
    else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

function resetScore(){
    YOU['score'] = 0;
    DEALER['score'] = 0;
    document.querySelector(YOU['scoreSpan']).textContent = YOU['score'];
    document.querySelector(YOU['scoreSpan']).style.color = 'white';
    document.querySelector(DEALER['scoreSpan']).textContent = DEALER['score'];
    document.querySelector(DEALER['scoreSpan']).style.color = 'white';
    document.querySelector("#result").textContent = "Let's Play";
    document.querySelector("#result").style.color = "black";
    blackjackgame['isResult']=false;
    blackjackgame['isStand']=false;
    blackjackgame['isturnsOver']=false;
    blackjackgame['isHit']=false;

}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function stand(){
    if ((blackjackgame['isResult']===false) && (blackjackgame['isHit'] == true)){
        blackjackgame['isStand']=true;
        
        while(DEALER['score']< 16 && blackjackgame['isStand']===true){
            let card = randomCard(); 
            showCard(card,DEALER);
            updateScore(card,DEALER);
            showScore(DEALER);
            await sleep(800);
        }
        blackjackgame['isturnsOver']=true;
        let winner = computeWinner();
        showResult(winner); 
    }
}

function computeWinner(){
    let winner;
    if (YOU['score']<=21){
        if ((DEALER['score']>21) || (DEALER['score']<YOU['score'])){
            result = console.log("YOU WON!!!");
            winner = YOU;
        }
        else if (YOU['score']<DEALER['score']){
            result = console.log('You Lost');
            winner = DEALER;
        }
        else if(YOU['score']===DEALER['score']){
            result = console.log("You Drew");
        }
    }
    else if (YOU['score']>21 && DEALER['score']<=21){
        result = console.log("YOU LOST!!!");
        winner = DEALER;
    }
    else if (DEALER['score']>21 && YOU['score']>21){
        result = console.log('Draw!!');
    }
    console.log('winner',winner); 
    return winner;
}

function showResult(winner){
    if(blackjackgame['isturnsOver']===true){
        let message ,messagecolor;
        // winner = computeWinner();
        if (winner === YOU){
            message = "You Won!!";
            messagecolor = "green";
            winSound.play();
            blackjackgame['wins']+=1;
        }
        else if (winner===DEALER){
            message = "You Lost!!";
            messagecolor = "red";
            lossSound.play();
            blackjackgame['losses']+=1;
        }
        else if(winner===undefined){
            message = "That's a Draw!!";
            messagecolor = "blue";
            blackjackgame['draws']+=1;
        }
        document.querySelector("#result").textContent = message;
        document.querySelector("#result").style.color = messagecolor;
        document.querySelector("#wins").textContent = blackjackgame['wins'];
        document.querySelector("#loses").textContent = blackjackgame['losses'];
        document.querySelector("#draws").textContent = blackjackgame['draws'];
        blackjackgame['isResult'] = true;
    }
}
