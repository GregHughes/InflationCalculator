// To Do
// mobile layout
// error messaging
// add swap button logic
// add CSS gradient animation on calc
// add helper description button with links
// clean up UI - font size, layout, color
// push to gh-pages

import records from "./cpi.json" assert { type: "json" };

// gets current year
const date = new Date();
const currentYear = date.getFullYear();

// tracks form input
let formChanged = false;

// event listeners
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
dollars.addEventListener("keyup", formatDollars);

const calcBtn = document.getElementById("submit");
calcBtn.addEventListener("click", calculateInflation);

// press enter to submit form
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    calculateInflation(e);
  }
});

// canvas wrapper
const chartWrapper = document.getElementById("chart-wrapper");

// chart canvas
const canvas = document.getElementById("chart");

// element for innerHTML generation
const generated = document.getElementById("generated");

// set input max and placeholder values to the latest full calendar year
startYear.setAttribute("max", currentYear - 1);
endYear.setAttribute("max", currentYear - 1);
endYear.setAttribute("placeholder", currentYear - 1);

// flag set to true if user updates form input
function didInput() {
  formChanged = true;
}

// formatt dollar value with commas and update input
function formatDollars() {
  this.value = this.value
    .replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// validates input if user updated value on focusout
// if no input, form can be submitted with default/placeholder values
function validate() {
  let currentInput = this.getAttribute("id");
  let currentValue = Number(this.value);

  if (formChanged && this.value != "") {
    if (currentInput == "dollars") {
      // dollar must be > 0
      if (currentValue < 1) {
        this.setAttribute("class", "invalid");
      }
    } else if (currentInput == "startYear" || "endYear") {
      // records available from 1913 to last full calendar year
      if (currentValue < 1913 || currentValue > currentYear - 1) {
        this.setAttribute("class", "invalid");
      }
    }
    formChanged = false;
  }
}

// resets form input on selection if previous input was invalid
function reset() {
  if (this.hasAttribute("class", "invalid")) {
    this.value = "";
    this.removeAttribute("class", "invalid");
  } else {
    this.select();
  }
}

// performs CPI calculations
function calculateInflation(e) {
  e.preventDefault();

  // input values as numbers
  let startYearVal = Number(startYear.value);
  let endYearVal = Number(endYear.value);
  let dollarsVal = Number(dollars.value.replaceAll(",", ""));

  // default value if empty
  if (startYearVal == "") {
    startYearVal = 1913;
  } else {
    startYearVal = startYearVal;
  }
  // retrieve annual CPI from records
  const startAnnual = Number(
    records.filter((r) => r.Year == startYearVal).map((a) => a.Annual)
  );

  // default value if empty
  if (endYearVal == "") {
    endYearVal = 2022;
  } else {
    endYearVal = endYearVal;
  }

  // retrieve annual CPI from records
  const endAnnual = Number(
    records.filter((r) => r.Year == endYearVal).map((a) => a.Annual)
  );

  // default value if empty
  if (dollarsVal == "") {
    dollarsVal = 5;
  } else {
    dollarsVal = dollarsVal;
  }

  // calculate inflation rate
  const inflationRate = Number(
    (((endAnnual - startAnnual) / startAnnual) * 100).toFixed(3)
  );

  // calculate dollar inflation
  const dollarInflation = Number(
    ((inflationRate / 100) * dollarsVal + dollarsVal).toFixed(2)
  );

  // display inflation rate and dollar inflation
  let displayDollars = `$${dollarsVal.toLocaleString()} in ${startYearVal} would have approximately the same buying power as $${dollarInflation.toLocaleString()} in ${endYearVal}.`;
  generated.innerHTML = displayDollars;

  console.log("records: ", records);
  console.log("dollarsVal", dollarsVal);
  console.log("startAnnual: ", startAnnual);
  console.log("endAnnual", endAnnual);
  console.log("inflationRate", inflationRate);
  console.log("dollarInflation", dollarInflation);

  draw(startYearVal, startAnnual, endYearVal, endAnnual, records);
}

// chart.js implementation
function draw(startYearVal, startAnnual, endYearVal, endAnnual, records) {
  let years = [];
  let values = [startYearVal, endYearVal];

  // generate label based on year inputs
  let labels = () => {
    for (let i = Math.min(...values); i <= Math.max(...values); i++) {
      years.push(i);
    }
    if (years.length < 6) {
      // for sparse year distance add extra
      let labelStart = Math.min(...years) - 1;
      let labelEnd = Math.max(...years) + 1;
      years.push(labelEnd);
      years.unshift(labelStart);
    }

    // reverse chart labels if startyear is greater than endyear
    startYearVal > endYearVal ? years.reverse() : years;

    return years;
  };

  // generate data based on year inputs
  let chartData = () => {
    let annuals = [];
    years.map((ya) => {
      annuals.push(...records.filter((r) => r.Year == ya).map((a) => a.Annual));
    });
    return annuals;
  };

  // remove canvas if chart already drawn
  if (canvas != null) {
    canvas.remove();
  }

  // creates new canvas node
  chartWrapper.innerHTML = '<canvas id="chart"></canvas>';

  new Chart(document.getElementById("chart"), {
    type: "line",
    color: "black",
    options: {
      borderColor: "#000000",
      interaction: {
        axis: "x",
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
        },
      },
    },
    data: {
      labels: labels(),
      datasets: [
        {
          label: "Annual CPI",
          data: chartData(),
          borderColor: "#FFFFFF",
          backgroundColor: "#000000",
        },
      ],
    },
  });
}
