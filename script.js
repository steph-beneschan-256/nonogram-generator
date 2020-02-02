const tileSize = 100;
var tileRowWidth;
var tileColHeight;
const auto_string = " auto";
const cent_px_string = " 100px"

var tileStates;
var solutionStates;
var colHints;
var rowHints;
var mistakes;
var puzzleTimeElapsed;
var startTime;
var timerDisplayInterval;

//Keep track of how much time the player has spent on the puzzle

async function load(){
	await new Promise(r => setTimeout(r, 1000));
	fadeIn();
}

async function loadB(){
	var hSlider = document.getElementById("sizeSlider");
	var s = hSlider.value;
	tileRowWidth = s;
	tileColHeight = s;

	//Values for the board tiles in their current state
	//Each value is an array with 2 items:
	//0: 0 or 1; whether the tile is filled (1 for empty/white)
	//1: whether the tile should be clickable (0: no; 1: yes)
	tileStates = new Array(tileRowWidth*tileColHeight);
	for(var i=0; i<tileStates.length; i++){
		tileStates[i] = [0,1];
	}

	//The state that the board should be in
	solutionStates = new Array(tileRowWidth*tileColHeight);
	for(var i=0; i<solutionStates.length; i++){
		solutionStates[i] = Math.floor(Math.random()*1.99);
	}

	//Generate the hint numbers
	colHints = new Array(tileColHeight);
	for(var i=0; i<tileColHeight; i++){
		colHints[i] = "";
		var length=0;
		for(var j=0; j<tileRowWidth; j++){
			if(solutionStates[i+tileRowWidth*j]){
				length++;
			}
			else{
				if(length > 0){
					colHints[i] += length.toString() + ", ";
				}
				length = 0;
			}
		}
	if(length > 0){
		colHints[i] += length.toString() + ", ";
	}
	else if(colHints[i] == ""){
		colHints[i] += "0, ";
	}
	colHints[i] = colHints[i].slice(0, -2);
	}
	rowHints = new Array(tileRowWidth);
	for(var i=0; i<tileRowWidth; i++){
		rowHints[i] = "";
		var length=0;
		for(var j=0; j<tileColHeight; j++){
			if(solutionStates[i*tileColHeight+j]){
				length++;
			}
			else{
				if(length > 0){
					rowHints[i] += length.toString() + ", ";
				}
				length = 0;
			}
		}
	if(length > 0){
		rowHints[i] += length.toString() + ", ";
	}
	else if(rowHints[i] == ""){
		rowHints[i] += " 0, ";
	}
	rowHints[i] = rowHints[i].slice(0,-2);
	}

	//Track the number of mistakes made, rather than examine the entire
	//array each time a tile is filled/cleared
	var a=0;
	for(var i=0; i<solutionStates.length; i++){
		if(tileStates[i][0] != solutionStates[i]){
			a++;
		}
	}
	mistakes = a;	
	startTime = new Date().getTime();

	createBoard();
	drawHints();
	startTimer();

	var settings = document.getElementById("Settings");
	settings.innerHTML = ``;
}

function fadeIn(){
	document.getElementById("Header").style.opacity=1;
	document.getElementById("Settings").style.opacity=1;
}

function startTimer(){
	document.getElementById("TimerDisplay").style.opacity=1;
	timerDisplayInterval = setInterval(function(){
	var now = new Date().getTime();
	var elapsed = now - startTime;
	var minutes = Math.floor((elapsed % (1000 * 60 * 60))/(1000 * 60));
	var seconds = Math.floor((elapsed % (1000 * 60))/1000);
	document.getElementById("TimerDisplay").innerHTML = String(minutes).padStart(2, '0') + " : " + String(seconds).padStart(2, '0');
}, 1000);
}

