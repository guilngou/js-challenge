const { Event, eventList, simpleSum } = require("./event");
const moment = require("moment");

test("Adding 1 + 1 equals 2", () => {
  expect(simpleSum(1, 1)).toBe(2);
});
test("Adding 1 + 1 does not equal 1", () => {
  expect(simpleSum(1, 1)).not.toBe(1);
});
test("Adding an event", () => {
  let startDate = moment(new Date(2018, 6, 1, 10, 30)); // July 1st, 10:30
  let endDate = moment(new Date(2018, 6, 1, 14, 0)); // July 1st, 14:00
  new Event(true, true, startDate, endDate);
});
test("Availabilities", () => {
  startDate = moment(new Date(2018, 6, 1, 10, 30)); // July 1st, 10:30
  endDate = moment(new Date(2018, 6, 1, 14, 0)); // July 1st, 14:00
  new Event(true, true, startDate, endDate);
});
