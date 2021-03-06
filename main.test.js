const { Event } = require("./event");
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);

test("Availabilities", () => {
  // AVAILABILITIES //
  // The company is available every monday, from 10:30 to 14:00, beginning the 2nd of July
  let startDate = moment(new Date(2018, 6, 2, 10, 30));
  let endDate = moment(new Date(2018, 6, 2, 14, 0));
  let range = moment.range(startDate, endDate);
  new Event(true, true, startDate, endDate, range);

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
  expect(
    Event.prototype.availabilities(fromDate, toDate, customerRange)
  ).toEqual(
    "I'm available on July 3rd, at 11:30, 12:00, 13:00, 13:30, 14:00, 14:30, 15:00, 15:30\nI'm available on July 9th, at 10:30, 11:00, 11:30, 12:00, 12:30, 13:00\nI'm not available any other time !"
  );
});
