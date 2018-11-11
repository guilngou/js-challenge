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
const openingRanges = [];
const busyRanges = [];
let availableRanges = [];

const Event = function(opening, recurring, startDate, endDate, range) {
  this.opening = opening;
  this.recurring = recurring;
  this.startDate = startDate;
  this.endDate = endDate;
  this.range = range;

  // when an event is created, push it to the class variable
  eventList.push(this);

  if (opening) {
    openingRanges.push(range);
  } else {
    busyRanges.push(range);
  }
};

// This method should return the availabilities of the company
// Only "available" events should be displayed
// You can use slots, or return the availabilities the way you want
Event.prototype.availabilities = function(fromDate, toDate) {
  console.log("availableRanges : ");
  console.log(subtractRanges(openingRanges, busyRanges));
  return; //Something awesome;
};

const subtractRanges = (open, busy) => {
  return flatten(
    open.map(s => {
      return flatten(busy).reduce(
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
