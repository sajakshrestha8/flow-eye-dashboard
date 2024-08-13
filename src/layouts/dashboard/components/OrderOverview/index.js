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
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import TimelineItem from "examples/Timeline/TimelineItem";

function OrdersOverview() {
  return (
    <Card className="h-100">
      <SoftBox pt={3} px={3}>
        <SoftTypography variant="h6" fontWeight="medium">
          Log
        </SoftTypography>
      </SoftBox>
      <SoftBox p={2}>
        <TimelineItem
          color="info"
          icon="show_chart"
          title="50cm, Water Level"
          dateTime="13 AUG 7:20 PM"
        />
        <TimelineItem
          color="warning"
          icon="mail"
          title="Warning Message Sent"
          dateTime="14 AUG  10:35 PM"
        />
        <TimelineItem
          color="error"
          icon="warning"
          title="Flood Alert - 70cm"
          dateTime="14 AUG 11 PM"
        />
        <TimelineItem
          color="info"
          icon="show_chart"
          title="60cm, Water Level"
          dateTime="13 AUG 7:20 PM"
        />
        <TimelineItem
          color="info"
          icon="show_chart"
          title="65cm, Water Level"
          dateTime="13 AUG 7:20 PM"
        />
        <TimelineItem
          color="info"
          icon="show_chart"
          title="70cm, Water Level"
          dateTime="13 AUG 7:20 PM"
        />
        <TimelineItem
          color="info"
          icon="show_chart"
          title="80cm, Water Level"
          dateTime="13 AUG 7:20 PM"
        />
      </SoftBox>
    </Card>
  );
}

export default OrdersOverview;
