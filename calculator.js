// To Do
// submit on enter
// check input bounds
// error handling with constructor
// add swap button logic
// draw graph with d3.js
// add CSS gradient background w/ animations
// add helper description button with links
// clean up UI
// push to gh-pages

import records from "./cpi.json" assert { type: "json" };

// model filtering based off comment below
// console.log("records: ",records)
// console.log(...records.filter((r) => r.Year == 1992).map((a) => a.Annual));

// series ID for the Consumer Price Index for All Urban Consumers: All Items (CPI-U)
const seriesId = "CUUR0000SA0";
const baseURL = "https://api.bls.gov/publicAPI/v2/timeseries/data/";
const apiKey = "XXXXXXXXXXXXXXXXXXX";

// endpoint is only used for current year's data
const url = `${baseURL}${seriesId}?registrationkey=${apiKey}`;

// gets current year
const date = new Date();
const currentYear = date.getFullYear();

// global elements
const startYear = document.getElementById("startYear");
startYear.addEventListener("focusout", focusOut);
startYear.addEventListener("focusin", focusIn);

const endYear = document.getElementById("endYear");
endYear.addEventListener("focusout", focusOut);
endYear.addEventListener("focusin", focusIn);

const dollars = document.getElementById("dollars");
dollars.addEventListener("focusout", focusOut);
dollars.addEventListener("focusin", focusIn);

const calcBtn = document.getElementById("calc");
calcBtn.addEventListener("click", getCalc);

const generated = document.getElementById("generated");

// set input max and placeholder values to the latest full calendar year
startYear.setAttribute("max", currentYear - 1);
endYear.setAttribute("max", currentYear - 1);
endYear.setAttribute("placeholder", currentYear - 1);

// API test
// const testBtn = document.getElementById("test")
// testBtn.addEventListener("click", getCPI);

function focusOut() {
  let currentInput = this.getAttribute("id");
  let currentValue = this.value;

  if (currentInput == "startYear" || "endYear") {
    if (currentValue < 1913 || currentValue > currentYear - 1) {
      this.setAttribute("class", "invalid");
    }
  }

  if (currentInput == "dollars") {
    if (currentValue < 1) {
      this.setAttribute("class", "invalid");
    }
  }

  console.log(currentInput);
  console.log(currentValue);
}

function focusIn() {
  this.value = "";
  this.removeAttribute("class", "invalid");

  // if (this.hasAttribute("id", "invalid")) {
  //   this.removeAttribute("id", "invalid");
  // }
}

function err() {
  console.warn("err");
}

function getCalc(event) {
  event.preventDefault();

  let startYearVal = Number(startYear.value);

  if (startYearVal == "") {
    startYearVal = 1913;
  } else {
    startYearVal = startYearVal;
  }

  const startAnnual = Number(
    records.filter((r) => r.Year == startYearVal).map((a) => a.Annual)
  );

  let endYearVal = Number(endYear.value);
  if (endYearVal == "") {
    endYearVal = 2022;
  } else {
    endYearVal = endYearVal;
  }

  const endAnnual = Number(
    records.filter((r) => r.Year == endYearVal).map((a) => a.Annual)
  );

  let dollarsVal = Number(dollars.value);
  if (dollarsVal == "") {
    dollarsVal = 5;
  } else {
    dollarsVal = dollarsVal;
  }

  const inflationRate = Number(
    (((endAnnual - startAnnual) / startAnnual) * 100).toFixed(3)
  );

  const dollarInflation = Number(
    ((inflationRate / 100) * dollarsVal + dollarsVal).toFixed(2)
  );

  let displayDollars = `$${dollarsVal} in ${startYearVal} would be worth approximately $${dollarInflation} in ${endYearVal}.`;
  generated.innerHTML = displayDollars;

  console.log("records: ", records);
  console.log("dollarsVal", dollarsVal);
  console.log("startAnnual: ", startAnnual);
  console.log("endAnnual", endAnnual);
  console.log("inflationRate", inflationRate);
  console.log("dollarInflation", dollarInflation);
}

function getCPI() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // parse response for current year's monthly values
      const monthlyValues = data.Results.series[0].data
        .filter((y) => y.year == currentYear.toString())
        .map((v) => Number(v.value));

      console.log("monthlyValues: ", monthlyValues);

      // calculate the average for the current year
      const currentYearAvg = monthlyValues.reduce((a, b) => a + b, 0);

      console.log("currentYearAvg: ", currentYearAvg);

      // calculate the inflation rate change between the two years
    })
    .catch((error) => console.error(error));
}
