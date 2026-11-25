// ─────────────────────────────────────────────────────────────
//  Colour variations guests can pick from. Each pick goes in their
//  cart, so you know exactly which colours & quantities to prepare.
//
//  • Each entry uses a photo from public/colorways/. To add a colour, drop a
//    transparent PNG/WebP there and add an entry below (a new unique `id`).
//  • `id`s are saved with every RSVP — don't rename them after people book.
// ─────────────────────────────────────────────────────────────

export const PRODUCTS = {
  bouquet:  { id: "bouquet",  label: "Scented Bouquet", plural: "Scented Bouquets" },
  scent:    { id: "scent",    label: "Mini Perfume Scent", plural: "Perfume Scents" },
};

const BG = ["#DDE1D4", "#EFE2D2", "#E3E6DA", "#F1D7D6", "#EADFD2", "#DCE0D1"]; // soft panel tints behind the photos

const make = (product, list) =>
  list.map(([id, name, note, swatches], i) => ({
    id, name, note, swatches, bg: BG[i % BG.length],
    image: `/colorways/${product}-${id}.webp`,
  }));

export const bouquetColorways = make("bouquet", [
  ["soft-pink",        "Soft Pink",        "Pink lily with white peonies",        ["#F08DB2", "#FFFFFF", "#F4B9A3"]],
  ["ruby-red",         "Ruby Red",         "Deep red lily with white peonies",    ["#B3122E", "#FFFFFF", "#F4B9A3"]],
  ["snow-white",       "Snow White",       "All-white lily and peonies",          ["#FFFFFF", "#EFE9E0", "#F4B9A3"]],
  ["golden-yellow",    "Golden Yellow",    "Sunny yellow lily with white peonies",["#F5B820", "#FFFFFF", "#F4B9A3"]],
  ["lavender",         "Lavender",         "Soft purple lily with white peonies", ["#9B7FD0", "#FFFFFF", "#F4B9A3"]],
  ["tangerine-orange", "Tangerine Orange", "Bright orange lily with white peonies",["#F26A1B", "#FFFFFF", "#F4B9A3"]],
]);

// Mini-perfume scents. Each uses a poster image from public/scents/<id>.webp
// (the poster already shows the name, scent category and description).
export const scentColorways = [
  ["my-way",         "My Way",              "White Floral",                  ["#E0BDEB"]],
  ["libre",          "Libre",               "Aromatic Floral",               ["#A9B4E8"]],
  ["pleasures",      "Pleasures",           "Fresh Floral",                  ["#B5CDB5"]],
  ["pink-chiffon",   "Pink Chiffon",        "Fruity Floral",                 ["#E8B864"]],
  ["pure-seduction", "Pure Seduction",      "Fruity Floral",                 ["#D88C95"]],
  ["rihanna-riri",   "Rihanna Riri",        "Fruity Floral",                 ["#F0A58A"]],
  ["jadore",         "J'adore",             "Fruity Floral",                 ["#C9A8E8"]],
  ["chance-chanel",  "Chance Chanel",       "Fruity Floral",                 ["#A8E8CB"]],
  ["gucci-flora",    "Gucci Flora",         "Floral Fruity",                 ["#F2C4AE"]],
  ["good-girl",      "Good Girl",           "Sweet Amber / Gourmand",        ["#F5E3A0"]],
].map(([id, name, note, swatches]) => ({
  id, name, note, swatches, bg: "#000000",
  image: `/scents/${id}.webp`,
}));

export const colorways = { bouquet: bouquetColorways, scent: scentColorways };

export function findColorway(product, id) {
  return (colorways[product] || []).find((c) => c.id === id);
}
