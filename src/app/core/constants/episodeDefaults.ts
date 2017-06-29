import * as moment from 'moment';

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
      description: "It's Matthes, you and this series' race discussion. Don't forget to call in. Remember to listen live Thursday's at 12pm PST!"
    },
    keefer: {
        title: "Show #"
    },
    steveshow: {
      guest: {
        title: "Guest: "
      },
      fantasy: {
        title: "Moto Fantasy: Race SX " + moment().format("YYYY"),
        description: "Discussing the scoops that affect your Fantasy Moto picks before you make them.",
        // keywords: "fantasy"
      },
      review: {
        title: "Race SX " + moment().format("YYYY") + " Review",
        description: "Wrapping up action from the race weekend, covering all the scoops, with the normal cast of characters."
      },
      postrace: {
        title: "Race " + moment().format("YYYY") + " Post-Race Interviews",
        description: "Post-race interviews brought to you by Pro Circuit."
      },
      privateer: {
        title: "Race Tech Suspension: Privateer Island Life Podcast #",
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
    ],
}