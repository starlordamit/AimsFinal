import React, { useState, useEffect } from "react";
import { format } from "date-fns"; // Ensure date-fns is installed

function TodayLectures() {
  const [todayLectures, setTodayLectures] = useState([]);
  const today = new Date();
  const formattedDate = format(today, "d"); // 'd' formats the date as day of the month

  useEffect(() => {
    const allLectures = JSON.parse(sessionStorage.getItem("timeTableData")); // Ensure this data is correctly stored in sessionStorage
    const filteredLectures = allLectures.filter((lecture) => {
      const dayLecture = lecture[`c${formattedDate}`]; // Accessing dynamically based on the day of the month
      return dayLecture && dayLecture.trim() !== "";
    });

    const sortedLectures = filteredLectures.sort((a, b) => {
      // Assuming time is in the format 'HH:MM - HH:MM'
      const startTimeA = getTime(a[`c${formattedDate}`]);
      const startTimeB = getTime(b[`c${formattedDate}`]);
      return startTimeA - startTimeB;
    });

    setTodayLectures(sortedLectures);
  }, [formattedDate]); // Dependency on formattedDate

  // Helper function to parse time from the lecture time string
  function getTime(timeString) {
    const time = timeString.match(/\d{2}:\d{2}/); // Matches the HH:MM pattern
    return time ? new Date(`1970/01/01 ${time[0]}`) : new Date();
  }

  return (
    <div>
      <h1>Today's Lectures</h1>
      {todayLectures.map((lecture, index) => (
        <div key={index}>
          <h2>{lecture.course_name}</h2>
          <p>{lecture[`c${formattedDate}`]}</p>{" "}
          {/* Using formattedDate here should be valid now */}
        </div>
      ))}
    </div>
  );
}

export default TodayLectures;
