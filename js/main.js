/* globals window */
(function () {
  var WATER_TOP_COLOR = "#04619f";
  var WATER_BOTTOM_COLOR = "#000000";

  var htmlCanvas = document.querySelector("canvas");
  var ctx = htmlCanvas.getContext('2d')
  var ship = window.document.querySelector('#ship');

  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;
  var shipComputed = {
    top: screenHeight / 2,
    left: -10,
    widthScreenWidthPercent: 0.07,
  };

  var wave = {};
  var waveLength = 0;
  var wave2 = {};
  var wave3 = {};
  var waves = {};

  var moveWavesId;
  var moveShipId;

  function value(x, width, numberOfWaves) {
    x = x * numberOfWaves / width * 2 * Math.PI;
    return Math.sin(x);
  }

  function multiplier(x, width) {
    var multiplierVar = 90;

    if (x <= width / 2) {
      return x * multiplierVar * 2 / width;
    }
    return width * multiplierVar / 2 / x;
  }

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function draw() {
    ctx.clearRect(0, 0, screenWidth, screenHeight);
    ctx.beginPath();
    ctx.moveTo(screenWidth, screenHeight);

    for (var x = waveLength - 1; x > 0; x--) {
      ctx.lineTo(x, waves[x])
    }

    var gradient = ctx.createLinearGradient(0, 0, 0, screenHeight);
    gradient.addColorStop(.5, WATER_TOP_COLOR);
    gradient.addColorStop(1, WATER_BOTTOM_COLOR);
    ctx.fillStyle = gradient;
    ctx.lineTo(0, screenHeight);
    ctx.fill();

    requestAnimationFrame(draw);
  }

  function moveShip() {
    var y1 = waves[shipComputed.left];
    var y2 = waves[shipComputed.left + 1];

    shipComputed.angle = -Math.atan(y1 - y2) + 'rad';
    shipComputed.top = y1;
    shipComputed.left += 1;
    if (shipComputed.left > screenWidth - 1) {
      shipComputed.left = -10;
    }

    ship.style.transform = 'rotate(' + shipComputed.angle + ')';
    ship.style.left = shipComputed.left - (screenWidth * shipComputed.widthScreenWidthPercent / 2);
    ship.style.top = shipComputed.top - (screenWidth * shipComputed.widthScreenWidthPercent);
  }

  function initializeWaves() {
    var randomWaves1 = randomIntFromInterval(4, 5);
    var randomWaves2 = randomIntFromInterval(2, 3);
    var randomWaves3 = randomIntFromInterval(6, 7);

    for (var x = 0; x < screenWidth; x++) {
      wave[x] = value(x, screenWidth, randomWaves1) * multiplier(x, screenWidth) / 4;
      wave2[x] = value(x, screenWidth, randomWaves2) * multiplier(x * 3, screenWidth) / 6;
      wave3[x] = value(x, screenWidth, randomWaves3);
    }
    waveLength = Object.keys(wave).length;
  }

  function moveWaves() {
    if (!waveLength) {
      initializeWaves();
    }

    for (var x = waveLength - 1; x >= 0; x--) {
      if (x === 0) {
        wave2[x] = wave2[waveLength - 1];
        wave3[x] = wave3[waveLength - 1];
      } else {
        wave2[x] = wave2[x - 1];
        wave3[x] = wave3[x - 1];
      }

      waves[x] = wave[x] + wave2[x] + wave3[x] + screenHeight / 2;
    }
  }

  function startLoop() {
    clearInterval(moveWavesId);
    moveWavesId = setInterval(moveWaves, 8000 / screenWidth);

    clearInterval(moveShipId);
    moveShipId = setInterval(moveShip, 10000 / screenWidth);
  }

  function recalculateCanvas() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    htmlCanvas.width = screenWidth;
    htmlCanvas.height = screenHeight;

    wave = {};
    wave2 = {};
    wave3 = {};
    waveLength = 0;
    waves = {};

    startLoop();
  }

  window.addEventListener('resize', recalculateCanvas);
  window.removeEventListener("unload", recalculateCanvas);

  recalculateCanvas();
  requestAnimationFrame(draw);
}());
