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
import axios from "axios";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import TimelineItem from "examples/Timeline/TimelineItem";
import { useEffect, useState } from "react";

function OrdersOverview(props) {
  const [logs, setLogs] = useState([]);

  // Fetch logs from the backend
  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await axios.get("http://localhost:8000/logs");
        setLogs(response.data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    }

    fetchLogs();

    // Optionally, set an interval to refresh logs every few seconds
    const interval = setInterval(() => {
      fetchLogs();
    }, 2000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-100">
      <SoftBox p={2}>
        {logs.map((log, index) => (
          <TimelineItem
            key={index}
            color={log.flood_alert ? "error" : log.sms_alert_sent ? "warning" : "info"} // Corrected 'sms_sent' to 'sms_alert_sent'
            icon={log.flood_alert ? "warning" : log.sms_alert_sent ? "mail" : "show_chart"} // Corrected 'sms_sent' to 'sms_alert_sent'
            title={
              log.flood_alert
                ? `Flood Alert: ${log.level}cm`
                : log.sms_alert_sent
                ? `Warning Sent: ${log.level}cm`
                : `${log.level}cm, Water Level`
            } // Corrected 'sms_sent' to 'sms_alert_sent'
            dateTime={new Date(log.timestamp).toLocaleString()} // Format the timestamp as needed
          />
        ))}
      </SoftBox>
    </Card>
  );
}

export default OrdersOverview;
