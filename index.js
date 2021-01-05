import "./styles.css";
var context = new AudioContext();

var notes = {
  c: 261.63,
  d: 293.66,
  e: 329.66,
  f: 349.23,
  g: 392,
  a: 440,
  b: 493.88,
  c2: 523.26
};

let ampA = 0.01,
  ampD = 0.01,
  ampS = 0.96,
  ampR = parseFloat(0.01);
let filtA = 0.01,
  filtD = 0.01,
  filtS = 0.96,
  filtR = 0.01;

var noteOn = false;

var myFilter = context.createBiquadFilter();
myFilter.type = "lowpass";
myFilter.frequency.value = 1000;
var cutOffFrequency = 19968;
var filtEnvAmount = 0;
var osc1 = context.createOscillator();
var myGain = context.createGain();
//lfo.frequency.value = 10;
//lfo.connect(myFilter);

myGain.gain.value = 0.0;
osc1.type = "square";
osc1.frequency.value = 220.0;
osc1.connect(myGain);

myGain.connect(myFilter);
myFilter.connect(context.destination);
osc1.start();

document.getElementById("ampSlideA").addEventListener("input", () => {
  //console.log("attack slider moved");

  ampA = parseFloat(document.getElementById("ampSlideA").value / 100.0);
  ampA = parseFloat(Math.pow(ampA, 4.0) / 125.0);
  document.getElementById("ampSlideAText").innerHTML = ampA.toFixed(2);
  //document.getElementById("ADSRimage").width = 50px;
});

document.getElementById("ampSlideD").addEventListener("input", () => {
  ampD = parseFloat(document.getElementById("ampSlideD").value / 100.0);
  ampD = parseFloat(Math.pow(ampD, 4.0) / 125.0);
  document.getElementById("ampSlideDText").innerHTML = ampD.toFixed(2);
});

document.getElementById("ampSlideS").addEventListener("input", () => {
  ampS = parseFloat(document.getElementById("ampSlideS").value / 500.0);
  ampS = Math.pow(ampS, 4.0);
  document.getElementById("ampSlideSText").innerHTML = ampS.toFixed(2);
});

document.getElementById("ampSlideR").addEventListener("input", () => {
  ampR = parseFloat(document.getElementById("ampSlideR").value / 100.0);
  ampR = parseFloat(Math.pow(ampR, 4.0) / 125.0);
  document.getElementById("ampSlideRText").innerHTML = ampR.toFixed(2);
});

document.getElementById("filtSlideA").addEventListener("input", () => {
  //console.log("attack slider moved");
  filtA = parseFloat(document.getElementById("filtSlideA").value / 100.0);
  filtA = Math.pow(filtA, 4.0) / 125.0;
  document.getElementById("filtSlideAText").innerHTML = filtA.toFixed(2);
});

document.getElementById("filtSlideD").addEventListener("input", () => {
  filtD = parseFloat(document.getElementById("filtSlideD").value / 100.0);
  filtD = Math.pow(filtD, 4.0) / 125.0;
  document.getElementById("filtSlideDText").innerHTML = filtD.toFixed(2);
});

document.getElementById("filtSlideS").addEventListener("input", () => {
  filtS = parseFloat(document.getElementById("filtSlideS").value / 500.0);
  filtS = Math.pow(filtS, 4.0);
  document.getElementById("filtSlideSText").innerHTML = filtS.toFixed(2);
});

document.getElementById("filtSlideR").addEventListener("input", () => {
  filtR = parseFloat(document.getElementById("filtSlideR").value / 100.0);
  filtR = Math.pow(filtR, 4.0) / 125.0;
  document.getElementById("filtSlideRText").innerHTML = filtR.toFixed(2);
});

document.getElementById("cutoffslider").addEventListener("input", () => {
  cutOffFrequency = document.getElementById("cutoffslider").value / 100.0;
  cutOffFrequency = Math.pow(cutOffFrequency, 4.0) * 32 - 32;
  document.getElementById("cutofftext").innerHTML = cutOffFrequency.toFixed(2);
});

