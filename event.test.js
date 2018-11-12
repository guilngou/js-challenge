const {
  Event,
  eventList,
  eventValidator,
  nth,
  substractRanges
} = require("./event");
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
  test("substractRanges", () => {
    let startDate = moment(new Date(2018, 6, 2, 10, 0));
    let endDate = moment(new Date(2018, 6, 2, 14, 0));
    let range1 = moment.range(startDate, endDate);
    startDate = moment(new Date(2018, 6, 2, 10, 0));
    endDate = moment(new Date(2018, 6, 2, 11, 0));
    let range2 = moment.range(startDate, endDate);
    startDate = moment(new Date(2018, 6, 2, 11, 0));
    endDate = moment(new Date(2018, 6, 2, 14, 0));
    let range3 = moment.range(startDate, endDate);
    let result = substractRanges(range1, range2);
    expect(result[0].isSame(range3)).toBeTruthy();
  });
  test("formatOutput", () => {});
});
