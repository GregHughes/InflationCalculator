# Inflation Calculator

This is an inflation calculator uses the Consumer Price Index provided by the U.S. Bureau of Labor Statistics to calculate the rate of inflation between two distinct years and apply that to a dollar amount.

For the purpose of this website I am not fetching data from the API directly with every request. I had downloaded the annual CPI data and stored it in a JSON file.

You can learn more about the BLS Public Data API [here](https://www.bls.gov/developers/home.htm).

## How the calculations are performed

The calculator uses the average annual CPI reading for each year from 1913 (the original year of recording) to the **latest full calendar year**.

To calculate the rate of inflation, you’ll need a start date, an end date, and a chart of the Consumer Price Index - a measure of average changes in prices over time issued by the U.S. Bureau of Labor Statistics.

1. Subtract the CPI of the start date from the CPI of the end date.

2. Divide that number by the CPI of the start date.

3. Multiply this number by 100.

You know have your inflation rate for that period of time.

Example:

1975 Annual CPI = 53.8

1995 Annual CPI = 152.4

Equation: ((152.4-53.8)/53.8) x 100 = 183.27

The rate of inflation between 1975 and 1995 was 183.27%

To see how inflation affects the value of $1, first divide the inflation rate by 100. Then, multiply that number by 1 (or any starting dollar amount you wish). Then add that number to your dollar amount.

Equation:

((183.27/100) x 1) + $1 = $2.83

((183.27/100) x 5) + $5 = $14.16

In this instance $1 in 1975 had the purchasing power of $2.83 in 1995, and $5 in 1975 had the purchasing power of $14.16 in 1995.
