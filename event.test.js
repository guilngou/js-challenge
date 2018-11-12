const { Event, eventList, simpleSum } = require("./event");
const moment = require("moment");

test("Adding 1 + 1 equals 2", () => {
  expect(simpleSum(1, 1)).toBe(2);
});
test("Adding 1 + 1 does not equal 1", () => {
  expect(simpleSum(1, 1)).not.toBe(1);
});
test("Adding an event", () => {
  let startDate = moment(new Date(2018, 6, 2, 10, 30));
  let endDate = moment(new Date(2018, 6, 2, 14, 0));
  // let startDate = moment("2011-10-10T10:20:90");
  // let endDate = moment("2011-10-10T10:20:90");
  let range = moment.range(startDate, endDate);
  new Event(true, true, startDate, endDate, range);
});
test("Availabilities", () => {
  let startDate = moment(new Date(2018, 6, 2, 10, 30));
  let endDate = moment(new Date(2018, 6, 2, 14, 0));
  // let startDate = moment("2011-10-10T10:20:90");
  // let endDate = moment("2011-10-10T10:20:90");
  let range = moment.range(startDate, endDate);
  new Event(true, true, startDate, endDate, range);
  // new Event("true", true, startDate, endDate, range);

  // The company is available on tuesday 3rd of july, from 11:30 to 16:00
  startDate = moment(new Date(2018, 6, 3, 11, 30));
  endDate = moment(new Date(2018, 6, 3, 16, 0));
  range = moment.range(startDate, endDate);
  new Event(true, false, startDate, endDate, range);

  // INTERVENTIONS //
  // The company has an intervention scheduled tuesday 3rd of july, from 12:30 to 13:00
  startDate = moment(new Date(2018, 6, 3, 12, 30));
  endDate = moment(new Date(2018, 6, 3, 13, 0));
  range = moment.range(startDate, endDate);
  new Event(false, false, startDate, endDate, range);

  // The company has an intervention scheduled tuesday 9th of july, from 13:30 to 14:00
  startDate = moment(new Date(2018, 6, 9, 13, 30));
  endDate = moment(new Date(2018, 6, 9, 14, 0));
  range = moment.range(startDate, endDate);
  new Event(false, false, startDate, endDate, range);

  // MAIN RESPONSE //
  // The resident wants to know availabilities from 3rd of July,
  // 10AM, to 15th of July, 10AM
  const fromDate = moment(new Date(2018, 6, 3, 10, 0));
  const toDate = moment(new Date(2018, 6, 15, 10, 0));
  const customerRange = moment.range(fromDate, toDate);
  Event.prototype.availabilities(fromDate, toDate, customerRange);
});
