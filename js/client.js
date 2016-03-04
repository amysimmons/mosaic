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
	var canvas = document.getElementById('photo-mosaic-canvas');
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
	//fetch new image for each tile
	//render grid from top to bottom
}

function sliceImage(){
	var canvas = document.getElementById('photo-mosaic-canvas');
	var ctx = canvas.getContext('2d');
	
	var sx = 0;
	var sy = 0;
	var sw = TILE_WIDTH;
	var sh = TILE_HEIGHT;
	
	var id = 0;
	var grid = [];

	while(sy <= canvas.height){
		var row = [];
		while (sx <= canvas.width){
			var imageData = ctx.getImageData(sx, sy, sw, sh);
			var tile = {
				id: id,
				imageData: imageData,
				averageColor: null,
				image: null
			}
			row.push(tile);
			sx += sw;
			id++;
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
			    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
			}

			tile.averageColor = rgbToHex(rAvg, gAvg, bAvg);

		};

	};
	
}

function fetchTimeImage(){


}

function renderMosaic(){

}

function renderOriginal(){

}

document.addEventListener("DOMContentLoaded", function(event) { 
	var app = new App();
});
	
