var legSlider, shapeSlider, lengthSlider, rSlider, gSlider, bSlider

let starfish = {}
let img;
let images = [];
let ready = false;

function preload() {
	img = loadImage('meme.png');
}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
  strokeWeight(5);
  // strokeFill(0);
  legSlider = createSlider(5, 8, 5);
  legSlider.position(900, 260);
  shapeSlider = createSlider(30, 100, 50);
  shapeSlider.position(900, 290);
  lengthSlider = createSlider(100, 250, 150);
	lengthSlider.position(900, 320);
	
  rSlider = createSlider(0, 255, 100);
  rSlider.position(130, 260);
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
		img = loadImage("https://cors-anywhere.herokuapp.com/" + images[0]);
		ready = false;
  }
	background(225)
  textSize(20);
  const r = rSlider.value();
  const b = gSlider.value();
  const g = bSlider.value();
	// noStroke()
	fill(r, g, b);

	//reposition 0,0 to the center of the canvas
	// translate(width / 2, height / 2);

		// var fr = 2*(frameCount /100);

	// console.log(fr)
	// if (fr > 1){
	// 	console.log("test");
	// 	scale (1*fr);
	// 		}
	// if(fr >1.2){
	// 	frameCount = 0;
	// 	scale (1/fr);
	// }
	
	//     function         speed  distance
	// rotate(1.2+cos(frameCount*0.08)*0.08)
	// scale(1+cos(frameCount*0.05)*0.05)

//  star(x, y, inner vertex, outer vertex, no of legs)
	ambientLight(255)

	// fill(0,0,0,255)
	textureMode(NORMAL)
	texture(img);
	star(0, 0, shapeSlider.value(), lengthSlider.value(), legSlider.value());
	starfish = {
		color: [rSlider.value(), gSlider.value(), bSlider.value()],
		shape: shapeSlider.value(),
		length: lengthSlider.value(),
		numLegs: legSlider.value(),
		texture: searchInput.value()
	}

	// for (let i = 0; i < 5; i++) {
	// 	for(let h = 0; h < 3; h++) {
	// 		// image(img, -200 + (60 * i), -100 + (60 * h), 50, 50)
	// 	}
	// }

	// fill(0,0,0,0)
	// star(0, 0, shapeSlider.value(), lengthSlider.value(), legSlider.value());

}

function star(x, y, radius1, radius2, npoints) {
	let angle = TWO_PI / npoints;
	let halfAngle = angle / 2.0;
	beginShape();
	for (let a = 1; a < TWO_PI; a += angle) {

	  let sx = x + cos(a) * radius1;
	  let sy = y + sin(a) * radius1;
	  vertex(sx, sy, 0 + (0.5/(angle/a)),1);   //Inner vertex
	  sx = x + cos(a + halfAngle) * radius2;
		sy = y + sin(a + halfAngle) * radius2;
		vertex(sx, sy); //outer vertex
	}


	endShape(CLOSE);
	
}

function requestImage(search = "hot dog") {
	let url = 'https://www.googleapis.com/customsearch/v1?q=' + search + "&fileType=jpg,png&cx=005973051980809555555%3Azmae5bkt_wu&imgType=clipart&num=4&safe=active&searchType=image&key=AIzaSyDT4P_KnUkdDl1M26qpUZt27-E50-xpJr8";
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
    searchInput.value("")
  }
}
