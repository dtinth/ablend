#!/usr/bin/env node

var argv = require('optimist')
  .usage('Usage: $0 <black.png> <white.png> <result.png>')
  .demand(3)
  .argv;

var Canvas = require('canvas');
var fs = require('fs');
var ablend = require('./lib/ablend');

function loadImage(filename) {
  var image = new Canvas.Image();
  image.src = fs.readFileSync(filename);
  return image;
}

var black = loadImage(argv._[0]);
var white = loadImage(argv._[1]);

function toImageData(image) {
  var canvas = new Canvas(image.width, image.height);
  var ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

var result, output, outputCtx, data;
output = new Canvas(black.width, black.height);
outputCtx = output.getContext('2d');
data = outputCtx.createImageData(output.width, output.height);

var lastPercentage = -1;
function updateProgress(current, total) {
  var percentage = Math.floor(current * 100 / total);
  if (percentage != lastPercentage) {
    process.stdout.write('|');
    for (var i = 0; i < percentage; i += 2) process.stdout.write('=');
    for (; i < 100; i += 2) process.stdout.write(' ');
    process.stdout.write('| ' + percentage + '%\r');
    lastPercentage = percentage;
  }
}

try {
  console.log('Processing images...');
  result = ablend.ablend(toImageData(black), toImageData(white), data, updateProgress);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

console.log('');
console.log('Writing output file...');
outputCtx.putImageData(data, 0, 0);
fs.writeFileSync(argv._[2], output.toBuffer());

