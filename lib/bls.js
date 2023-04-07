import records from "./cpi.json" assert { type: "json" };

// console.log(records.filter((i) => i.Year == 1992).map((a) => a.Annual));

const baseURL = "https://api.bls.gov/publicAPI/v2/timeseries/data/";
const apiKey = "XXXXXXXXXXXXXXXXXXXXXXX";

// series ID for the Consumer Price Index for All Urban Consumers: All Items (CPI-U)
const seriesId = "CUUR0000SA0";

// endpoint is only used for current year's data
const url = `${baseURL}${seriesId}?registrationkey=${apiKey}`;

const date = new Date();
const currentYear = date.getFullYear();
const earliestRecord = 1913; // data record begins in 1913

function getCPI() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // parse response for current year's monthly values
      const monthlyValues = data.Results.series[0].data
        .filter((y) => y.year == currentYear.toString())
        .map((v) => Number(v.value));

      // calculate the average for the current year
      const currentYearAvg = monthlyValues.reduce((a, b) => a + b, 0);

      // calculate the inflation rate change between the two years
    })
    .catch((error) => console.error(error));
}
