// ─────────────────────────────────────────────────────────────
//  Everything on the site that describes the event lives here.
//  Items marked TODO need your real details before you publish.
// ─────────────────────────────────────────────────────────────

export const eventDetails = {
  name:         "Made by Me Crafts",
  eventTitle:   "Made by Me Workshop",
  workshopName: "Make Your Scented Bouquet",
  tagline:      "A celebration of self-expression, creativity & thoughtful gifting",
  edition:      "Lily Edition · Made by Me Workshop at Social Addis",

  date:         "Sunday, November 29, 2026",
  dateShort:    "Sun · Nov 29",
  // TODO: confirm the start time and add it here (e.g. "2:00 PM") — it isn't shown on the site until you do
  time:         "",

  venue:        "Social Addis",
  // TODO: add the street address / pin for Social Addis
  address:      "Addis Ababa",
  drinkPartner: "Sene Tea",

  instagramUrl: "https://instagram.com/madebyme.4",
  telegram:     "https://t.me/azagbrazm",
  phone:        "+251945127874",
  email:        "madebymecrafts.4@gmail.com",

  // One ticket covers the activities, refreshment, games & karaoke and the blind gift
  entranceFee:  1300,
  currency:     "birr",
};

export const hosts = [
  { handle: "@Madebymecrafts.4", url: "https://instagram.com/madebymecrafts.4" },
  { handle: "@cherryearrings4",  url: "https://instagram.com/cherryearrings4" },
];

// The workshop, shown as one combined card
export const activities = [
  {
    id:       "bouquet-keychain",
    name:     "Flower Bouquet & Key Chain",
    tagline:  "Lilies, peonies & a pocket-size keepsake",
    description:
      "Build a bouquet that looks as good as it smells — a lily as the star of the show, three peonies and a mini perfume in the scent you choose. Then shrink it down to pocket size and make a tiny flower key chain to carry everywhere. Pick your bouquet colour and perfume scent below.",
    makes:    ["Mainly lily flowers", "3 peony flowers", "Mini perfume", "Miniature bouquet key chain", "Yours to keep"],
    color:    "#DBA1A3",
  },
];

export const experience = [
  { icon: "🌸", label: "Make your own",       note: "Handmade bouquet & key chain, made by you" },
  { icon: "💐", label: "Quality time",        note: "Come with friends — or make one here" },
  { icon: "🎤", label: "Music & karaoke",     note: "Sing along, dance, soak it all in" },
  { icon: "🎀", label: "Fun games",           note: "Little games with little surprises" },
  { icon: "🪷", label: "Whimsical vendors",   note: "Pretty, one-of-a-kind finds to browse" },
];

export const ticketIncludes = [
  "Both crafting activities",
  "Refreshment — tea from Sene",
  "Games, music & karaoke",
  "Mini perfume in the scent you pick",
  "Blind gift from Made by Me",
];

// What you'll take home — shown with one photo (public/takehome/take-home.jpg)
export const takeHomeImage = "/takehome/take-home.jpg";
export const takeHome = [
  { id: "bouquet",  name: "Scented bouquet",  note: "Lilies & peonies, wrapped in the colours you picked" },
  { id: "keychain", name: "Flower key chain", note: "A tiny tulip bouquet to carry everywhere" },
  { id: "perfume",  name: "Mini perfume",     note: "A roll-on scent to finish your bouquet" },
  { id: "gift",     name: "Blind gift",       note: "A mystery surprise from Made by Me" },
];
