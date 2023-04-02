const axios = require("axios");

let data = JSON.stringify({
  seriesid: ["WMU00140201020000001300002500", "WMU00140201020000001300002500"],
  startyear: "2018",
  endyear: "2018",
  catalog: true,
  calculations: true,
  annualaverage: true,
  aspects: true,
  registrationkey: "XXXXXXXXXXXXXXXXXXXXXXXXXXX",
});

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://api.bls.gov/publicAPI/v2/timeseries/data/",
  headers: {
    "Content-Type": "application/json",
  },
  data: data,
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
