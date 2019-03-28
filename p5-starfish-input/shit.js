var legSlider, shapeSlider, lengthSlider, rSlider, gSlider, bSlider

let starfish = {}

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(5);
  // strokeFill(0);
  legSlider = createSlider(5, 8, 5);
  legSlider.position(340, 35);
  shapeSlider = createSlider(30, 100, 50);
  shapeSlider.position(340, 65);
  lengthSlider = createSlider(100, 250, 150);
  lengthSlider.position(340, 95);
  rSlider = createSlider(0, 255, 100);
  rSlider.position(130, 35);
  gSlider = createSlider(0, 255, 100);
  gSlider.position(130, 65);
  bSlider = createSlider(0, 255, 100);
  bSlider.position(130, 95);
  searchInput = createInput();
  searchInput.position(125, 150);
}

function draw (){
  background(225)
  textSize(20);
  text('Phyiscal Attributes', 325, 30);
  text('Starfish Colour', 130, 30);
  text('Search for Texture', 120, 140);
  const r = rSlider.value();
  const b = gSlider.value();
  const g = bSlider.value();

    fill(r, g, b);

	//reposition 0,0 to the center of the canvas
	translate(width / 2, height / 2);


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
	rotate(1.2+cos(frameCount*0.08)*0.08)
	scale(1+cos(frameCount*0.05)*0.05)

//  star(x, y, inner vertex, outer vertex, no of legs)
	star(0, 0, shapeSlider.value(), lengthSlider.value(), legSlider.value());


	starfish = {
		color: [rSlider.value(), gSlider.value(), bSlider.value()],
		shape: shapeSlider.value(),
		length: lengthSlider.value(),
		numLegs: legSlider.value(),
		texture: searchInput.value()
	}
}

function star(x, y, radius1, radius2, npoints) {
	let angle = TWO_PI / npoints;
	let halfAngle = angle / 2.0;
	beginShape();

	for (let a = 1; a < TWO_PI; a += angle) {
	  let sx = x + cos(a) * radius2;
	  let sy = y + sin(a) * radius2;
	  vertex(sx, sy);   //Inner vertex
	  sx = x + cos(a + halfAngle) * radius1;
	  sy = y + sin(a + halfAngle) * radius1;
	  vertex(sx, sy); //outer vertex
	}
	endShape(CLOSE);
}