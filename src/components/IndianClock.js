import React, { useState, useEffect } from "react";

function IndianClock() {
  const [time, setTime] = useState(new Date()); // Initialize state with the current time

  useEffect(() => {
    // Function to update time
    const updateTime = () => {
      const now = new Date();
      const indiaTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );
      setTime(indiaTime);
    };

    // Set interval to update time every second
    const intervalId = setInterval(updateTime, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {/* <h2>Current Time in India (IST)</h2> */}
      <p>{time.toLocaleTimeString("en-IN").toUpperCase()}</p>
    </div>
  );
}

export default IndianClock;
