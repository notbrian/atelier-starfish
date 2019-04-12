// Initalize global variables
// UI Sliders
let legSlider;
let shapeSlider;
let lengthSlider;
let rSlider;
let gSlider;
let bSlider;
let button;

// Values of the current Starfish on the screen
let starfish = {};
// Current texture
let img;
// Original image for the texture before any colorization
let originalImg;
// Array that stores the 4 image results we get back from google images
const images = ['blank'];
// Boolean variable that tells the draw loop when the google search is completed
// Then it can load the images
let ready = false;
// Last thing a person searched, used in the starfish object
// Originally this property was going to be used for a naming system
let lastSearch = '';
let bgImg;


// Initialize Firebase
const config = {
  apiKey: 'AIzaSyDkqNkD2L82vlNs9YdaMELDRamHNKjK6d0',
  authDomain: 'starfish-1553611377495.firebaseapp.com',
  projectId: 'starfish-1553611377495',
};

firebase.initializeApp(config);

const db = firebase.firestore();

function preload() {
  // Preloads a basic starfish image to use as a texture on launch
  img = loadImage('starfish.jpg', () => {
    img.loadPixels();
    // Duplicates the image pixel array
    originalImg = Uint8ClampedArray.from(img.pixels);
  });
  // Loads the background
  bgImg = loadImage('ocean.png');
}

function setup() {
  // Creates a WebGL canvas
  createCanvas(windowWidth, windowWidth / 2, WEBGL);
  strokeWeight(5);

  // Creates a div to hold all the UI elements with an id of "grid"
  // Needed to be done in the setup function because the UI would end up being above the canvas
  // Probably a better way to do this but I was in a rush ok
  createDiv(`<div id="attributes"></div>
	<div id="texture"></div>
	<div id="color"></div>`).id('grid');

  // Creates text and parents it to the attributes div
  createP('Physical Attributes').parent('attributes');
  // More text
  createP('Number of Legs').parent('attributes');

  // Creates a slider ranging from 5 - 15 and randomizes the starting value
  // Number of legs slider
  legSlider = createSlider(5, 15, random(5, 8));
  // More parenting
  legSlider.parent('attributes').class('slider');

  // Inner radius slider
  createP('Inner Radius').parent('attributes');
  shapeSlider = createSlider(50, 100, random(50, 100));
  shapeSlider.parent('attributes').class('slider');

  // Outer radius slider
  createP('Outer Radius').parent('attributes');
  lengthSlider = createSlider(150, 250, random(150, 250));
  lengthSlider.parent('attributes').class('slider');

  // Red color slider
  createP('Starfish Colour').parent('color');
  createP('Red').parent('color');
  rSlider = createSlider(0, 255, 0);
  // rSlider.position(130, 260);
  rSlider.parent('color').class('slider').id('red');
  // Run the function that recolorizes the image when the mouse is released or touch event ended
  rSlider.mouseReleased(sliderHandler);
  rSlider.touchEnded(sliderHandler);
  // Green color slider
  createP('Green').parent('color');
  gSlider = createSlider(0, 255, 0);
  gSlider.parent('color').class('slider').id('green');
  gSlider.mouseReleased(sliderHandler);
  gSlider.touchEnded(sliderHandler);
  // Blue color slider
  createP('Blue').parent('color');
  bSlider = createSlider(0, 255, 0);
  bSlider.parent('color').class('slider').id('blue');
  bSlider.mouseReleased(sliderHandler);
  bSlider.touchEnded(sliderHandler);

  // Creates the text box for searching textures
  createP('Search for Texture <br> (Anything you want!)').parent('texture');
  searchInput = createInput();
  searchInput.parent('texture');
  searchInput.class('textureInput');

  // Creates the submit button
  button = createButton('Send to Aquarium');
  button.parent('texture');
  button.mousePressed(upload);
  button.class('send');
}

function draw() {
  textureMode(NORMAL);
  fill(255);
  // Creates the background plane
  texture(bgImg);
  plane(width, height, 50, 50);
  scale(1.2);

  // If ready is true, run imageLoad only once
  if (ready) {
    imageLoad(0);
    ready = false;
  }

  // Animation
  rotate(1.2 + cos(frameCount * 0.08) * 0.08);
  scale(1 + cos(frameCount * 0.05) * 0.05);

  // Basic Lighting
  ambientLight(255);
  // Normalizes texture positions
  textureMode(NORMAL);
  fill(255);
  texture(img);
  // Draws a star at 0,0 passing values of the sliders
  star(0, 0, shapeSlider.value(), lengthSlider.value(), legSlider.value());

  // Updates the starfish object with current state
  starfish = {
    searchTerm: lastSearch,
    numLegs: legSlider.value(),
    shape: shapeSlider.value(),
    length: lengthSlider.value(),
    color: [rSlider.value(), gSlider.value(), bSlider.value()],
    // URL of the texture which will get loaded individually on the aquarium side
    textureLink: images[0],
    // Random unique value for the starfish
    seed: random(-999, 999),
  };
}

