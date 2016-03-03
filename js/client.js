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
	    	renderMosaic();
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
            console.log(ctx.getImageData(50, 50, 100, 100));
            debugger
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

function renderMosaic(){

}


function sliceImage(){

}

function calculateAverageColor(){


}

function fetchMosaicTile(){


}

function renderOriginal(){

}

document.addEventListener("DOMContentLoaded", function(event) { 
	var app = new App();
});
	
