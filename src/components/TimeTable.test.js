import { render, screen } from "@testing-library/react";
import TimeTable from "./TimeTable"; // Adjust the path according to your structure

describe("isCurrentOrConsecutiveClass", () => {
  // Mock current time: 08:50 AM
  it("should return true at the start of the class at 08:50 AM", () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date("2023-05-01T08:50:00Z").getTime());
    const timeString = "08:50 - 09:40";
    expect(isCurrentOrConsecutiveClass(timeString)).toBeTruthy();
  });

  // Mock current time: 09:20 AM
  it("should return true during the class at 09:20 AM", () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date("2023-05-01T09:20:00Z").getTime());
    const timeString = "08:50 - 09:40";
    expect(isCurrentOrConsecutiveClass(timeString)).toBeTruthy();
  });

  // Mock current time: 09:40 AM
  it("should return true at the end of the class at 09:40 AM", () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date("2023-05-01T09:40:00Z").getTime());
    const timeString = "08:50 - 09:40";
    expect(isCurrentOrConsecutiveClass(timeString)).toBeTruthy();
  });

  // Mock current time: 09:41 AM
  it("should return false just after the class at 09:41 AM", () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date("2023-05-01T09:41:00Z").getTime());
    const timeString = "08:50 - 09:40";
    expect(isCurrentOrConsecutiveClass(timeString)).toBeFalsy();
  });
});