function createBoard(){
	var board = document.getElementById("Board");
	//Must account for the border size of tiles
	board.style.width = ((tileSize+2)*tileRowWidth).toString() + "px";
	board.style.height = ((tileSize+2)*tileColHeight).toString() + "px";
	board.style.maxWidth = ((tileSize+2)*tileRowWidth).toString() + "px";
	board.style.maxHeight = ((tileSize+2)*tileColHeight).toString() + "px";

	board.style.gridAutoRows = auto_string.repeat(tileRowWidth);
	board.style.gridTemplateColumns = cent_px_string.repeat(tileColHeight);
	board.style.gridTemplateRows = cent_px_string.repeat(tileRowWidth);
		for(var i=0; i<(tileRowWidth*tileColHeight); i++){
		let template = `
			<style>
				.Tile${i}{
					position: relative;
					float: left;
					width: 100px;
					height: 100px;
					background-color: #FFFFFF;
					border-style: solid;
					border-color: #888888;
					border-width: 1px;
					opacity: 1;
			}
			</style>
			<div class="Tile${i}" id="Tile${i}" onclick="switchTile(${i});">
				<style>
					.ColorCircle${i}{
						position: absolute;
						margin: 0 auto;
						height: 0px;
						width: 0px;
						left:50px;
						top:50px;
						-ms-transform: translate(50%, 50%);	
						transform: translate(-50%, -50%);
						background-color: #000000;
						border-radius: 100px;
						transition: width 0.5s, height 0.5s, border-radius 0.5s, opacity 0s;
					
					}
				</style>
				<div class="ColorCircle${i}" id="ColorCircle${i}"></div>
				<div class="Peg" id="Peg"></div>		
			</div>
			`;
			document.getElementById('Board').innerHTML += template;
		}

}

function drawHints(){
	var hintRows = document.getElementById("RowHints");
	hintRows.style.gridAutoRows="100px".repeat(tileColHeight);

	for(var i=0; i<tileRowWidth; i++){
		var num = rowHints[i].toString();
		let template = `
		<style>
		.RowHint${i}{
			text-align: right;
		}
		</style>
		<div class="RowHint${i}">
			${num}
		</div>
		`;
		hintRows.innerHTML += template;
		}	

	var hintCols = document.getElementById("ColHints");
	hintCols.style.gridTemplateColumns=cent_px_string.repeat(tileColHeight);
	
	for(var i=0; i<tileColHeight; i++){
		var num = colHints[i].toString();
		var ip = i + 1;
		let template = `
		<style>
		.ColHint${i}{
			grid-column: ${ip};
			text-align: center;
			padding: 50px;
		}
		</style>
		<div class="ColHint${i}">
			${num}
		</div>
		`;
hintCols.innerHTML += template;
}
}

async function victory(){
	clearInterval(timerDisplayInterval);
	for(var i=0; i<tileStates.length; i++){
		//Tiles should no longer be clickable
		tileStates[i][1] = 0;
		if(tileStates[i][0]){
			var tile = document.getElementById("Tile"+i.toString());
			var cCircle = document.getElementById("ColorCircle"+i.toString());
			cCircle.style.opacity = 1;
			cCircle.style.backgroundColor = "#0000FF";
			cCircle.style.width = "100px";
			cCircle.style.height = "100px";
			await new Promise(r => setTimeout(r, 100));
			cCircle.style.borderRadius = "0px";
		}
	}
	let template = `Well done! Refresh for another puzzle.`;
	var subtitle = document.getElementById("Subtitle");
	subtitle.innerHTML = template;
	subtitle.style.opacity=1;

}

async function animateTile(index){
		var tileState = tileStates[index][0];
		var tile = document.getElementById("Tile"+index.toString());
		var cCircle = document.getElementById("ColorCircle"+index.toString());
		cCircle.style.opacity = 1;
		cCircle.style.width = "100px";
		cCircle.style.height = "100px";
		await new Promise(r => setTimeout(r, 100));
		cCircle.style.borderRadius = "0px";
		await new Promise(r => setTimeout(r, 500));
		tile.style.backgroundColor = (tileState ? "#000000" : "#FFFFFF");
		cCircle.style.width = "1px";
		cCircle.style.height = "1px";
		cCircle.style.borderRadius = "100px";
		cCircle.style.opacity = 0;
		cCircle.style.backgroundColor = (tileState ? "#FFFFFF" : "#000000");
		await new Promise(r => setTimeout(r, 100));

}

async function switchTile(index){
		if(!tileStates[index][1]){
			return;
		}
		tileStates[index][1] = 0;
		tileStates[index][0] = (tileStates[index][0] ? 0 : 1);
		await animateTile(index);
		mistakes = mistakes - ((tileStates[index][0] == solutionStates[index]) ? 1 : -1);
		if(mistakes == 0){
			victory();
		}
		else{
			tileStates[index][1] = 1;
		}
	}

