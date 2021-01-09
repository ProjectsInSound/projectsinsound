var informationStrings = {
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

document.getElementById("synth").style.display = "none";
document.getElementById("helpText").style.color = "grey";
document.getElementById("squareButton").checked = true;

let infoText = "Hover over a slider or button for information.";

let buttonTextColor = document.getElementById("whyImApplyingButton").style
  .color;

for (const item in informationStrings) {
  applyInfoListeners(item);
}

function applyInfoListeners(sliderName) {
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

document.getElementById("whyImApplyingButton").addEventListener("click", () => {
  openApply();
});

document.getElementById("openSynthButton").addEventListener("click", () => {
  openSynth();
  console.log("opensynthclicked");
});

function openApply() {
  var x = document.getElementById("whyImApplying");
  var y = document.getElementById("synth");

  document.getElementById("whyImApplyingButton").style.color = "orange";
  document.getElementById("openSynthButton").style.color = buttonTextColor;

  x.style.display = "flex";
  y.style.display = "none";
}

function openSynth() {
  var x = document.getElementById("synth");
  var y = document.getElementById("whyImApplying");

  document.getElementById("whyImApplyingButton").style.color = buttonTextColor;
  document.getElementById("openSynthButton").style.color = "orange";

  x.style.display = "grid";
  y.style.display = "none";
}