document
  .getElementById("FilterEnvelopeAmountSlider")
  .addEventListener("input", () => {
    filtEnvAmount = parseFloat(
      document.getElementById("FilterEnvelopeAmountSlider").value / 500.0
    ).toFixed(2);
    filtEnvAmount = Math.pow(filtEnvAmount, 4.0);
    if (document.getElementById("FilterEnvelopeAmountSlider").value < 0) {
      filtEnvAmount *= -1;
    }

    document.getElementById(
      "FilterEnvelopeAmountText"
    ).innerHTML = filtEnvAmount.toFixed(2);
  });

document.getElementById("piano").addEventListener("mousedown", (e) => {
  noteOn = true;

  if (e.target.dataset.note != null) {
    osc1.frequency.value = notes[e.target.dataset.note];
    rampAmpValuesADS(ampA, ampD, ampS, myGain.gain);
    filterTestADS();
  }
});

document.getElementById("piano").addEventListener("mouseup", (e) => {
  noteOn = false;
  console.log(noteOn);

  rampAmpValuesR(ampR, myGain.gain);
  filterTestR();
});

function rampAmpValuesADS(A, D, S, parameter) {
  var currentGain = parameter.value;
  parameter.cancelScheduledValues(context.currentTime);
  parameter.value = currentGain;
  var fadeToZero = context.currentTime + 0.01;
  parameter.exponentialRampToValueAtTime(0.01, fadeToZero);
  let noteStart = context.currentTime;
  console.log("note start time = " + noteStart);
  parameter.exponentialRampToValueAtTime(0.9, noteStart + A);
  parameter.setValueAtTime(0.9, noteStart + A);
  parameter.exponentialRampToValueAtTime(S * 0.9, noteStart + A + D);

  parameter.setValueAtTime(S * 0.9, noteStart + A + D);
}

function rampAmpValuesR(R, parameter) {
  noteOn = false;
  console.log(noteOn);

  var currentGain = parameter.value;
  parameter.cancelScheduledValues(context.currentTime);
  parameter.value = currentGain;
  parameter.exponentialRampToValueAtTime(0.001, context.currentTime + R);
  parameter.linearRampToValueAtTime(0, context.currentTime + R + 0.01);
}

function filterTestADS() {
  myFilter.frequency.cancelScheduledValues(context.currentTime);
  let startPoint = cutOffFrequency;
  myFilter.frequency.setValueAtTime(startPoint, context.currentTime + 0.01);
  let maxPoint = 0;
  console.log(filtEnvAmount);
  let sustainPoint = startPoint;
  if (filtEnvAmount > 0) {
    maxPoint = (19968 - startPoint) * filtEnvAmount;
    sustainPoint = (maxPoint - startPoint) * filtS + startPoint;
  } else {
    maxPoint = startPoint + startPoint * filtEnvAmount;
    sustainPoint = startPoint - (startPoint - maxPoint) * filtS;
    console.log(startPoint);
    console.log(maxPoint);
    console.log(sustainPoint);
  }

  let noteStart = context.currentTime;
  myFilter.frequency.exponentialRampToValueAtTime(maxPoint, noteStart + filtA);
  myFilter.frequency.setValueAtTime(maxPoint, noteStart + filtA);
  myFilter.frequency.exponentialRampToValueAtTime(
    sustainPoint,
    noteStart + filtA + filtD
  );
  myFilter.frequency.setValueAtTime(sustainPoint, noteStart + filtA + filtD);
}

function filterTestR() {
  noteOn = false;
  console.log(noteOn);
  let noteOff = context.currentTime;
  let noteEnd = noteOff + filtR;
  let endPoint = cutOffFrequency;
  let currentCutOff = myFilter.frequency.value;
  myFilter.frequency.cancelScheduledValues(noteOff);
  myFilter.frequency.setValueAtTime(currentCutOff, noteOff);
  myFilter.frequency.exponentialRampToValueAtTime(endPoint + 0.01, noteEnd);
  myFilter.frequency.linearRampToValueAtTime(endPoint, noteEnd + 0.01);
}
