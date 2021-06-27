var informationStrings = {
  //This dictionary holds the relevant string information to be displayed for each slider/button of the synthesiser

  ampSlideA:
    "This slider changes the time that it takes a note to reach maximum volume.",
  ampSlideD:
    "This slider changes the time that it takes a note to reach the sustain volume.",
  ampSlideS: "This slider changes the sustain volume.",
  ampSlideR:
    "This slider changes the time taken for a note to stop after a key is released.",
  filtSlideA:
    "This slider changes the time that it takes the filter to reach maximum level.",
  filtSlideD:
    "This slider changes the time that it takes the filter to reach the sustain level.",
  filtSlideS: "This slider changes the sustain level of the filter.",
  filtSlideR:
    "This slider changes the time taken for the filter to close after a key is released.",
  cutoffslider: "This slider changes the cut-off frequency of the filter.",
  FilterEnvelopeAmountSlider:
    "This slider changes the amount of modulation of the cut-off frequency.",
  volumeSlider: "Move this slider to change the overall volume.",
  bassButton: "Low octave, plays only one note at a time.",
  keyboard1Button: "A plucky, trance-style syntheiser sound.",
  keyboard2Button: "A mellower, slightly organ-like keyboard sound.",
  squareButton: "Sets the basic waveform to a buzzy square wave",
  triangleButton: "Sets the basic waveform to a mellow triangle wave.",
  sawtoothButton: "Sets the basic waveform to a bright sawtooth wave."
};

//setting the synth panel to be invisible when the website is loaded
document.getElementById("synth").style.display = "none";
document.getElementById("unity3D").style.display = "none";
document.getElementById("systemDesign").style.display = "none";
document.getElementById("music").style.display = "none";

//setting the default paramater for the synth waveform
document.getElementById("squareButton").checked = true;

//storing the default infoText, and settonhg the evet listeners for all of the parameters in the dictionary
let infoText = "Hover over a slider or button for information.";

let buttonTextColor = document.getElementById("whyImApplyingButton").style
  .color;

for (const item in informationStrings) {
  applyInfoListeners(item);
}

function applyInfoListeners(sliderName) {
  //this function sets the event listeners for the mouse eneter and mousleave events for the given sliderName (also works for buttons)
  if (document.getElementById(sliderName) != null) {
    document.getElementById(sliderName).addEventListener("mouseenter", () => {
      document.getElementById("helpText").innerText =
        informationStrings[sliderName];
      document.getElementById("helpText").style.color = "orange";
      console.log("mouseover");
    });

    document.getElementById(sliderName).addEventListener("mouseleave", () => {
      document.getElementById("helpText").innerText = infoText;
      document.getElementById("helpText").style.color = "grey";
    });
  }
}

//making event listeners for the navigation panel

document.getElementById("whyImApplyingButton").addEventListener("click", () => {
  openApply();
  pauseVideos();
});

document.getElementById("Unity3DButton").addEventListener("click", () => {
  openUnity3D();
});

document.getElementById("systemDesignButton").addEventListener("click", () => {
  openSystemDesign();
});

document.getElementById("musicButton").addEventListener("click", () => {
  openMusic();
});

document.getElementById("openSynthButton").addEventListener("click", () => {
  openSynth();
});

document.getElementById("synthLink").addEventListener("click", () => {
  openSynth();
});

document.getElementById("synthLink").addEventListener("mouseenter", () => {
  document.getElementById("synthLink").style.color = "orange";
});

document.getElementById("synthLink").addEventListener("mouseleave", () => {
  document.getElementById("synthLink").style.color = "black";
});

function openApply() {
  //function to open the "Why I'm Applying" section and make sure that "Play a Syntheiser" is closed
  var x = document.getElementById("whyImApplying");
  var y = document.getElementById("synth");
   PauseAllAudio2();

  //once pressed, the button stays orange
  document.getElementById("whyImApplyingButton").style.color = "orange";
  document.getElementById("openSynthButton").style.color = buttonTextColor;
  document.getElementById("Unity3DButton").style.color = buttonTextColor;
  document.getElementById("musicButton").style.color = buttonTextColor;
  document.getElementById("systemDesignButton").style.color = buttonTextColor;

  x.style.display = "flex";
  y.style.display = "none";
  document.getElementById("systemDesign").style.display = "none";
  document.getElementById("unity3D").style.display = "none";
  document.getElementById("music").style.display = "none";
}

