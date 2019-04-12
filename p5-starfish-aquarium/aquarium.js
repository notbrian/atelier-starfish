// Aquarium Code
// Declaring variables

// Container for the background image
let bgImg;

// Array that contains all the starfish on the Firebase
const aquarium = [];

// Array that contains the bubble objects on the screen
const b = [];

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyDkqNkD2L82vlNs9YdaMELDRamHNKjK6d0',
  authDomain: 'starfish-1553611377495.firebaseapp.com',
  projectId: 'starfish-1553611377495',
};

firebase.initializeApp(config);

// Creates a reference to the Firebase database
const db = firebase.firestore();

// pre loads the background img
function preload() {
  bgImg = loadImage('Starfish Background.png');
}

function setup() {
  // Creates a WebGL canvas
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Adds a new bubble every 100ms
  setInterval(() => {
    b.push(new Bubble());
  }, 100);

  // Listener for the Firebase to update the aquarium with any new Starfish that get added
  // Also runs once the first time it is called
  db.collection('starfish')
    // Triggers when any change on the database happens
    .onSnapshot((snapshot) => {
      // Calls the docChanges method on the snapshot of the database to get the new starfish
      const changes = snapshot.docChanges();
      // Creates a new Starfish for each change and adds it to the aquarium
      changes.forEach((change) => {
        // The actual data, not the metadata of the data
        const data = change.doc.data();
        // Debug log
        console.log('TCL: setup -> data', data);
        // Creates a new Starfish instance from the base class
        const newStarfish = new Starfish(data);
        // Loads the Starfish image
        newStarfish.loadImage();
        // Pushes to the aquarium
        aquarium.push(newStarfish);
      });
    });
}

function draw() {
  background(225);
  textSize(20);
  // Normalizes texture UV values (0-1) instead of pixel space 
  textureMode(NORMAL);
  fill(255);
  // Sets the background image
  // P5 WebGl doesn't support image() so we gotta make a plane the size of the screen
  // Then apply the image as a texture
  texture(bgImg);
  plane(width, height, 50, 50);

  // Loops through the set of starfish in the aquarium
  for (let i = 0; i < aquarium.length; i += 1) {
    // Pushmatrix to apply transforms individually to starfish 
    push();
    scale(0.5);
    // If the image is undefined just set the texture to be the background image
    // Else set it to the loaded image under the .image property
    if (aquarium[i].image === undefined) {
      texture(bgImg);
    } else {
      texture(aquarium[i].image);
    }
    // Runs the move method under each starfish
    aquarium[i].move();
    // Runs the draw method under each starfish
    aquarium[i].draw();
    // Popmatrix to reset the transforms
    pop();
  }

  // Bubbles loop
  for (let i = 0; i < b.length; i += 1) {
    // Translate bubbles down near the edge of the screen
    translate(0, 40);
    // Calls the render method on each bubble
    b[i].render(i);
    // If the bubble exists, call the update and delete methods
    if (b[i]) {
      b[i].update();
      b[i].delete(b, i);
    }
  }
}

// Function to draw a starfish on the screen
// Requires a XY coordinate, inner and outer radius, number of points,
// and a random seed (can be any number)
function star(x, y, radius1, radius2, npoints, seed) {
  // The angle of the outer points (the pointy ends of the star)
  const angle = TWO_PI / npoints;
  // The angle of the inner points
  const halfAngle = angle / 2.0;
  // Begins recording verticies for a custom P5 shape
  beginShape();
  // Loop that draws all the legs for a star
  // a variable stores the current angle for the leg
  // loops until the angle is equal to TWO_PI + angle * 2
  // Still not completely sure why we needed to do the angle * 2 part
  // But it fixes the points not drawing the entire starfish
  for (let a = 1; a < TWO_PI + angle * 2; a += angle) {
    // Formula: Calculates the point on the first radius and then multiplies by a noise calculation
    // Noise calculation is the "breathing" animation of the Starfish
    // Seed is unique to every starfish
    let sx = (x + cos(a) * radius1) * ((noise(seed + frameCount * 0.005)));
    let sy = (y + sin(a) * radius1) * ((noise(seed + frameCount * 0.005)));

    // Draws the outer vertex for the first point of the leg
    // Last two arguments are the UV coordinates of the point required for texture mapping
    vertex(sx, sy, 0, 0 + (0.5 / (angle / a)), 1);
    
    // Calculates the inner point
    sx = x + cos(a + halfAngle) * radius2;
    sy = y + sin(a + halfAngle) * radius2;
    vertex(sx, sy, 0); // outer vertex
  }
  // Closes the shape after the loop is done
  endShape(CLOSE);
}

