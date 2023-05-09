// NOT IN USE

// fetch data from bls api

// change for api version
const API_VERSION = 1; // 1 or 2

// series ID for the Consumer Price Index for All Urban Consumers: All Items (CPI-U)
const seriesId = "CUUR0000SA0";
const v1BaseURL = "https://api.bls.gov/publicAPI/v1/timeseries/data/";
const v2BaseURL = "https://api.bls.gov/publicAPI/v2/timeseries/data/";
const apiKey = "XXXXXXXXXXXXXXXXXXX";

let URL;

switch (API_VERSION) {
  case 1:
    URL = `${v1BaseURL}${seriesId}`;
    break;
  case 2:
    URL = `${v2BaseURL}${seriesId}?registrationkey=${apiKey}`;
    break;
  default:
    console.log("API Version set incorrectly");
}

// Button to invoke getCPI
// const testBtn = document.getElementById("test")
// testBtn.addEventListener("click", getCPI);

// fetches CPI for current year if needed
function getCPI() {
  fetch(URL)
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
