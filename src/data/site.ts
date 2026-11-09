// Facts for I&A Parfums. Business details are the company's (same shop as Schoolwear, Fashions and Tailoring).
// Anything the client has not confirmed lives in toConfirm and appears on pages only as a labelled placeholder.
export const SITE = {
  name: "I&A Parfums",
  legalName: "I & A Fashions Limited",
  tradingAs: "I & A Parfums",
  companyNumber: "07202123",
  vat: "338770178",
  since: 1993,
  address: { street: "84 Mitcham Road", area: "Tooting", city: "London", postcode: "SW17 9NG" },
  phone: "020 8767 8613",
  phoneIntl: "+442087678613",
  hours: "Monday to Sunday, 9am to 6pm",
  email: "",
  social: { instagram: "https://www.instagram.com/iafashions/", facebook: "https://www.facebook.com/iafashions/" },
  url: "https://sheedosa.github.io/iana-parfums",
  family: [
    { name: "I&A Fashions", url: "https://sheedosa.github.io/iana-fashions/" },
    { name: "I&A Tailoring", url: "https://sheedosa.github.io/iana-tailoring/" },
    { name: "I&A Schoolwear", url: "https://sheedosa.github.io/iana-schoolwear/" },
  ],
  // Confirmed by the client.
  bottlesFrom: 150, // GBP, 50ml and up
  delivery: {
    standard: { price: 4.95, time: "5 working days" },
    express: { price: 7.95, time: "48 hours" },
    freeOver: 100,
    collect: "84 Mitcham Road, Tooting",
  },
  returns: { days: 28, excluded: ["suits", "bridal dresses", "prom dresses"] },
  // What the client wants to sell, confirmed: samples, sample sets, gift boxes and a seasonal subscription.
  preview: true, // concept preview: sample scents, ordering switched off
  toConfirm: [
    "Brand name (client considering M.H.T); I & A Parfums is the working name",
    "the range: names, notes and stories (four samples here, one per family, with working names Wandle, Furzedown, Common and Mitcham)",
    "whether the scents are the client's own or a bought-in range",
    "2ml sample price (shown as £[SAMPLE PRICE])",
    "per-scent bottle prices (sample prices shown; bottles from £150 is confirmed)",
    "Proposed: the sample credit (the 2ml price comes off the bottle) and how it is applied",
    "discovery set price and whether it is credited in full or in part",
    "gift box: what is in it and the price",
    "the seasonal edition: what each edition contains, price and how often it is sent",
    "the perfumer, where the scents are blended and bottled, and the materials",
    "concentration (eau de parfum assumed), alcohol base, vegan or cruelty-free claims",
    "returns on opened perfume bottles and samples",
    "bottle and cap finish, and photography",
    "social accounts (the iafashions Instagram and Facebook are carried from the sister sites)",
  ],
};

export const SAMPLE_ML = 2;
export const SIZES = ["2ml sample", "50ml", "100ml"] as const;
export type Size = (typeof SIZES)[number];

export const gbp = (n: number) => `£${Number.isInteger(n) ? n : n.toFixed(2)}`;
export const DELIVERY_LINE = `Standard delivery ${gbp(SITE.delivery.standard.price)} · Free over ${gbp(SITE.delivery.freeOver)} · ${SITE.returns.days}-day returns`;
