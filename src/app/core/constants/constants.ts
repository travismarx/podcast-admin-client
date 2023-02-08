export const Constants: any = {
  enclosure_prefix: {
    pulpmx: "http://media.blubrry.com/pulpmxshow/pulpmxshow.com/podcasts/",
    steveshow: "http://media.blubrry.com/tsms/pulpmx.com/podcasts/",
    moto60: "http://media.blubrry.com/preshow/pulpmx.com/podcasts/preshows/",
    hockey: "http://media.blubrry.com/pulphockey/pulphockey.com/shows/",
    keefer: "http://media.blubrry.com/keefer_tested/pulpmx.com/podcasts/",
    shiftinggears:
      "http://media.blubrry.com/shiftinggears/pulpmx.com/podcasts/",
    industryseating:
      "http://media.blubrry.com/industryseating/pulpmx.com/podcasts/",
    reraceables: "http://media.blubrry.com/tsms/pulpmx.com/podcasts/",
    coffeewithkeefers:
      "http://media.blubrry.com/keefer_tested/pulpmx.com/podcasts/",
  },
  showOptions: {
    coffeewithkeefers: {
      xmlName: "z_coffee",
      url: "http://apptabs.pulpmx.com/z_coffee.xml",
      feedburner:
        "https://www.feedburner.com/fb/a/pingSubmit?bloglink=http%3A%2F%2Ffeeds.feedburner.com%2FCoffeeWithTheKeefers",
    },
    reraceables: {
      xmlName: "z_reraceables",
      url: "http://apptabs.pulpmx.com/z_reraceables.xml",
      feedburner:
        "https://www.feedburner.com/fb/a/pingSubmit?bloglink=http%3A%2F%2Ffeeds.feedburner.com%2FTheRe-raceables",
    },
    industryseating: {
      xmlName: "industryseating",
      url: "http://apptabs.pulpmx.com/industryseating.xml",
      feedburner:
        "https://www.feedburner.com/fb/a/pingSubmit?bloglink=http%3A%2F%2Ffeeds.feedburner.com%2Findustryseating",
    },
    pulpmx: {
      xmlName: "z_pmxs",
      url: "http://apptabs.pulpmx.com/z_pmxs.xml",
      feedburner:
        "https://www.feedburner.com/fb/a/pingSubmit?bloglink=http%3A%2F%2Ffeeds.feedburner.com%2FThePulpmxcomShow",
    },
    steveshow: {
      xmlName: "z_tsms",
      url: "http://apptabs.pulpmx.com/z_tsms.xml",
      feedburner:
        "https://www.feedburner.com/fb/a/pingSubmit?bloglink=http%3A%2F%2Ffeeds.feedburner.com%2Fpulpmx%2FRkNd",
    },
    moto60: {
      xmlName: "z_pmxpreshow",
      url: "http://apptabs.pulpmx.com/z_pmxpreshow.xml",
      feedburner:
        "https://www.feedburner.com/fb/a/pingSubmit?bloglink=http%3A%2F%2Ffeeds.feedburner.com%2FTheFlyRacingMoto60Show",
    },
    hockey: {
      xmlName: "z_pulphockey",
      url: "http://apptabs.pulpmx.com/z_pulphockey.xml",
      feedburner:
        "https://www.feedburner.com/fb/a/pingSubmit?bloglink=http%3A%2F%2Ffeeds.feedburner.com%2FThePulpHockeyShow",
    },
    keefer: {
      xmlName: "z_keefer",
      url: "http://apptabs.pulpmx.com/z_keefer.xml",
      feedburner:
        "https://feedburner.google.com/fb/a/pingSubmit?bloglink=http%3A%2F%2Ffeeds.feedburner.com%2Fpulpmx%2FWcBg",
    },
    shiftinggears: {
      xmlName: "shiftinggears",
      url: "http://apptabs.pulpmx.com/shiftinggears.xml",
      feedburner:
        "https://feedburner.google.com/fb/a/pingSubmit?bloglink=http%3A%2F%2Ffeeds.feedburner.com%2Fpulpmx%2FRkNd",
    },
  },
  showTitleOptions: [
    {
      label: "The PulpMX Show",
      value: "pulpmx",
    },
    {
      label: "Fly Moto:60 Show",
      value: "moto60",
    },
  ],
  liveEventDefaults: {
    pulpmx: {
      epPodTitleAbbr: "pulpmx",
      epPodAbbr: "pulpmx",
      showtime: "17:00",
      title: "The PulpMX Show",
      epPodImage: "img/showthumbs/pulpmx.png",
      epPodTitle:
        "The PulpMX Show Presented by Motosport.com, Fly Racing, and DeCal Works",
    },
    moto60: {
      epPodTitleAbbr: "moto60",
      epPodAbbr: "moto60",
      showtime: "11:00",
      guests: "The usuals",
      title: "Fly Moto:60 Show",
      epPodImage: "img/showthumbs/moto60.png",
      epPodTitle:
        "The Fly Racing Moto:60 Show Presented by Truck Hero, Pro Taper, and GET Data",
    },
  },
  episodeOptions: [
    {
      label: "Edit episode",
      icon: "fa-pencil",
    },
    {
      label: "Deactivate episode",
      icon: "fa-ban",
    },
  ],
};
