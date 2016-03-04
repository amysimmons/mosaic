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
	//get average colour for each tile
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
	console.log(grid);
	return grid;
}

function calculateAverageColor(){


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
	
