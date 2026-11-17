
const lights = [
  { x:68.7, y:44.2, note:'C5', hz:523.25, color:'#ff9574' },
  { x:29.2, y:53.7, note:'D5', hz:587.33, color:'#ffcf64' },
  { x:49.8, y:53.8, note:'E5', hz:659.25, color:'#9dc6f1' },
  { x:16.3, y:64.5, note:'F5', hz:698.46, color:'#ff9996' },
  { x:70.2, y:66.2, note:'G5', hz:783.99, color:'#ffdb72' },
  { x:51.8, y:75.0, note:'A5', hz:880.00, color:'#ffa17d' },
  { x:25.9, y:80.4, note:'B5', hz:987.77, color:'#add5a0' },
  { x:66.6, y:89.9, note:'C6', hz:1046.50, color:'#aad0f5' }
];

const layer = document.getElementById('lights');
const star = document.getElementById('star');
const message = document.getElementById('message');

let audio;
let melodyTimers = [];
let melodyPlaying = false;

// Create the clickable lights
lights.forEach((light, index) => {
  const button = document.createElement('button');

  button.className = 'light';
  button.style.left = light.x + '%';
  button.style.top = light.y + '%';
  button.style.setProperty('--glow', light.color);

  button.setAttribute('aria-label', 'Play light ' + (index + 1));

  button.addEventListener('click', () => playLight(index));

  layer.appendChild(button);
  light.button = button;
});

// Start browser audio
function getAudio() {
  if (!audio) {
    audio = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audio.state === 'suspended') {
    audio.resume();
  }

  return audio;
}

// Create a music-box-like note
function bell(hz, length = 0.35) {
  const ctx = getAudio();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = hz;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + length + 0.4);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + length + 0.45);
}

// Make a light glow briefly
function flashLight(index) {
  const button = lights[index].button;

  button.classList.remove('playing');
  void button.offsetWidth;
  button.classList.add('playing');

  setTimeout(() => {
    button.classList.remove('playing');
  }, 400);
}

// Play a Christmas light
function playLight(index) {
  const light = lights[index];

  bell(light.hz);
  flashLight(index);

  message.textContent = light.note + ' ♪';

  console.log('Played light:', index + 1, light.note);
}

// Frequencies for the star melody
const notes = {
  'B4': 493.88,
  'C5': 523.25,
  'C#5': 554.37,
  'D5': 587.33,
  'D#5': 622.25,
  'E5': 659.25,
  'F#5': 739.99,
  'G5': 783.99
};

// Short simplified Sugar Plum Fairy melody
const sugarPlum = [
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
  ['C5', 0.5],
  ['B4', 0.5],
  ['E5', 0.5],
  ['C5', 0.5],
  ['E5', 0.5],
  ['B4', 0.5],
  ['G5', 0.5],
  ['E5', 0.5],
  ['G5', 0.5],
  ['F#5', 1]
];

// Stop the song
function stopMelody() {
  melodyTimers.forEach(clearTimeout);
  melodyTimers = [];

  melodyPlaying = false;
  star.classList.remove('playing');
  message.textContent = '♪';
}

// Play the song when the star is clicked
function playStar() {
  if (melodyPlaying) {
    stopMelody();
    return;
  }

  getAudio();

  melodyPlaying = true;
  star.classList.add('playing');

  message.textContent = 'dance of the sugar plum fairy ♪';
  console.log('Played star: Sugar Plum Fairy');

  let elapsed = 0;
  const beat = 460;

  sugarPlum.forEach((item, index) => {
    const note = item[0];
    const duration = item[1];

    const timer = setTimeout(() => {
      bell(notes[note], duration * 0.46);
      flashLight(index % lights.length);

      console.log('Melody note:', note);
    }, elapsed);

    melodyTimers.push(timer);
    elapsed += duration * beat;
  });

  melodyTimers.push(setTimeout(stopMelody, elapsed + 600));
}

// Click the star
star.addEventListener('click', playStar);

// Keyboard controls
function handleKey(k) {
  const index = '12345678'.indexOf(k);

  if (index !== -1) {
    playLight(index);
    return false;
  }

  if (k.toLowerCase() === 's') {
    stopMelody();
    return false;
  }

  return true;
}

// p5.js keyboard event
if (typeof window.p5 === 'function') {
  new p5(p => {
    p.setup = () => p.noCanvas();

    p.keyPressed = () => handleKey(p.key);
  });
} else {
  document.addEventListener('keydown', event => {
    if (!handleKey(event.key)) {
      event.preventDefault();
    }
  });
}
