// Create new Lingo
var en = new Lingo();
en.ids = ["en", "en-gb", "en-us"]
en.name = "English";
en.shortname = "English";
en.flagIcon = "EN";

// Lingolist
LingoList.storeLingo(en);
delete (en);