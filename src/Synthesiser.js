/*
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
*/

//Creating all Audio Nodes needed for the synthesiser element of the website
//The variable holder holds the oscillator, gain and filter elements for each voice, as well as their current note data

var context = new AudioContext();

var holder = [
  [0, 0, 0, null, false],
  [0, 0, 0, null, false],
  [0, 0, 0, null, false],
  [0, 0, 0, null, false]
];

var outputGain = context.createGain();

createVoices();
var voiceTracker = 0;
var maxVoiceLevel = 0.2;

//Creating a list of keyboard keycode values and all of the frequencies for those notes

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

//Creating the variables that store the values for the settings of the synthesiser
let ampA = 0.01,
  ampD = 0.01,
  ampS = 0.96,
  ampR = 0.01;
let filtA = 0.01,
  filtD = 0.01,
  filtS = 0.96,
  filtR = 0.01;
var cutOffFrequency = 19968;
var filtEnvAmount = 0;
var noteOn = false;

//creating event listeners for the user interactions
createADSREventListeners();
createFilterSettingsEventListeners();

document.getElementById("piano").addEventListener("mousedown", (e) => {
  /*This event listener is triggered when the user presses on one of the keyboard keys
    First the AudioContext is resumed - this has to be done after a user interaction
    First the noteOn message is set to true so that we kjnow a note is playing
    Next the oscillator of the current voice is set to the relevant frequency
    Then the envelope generators for the Amplitude and the Filter of that voice are triggered
    */
  context.resume();
  noteOn = true;
  if (e.target.dataset.note != null) {
    holder[voiceTracker][0].frequency.value =
      keyboardNotes[e.target.dataset.note];
    rampAmpValuesADS(ampA, ampD, ampS, holder[voiceTracker][1].gain);
    PolyphonicFilterADS(filtA, filtD, filtS, holder[voiceTracker][2]);
  }
});

document.getElementById("piano").addEventListener("mouseup", (e) => {
  /* This event listener is used to end notes when a user releases the mouse button
      The noteOn message is set to false, and then the "release" portion of the note is triggered using the two functions
  */
  noteOn = false;
  rampAmpValuesR(ampR, holder[voiceTracker][1].gain);
  filterTestR(filtR, holder[voiceTracker][2].frequency);
});

document.getElementById("piano").addEventListener("mouseleave", (e) => {
  /* This event listener is to stop any notes from ringing on if the user drags their mouse out of the button
      whilst still holding down the mouse, by triggering the two release functions to end a note
  */
  if (noteOn === true) {
    noteOn = false;
    rampAmpValuesR(ampR, holder[voiceTracker][1].gain);
    filterTestR(filtR, holder[voiceTracker][2].frequency);
  }
});

window.onkeydown = function (event) {
  //This event listener is used to  start notes when the user presses the right key on the keyboard
  //the first if statement makes sure that the key pressed is one that has a frequency tied to it
  //the second if statement is used to check whether the event keycode is already being used to play a note on any of the 4 voices
  //This was necessary because when a key is held down for a while it starts triggering repeatedly
  //By checking the note is not already on it's possible to make it only trigger once
  //By checking if any voice of free, it means that if the user holds down three keys and plays a melody over the top...
  //The three held down keys don't stop as its reassignimg the empty voice
  //if four keys are held down it just steals one of them
  context.resume();
  let freeVoice = null;
  if (keyboardNotes[event.keyCode] != null) {
    let noteAlreadyOn = false;
    for (let i = 0; i < holder.length; i++) {
      if (holder[i][3] === event.keyCode) {
        noteAlreadyOn = true;
      }
      if (holder[i][3] === null) {
        freeVoice = i;
      }
    }

    if (freeVoice != null) {
      voiceTracker = freeVoice;
    }

    //if the note is not already playing in one of the voices then start playing it
    //the frequency of that voice is set to the relevant frequency, and the key pressed is assigned to that voice
    //The ADS portion of that note are then triggered by the two functions
    //The relevant button on the keyboard is then coloured grey
    //The voice tracker is then incremented and then there is a remainder division by the number of voices
    //This makes sure that every new note is assigned to a new voice, with a maximum of 4 voices
    if (noteAlreadyOn === false) {
      holder[voiceTracker][0].frequency.value = keyboardNotes[event.keyCode];
      holder[voiceTracker][3] = event.keyCode;
      rampAmpValuesADS(ampA, ampD, ampS, holder[voiceTracker][1].gain);
      PolyphonicFilterADS(filtA, filtD, filtS, holder[voiceTracker][2]);
      if (document.getElementById(event.keyCode) != null) {
        document.getElementById(event.keyCode).style.backgroundColor = "grey";
      }
      voiceTracker++;
      voiceTracker %= holder.length;
    }
  }
};

