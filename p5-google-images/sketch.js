let response;
let img;
let ready = false;

function setup() {
    createCanvas(640, 480);
}

function draw() {
   if(ready) {
    image(img, width/2 ,height/2, img.width, img.height)
   }
}

function requestImage(search = "hot dog") {
    let url = 'https://www.googleapis.com/customsearch/v1?q=hot+dog&cx=005973051980809555555%3Azmae5bkt_wu&imgType=clipart&num=4&safe=active&searchType=image&key=AIzaSyDT4P_KnUkdDl1M26qpUZt27-E50-xpJr8';
    httpDo(
      url,
      {
        method: 'GET',
      },
      function(res) {
        response = JSON.parse(res)
        console.log(response.items[0].link)
        img = createImg(response.items[0].link);
        ready = true;
      }
    );

}

