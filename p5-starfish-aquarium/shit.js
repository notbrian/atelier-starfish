let img;
let starfish = []
// let images = [];
let ready = false;

// Initialize Firebase
var config = {
	apiKey: "AIzaSyDkqNkD2L82vlNs9YdaMELDRamHNKjK6d0",
	authDomain: "starfish-1553611377495.firebaseapp.com",
	projectId: "starfish-1553611377495",
};

firebase.initializeApp(config);

var db = firebase.firestore();

function preload() {
	img = loadImage('Starfish Background.png');

}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	strokeWeight(5);


	db.collection("starfish")
    .onSnapshot(function() {
		loadStarfish()
    });

}

function draw() {

	background(225)
	textSize(20);

	textureMode(NORMAL)
	fill(255)
	texture(img);
	plane(width, height, 50, 50);

	for (let i = 0; i < starfish.length; i++) {
		push()
		// rotate(1.2+cos(frameCount*0.08)*0.08)
		// scale(1+cos(frameCount*0.05)*0.05)
		if(starfish[i].image === undefined) {
			texture(img)
		} else {
			texture(starfish[i].image);
		}
		star(0 + (200 * i), 0, starfish[i].shape, starfish[i].length, starfish[i].numLegs);

		pop()
	}

	// star(0, 0, 50, 150, 15);




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
			starfish.push(doc.data())
		});



		
	starfish.forEach((starfish) => {
		console.log("test")
		if (starfish.textureLink == "blank") {
			return
		}
		console.log(starfish)
		starfish.image = loadImage("https://cors-anywhere.herokuapp.com/" + starfish.textureLink)
	})

	});

	



	// starfish.forEach((starfish) => {
	// 	console.log("test")
	// 	if (starfish.textureLink == "blank") {
	// 		return
	// 	}
	// 	console.log(starfish)
	// 	starfish.image = loadImage("https://cors-anywhere.herokuapp.com/" + starfish.textureLink)
	// })


	// ready = true;
}