window.onkeyup = function (event) {
  //This event listener is used to end notes when the key is lifted up
  //The first thing that happens is to check which voice is playing the note of the key thats just been lifted
  //Because there is a maximum number of 4 notes at once, it can happen that a key can be released that doesn't relate to any note being played
  //This for loop finds out which voice is playing the note
  let voiceForThisNote = null;
  for (let i = 0; i < holder.length; i++) {
    if (holder[i][3] === event.keyCode) {
      voiceForThisNote = i;
    }
  }

  //If there is a voice playing that note, then the voice playing that note is stopped
  //This is done by triggering the release portion of the note on the gain and filter nodes using the two functions
  //The 3rd element of the array for that voice is then set to null, so that its clear its not playing a note anymore

  if (voiceForThisNote != null) {
    rampAmpValuesR(ampR, holder[voiceForThisNote][1].gain);
    filterTestR(filtR, holder[voiceForThisNote][2].frequency);
    holder[voiceForThisNote][3] = null;
  }

  //the colour of the relevant keyboard button is set to white to show that it is no longer pressed
  if (document.getElementById(event.keyCode) != null) {
    document.getElementById(event.keyCode).style.backgroundColor = "lightgray";
  }
};

function rampAmpValuesADS(A, D, S, parameter) {
  /*This function controls the level("volume/loudness") of a note being played when the key is pressed
  This is done by changing the "gain" value of the gain node for the relevant voice
  The parameters A and D describe the amount of time that the sounds take to rise and decrease to and from maximum level
  These are called Attack and Decay
  The parameter S describes the level at which the sound stops decaying
  This is the level that the sound stays at when the key is held down
  */

  //before any note is turned on, the gain is set to quickly ramp down 0.001 so no previous note is playing on that voice
  var currentGain = parameter.value;
  parameter.cancelScheduledValues(context.currentTime);
  parameter.value = currentGain;
  var fadeToZero = context.currentTime + 0.01;
  parameter.exponentialRampToValueAtTime(0.001, fadeToZero);

  //because synths generally use exponential curves, the exponential ramp rather than linear
  //You can't have an exponential ramp to or from 0
  //To work round this, if the sustain parameter ("S") is set to 0, it is adjusted to 0.001

  let newS = S;
  if (S === 0.0) {
    newS = 0.001;
  }

  //The start time of the note is measured
  //The value of the gain parameter is then set to ramp up to a maxiumum and down to the sustain level
  //for the duration of the Attack and Decay times
  //The maximum level at any time is set  to stop sounds getting too loud
  let noteStart = context.currentTime;
  parameter.exponentialRampToValueAtTime(maxVoiceLevel, noteStart + A);
  parameter.setValueAtTime(maxVoiceLevel, noteStart + A);
  parameter.exponentialRampToValueAtTime(
    newS * maxVoiceLevel,
    noteStart + A + D
  );
  parameter.setValueAtTime(newS * maxVoiceLevel, noteStart + A + D);

  //This last part of the function makes sure that the level reaches 0 when S is set to 0 by using a very quick linear ramp
  if (S === 0) {
    parameter.linearRampToValueAtTime(0, noteStart + A + D + 0.01);
    parameter.setValueAtTime(0, noteStart + A + D + 0.01);
  }
}

function rampAmpValuesR(R, parameter) {
  /*This function controls the gain value for the end part of a note
  The gain value of the parameter passed into the function is decreased to 0 over the time "R"
  Because of the issue with ramping values to 0, the value is first ramped to 0.001 using an exponential curve
  The remaining ramp is then done using a linear ramp to 0
  */

  noteOn = false;
  var currentGain = parameter.value;
  parameter.cancelScheduledValues(context.currentTime);
  parameter.value = currentGain;
  parameter.exponentialRampToValueAtTime(0.001, context.currentTime + R);
  parameter.linearRampToValueAtTime(0, context.currentTime + R + 0.01);
}

function PolyphonicFilterADS(A, D, S, filter) {
  /* This function controls the filter frequency for the A, D and S portion of a note being played
    The idea of this is to make the frequency spectrum of a sound change over time
  */
  //Firstly all previously schediled values are cancelled
  //The frequency is set to the users selected cut-off frequency
  filter.frequency.cancelScheduledValues(context.currentTime);
  let startPoint = cutOffFrequency;
  filter.frequency.setValueAtTime(startPoint, context.currentTime + 0.01);

  //this part of the function contains maths that got quite confusing
  //the strength of the effect of this function is determined by the variable "filtEnvAmount"
  //So the maximum, minimum and sustain points need to be calculated in reaction to that value
  //If the amount is positive, the maximum point is worked out as the (available range above the start point multiplied by the envelope amount) + start point
  //If the amount is negative it is done using the range available below the start point
  let maxPoint = 0;
  let sustainPoint = startPoint;
  if (filtEnvAmount > 0) {
    maxPoint = (19968 - startPoint) * filtEnvAmount;
    sustainPoint = (maxPoint - startPoint) * S + startPoint;
  } else {
    maxPoint = startPoint + startPoint * filtEnvAmount;
    sustainPoint = startPoint - (startPoint - maxPoint) * S;
  }
  //Once the target frequency values have been calculated the frequency valuye is set to ramp to those values over time

  let noteStart = context.currentTime;
  filter.frequency.exponentialRampToValueAtTime(maxPoint, noteStart + A);
  filter.frequency.setValueAtTime(maxPoint, noteStart + A);
  filter.frequency.exponentialRampToValueAtTime(
    sustainPoint,
    noteStart + A + D
  );
  filter.frequency.setValueAtTime(sustainPoint, noteStart + A + D);
}