// Class definition for Starfish
class Starfish {
  // Constructor that loads every property from a data object
  constructor(data) {
    this.color = data.color;
    this.length = data.length;
    this.numLegs = data.numLegs;
    this.searchTerm = data.searchTerm;
    this.shape = data.shape;
    // URL for the texture that will be loaded in .loadImage()
    this.textureLink = data.textureLink;
    this.seed = data.seed;
    this.xpos = random(700, -700);
    this.ypos = random(700, -700);
    this.xspeed = random(0.2, 1); // Speed of the shape
    this.yspeed = random(0.2, 1); // Speed of the shape
    this.xdirection = (random(-1, 1).toFixed(2)); // Left or Right
    this.ydirection = (random(-1, 1).toFixed(2)); // Top to Bottom
    this.rad = (this.length + this.shape);
  }
  // Draw function
  draw() {
    translate(this.xpos, this.ypos);
    rotate(frameCount * this.seed / 1000000);
    star(0, 0, this.shape, this.length, this.numLegs, this.seed);
  }
  // Move function
  move() {
    // New XY position of the starfish
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
  // Loads the image for each Starfish
  loadImage() {
    // If textureLink has no texture, don't bother trying to load the image
    if (this.textureLink === 'blank') {
      return;
    }
    // Sets the image property to the p5.image object that gets loaded from the loadImage()
    // We use a cors-anywhere proxy to bypass CORS errors and not have to setup a server
    this.image = loadImage(`https://cors-anywhere.herokuapp.com/${this.textureLink}`, (img) => {
      // This next loop applies a color filter affect to the entire image
      console.log('Loaded!');
      // Loads the pixels of the image into a pixels array
      img.loadPixels();
      for (let x = 0; x < img.width; x += 1) {
        for (let y = 0; y < img.height; y += 1) {
          // Pixel space to array space conversion
          // Credits go to Daniel Shiffman
          const loc = (x + y * img.width) * 4;
          const r = img.pixels[loc];
          const g = img.pixels[loc + 1];
          const b = img.pixels[loc + 2];
          // Adds the filter value to the pixel in question
          // Interesting thing to note: The pixels array is a Uint8ClampedArray,
          // which means it will clamp the values to 0-255. Don't have to worry about overflows!
          img.pixels[loc] = r + this.color[0];
          img.pixels[loc + 1] = g + this.color[1];
          img.pixels[loc + 2] = b + this.color[2];
        }
      }
      // Updates the image with the new pixels array
      img.updatePixels();
    });
  }
}

// Bubble class definition
class Bubble {
  // Constructor to generate properties
  constructor() {
    this.r = 10;
    this.x = random(((-width / 2) + (this.r / 2)), ((width / 2) - (this.r / 2)));
    this.y = random(50, 100);
    this.angle = random(60);
    this.alpha = 90;
  }
  // Render function
  render(pos) {
    for (let i = 0; i < b.length; i++) {
      if (this != b[i]) {
        const dis = dist(this.x, this.y, b[i].x, b[i].y);
        const rs = this.r;
        if (dis < rs) {
          if (random(1) < 0.5) {
            b.splice(i, 1);
          } else {
            b.splice(pos, 1);
          }
        }
      }
    }

    noStroke();
    fill(110, 222, 255, this.alpha);
    ellipse(this.x, this.y, this.r);
    push();
    fill(255, this.alpha);
    noStroke();
    // / Design inside the bubble
    rect(this.x - (this.r / 3), this.y - (this.r / 3), (this.r / 3) / 2, (this.r / 3));
    rect(this.x - (this.r / 3), this.y - (this.r / 3), (this.r / 3), (this.r / 3) / 2);
    pop();
  }
  update() {
    this.alpha -= 0.3;
    const s = sin(this.angle);
    this.x = map(s, -1, 1, (-width / 2) + (this.r / 2), (width / 2) - (this.r / 2));
    this.angle += 0.001;
    this.y -= random(0.5, 5);
  }
  delete(b, i) {
    if (b[i].alpha < 0) {
      b.splice(i, 1);
    }
  }
}

// Debug mouse released function
function mouseReleased() {
  console.log(mouseX, mouseY);
}
