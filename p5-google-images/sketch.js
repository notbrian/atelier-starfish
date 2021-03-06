/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */

// This file is the prototype to test if P5 + Google Images would actually work
let response;
let ready = false;
let images = [];
let searchInp;

function setup() {
  createCanvas(800, 480);
  searchInp = createInput('');
  searchInp.input(searchHandler);
}

function draw() {
  background(255);
  translate(width / 2, height / 2);
  if (ready) {
    imageMode(CENTER);

    for (let i = 0; i < images.length; i += 1) {
      image(images[i], -500 + (200 * (i + 1)), 0, 150, 150);
    }
  }
}

function shuffleImages() {
  for (let i = 0; i < images.length; i += 1) {
    images = images.unshift(images.pop());
  }
}

function requestImage(search = 'hot dog') {
  const url = `https://www.googleapis.com/customsearch/v1?q=${search}&fileType=jpg,png&cx=005973051980809555555%3Azmae5bkt_wu&imgType=clipart&num=4&safe=active&searchType=image&key=AIzaSyDT4P_KnUkdDl1M26qpUZt27-E50-xpJr8`;
  httpDo(
    url, {
      method: 'GET',
    },
    (res) => {
      response = JSON.parse(res);
      console.log(response);
      for (let i = 0; i < 4; i += 1) {
        images[i] = createImg(response.items[i].link);
      }
      ready = true;
    },
  );
}

function searchHandler() {
  console.log(this.value());
}

function keyPressed() {
  if (key === 'Enter') {
    requestImage(searchInp.value());
    searchInp.value('');
  }
}
