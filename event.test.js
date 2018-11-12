const { Event, eventList, simpleSum, eventValidator, nth } = require("./event");
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);

describe("Unit tests", () => {
  test("constructor", () => {
    let startDate = moment(new Date(2018, 6, 2, 10, 30));
    let endDate = moment(new Date(2018, 6, 2, 14, 0));
    let range = moment.range(startDate, endDate);
    let event = new Event(true, true, startDate, endDate, range);
    expect(event.opening).toBeTruthy();
    expect(event.recurring).toBeTruthy();
    expect(event.startDate).toEqual(startDate);
    expect(event.endDate).toEqual(endDate);
    expect(event.range).toEqual(range);
    expect(event.eventId).toEqual(1);
  });
  test("eventValidator, event is valid", () => {
    let startDate = moment(new Date(2018, 6, 2, 10, 30));
    let endDate = moment(new Date(2018, 6, 2, 14, 0));
    let range = moment.range(startDate, endDate);
    let event = new Event(true, true, startDate, endDate, range);
    expect(eventValidator(event).bool).toBeTruthy();
  });
  test("eventValidator, event is not valid", () => {
    let startDate = moment(new Date(2018, 6, 2, 10, 30));
    let endDate = moment(new Date(2018, 6, 2, 14, 0));
    let range = moment.range(startDate, endDate);
    let event = new Event("sqdqsd", true, startDate, endDate, range);
    expect(eventValidator(event).bool).toBeFalsy();
    expect(eventValidator(event).messageError).toEqual(
      "Opening is not valid. (event n°3) "
    );
  });
  test("eventValidator, a busy event can not be recurring", () => {
    let startDate = moment(new Date(2018, 6, 2, 10, 30));
    let endDate = moment(new Date(2018, 6, 2, 14, 0));
    let range = moment.range(startDate, endDate);
    let event = new Event(false, true, startDate, endDate, range);
    expect(eventValidator(event).bool).toBeFalsy();
    expect(eventValidator(event).messageError).toEqual(
      "A busy event can not be recurring. (event n°4) "
    );
  });
  test("nth", () => {
    for (let i = 1; i < 32; i++) {
      if (i > 3 && i < 21) {
        expect(nth(i)).toEqual("th");
      }
      if (i < 4 || i > 20) {
        switch (i % 10) {
          case 1:
            expect(nth(i)).toEqual("st");
            break;
          case 2:
            expect(nth(i)).toEqual("nd");
            break;
          case 3:
            expect(nth(i)).toEqual("rd");
            break;
          default:
            expect(nth(i)).toEqual("th");
            break;
        }
      }
    }
  });
});
// describe("Integration tests", () => {
//   test("Adding 1 + 1 equals 2", () => {
//     expect(simpleSum(1, 1)).toBe(2);
//   });
//   test("Adding 1 + 1 does not equal 1", () => {
//     expect(simpleSum(1, 1)).not.toBe(1);
//   });
//   test("Adding an event", () => {
//     let startDate = moment(new Date(2018, 6, 2, 10, 30));
//     let endDate = moment(new Date(2018, 6, 2, 14, 0));
//     // let startDate = moment("2011-10-10T10:20:90");
//     // let endDate = moment("2011-10-10T10:20:90");
//     let range = moment.range(startDate, endDate);
//     let event = new Event(true, true, startDate, endDate, range);
//     //console.log(event);
//   });
//   test("Availabilities", () => {
//     let startDate = moment(new Date(2018, 6, 2, 10, 30));
//     let endDate = moment(new Date(2018, 6, 2, 14, 0));
//     // let startDate = moment("2011-10-10T10:20:90");
//     // let endDate = moment("2011-10-10T10:20:90");
//     let range = moment.range(startDate, endDate);
//     new Event(true, true, startDate, endDate, range);
//     // new Event("true", true, startDate, endDate, range);

//     // The company is available on tuesday 3rd of july, from 11:30 to 16:00
//     startDate = moment(new Date(2018, 6, 3, 11, 30));
//     endDate = moment(new Date(2018, 6, 3, 16, 0));
//     range = moment.range(startDate, endDate);
//     new Event(true, false, startDate, endDate, range);

//     // INTERVENTIONS //
//     // The company has an intervention scheduled tuesday 3rd of july, from 12:30 to 13:00
//     startDate = moment(new Date(2018, 6, 3, 12, 30));
//     endDate = moment(new Date(2018, 6, 3, 13, 0));
//     range = moment.range(startDate, endDate);
//     new Event(false, false, startDate, endDate, range);

//     // The company has an intervention scheduled tuesday 9th of july, from 13:30 to 14:00
//     startDate = moment(new Date(2018, 6, 9, 13, 30));
//     endDate = moment(new Date(2018, 6, 9, 14, 0));
//     range = moment.range(startDate, endDate);
//     new Event(false, false, startDate, endDate, range);

//     // MAIN RESPONSE //
//     // The resident wants to know availabilities from 3rd of July,
//     // 10AM, to 15th of July, 10AM
//     const fromDate = moment(new Date(2018, 6, 3, 10, 0));
//     const toDate = moment(new Date(2018, 6, 15, 10, 0));
//     const customerRange = moment.range(fromDate, toDate);
//     Event.prototype.availabilities(fromDate, toDate, customerRange);
//   });
// });
