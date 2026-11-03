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
  preview: true, // concept preview: sample scents, ordering switched off
  toConfirm: [
    "trading name (I & A Parfums proposed)",
    "whether the scents are the client's own or a bought-in range",
    "the range: names, families, notes and stories (seven samples here)",
    "prices for 2ml sample, 50ml and 100ml, and the discovery set",
    "how the sample credit is applied (code in the sample box, account, in store)",
    "whether the discovery set price is credited in full or in part",
    "the perfumer, where the scents are blended and bottled, and the materials",
    "concentration (eau de parfum assumed), alcohol base, vegan or cruelty-free claims",
    "delivery charges, returns on sealed and opened bottles",
    "bottle and cap finish, and photography",
    "social accounts (the iafashions Instagram and Facebook are carried from the sister sites)",
  ],
};

export const SAMPLE_ML = 2;
export const SIZES = ["2ml sample", "50ml", "100ml"] as const;
export type Size = (typeof SIZES)[number];