// Function that loads images
// Takes an index value
function imageLoad(index = 0) {
  // Loads an image from the web
  img = loadImage(`https://cors-anywhere.herokuapp.com/${images[index]}`, () => {
    img.loadPixels();
    // Duplicates the original state
    originalImg = Uint8ClampedArray.from(img.pixels);
    // Colors the current img
    colorImage();
  }, (err) => {
    // Error handler
    // Some images on the web still arent accessible through the cors proxy
    console.log(err);
    console.log('loading next image...');
    // If we've gone through the entire array of images and we still can't load a valid image,
    // Just load the meme.png as a texture
    if (index > 3) {
      img = loadImage('meme.png');
      return;
    }
    // Recursive function
    // Goes through the entire images array until it finds a loadable image
    imageLoad(index + 1);
  });
}

// Draws a star
// Further comments can be found in aquarium.js
// aint nobody got time fo dat
function star(x, y, radius1, radius2, npoints) {
  const angle = TWO_PI / npoints;
  const halfAngle = angle / 2.0;

  beginShape();
  for (let a = 1; a < TWO_PI + angle * 2; a += angle) {
    let sx = (x + cos(a) * radius1) * ((noise(frameCount * 0.01)));
    let sy = (y + sin(a) * radius1) * ((noise(frameCount * 0.01)));
    vertex(sx, sy, 0, 0 + (0.5 / (angle / a)), 1); // Inner vertex
    sx = x + cos(a + halfAngle) * radius2;
    sy = y + sin(a + halfAngle) * radius2;
    vertex(sx, sy, 0); // outer vertex
  }
  endShape(CLOSE);
}

// Function that queries the google search API and gets the top 4 images
function requestImage(search = 'hot dog') {
  // HTTP URL query that we're gonna call
  const url = `https://www.googleapis.com/customsearch/v1?q=${search}&fileType=jpg,png&cx=005973051980809555555%3Azmae5bkt_wu&num=4&safe=active&searchType=image&key=AIzaSyDT4P_KnUkdDl1M26qpUZt27-E50-xpJr8`;
  // Performs a get request to that URL
  httpDo(
    url, {
      method: 'GET',
    },
    (res) => {
      const response = JSON.parse(res);
      console.log(response);
      // Stores the first four URLs into the images array
      for (let i = 0; i < 4; i++) {
        images[i] = response.items[i].link;
      }
      // Tells the draw loop the data has loaded
      ready = true;
    },
  );
}

// Function called when a key is pressed
function keyPressed() {
  // If its the enter key, assume its the search input
  if (key === 'Enter') {
    // Requests top 4 images of this search value on google
    requestImage(searchInput.value());
    // Stores the value into lastSearch before we wipe the input box
    lastSearch = searchInput.value();
    searchInput.value('');
  }
}

// Uploads the current starfish to the Firebase
function upload() {
  db.collection('starfish').add(starfish)
    .then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
}

// Colors the image
// Detailed documentation in aquarium.js
function colorImage() {
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      const loc = (x + y * img.width) * 4;
      let r;
      let g;
      let
        b;
      r = img.pixels[loc];
      g = img.pixels[loc + 1];
      b = img.pixels[loc + 2];
      img.pixels[loc] = r + rSlider.value();
      img.pixels[loc + 1] = g + gSlider.value();
      img.pixels[loc + 2] = b + bSlider.value();
    }
  }
  img.updatePixels();
}

// Function called when a color slider is released
function sliderHandler() {
  console.log('test');
  for (let x = 0; x < img.width; x += 1) {
    for (let y = 0; y < img.height; y += 1) {
      const loc = (x + y * img.width) * 4;
      // Takes the original image values and modifies them
      // Otherwise, you would be adding the filter on top of itself.
      img.pixels[loc] = originalImg[loc] + rSlider.value();
      img.pixels[loc + 1] = originalImg[loc + 1] + gSlider.value();
      img.pixels[loc + 2] = originalImg[loc + 2] + bSlider.value();
    }
  }
  img.updatePixels();
}
