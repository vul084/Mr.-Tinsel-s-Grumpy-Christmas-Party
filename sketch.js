
let cat;
let piano;

let songPlaying = false;
let songIndex = 0;
let nextNote = 0;
let starGlow = 0;

let lights = [
  {x: 68.7, y: 44.8, note: 'C5', color: [255,126,85], glow: 0},
  {x: 29.2, y: 53.4, note: 'D5', color: [255,207,98], glow: 0},
  {x: 49.8, y: 54.2, note: 'E5', color: [154,192,238], glow: 0},
  {x: 16.5, y: 64.7, note: 'F5', color: [250,128,128], glow: 0},
  {x: 70.5, y: 65.5, note: 'G5', color: [255,203,85], glow: 0},
  {x: 52, y: 75.2, note: 'A5', color: [255,145,100], glow: 0},
  {x: 26, y: 80.7, note: 'B5', color: [152,197,140], glow: 0},
  {x: 67, y: 90.3, note: 'C6', color: [150,194,244], glow: 0}
];

let song = [
  ['G5', 0.5],
  ['E5', 0.5],
  ['G5', 0.5],
  ['F#5', 0.5],
  ['D#5', 0.5],
  ['E5', 0.5],
  ['D5', 0.25],
  ['D5', 0.25],
  ['D5', 0.5],
  ['C#5', 0.25],
  ['C#5', 0.25],
  ['C#5', 0.5],
  ['C5', 0.25],
  ['C5', 0.25],
  ['B4', 0.5],
  ['E5', 0.5]
];

function preload() {
  cat = loadImage('christmas-cat.png');
}

function setup() {
  let w = min(windowWidth * 0.9, 480);
  let canvas = createCanvas(w, w * cat.height / cat.width);
  canvas.parent('cat-container');

  piano = new p5.PolySynth();
}

function draw() {
  clear();
  image(cat, 0, 0, width, height);

  noStroke();

  for (let i = 0; i < lights.length; i++) {
    let light = lights[i];

    if (light.glow > 0) {
      fill(
        light.color[0],
        light.color[1],
        light.color[2],
        light.glow
      );

      circle(
        width * light.x / 100,
        height * light.y / 100,
        width * 0.035
      );

      light.glow -= 4;
    }
  }

  if (starGlow > 0) {
    fill(255, 215, 105, starGlow);
    circle(width * 0.48, height * 0.10, width * 0.10);
    starGlow -= 2;
  }

  // Play one note at a time
  if (songPlaying && millis() >= nextNote) {

    if (songIndex < song.length) {
      let note = song[songIndex][0];
      let duration = song[songIndex][1];

      piano.play(note, 0.3, 0, 0.3);

      starGlow = 75;

      nextNote = millis() + duration * 460;
      songIndex++;

      console.log('Star:', note);

    } else {
      songPlaying = false;
      document.getElementById('message').textContent = '♪';
    }
  }
}

function playLight(i) {
  userStartAudio();

  piano.play(lights[i].note, 0.35, 0, 0.4);
  lights[i].glow = 120;

  document.getElementById('message').textContent =
    lights[i].note + ' ♪';

  console.log('Light', i + 1, lights[i].note);
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width ||
      mouseY < 0 || mouseY > height) {
    return;
  }

  // Clicking the star starts or stops the song
  if (dist(mouseX, mouseY,
      width * 0.48, height * 0.10) < width * 0.075) {

    userStartAudio();

    songPlaying = !songPlaying;

    if (songPlaying) {
      songIndex = 0;
      nextNote = millis();
      starGlow = 75;

      document.getElementById('message').textContent =
        'sugar plum fairy ♪';

      console.log('Sugar Plum Fairy started');

    } else {
      document.getElementById('message').textContent = '♪';
    }

    return false;
  }

  // Check which light was clicked
  for (let i = 0; i < lights.length; i++) {
    let x = width * lights[i].x / 100;
    let y = height * lights[i].y / 100;

    if (dist(mouseX, mouseY, x, y) < width * 0.045) {
      playLight(i);
      return false;
    }
  }
}

function keyPressed() {
  let i = '12345678'.indexOf(key);

  if (i !== -1) {
    playLight(i);
    return false;
  }

  if (key === 's' || key === 'S') {
    songPlaying = false;
    document.getElementById('message').textContent = '♪';
    return false;
  }
}

function windowResized() {
  let w = min(windowWidth * 0.9, 480);
  resizeCanvas(w, w * cat.height / cat.width);
}