function filterTestR(R, paramater) {
  /* This function ramps the filter frequency value of the paramter down to the initial cutoff frequency over the release time ("R")
   */
  noteOn = false;
  let noteOff = context.currentTime;
  let noteEnd = noteOff + filtR;
  let endPoint = cutOffFrequency;
  let currentCutOff = paramater.value;
  paramater.cancelScheduledValues(noteOff);
  paramater.setValueAtTime(currentCutOff, noteOff);
  paramater.exponentialRampToValueAtTime(endPoint + 0.01, noteEnd);
  paramater.linearRampToValueAtTime(endPoint, noteEnd + 0.01);
}

function createVoices() {
  //This function is used to create and connect all of the audio nodes needed for the 4 voices

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
}

function calculateADR(value) {
  //This function converts the data from a slider into a usable value for the synth's Attack, Decay and Release parameters
  value /= 100.0;
  value = parseFloat(Math.pow(value, 4.0) / 125.0);
  return value;
}

function calculateS(value) {
  //This function converts the data from a slider into a usable value for the synth's Sustain parameters
  value /= 500.0;
  value = Math.pow(value, 4.0);
  return value;
}

function calculateCutOff(value) {
  //This function converts the data from a slider into a usable value for the synth's Cutoff parameter
  value /= 100.0;
  value = Math.pow(value, 4.0) * 32;
  return value;
}

function createADSREventListeners() {
  //This function creates listeners for each of the A,D,S and R sliders in the synth
  //First the value is processed to set the relevant parameter
  //Then the relevant text is updated
  document.getElementById("ampSlideA").addEventListener("input", () => {
    ampA = calculateADR(document.getElementById("ampSlideA").value);
    document.getElementById("ampSlideAText").innerHTML = ampA.toFixed(2);
  });

  document.getElementById("ampSlideD").addEventListener("input", () => {
    ampD = calculateADR(document.getElementById("ampSlideD").value);
    document.getElementById("ampSlideDText").innerHTML = ampD.toFixed(2);
  });

  document.getElementById("ampSlideS").addEventListener("input", () => {
    ampS = calculateS(document.getElementById("ampSlideS").value);
    document.getElementById("ampSlideSText").innerHTML = ampS.toFixed(2);
  });

  document.getElementById("ampSlideR").addEventListener("input", () => {
    ampR = calculateADR(document.getElementById("ampSlideR").value);
    document.getElementById("ampSlideRText").innerHTML = ampR.toFixed(2);
  });

  document.getElementById("filtSlideA").addEventListener("input", () => {
    filtA = calculateADR(document.getElementById("filtSlideA").value);
    document.getElementById("filtSlideAText").innerHTML = filtA.toFixed(2);
  });

  document.getElementById("filtSlideD").addEventListener("input", () => {
    filtD = calculateADR(document.getElementById("filtSlideD").value);
    document.getElementById("filtSlideDText").innerHTML = filtD.toFixed(2);
  });

  document.getElementById("filtSlideS").addEventListener("input", () => {
    filtS = calculateS(document.getElementById("filtSlideS").value);
    document.getElementById("filtSlideSText").innerHTML = filtS.toFixed(2);
  });

  document.getElementById("filtSlideR").addEventListener("input", () => {
    filtR = calculateADR(document.getElementById("filtSlideR").value);
    document.getElementById("filtSlideRText").innerHTML = filtR.toFixed(2);
  });
}

function createFilterSettingsEventListeners() {
  //Function to create event listeners for the sliders that control the filters
  //Firts the value is calculated, applied to the relevant parameter and then the text is updated
  document.getElementById("cutoffslider").addEventListener("input", () => {
    cutOffFrequency = calculateCutOff(
      document.getElementById("cutoffslider").value
    );

    //This for loop applies the change to the filter for every voice

    for (let i = 0; i < holder.length; i++) {
      holder[i][2].frequency.value = cutOffFrequency;
    }
    document.getElementById("cutofftext").innerHTML = cutOffFrequency.toFixed(
      0
    );
  });

  //Calculating and seting the value and text for any change to the filter envelope amount slider

  document
    .getElementById("FilterEnvelopeAmountSlider")
    .addEventListener("input", () => {
      filtEnvAmount = parseFloat(
        document.getElementById("FilterEnvelopeAmountSlider").value / 500.0
      ).toFixed(2);
      filtEnvAmount = Math.pow(filtEnvAmount, 4.0);
      //In the calculation to convert the slider value into a usable value, it gets raised to the power of 4
      //It is then necessary to make it negative again if the initial value was negative
      if (document.getElementById("FilterEnvelopeAmountSlider").value < 0) {
        filtEnvAmount *= -1;
      }

      //updating the relevant text with the new value
      document.getElementById(
        "FilterEnvelopeAmountText"
      ).innerHTML = filtEnvAmount.toFixed(2);
    });
}