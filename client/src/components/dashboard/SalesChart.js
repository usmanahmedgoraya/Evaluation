import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import dynamic from "next/dynamic";
import useArticleStore from "@/zustand/article.zustand";
import { useEffect } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SalesChart = () => {
  const { getAnalytics, analytics } = useArticleStore()


  useEffect(() => {
    getAnalytics()
  }, [])

  // Dummy data
  const dummyData = {
    dates: [
      "2022-01-01T00:00:00.000Z",
      "2022-01-02T00:00:00.000Z",
      "2022-01-03T00:00:00.000Z",
      "2022-01-04T00:00:00.000Z",
      "2022-01-05T00:00:00.000Z",
      "2022-01-06T00:00:00.000Z",
      "2022-01-07T00:00:00.000Z",
      "2022-01-08T00:00:00.000Z"
    ],
    englishCounts: [30, 40, 35, 45, 50, 55, 60, 65],
    spanishCounts: [15, 20, 18, 22, 25, 28, 30, 32]
  };

  const { dates, englishCounts, spanishCounts } = dummyData;

  const chartoptions = {
    series: [
      {
        name: "English",
        data: analytics?.englishCounts,
      },
      {
        name: "Spanish",
        data: analytics?.spanishCounts,
      },
    ],
    options: {
      chart: {
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        strokeDashArray: 3,
        borderColor: "rgba(0,0,0,0.1)",
      },

      stroke: {
        curve: "smooth",
        width: 1,
      },
      xaxis: {
        categories: analytics?.dates?.map(date => new Date(date).toLocaleDateString()), // Convert dates to local date strings
      },
    },
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Sales Summary</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          Yearly Sales Report
        </CardSubtitle>
        <Chart
          type="area"
          width="100%"
          height="390"
          options={chartoptions.options}
          series={chartoptions.series}
        />
      </CardBody>
    </Card>
  );
};

export default SalesChart;
