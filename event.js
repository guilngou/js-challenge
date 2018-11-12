const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);
const lodash = require("lodash");
const flatten = lodash.flatten;
// This is the Event class
// An event is either opening (available) or busy (intervention)
// An opening event can be recurring (it means it repeats itself on the same day, same hours the next weeks)
// An event has a start date and an end date, preferably the same day.

// The eventlist is used to push all the events in a global variable
// Feel free to use your own implementation / different lists
const eventList = [];
const openingEventList = [];
const busyRanges = [];
let availableRanges = [];
let eventId = 0;

const Event = function(opening, recurring, startDate, endDate, range) {
  this.opening = opening;
  this.recurring = recurring;
  this.startDate = startDate;
  this.endDate = endDate;
  this.range = range;
  this.eventId = ++eventId;

  if (eventValidator(this)) {
    // when an event is created and valid, push it to the class variable
    eventList.push(this);
    if (opening) {
      openingEventList.push(this);
    } else {
      busyRanges.push(range);
    }
  }
};

const eventValidator = event => {
  let isValid = true;
  let messageError = "";
  messageError += `Event n°${event.eventId}: `;
  if (!(typeof event.opening === "boolean")) {
    messageError += "Opening is not valid. ";
    isValid = false;
  }
  if (!(typeof event.recurring === "boolean")) {
    messageError += "Recurring is not valid. ";
    isValid = false;
  }
  if (!event.startDate.isValid()) {
    messageError += "Start date is not valid. ";
    isValid = false;
  }
  if (!event.endDate.isValid()) {
    messageError += "End date is not valid. ";
    isValid = false;
  }
  if (!moment.isRange(event.range)) {
    messageError += "Range is not valid. ";
    isValid = false;
  }
  if (!isValid) {
    console.error(messageError);
  }
  return isValid;
};

// This method should return the availabilities of the company
// Only "available" events should be displayed
// You can use slots, or return the availabilities the way you want
Event.prototype.availabilities = function(fromDate, toDate, customerRange) {
  const openingRangesInCustomerRange = [];
  for (const event of openingEventList) {
    // Evenements non récurrents //////////////////////////////
    if (event.range.overlaps(customerRange) && !event.recurring) {
      openingRangesInCustomerRange.push(event.range.intersect(customerRange));
    }
    ///////////////////////////////////////////////////////////
    // Evenements récurrents //////////////////////////////////
    if (event.recurring && event.startDate.isBefore(toDate)) {
      while (event.startDate.isBefore(toDate)) {
        if (event.range.overlaps(customerRange)) {
          openingRangesInCustomerRange.push(
            event.range.intersect(customerRange)
          );
        }
        event.startDate = event.startDate.add(7, "days");
        event.endDate = event.endDate.add(7, "days");
        event.range = moment.range(event.startDate, event.endDate);
      }
    }
    ///////////////////////////////////////////////////////////
  }
  availableRanges = subtractRanges(openingRangesInCustomerRange, busyRanges);
  const availableRangesSorted = availableRanges.sort(
    (a, b) => a.start - b.start
  );

  formatOutput(availableRangesSorted);
};

const formatOutput = rangesToOutput => {
  let output = "";
  const startDate = moment(new Date(2000, 1, 1, 0, 0));
  const endDate = moment(new Date(2000, 1, 1, 0, 30));
  const thirtyMinutesRange = moment.range(startDate, endDate);
  let currentDate = moment("2000-01-01");
  for (const range of rangesToOutput) {
    const slots = Array.from(
      range.byRange(thirtyMinutesRange, { excludeEnd: true })
    );
    for (const slot of slots) {
      if (!currentDate.isSame(slot, "day")) {
        const day = nth(parseInt(slot.format("D")));
        currentDate = slot;
        if (!!output) {
          output = output.substring(0, output.length - 2);
          output += `\nI'm available on ${slot.format(
            "MMMM D"
          )}${day}, at ${slot.format("HH:mm")}, `;
        } else {
          output += `I'm available on ${slot.format(
            "MMMM D"
          )}${day}, at ${slot.format("HH:mm")}, `;
        }
      } else {
        output += `${slot.format("HH:mm")}, `;
      }
    }
  }
  output = output.substring(0, output.length - 2);
  output += "\nI'm not available any other time !";
  console.log("output :");
  console.log(output);
};

const nth = d => {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const subtractRanges = (sourceRange, otherRanges) => {
  return flatten(
    sourceRange.map(s => {
      return flatten(otherRanges).reduce(
        (remaining, o) => {
          return flatten(remaining.map(r => r.subtract(o)));
        },
        [s]
      );
    })
  );
};

const simpleSum = (a, b) => a + b;

module.exports = { simpleSum, Event, eventList };
