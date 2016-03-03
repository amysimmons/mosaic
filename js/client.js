function App() {
	this.file;
	this.image;
	this.grid = [];

	document.getElementById("uploadInput").onchange = function() {
		loadImage(this);
	};
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
}

function cropImage(){

}

document.addEventListener("DOMContentLoaded", function(event) { 
	var app = new App();
});
	
