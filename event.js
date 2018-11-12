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

  if (eventValidator(this).bool) {
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
  const isValid = { bool: true, messageError: "" };
  if (!(typeof event.opening === "boolean")) {
    isValid.messageError += "Opening is not valid. ";
  }
  if (!(typeof event.recurring === "boolean")) {
    isValid.messageError += "Recurring is not valid. ";
  }
  if (
    typeof event.opening === "boolean" &&
    typeof event.recurring === "boolean"
  ) {
    if (!event.opening && event.recurring) {
      isValid.messageError += "A busy event can not be recurring. ";
    }
  }
  if (!event.startDate.isValid()) {
    isValid.messageError += "Start date is not valid. ";
  }
  if (!event.endDate.isValid()) {
    isValid.messageError += "End date is not valid. ";
  }
  if (!moment.isRange(event.range)) {
    isValid.messageError += "Range is not valid. ";
  }
  if (!(isValid.messageError.length == 0)) {
    isValid.messageError += `(event n°${event.eventId}) `;
    isValid.bool = false;
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
  availableRanges = substractRanges(openingRangesInCustomerRange, busyRanges);
  const availableRangesSorted = availableRanges.sort(
    (a, b) => a.start - b.start
  );

  console.log(formatOutput(availableRangesSorted));
  return formatOutput(availableRangesSorted);
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
  return output;
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

const substractRanges = (sourceRange, otherRanges) => {
  if (!Array.isArray(sourceRange)) {
    sourceRange = [sourceRange];
  }
  if (!Array.isArray(otherRanges)) {
    otherRanges = [otherRanges];
  }
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

module.exports = {
  Event,
  eventList,
  eventValidator,
  nth,
  substractRanges,
  formatOutput
};
