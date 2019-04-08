var legSlider, shapeSlider, lengthSlider, rSlider, gSlider, bSlider, button

let starfish = {}
let img;
let originalImg;
let images = ["blank"];
let ready = false;
let lastSearch = ""


// Initialize Firebase
var config = {
	apiKey: "AIzaSyDkqNkD2L82vlNs9YdaMELDRamHNKjK6d0",
	authDomain: "starfish-1553611377495.firebaseapp.com",
	projectId: "starfish-1553611377495",
};

firebase.initializeApp(config);

var db = firebase.firestore();



function preload() {
	img = loadImage('meme.png');
}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
  strokeWeight(5);
  // strokeFill(0);
  legSlider = createSlider(5, 15, 5);
  legSlider.position(900, 260);
  shapeSlider = createSlider(50, 100, 50);
  shapeSlider.position(900, 290);
  lengthSlider = createSlider(150, 250, 150);
	lengthSlider.position(900, 320);
	button = createButton('Send to Aquarium');
  button.position(900, 350);
  button.mousePressed(upload);
	
  rSlider = createSlider(0, 255, 100);
	rSlider.position(130, 260);
	rSlider.mouseReleased(colorImage)
  gSlider = createSlider(0, 255, 100);
  gSlider.position(130, 290);
  bSlider = createSlider(0, 255, 100);
  bSlider.position(130, 320);
  searchInput = createInput();
	searchInput.position(125, 400);
	searchInput.input(searchHandler)


	createP('Starfish Colour').position(130,210);
	createP('Search for Texture').position(130,350);
	createP('Physical Attributes').position(900, 210);

	
}

function draw (){

	if(ready) {
		img = loadImage("https://cors-anywhere.herokuapp.com/" + images[0], function() {
			img.loadPixels()
			originalImg = Uint8ClampedArray.from(img.pixels);

			for (let x = 0; x < img.width; x++) {
				for (let y = 0; y < img.height; y++) {
	
					let loc = (x + y * img.width) * 4;
					let r, g, b;
					r = img.pixels[loc];
					g = img.pixels[loc+1]
					b = img.pixels[loc+2]
	
					img.pixels[loc] = r + rSlider.value();
					img.pixels[loc+1] = g + gSlider.value();
					img.pixels[loc+2] = b +  bSlider.value();
				 }
			}
			img.updatePixels();
			
		});
		ready = false;
	}
	
	background(225)
  textSize(20);
  // const r = rSlider.value();
  // const b = gSlider.value();
  // const g = bSlider.value();
	// noStroke()

	//reposition 0,0 to the center of the canvas
	// translate(width / 2, height / 2);

	
	//     function         speed  distance
	rotate(1.2+cos(frameCount*0.08)*0.08)
	scale(1+cos(frameCount*0.05)*0.05)

//  star(x, y, inner vertex, outer vertex, no of legs)
	ambientLight(255)
	textureMode(NORMAL)
	fill(255)
	texture(img);
	tint(0)
	star(0, 0, shapeSlider.value(), lengthSlider.value(), legSlider.value());
	

	
	starfish = {
		searchTerm: lastSearch,
		numLegs: legSlider.value(),
		shape: shapeSlider.value(),
		length: lengthSlider.value(),
		color: [rSlider.value(), gSlider.value(), bSlider.value()],
		textureLink: images[0],
		seed: random(-999, 999)
	}





}

function star(x, y, radius1, radius2, npoints) {
	let angle = TWO_PI / npoints;
	let halfAngle = angle / 2.0;

	beginShape();
	for (let a = 1; a < TWO_PI + angle * 2; a += angle) {

		let sx = (x + cos(a) * radius1) * ((noise(frameCount*0.01)));
		let sy = (y + sin(a) * radius1) * ((noise(frameCount*0.01)));
		vertex(sx, sy, 0, 0 + (0.5 / (angle / a)), 1); //Inner vertex
	  sx = x + cos(a + halfAngle) * radius2;
		sy = y + sin(a + halfAngle) * radius2;
		vertex(sx, sy, 0); //outer vertex
	}


	endShape(CLOSE);
	
}

function requestImage(search = "hot dog") {
	// let url = 'https://www.googleapis.com/customsearch/v1?q=' + search + "&fileType=jpg,png&cx=005973051980809555555%3Azmae5bkt_wu&imgType=clipart&num=4&safe=active&searchType=image&key=AIzaSyDT4P_KnUkdDl1M26qpUZt27-E50-xpJr8";
	// let url = 'https://www.googleapis.com/customsearch/v1?q=' + search + "&fileType=jpg,png&cx=005973051980809555555%3Azmae5bkt_wu&num=4&searchType=image&key=AIzaSyDT4P_KnUkdDl1M26qpUZt27-E50-xpJr8";
	let url = 'https://www.googleapis.com/customsearch/v1?q=' + search + "&fileType=jpg,png&cx=005973051980809555555%3Azmae5bkt_wu&num=4&safe=active&searchType=image&key=AIzaSyDT4P_KnUkdDl1M26qpUZt27-E50-xpJr8";

	httpDo(
		url,
		{
			method: 'GET',
		},
		function(res) {
			response = JSON.parse(res)
			console.log(response)
			for (let i = 0; i < 4; i++) {
				images[i] = response.items[i].link
			}
			
			ready = true;
		}
	);

}

function searchHandler() {
  console.log(this.value())
}

function keyPressed() {
  if(key === "Enter") {
		requestImage(searchInput.value())
		lastSearch = searchInput.value()
    searchInput.value("")
  }
}


function upload() {
	db.collection("starfish").add(starfish)
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});
}


function colorImage() {
	img.loadPixels();
	img.pixels = Uint8ClampedArray.from(originalImg)
	console.log('af')
	for (let x = 0; x < img.width; x++) {
		for (let y = 0; y < img.height; y++) {

			let loc = (x + y * img.width) * 4;
			let r, g, b;
			r = img.pixels[loc];
			g = img.pixels[loc+1]
			b = img.pixels[loc+2]

			img.pixels[loc] = r + rSlider.value();
			img.pixels[loc+1] = g + gSlider.value();
			img.pixels[loc+2] = b +  bSlider.value();
		 }
	}
	img.updatePixels();

}