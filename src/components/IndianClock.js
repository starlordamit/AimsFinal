import React, { useState, useEffect } from "react";
import { Typography } from "antd";

const { Text } = Typography;

function IndianClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const indiaTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      setTime(indiaTime);
    };

    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={styles.container}>
      <Text style={styles.time}>
        {time.toLocaleTimeString("en-IN", { hour12: true }).toUpperCase()}
      </Text>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    // padding: "8px",
    // background: "rgba(0, 0, 0, 0.8)",
    // borderRadius: "8px",
    // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    // minWidth: "150px",
  },
  time: {
    fontSize: "14px",
    fontFamily: '"Courier New", Courier, monospace',
    fontWeight: "normal",
    color: "white",
  },
};

export default IndianClock;