function openSynth() {
  //function to open the "Play a Syntheiser" section and make sure that "Why I'm Applying" is closed
  var x = document.getElementById("synth");
  var y = document.getElementById("whyImApplying");
   PauseAllAudio2();

  //once pressed, the button stays orange
  document.getElementById("whyImApplyingButton").style.color = buttonTextColor;
  document.getElementById("openSynthButton").style.color = "orange";
  document.getElementById("Unity3DButton").style.color = buttonTextColor;
  document.getElementById("musicButton").style.color = buttonTextColor;
  document.getElementById("systemDesignButton").style.color = buttonTextColor;

  x.style.display = "grid";
  y.style.display = "none";
  document.getElementById("systemDesign").style.display = "none";
  document.getElementById("unity3D").style.display = "none";
  document.getElementById("music").style.display = "none";
}

function openUnity3D() {
  //function to open the "Play a Syntheiser" section and make sure that "Why I'm Applying" is closed
  var x = document.getElementById("synth");
  var y = document.getElementById("whyImApplying");
  PauseAllAudio2();

  //once pressed, the button stays orange
  document.getElementById("whyImApplyingButton").style.color = buttonTextColor;
  document.getElementById("openSynthButton").style.color = buttonTextColor;
  document.getElementById("Unity3DButton").style.color = "orange";
  document.getElementById("musicButton").style.color = buttonTextColor;
  document.getElementById("systemDesignButton").style.color = buttonTextColor;

  x.style.display = "none";
  y.style.display = "none";
  document.getElementById("systemDesign").style.display = "none";
  document.getElementById("unity3D").style.display = "flex";
  document.getElementById("music").style.display = "none";
}

function openSystemDesign() {
  //function to open the "Play a Syntheiser" section and make sure that "Why I'm Applying" is closed
  var x = document.getElementById("synth");
  var y = document.getElementById("whyImApplying");
   PauseAllAudio2();

  //once pressed, the button stays orange
  document.getElementById("whyImApplyingButton").style.color = buttonTextColor;
  document.getElementById("openSynthButton").style.color = buttonTextColor;
  document.getElementById("systemDesignButton").style.color = "orange";
  document.getElementById("Unity3DButton").style.color = buttonTextColor;
  document.getElementById("musicButton").style.color = buttonTextColor;

  x.style.display = "none";
  y.style.display = "none";
  document.getElementById("unity3D").style.display = "none";
  document.getElementById("systemDesign").style.display = "flex";
  document.getElementById("music").style.display = "none";
}

function openMusic() {
  //function to open the "Play a Syntheiser" section and make sure that "Why I'm Applying" is closed
  var x = document.getElementById("synth");
  var y = document.getElementById("whyImApplying");
   PauseAllAudio2();

  //once pressed, the button stays orange
  document.getElementById("whyImApplyingButton").style.color = buttonTextColor;
  document.getElementById("openSynthButton").style.color = buttonTextColor;
  document.getElementById("systemDesignButton").style.color = buttonTextColor;
  document.getElementById("Unity3DButton").style.color = buttonTextColor;
  document.getElementById("musicButton").style.color = "orange";

  x.style.display = "none";
  y.style.display = "none";
  document.getElementById("unity3D").style.display = "none";
  document.getElementById("systemDesign").style.display = "none";
  document.getElementById("music").style.display = "flex";
}

function pauseVideos() {
  console.log("video pause function called");
  let videoList = document.getElementsByTagName("video");
  for(let i = 0; i< videoList.Length; i++){
    console.log(videoList[i]);
    videoList[i].pause();
  }
  
  
}

document.addEventListener("play",  PauseAllAudio(), true);


function PauseAllAudio(){
  return function curried_func(e) {
    var audioPlayers = document.getElementsByTagName("audio");
    for (var i = 0; i < audioPlayers.length; i++) {
      if (audioPlayers[i] !== e.target) {
        audioPlayers[i].pause();
      }
    }
  }
}

function PauseAllAudio2() {
  var audioPlayers = document.getElementsByTagName("audio");
  for (var i = 0; i < audioPlayers.length; i++) {
    if (audioPlayers[i] !== e.target) {
      audioPlayers[i].pause();
    }
  }
}
