function App(){
	this.photo = null;
	this.grid = [];

	document.getElementById("uploadInput").onchange = function(){
		loadImage(this);
	};

	document.getElementById("toggleMosaicBtn").onclick = function(){
		if (this.innerHTML == "Show mosaic") {
			this.innerHTML = "Show original";
			generateMosaic();
		}
		else {
			this.innerHTML = "Show mosaic";
			renderOriginal();
		};
	}
}

//loads the photo onto a canvas and renders the toggle mosaic/photo button
function loadImage(input){
	var file = input.files[0];
	var canvas = document.getElementById('photo-canvas');
	var ctx = canvas.getContext('2d');
	var reader = new FileReader();

	reader.onload = function(e){
		var img = new Image();
		img.onload = function(){
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
		}
		img.src = event.target.result;
		App.photo = img;
	};

	reader.readAsDataURL(file);
	showToggleButton();
}

function showToggleButton(){
	document.getElementById("toggleMosaicBtn").className = "show";
}

function generateMosaic(){
	App.grid = slicePhoto();
	calculateAverageColors();
	generateMosaicPieces();
	renderMosaic();
}

//slices up the uploaded photo into tiles
function slicePhoto(){
	var canvas = document.getElementById('photo-canvas');
	var ctx = canvas.getContext('2d');
	
	var grid = [];
	var id = 0;
	var sx = 0;
	var sy = 0;
	var sw = TILE_WIDTH;
	var sh = TILE_HEIGHT;
	
	while(sy <= canvas.height - sh){
		var row = {tiles: [], visible: false};
		while (sx <= canvas.width - sw){
			var imageData = ctx.getImageData(sx, sy, sw, sh);
			var tile = {
				id: id,
				photoData: imageData,
				averageColor: null,
				mosaicPiece: null,
				loaded: false
			}
			row.tiles.push(tile);
			sx += sw;
			id++;
		}
		sy += sh;
		sx = 0;
		grid.push(row);
	}
	return grid;
}

//populates an average colour for each photo tile in the grid
function calculateAverageColors(){
	for (var i = 0; i < App.grid.length; i++) {
		var row = App.grid[i].tiles;
		for (var j = 0; j < row.length; j++) {
			var tile = row[j];
			//sets up arrays to calculate the average red, green, blue and alpha for each photo tile
			var r = [];
			var g = [];
			var b = [];
			// tile.photoData.data is a 1024 length array, with every four values being an r, g, b then a
			// this is why the loop increments k by 4 and asssigns the values internally 
			// 'a' values are skipped because we only need rgb
			for (var k = 0; k < tile.photoData.data.length; k += 4) {
				r.push(tile.photoData.data[k]);
				g.push(tile.photoData.data[k + 1]);
				b.push(tile.photoData.data[k + 2]);
			};

			function getAverage(values){
				var sum = values.reduce(function(a, b) { return a + b; });
				return Math.floor(sum/values.length)
			}

			function componentToHex(c) {
				var hex = c.toString(16);
				return hex.length == 1 ? "0" + hex : hex;
			}

			function rgbToHex(r, g, b) {
				return componentToHex(r) + componentToHex(g) + componentToHex(b);
			}

			tile.averageColor = rgbToHex(getAverage(r), getAverage(g), getAverage(b));
		};
	};
}

//creates a mosaic piece for each photo tile in the grid
function generateMosaicPieces(){
	for (var i = 0; i < App.grid.length; i++) {
		var row = App.grid[i];
		row.tiles.map(function(tile){
			var src = `/color/${tile.averageColor}`;
			var img = document.createElement('img');
			img.src = src;
			img.id = tile.id;

			img.onload=function(){
				tile.loaded = true; 
				checkIfRowLoaded(tile);
			}

			tile.mosaicPiece = img;
		});
	};
}

//renders the hidden mosaic in the browser from top to bottom
function renderMosaic(){
	var container = document.getElementById('mosaic-container');
	for (var i = 0; i < App.grid.length; i++) {	

		var row = App.grid[i];
		var tiles = App.grid[i].tiles;

		var div = document.createElement('div');
		div.className = "row hide";
	
		for (var j = 0; j < tiles.length; j++) {
			var tile = tiles[j];
			div.appendChild(tile.mosaicPiece);
		};
	
		container.appendChild(div);	
	};
 }

//checks if all mosaicPieces in a row are loaded before showing the row
function checkIfRowLoaded(tile){
	var row = getRow(tile);
	var domRow = getDomRow(tile);

	var loadValues = row.tiles.map(function(tile){return tile.loaded});

	if (loadValues.indexOf(false) == [-1]){
		row.visible = true;
		domRow.className = "row show";
	}
}

//gets the row in App.grid for a particular tile
function getRow(tile){
	var rows = document.getElementsByClassName('row');

	for (var i = 0; i < App.grid.length; i++) {
		var row = App.grid[i];
		var tileIds = row.tiles.map(function(tile){return tile.id});

		if(tileIds.indexOf(tile.id) >= 0){
			return row;
		}
	};
}

//gets the row in the dom for a particular tile
function getDomRow(tile){
	var rows = document.getElementsByClassName('row');
	var domRow;

	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		for (var x = 0; x < row.childNodes.length; x++){
			if (row.childNodes[x].id == tile.id) {
			domRow = row;
			}
		}
	}
	return domRow;
}

//renders the original photo removing rows from bottom to top
function renderOriginal(){
	var rows = document.getElementsByClassName('row');
	var i = rows.length-1;  

	function myLoop () {  
		var row = rows[i]  
		setTimeout(function () {    
			row.className = "row hide";          
			i--;                    
			if (i >= 0) {            
		 		myLoop();
			}
		}, 200)
	}

	myLoop(); 
}	

document.addEventListener("DOMContentLoaded", function(event) { 
	var app = new App();
});