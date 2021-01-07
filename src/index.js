var context = new AudioContext();

let synthSettings = {
  amplitudeA: 0.01,
  amplitudeD: 0.01,
  amplitudeS: 0.96,
  amplitudeR: 0.01,
  filterA: 0.01,
  filterD: 0.01,
  filterS: 0.96,
  filterR: 0.01,
  cutoff: 19968,
  envAmount: 0
};

var holder = [
  [0, 0, 0, null, false],
  [0, 0, 0, null, false],
  [0, 0, 0, null, false],
  [0, 0, 0, null, false]
];

var outputGain = context.createGain();
outputGain.connect(context.destination);
outputGain.gain.setValueAtTime(0.05, context.currentTime);

for (let p = 0; p < holder.length; p++) {
  holder[p][0] = context.createOscillator();
  holder[p][1] = context.createGain();
  holder[p][1].gain.value = 0;
  holder[p][2] = context.createBiquadFilter();
  holder[p][0].connect(holder[p][1]);
  holder[p][1].connect(holder[p][2]);
  holder[p][2].connect(outputGain);
  holder[p][0].type = "square";
  holder[p][0].start();
  holder[p][4] = false;
}

var voiceTracker = 0;

var notes = {
  c: 261.63,
  d: 293.66,
  e: 329.66,
  f: 349.23,
  g: 392,
  a: 440,
  b: 493.88,
  c2: 523.26,
  d2: 587.33,
  e2: 659.25,
  f2: 698.46,
  g2: 783.99
};

var keyboardNotes = {
  65: 261.63,
  83: 293.66,
  68: 329.66,
  70: 349.23,
  71: 392,
  72: 440,
  74: 493.88,
  75: 523.26,
  76: 587.33,
  186: 659.25,
  222: 698.46,
  220: 783.99
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
  cutOffFrequency = Math.pow(cutOffFrequency, 4.0) * 32;
  for (let i = 0; i < 4; i++) {
    holder[i][2].frequency.value = cutOffFrequency;
  }
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

window.onkeydown = function (event) {
  //0 = osc, 1 = gain, 2 = filter, 3 = note
  if (keyboardNotes[event.keyCode] != null) {
    let noteAlreadyOn = false;
    for (let i = 0; i < 4; i++) {
      if (holder[i][3] === event.keyCode) {
        noteAlreadyOn = true;
      }
    }
    if (noteAlreadyOn === false) {
      holder[voiceTracker][0].frequency.value = keyboardNotes[event.keyCode];
      holder[voiceTracker][3] = event.keyCode;
      rampAmpValuesADS(ampA, ampD, ampS, holder[voiceTracker][1].gain);
      PolyphonicFilterADS(filtA, filtD, filtS, holder[voiceTracker][2]);
      console.log(
        "noteOn at oscillator " +
          voiceTracker +
          ", keynumber = " +
          event.keyCode
      );
      voiceTracker++;
      voiceTracker %= 4;
    }
  }
  /*
  console.log("key pressed = " + event.keyCode);
  if (keyboardNotes[event.keyCode] != null) {
    if (noteOn === false) {
      noteOn = true;
      osc1.frequency.value = keyboardNotes[event.keyCode];
      rampAmpValuesADS(ampA, ampD, ampS, myGain.gain);
      filterTestADS();
    }
  }
  */
};

window.onkeyup = function (event) {
  //0 = osc, 1 = gain, 2 = filter, 3 = note
  let voiceForThisNote = null;
  for (let i = 0; i < 4; i++) {
    if (holder[i][3] === event.keyCode) {
      voiceForThisNote = i;
    }
  }
  if (voiceForThisNote != null) {
    rampAmpValuesR(ampR, holder[voiceForThisNote][1].gain);
    holder[voiceForThisNote][3] = null;
  }

  /*
  if (keyboardNotes[event.keyCode] != null) {
    noteOn = false;
    console.log(noteOn);
    context.resume();

    rampAmpValuesR(ampR, myGain.gain);
    filterTestR();
  }
  */
};

document.getElementById("piano").addEventListener("mouseup", (e) => {
  noteOn = false;
  context.resume();

  rampAmpValuesR(ampR, myGain.gain);
  filterTestR();
});

document.getElementById("piano").addEventListener("mouseleave", (e) => {
  if (noteOn === true) {
    noteOn = false;
    context.resume();

    rampAmpValuesR(ampR, myGain.gain);
    filterTestR();
  }
});

function rampAmpValuesADS(A, D, S, parameter) {
  var currentGain = parameter.value;
  parameter.cancelScheduledValues(context.currentTime);
  parameter.value = currentGain;
  var fadeToZero = context.currentTime + 0.01;
  parameter.exponentialRampToValueAtTime(0.01, fadeToZero);
  let noteStart = context.currentTime;

  let newS = S;
  if (S === 0.0) {
    newS = 0.01;
  }

  parameter.exponentialRampToValueAtTime(0.2, noteStart + A);
  parameter.setValueAtTime(0.2, noteStart + A);
  parameter.exponentialRampToValueAtTime(newS  * 0.2, noteStart + A + D);
  parameter.setValueAtTime(newS * 0.2, noteStart + A + D);
  if (S === 0) {
    parameter.linearRampToValueAtTime(0, noteStart + A + D + 0.01);
    parameter.setValueAtTime(0, noteStart + A + D + 0.01);
  }
}

function rampAmpValuesR(R, parameter) {
  noteOn = false;

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

  let sustainPoint = startPoint;
  if (filtEnvAmount > 0) {
    maxPoint = (19968 - startPoint) * filtEnvAmount;
    sustainPoint = (maxPoint - startPoint) * filtS + startPoint;
  } else {
    maxPoint = startPoint + startPoint * filtEnvAmount;
    sustainPoint = startPoint - (startPoint - maxPoint) * filtS;
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

function PolyphonicFilterADS(A, D, S, filter) {
  filter.frequency.cancelScheduledValues(context.currentTime);
  let startPoint = cutOffFrequency;
  filter.frequency.setValueAtTime(startPoint, context.currentTime + 0.01);
  let maxPoint = 0;

  let sustainPoint = startPoint;
  if (filtEnvAmount > 0) {
    maxPoint = (19968 - startPoint) * filtEnvAmount;
    sustainPoint = (maxPoint - startPoint) * S + startPoint;
  } else {
    maxPoint = startPoint + startPoint * filtEnvAmount;
    sustainPoint = startPoint - (startPoint - maxPoint) * S;
  }

  let noteStart = context.currentTime;
  filter.frequency.exponentialRampToValueAtTime(maxPoint, noteStart + A);
  filter.frequency.setValueAtTime(maxPoint, noteStart + A);
  filter.frequency.exponentialRampToValueAtTime(
    sustainPoint,
    noteStart + A + D
  );
  filter.frequency.setValueAtTime(sustainPoint, noteStart + A + D);
}

function filterTestR() {
  noteOn = false;

  let noteOff = context.currentTime;
  let noteEnd = noteOff + filtR;
  let endPoint = cutOffFrequency;
  let currentCutOff = myFilter.frequency.value;
  myFilter.frequency.cancelScheduledValues(noteOff);
  myFilter.frequency.setValueAtTime(currentCutOff, noteOff);
  myFilter.frequency.exponentialRampToValueAtTime(endPoint + 0.01, noteEnd);
  myFilter.frequency.linearRampToValueAtTime(endPoint, noteEnd + 0.01);
}
