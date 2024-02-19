import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import dynamic from "next/dynamic";
import useArticleStore from "@/zustand/article.zustand";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SalesChart = () => {
  const { getTotalAnalyticsStats, analytics } = useArticleStore();
  const [chartType, setChartType] = useState("languages");

  useEffect(() => {
    getTotalAnalyticsStats();
  }, []);

  // Process data for chart
  let chartData = [];
  let dataKey = "languageCounts"; // Default data key
  if (chartType === "countries") {
    dataKey = "countryCounts";
  } else if (chartType === "siteURLs") {
    dataKey = "urlSiteCounts";
  }

  if (analytics && analytics.dates && analytics[dataKey]) {
    // Iterate over dates
    analytics.dates.forEach((date, index) => {
      let dataPoint = { x: new Date(date).toLocaleDateString() }; // Initialize data point with date
      // Iterate over data counts for each date
      analytics[dataKey].forEach(data => {
        Object.entries(data).forEach(([key, counts]) => {
          // Check if the key exists in the data point, if not initialize it
          if (!dataPoint[key]) {
            dataPoint[key] = 0;
          }
          // Accumulate counts for the key on the current date
          dataPoint[key] += counts[index];
        });
      });
      chartData.push(dataPoint);
    });
  }

  // Prepare series data for chart
  const seriesData = Object.entries(chartData[0] || {}).map(([key, _]) => ({
    name: key,
    data: chartData.map(item => item[key] || null) // Set null for missing data points
  }));

  const chartOptions = {
    chart: {
      type: "area"
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      strokeDashArray: 3,
      borderColor: "rgba(0,0,0,0.1)"
    },
    stroke: {
      curve: "smooth",
      width: 1
    },
    xaxis: {
      categories: chartData.map(item => item.x)
    }
  };

  const handleChangeChartType = event => {
    setChartType(event.target.value);
  };

  return (
    <Card>
      <CardBody>
        <div className="mb-3">
          <select value={chartType} onChange={handleChangeChartType}>
            <option value="languages">Languages</option>
            <option value="countries">Countries</option>
            <option value="siteURLs">Site URLs</option>
          </select>
        </div>
        <CardTitle tag="h5">Data Summary</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          Monthly Stats Report
        </CardSubtitle>
        <Chart
          type="area"
          width="100%"
          height="390"
          options={chartOptions}
          series={seriesData}
        />
      </CardBody>
    </Card>
  );
};

export default SalesChart;
