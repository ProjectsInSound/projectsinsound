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
  volumeSlider: "Move this slider to change the overall volume."
};

document.getElementById("synth").style.display = "none";
document.getElementById("helpText").style.color = "grey";

let infoText = "Hover over a slider for information.";

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
