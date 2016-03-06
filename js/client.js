function App() {
	this.file;
	this.image;
	this.grid = [];

	document.getElementById("uploadInput").onchange = function() {
		loadImage(this);
	};

	document.getElementById("toggleMosaicBtn").onclick = function(){
	    if (this.innerHTML=="Show mosaic") {
	    	this.innerHTML = "Show original";
	    	generateMosaic();
	    }
		else {
			this.innerHTML = "Show mosaic";
			renderOriginal();
		};
	}
}

function loadImage(input){
	App.file = input.files[0];
	var canvas = document.getElementById('photo-canvas');
	var ctx = canvas.getContext('2d');
   	var reader = new FileReader();

    reader.onload = function(e) {
    	var img = new Image();
    	img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        }
        img.src = event.target.result;
        App.image = img;
    };

    reader.readAsDataURL(App.file);
    showToggleButton();
}

function showToggleButton(){
	document.getElementById("toggleMosaicBtn").className = "show";
}

function generateMosaic(){
	App.grid = sliceImage();
	calculateAverageColors();
	fetchTiles();
	renderMosaic();
}

function sliceImage(){
	var canvas = document.getElementById('photo-canvas');
	var ctx = canvas.getContext('2d');
	
	var sx = 0;
	var sy = 0;
	var sw = TILE_WIDTH;
	var sh = TILE_HEIGHT;
	
	var grid = [];

	while(sy <= canvas.height){
		var row = [];
		while (sx <= canvas.width){
			var imageData = ctx.getImageData(sx, sy, sw, sh);
			var tile = {
				imageData: imageData,
				averageColor: null,
				image: null,
				sx: sx,
				sy: sy,
				sw: sw,
				sh: sh
			}
			row.push(tile);
			sx += sw;
		}
		sy += sh;
		sx = 0;
		grid.push(row);
	}
	return grid;
}

function calculateAverageColors(){
	var grid = App.grid;

	for (var i = 0; i < grid.length; i++) {
		
		var row = grid[i];

		for (var j = 0; j < row.length; j++) {

			var tile = row[j];

			var r = [];
			var g = [];
			var b = [];
			var a = [];

			for (var k = 0; k < tile.imageData.data.length; k += 4) {
				
				r.push(tile.imageData.data[k]);
				g.push(tile.imageData.data[k + 1]);
				b.push(tile.imageData.data[k + 2]);
				a.push(tile.imageData.data[k + 3]);

			};

			var rSum = r.reduce(function(a, b) { return a + b; });
			var rAvg = Math.floor(rSum/r.length);

			var gSum = g.reduce(function(a, b) { return a + b; });
			var gAvg = Math.floor(gSum/g.length);

			var bSum = b.reduce(function(a, b) { return a + b; });
			var bAvg = Math.floor(bSum/b.length);

			var aSum = a.reduce(function(a, b) { return a + b; });
			var aAvg = Math.floor(aSum/a.length);

			function componentToHex(c) {
			    var hex = c.toString(16);
			    return hex.length == 1 ? "0" + hex : hex;
			}

			function rgbToHex(r, g, b) {
			    return componentToHex(r) + componentToHex(g) + componentToHex(b);
			}

			tile.averageColor = rgbToHex(rAvg, gAvg, bAvg);

		};

	};
	
}

function fetchTiles(){
	for (var i = 0; i < App.grid.length; i++) {
		
		var row = App.grid[i];

		row.map(function(tile){
			var hex = tile.averageColor;
			var src = `/color/${hex}`;
			var image = document.createElement('img');
			image.src = src;
			//image.width = tile.sw;
			//image.height = tile.sh;
			tile.image = image;
		});
	};
}

function renderMosaic(){

	var row = App.grid[0];
 	renderRowOffscreen(row, renderRowOnscreen);
 }

function renderRowOnscreen(offscreenCanvas){
	var onscreenCanvas = document.getElementById('mosaic-canvas');
	var onscreenContext = onscreenCanvas.getContext('2d');

	var offscreenContext = offscreenCanvas.getContext('2d');

	var image = offscreenContext.getImageData(0,0,offscreenCanvas.width,offscreenCanvas.height); 

	onscreenCanvas.width = image.width;
	onscreenCanvas.height = image.height;
	onscreenContext.putImageData(image, 0,0);
}

function renderRowOffscreen(row, renderRowOnscreen){

	var offscreenCanvas = document.createElement('canvas');
	var offscreenContext = offscreenCanvas.getContext('2d');

	var tile = row[0];
	var xPos = tile.sx;
	var image = tile.image;

	image.onload = function(){
		offscreenCanvas.width = row.length * TILE_WIDTH;
		offscreenCanvas.height = TILE_HEIGHT;
		offscreenContext.drawImage(image, xPos, 0);
		renderRowOnscreen(offscreenCanvas)
	};
	
};

function renderOriginal(){


}

document.addEventListener("DOMContentLoaded", function(event) { 
	var app = new App();
});


/*


           
 var onscreenCanvas = document.getElementById('mosaic-canvas')
 var ctx = onscreenCanvas.getContext('2d');
 var tile = App.grid[0][0];
 var image = tile.image;

 image.onload = function(){
  onscreenCanvas.width = image.width;
  onscreenCanvas.height = image.height;
   ctx.drawImage(image, 0,0);
 }

*/
	
