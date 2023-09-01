
function ColorEvents() {
  // Initialize Cache Service
  var cache = CacheService.getScriptCache();
  
  var today = new Date();
  var nextmonth = new Date();
  nextmonth.setDate(nextmonth.getDate() + 31);
  
  // Cache today and nextmonth dates for 10 minutes
  cache.put("today", today.toString(), 600);
  cache.put("nextmonth", nextmonth.toString(), 600);
  
  // Fetch calendars
  var calendars = CalendarApp.getAllOwnedCalendars();
  
  // Cache the list of calendar IDs for 10 minutes
  var calendarIds = calendars.map(c => c.getId());
  cache.put("calendarIds", JSON.stringify(calendarIds), 600);
  
  calendars.forEach(calendar => {
    var events = calendar.getEvents(today, nextmonth);
    
    // Skip empty calendars
    if (events.length === 0) return;
    
    events.forEach(e => {
      var title = e.getTitle().toLowerCase();
      if (title.includes("meeting")) {
        e.setColor(CalendarApp.EventColor.ORANGE);
      } else if (title.includes("!")) {
        e.setColor(CalendarApp.EventColor.RED);
      }
    });
  });
}
