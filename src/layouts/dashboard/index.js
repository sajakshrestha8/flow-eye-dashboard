/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Soft UI Dashboard React base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import BuildByDevelopers from "layouts/dashboard/components/BuildByDevelopers";
import WorkWithTheRockets from "layouts/dashboard/components/WorkWithTheRockets";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
import axios from "axios";
import { useEffect, useState } from "react";
import { max } from "moment";

function Dashboard() {
  const { size } = typography;
  const { chart, items } = reportsBarChartData;
  const [waterLevel, setWaterLevel] = useState("");

  async function fetchin_water_data() {
    try {
      const response = await axios.get("http://localhost:8000/latest-data");

      // response.data contains the array of data
      const fetchedData = response.data;

      if (fetchedData.length > 0) {
        // Access the first item in the array
        const firstItem = fetchedData[0];
        console.log(firstItem.id);
        setWaterLevel(firstItem.level);

        // Optionally, set the water level using firstItem.level
        // setWaterLevel(firstItem.level);
      } else {
        console.log("No data found");
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchin_water_data(); // Initial fetch

    const interval = setInterval(() => {
      fetchin_water_data(); // Fetch data every 5 seconds
    }, 2000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <DashboardLayout>
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Water Level-Station 1" }}
                count={waterLevel + "cm"}
                icon={{ color: "success", component: "cell_tower" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Other Station" }}
                count="-"
                icon={{
                  color: "error",
                  component: "cell_tower",
                }}
              />
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <GradientLineChart
                title="Level Readings"
                description={<SoftBox display="flex" alignItems="center"></SoftBox>}
                height="25.80rem"
                chart={gradientLineChartData}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <OrderOverview />
            </Grid>

            {/* <button onClick={fetchin_water_data}>Clickme</button> */}
          </Grid>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
}

export default Dashboard;
