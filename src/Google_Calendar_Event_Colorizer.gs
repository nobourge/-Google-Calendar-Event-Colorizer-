function ColorEvents() {
  var cache = CacheService.getScriptCache();
  var today = new Date();
  var nextmonth = new Date();
  var nextyear = new Date();
  nextmonth.setDate(today.getDate() + 31);
  nextyear.setDate(today.getDate() + 365);

  var colorRules = {
    "meeting": CalendarApp.EventColor.ORANGE,
    "!": CalendarApp.EventColor.RED,
    "call": CalendarApp.EventColor.YELLOW,
    "party": CalendarApp.EventColor.MAUVE
  };

  var processedEvents = JSON.parse(cache.get("processedEvents") || "{}");
  var calendars = CalendarApp.getAllOwnedCalendars();

  calendars.forEach(calendar => {
    try {
      var events = calendar.getEvents(today, nextyear);
      if (events.length === 0) return;

      events.forEach(e => {
        if (processedEvents[e.getId()]) return; // Skip already processed
        processedEvents[e.getId()] = true;

        var title = e.getTitle().toLowerCase();
        for (var keyword in colorRules) {
          if (title.includes(keyword)) {
            e.setColor(colorRules[keyword]);
            break;
          }
        }
      });
    } catch (error) {
      Logger.log("Error processing calendar: " + calendar.getName() + " - " + error);
    }
  });

  cache.put("processedEvents", JSON.stringify(processedEvents), 600);
}

