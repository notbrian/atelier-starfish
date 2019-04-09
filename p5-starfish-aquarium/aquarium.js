let bgImg;
let aquarium = []
let b = []

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
	setInterval(()=>{b.push(new Bubble())},100);
	
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
		
		if(aquarium[i].image === undefined) {
			texture(bgImg)
		} else {
			texture(aquarium[i].image);
		}
		aquarium[i].move()
		aquarium[i].draw()

		pop()
	}

	/// Bubbles
	for(let i = 0; i < b.length ;i++)
	{
      	translate(0,40);
		
		b[i].render(i);
		if(b[i])
		{	b[i].update();
			b[i].delete(b,i);
		}	
	}

	// star(0, 0, 400, 400, 6);


}

function star(x, y, radius1, radius2, npoints, seed) {
	let angle = TWO_PI / npoints;
	let halfAngle = angle / 2.0;


	beginShape();
	for (let a = 1; a < TWO_PI + angle * 2; a += angle) {

		let sx = (x + cos(a) * radius1) * ((noise(seed + frameCount*0.005)));
		let sy = (y + sin(a) * radius1) * ((noise(seed + frameCount*0.005)));
		// let sx = (x + cos(a) * radius1);
		// let sy = (y + sin(a) * radius1);
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
		this.seed = data.seed
		this.xpos= random(700,-700);
		this.ypos = random(700,-700);
		this.xspeed = random(0.3,1); // Speed of the shape
		this.yspeed = random(0.3,1); // Speed of the shape
		this.xdirection = Math.round(random(-1,1)); // Left or Right
		this.ydirection = Math.round(random(-1,1)); // Top to Bottom
		this.rad = (this.length + this.shape);
	}

  draw() {
		translate(this.xpos, this.ypos)
		rotate(frameCount * 0.001 )
		star(0, 0, this.shape, this.length, this.numLegs, this.seed);
	}

	move() {
		this.xpos = this.xpos + this.xspeed * this.xdirection;
		this.ypos = this.ypos + this.yspeed * this.ydirection;
	
		// Test to see if the shape exceeds the boundaries of the screen
		// If it does, reverse its direction by multiplying by -1
		if (this.xpos > width || this.xpos < -width) {
			this.xdirection *= -1;
		}
		if (this.ypos > height || this.ypos < -height) {
			this.ydirection *= -1;
		}
	}
	
	loadImage() {
		if (this.textureLink == "blank") {
			return
		}
		this.image = loadImage("https://cors-anywhere.herokuapp.com/" + this.textureLink, (img) => {
			console.log("Loaded!")
			img.loadPixels()
			for (let x = 0; x < img.width; x++) {
				for (let y = 0; y < img.height; y++) {

					let loc = (x + y * img.width) * 4;
					let r, g, b;
					r = img.pixels[loc];
					g = img.pixels[loc+1]
					b = img.pixels[loc+2]

					img.pixels[loc] = r + this.color[0]
					img.pixels[loc+1] = g + this.color[1]
					img.pixels[loc+2] = b + this.color[2]
					// pixel = [pixel[0] + this.color[0], pixel[1] + this.color[1], pixel[2] + this.color[2]]
					// pixel = [0,0,0,0]
					// img.pixels[x,y] = pixel
 				}
			}
			img.updatePixels();

		})
	}

}

class Bubble{

	constructor(){
		this.r=10;
		this.x = random(((-width/2)+(this.r/2)),((width/2)-(this.r/2)));
		this.y = random(50,100);
		this.angle = random(60);
		this.alpha = 90;
	}
	render(pos)
	{
		
		for(let i  = 0;i< b.length;i++)
		{
			if(this != b[i])
			{
				let dis = dist(this.x,this.y,b[i].x,b[i].y)
				let rs = this.r;
				if(dis < rs)
				{
					if(random(1) < 0.5)
					{
						b.splice(i,1);
					}
					else
					{
						b.splice(pos,1);
					}
				}
			}
		}
		
		noStroke();
		fill(110,222,255,this.alpha);
		ellipse(this.x,this.y,this.r);
		push();
		fill(255,this.alpha);
		noStroke();
      /// Design inside the bubble
		rect(this.x-(this.r/3),this.y-(this.r/3),(this.r/3)/2,(this.r/3));
		rect(this.x-(this.r/3),this.y-(this.r/3),(this.r/3),(this.r/3)/2);
		pop();
	}
	update()
	{
		this.alpha -= 0.3;
		let s = sin(this.angle);
		this.x = map(s,-1,1,(-width/2)+(this.r/2),(width/2)-(this.r/2));
		this.angle += 0.001;
		this.y -= random(0.5,5);
	}
	delete(b,i)
	{
		if(b[i].alpha < 0)
		{
			b.splice(i,1);
		}
	}
}


function mouseReleased() {
	console.log(mouseX, mouseY)
}