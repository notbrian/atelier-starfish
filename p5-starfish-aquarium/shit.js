let bgImg;
let aquarium = []

// Initialize Firebase
var config = {
	apiKey: "AIzaSyDkqNkD2L82vlNs9YdaMELDRamHNKjK6d0",
	authDomain: "starfish-1553611377495.firebaseapp.com",
	projectId: "starfish-1553611377495",
};

firebase.initializeApp(config);

var db = firebase.firestore();


function preload() {
	bgImg = loadImage('Starfish Background.png');

}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	
	// loadStarfish()

	db.collection("starfish")
    .onSnapshot((snapshot) =>{
				let changes = snapshot.docChanges();
				changes.forEach(change => {
					data = change.doc.data()
					console.log("TCL: setup -> data", data)
					let newStarfish = new Starfish(data)
					newStarfish.loadImage()
					aquarium.push(newStarfish)
				})
		})

}

function draw() {
	background(225)
	textSize(20);
	textureMode(NORMAL)
	fill(255)
	texture(bgImg);
	plane(width, height, 50, 50);

	for (let i = 0; i < aquarium.length; i++) {
		push()
		scale(0.5)
		translate(-width/2,0)

		if(aquarium[i].image === undefined) {
			texture(bgImg)
		} else {
			texture(aquarium[i].image);
		}

		star(200 * i, 200, aquarium[i].shape, aquarium[i].length, aquarium[i].numLegs);

		pop()
	}

}

function star(x, y, radius1, radius2, npoints) {
	let angle = TWO_PI / npoints;
	let halfAngle = angle / 2.0;

	beginShape();
	for (let a = 1; a < TWO_PI + angle * 2; a += angle) {

		let sx = x + cos(a) * radius1;
		let sy = y + sin(a) * radius1;
		vertex(sx, sy, 0, 0 + (0.5 / (angle / a)), 1); //Inner vertex
		sx = x + cos(a + halfAngle) * radius2;
		sy = y + sin(a + halfAngle) * radius2;
		vertex(sx, sy, 0); //outer vertex
	}


	endShape(CLOSE);

}

function loadStarfish(params) {
	db.collection("starfish").get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			console.log(`${doc.id} => ${doc.data()}`);
			aquarium.push(doc.data())
		});



		
	aquarium.forEach((starfish) => {
		console.log("test")
		if (starfish.textureLink == "blank") {
			return
		}
		console.log(starfish)
		starfish.image = loadImage("https://cors-anywhere.herokuapp.com/" + starfish.textureLink)
	})

	});

}

class Starfish {

  constructor(data) {
		this.color = data.color
		this.length = data.length
		this.numLegs = data.numLegs
		this.searchTerm = data.searchTerm
		this.shape = data.shape
		this.textureLink = data.textureLink

	}

  draw(offset) {
		star(200 * offset, 200, this.shape, this.length, this.numLegs);
	}
	
	loadImage() {
		if (this.textureLink == "blank") {
			return
		}
		this.image = loadImage("https://cors-anywhere.herokuapp.com/" + this.textureLink)
	}

}
