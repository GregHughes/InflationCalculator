// To Do
// destroy chart on each new submit
// chart options - labels, domain display, colors and fonts, hover state, animation
// error handling with constructor
// add swap button logic
// add CSS gradient animation on calc
// add helper description button with links
// clean up UI - font size, layout, colors
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

let wasChanged = false;

// gets current year
const date = new Date();
const currentYear = date.getFullYear();

// global elements
const startYear = document.getElementById("startYear");
startYear.addEventListener("focusout", validate);
startYear.addEventListener("focusin", reset);
startYear.addEventListener("input", didInput);

const endYear = document.getElementById("endYear");
endYear.addEventListener("focusout", validate);
endYear.addEventListener("focusin", reset);
endYear.addEventListener("input", didInput);

const dollars = document.getElementById("dollars");
dollars.addEventListener("focusout", validate);
dollars.addEventListener("focusin", reset);
dollars.addEventListener("input", didInput);

const calcBtn = document.getElementById("submit");
calcBtn.addEventListener("click", getCalc);
// press enter to submit form
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getCalc(e);
  }
});

const generated = document.getElementById("generated");

// set input max and placeholder values to the latest full calendar year
startYear.setAttribute("max", currentYear - 1);
endYear.setAttribute("max", currentYear - 1);
endYear.setAttribute("placeholder", currentYear - 1);

// flag set to true if user updates form input
function didInput() {
  wasChanged = true;
}

// resets form input if previous input was invalid
function reset() {
  if (this.hasAttribute("class", "invalid")) {
    this.value = "";
    this.removeAttribute("class", "invalid");
  } else {
    this.select();
  }
}

// validates form input if user updated value
function validate() {
  let currentInput = this.getAttribute("id");
  let currentValue = Number(this.value);

  if (wasChanged && this.value != "") {
    if (currentInput == "dollars") {
      if (currentValue < 1) {
        this.setAttribute("class", "invalid");
      }
    } else if (currentInput == "startYear" || "endYear") {
      if (currentValue < 1913 || currentValue > currentYear - 1) {
        this.setAttribute("class", "invalid");
      }
    }
    wasChanged = false;
  }
}

// performs CPI calculations
function getCalc(e) {
  e.preventDefault();

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

  // let annuals = records.map((a) => Number(a.Annual));
  // let min = Math.min(...annuals);
  // let max = Math.max(...annuals);

  draw(startYearVal, startAnnual, endYearVal, endAnnual, records);

  // console.log("records: ", records);
  // console.log("dollarsVal", dollarsVal);
  // console.log("startAnnual: ", startAnnual);
  // console.log("endAnnual", endAnnual);
  // console.log("inflationRate", inflationRate);
  // console.log("dollarInflation", dollarInflation);
}

// generates errors
function err() {
  console.warn("err");
}

// chart.js implementation
function draw(startYearVal, startAnnual, endYearVal, endAnnual, records) {
  // clear previous chart

  let years = [];

  // generate label based on year inputs
  let labels = () => {
    for (let i = startYearVal; i <= endYearVal; i++) {
      years.push(i);
    }
    if (years.length < 6) {
      // for sparse year distance add extra
      let labelStart = Math.min(...years) - 1;
      let labelEnd = Math.max(...years) + 1;
      years.push(labelEnd);
      years.unshift(labelStart);
      return years;
    } else {
      return years;
    }
  };

  // generate data based on year inputs
  let chartData = () => {
    let annuals = [];
    years.map((ya) => {
      annuals.push(...records.filter((r) => r.Year == ya).map((a) => a.Annual));
    });
    return annuals;
  };

  new Chart(document.getElementById("chart"), {
    type: "line",
    color: "black",
    data: {
      labels: labels(),
      datasets: [
        {
          data: chartData(),
          borderColor: "#FFFFFF",
        },
      ],
    },
  });
}

/**********************************************/

// API test
// const testBtn = document.getElementById("test")
// testBtn.addEventListener("click", getCPI);

// fetches CPI for current year if needed
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
