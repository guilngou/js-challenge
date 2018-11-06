// This is the Event class
// An event is either opening (available) or busy (intervention)
// An opening event can be recurring (it means it repeats itself on the same day, same hours the next weeks)
// An event has a start date and an end date, preferably the same day.

// The eventlist is used to push all the events in a global variable
// Feel free to use your own implementation / different lists
var eventList = [];

var Event = function(opening, recurring, startDate, endDate){
  this.opening = opening;
  this.recurring = recurring;
  this.startDate = startDate;
  this.endDate = endDate;

  // when an event is created, push it to the class variable
  eventList.push(this);
};


// This method should return the availabilities of the company
// Only "available" events should be displayed
// You can use slots, or return the availabilities the way you want
Event.prototype.availabilities = function(fromDate, toDate){
  return //Something awesome;
};