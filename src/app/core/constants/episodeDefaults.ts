import * as moment from "moment";

const month = Number(moment().format("M"));
const dayOfMonth = Number(moment().format("D"));
const year = moment().format("YYYY");
const raceType = month < 5 || (month === 5 && dayOfMonth < 10) ? "SX" : "MX";

export const EpisodeDefaults: any = {
  emptyEpisode: {
    title: { textContent: "" },
    description: { textContent: "" },
    enclosure: { attributes: { length: "", type: "audio/mpeg", url: "" } },
    guid: { textContent: "", attributes: { isPermaLink: "false" } },
    pubDate: { textContent: "" },
    "itunes:duration": { textContent: "" },
    "itunes:keywords": { textContent: "" },
    "itunes:subtitle": { textContent: "" },
    "itunes:summary": { textContent: "" },
    "itunes:explicit": { textContent: "no" }
  },
  pulpmx: {
    title: "Show #"
  },
  moto60: {
    title: "Show #",
    description:
      "It's Matthes, you and this series' race discussion. Don't forget to call in. Remember to listen live Thursday's at 12pm PST!"
  },
  keefer: {
    title: "Show #"
  },
  steveshow: {
    guest: {
      title: "Guest: "
    },
    fantasy: {
      title: `Moto Fantasy: Race ${raceType} ${year}`,
      description: "Discussing the scoops that affect your Fantasy Moto picks before you make them."
      // keywords: "fantasy"
    },
    review: {
      title: `Race ${raceType} ${year} Review`,
      description:
        "Wrapping up action from the race weekend, covering all the scoops, with the normal cast of characters."
    },
    postrace: {
      title: `Race ${year} ${raceType} Post-Race Interviews`,
      description: "Post-race interviews brought to you by Pro Circuit."
    },
    privateer: {
      title: "Race Tech Suspension: Privateer Island Life Podcast #"
      // keywords: "privateer"
    }
  },
  hockey: {
    title: "Show "
  },
  steveshowDefaults: [
    {
      value: "guest",
      label: "Guest Pod"
    },
    {
      value: "fantasy",
      label: "Fantasy Pod"
    },
    {
      value: "review",
      label: "Race Review"
    },
    {
      value: "postrace",
      label: "Post-Race"
    },
    {
      value: "privateer",
      label: "Privateer Pod"
    }
  ]
};
