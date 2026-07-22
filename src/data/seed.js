// 种子数据：MVP 阶段内置的几个音乐节
// 全部来自官方海报/时间表识别

export const seedFestivals = [
  {
    id: "fuji-rock-2026",
    name: "FUJI ROCK FESTIVAL",
    year: 2026,
    location: "Naeba Ski Resort, Niigata",
    source: "fujirockfestival.com 官方时间表",
    dates: ["2026-07-24", "2026-07-25", "2026-07-26"],
    // 前 mainStageCount 个为主舞台（默认展示），其余在 "More" 里折叠
    mainStageCount: 8,
    stages: [
      "GREEN STAGE",
      "WHITE STAGE",
      "RED MARQUEE",
      "FIELD OF HEAVEN",
      "ORANGE ECHO",
      "GYPSY AVALON",
      "CRYSTAL PALACE",
      "ROOKIE A GO-GO",
      // 以下为"其他"舞台
      "NAEBA SHOKUDOU",
      "GANBAN",
      "BLUE GALAXY",
      "PALACE AREA",
      "PYRAMID GARDEN",
    ],
  },
  {
    id: "youshan-2026",
    name: "游山音乐节 yóu shān MUSIC FESTIVAL",
    year: 2026,
    location: "河北张家口市崇礼区梧桐大道曼松林",
    source: "官方海报",
    dates: ["2026-07-17", "2026-07-18", "2026-07-19"],
    mainStageCount: 2,
    stages: ["FOREST STAGE", "VALLEY STAGE"],
  },
  {
    id: "new-soil-2026",
    name: "新壤音乐节 NEW SOIL MUSIC FESTIVAL",
    year: 2026,
    location: "内蒙古锡林郭勒盟锡林浩特市 · 锡林郭勒旅游那达慕风情园",
    source: "官方海报",
    dates: ["2026-07-24", "2026-07-25", "2026-07-26"],
    mainStageCount: 3,
    stages: ["旷野舞台", "战国舞台", "扑光舞台"],
  },
  {
    id: "moss-2026",
    name: "MOSS 野苔音乐季 MOSS MUSIC SEASON",
    year: 2026,
    location: "武汉青山江滩 · 沙丁音乐秀场 SARDINEzone",
    source: "官方时间表",
    dates: ["2026-07-04", "2026-07-05", "2026-07-10", "2026-07-11", "2026-07-12", "2026-07-19"],
    mainStageCount: 1,
    stages: ["MOSS STAGE", "ROLLING STAGE"],
  },
];

// ============================================================
// FUJI ROCK FESTIVAL 2026 · 官方时间表 (fujirockfestival.com)
// link = en.fujirockfestival.com 艺人详情页
// ============================================================
export const seedPerformances = [
  // Day 1 (2026-07-24 FRI) · GREEN STAGE
  { id: "fr-d1-g1", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "ROUTE 17 Rock'n'Roll ORCHESTRA", stageName: "GREEN STAGE", startAt: "2026-07-24T11:00:00", endAt: "2026-07-24T12:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6899" },
  { id: "fr-d1-g2", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "My Hair is Bad",                stageName: "GREEN STAGE", startAt: "2026-07-24T13:00:00", endAt: "2026-07-24T14:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3799" },
  { id: "fr-d1-g3", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "LOYLE CARNER",                  stageName: "GREEN STAGE", startAt: "2026-07-24T15:00:00", endAt: "2026-07-24T16:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6897" },
  { id: "fr-d1-g4", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "TURNSTILE",                     stageName: "GREEN STAGE", startAt: "2026-07-24T17:00:00", endAt: "2026-07-24T18:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6337" },
  { id: "fr-d1-g5", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "Hi-STANDARD",                   stageName: "GREEN STAGE", startAt: "2026-07-24T19:00:00", endAt: "2026-07-24T20:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3455" },
  { id: "fr-d1-g6", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "The xx",                        stageName: "GREEN STAGE", startAt: "2026-07-24T21:25:00", endAt: "2026-07-24T22:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/2653" },
  // Day 1 · WHITE STAGE
  { id: "fr-d1-w1", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "KOTORI",                        stageName: "WHITE STAGE", startAt: "2026-07-24T11:30:00", endAt: "2026-07-24T12:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5241" },
  { id: "fr-d1-w2", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "SON ROMPE PERA",                stageName: "WHITE STAGE", startAt: "2026-07-24T13:00:00", endAt: "2026-07-24T13:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6852" },
  { id: "fr-d1-w3", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "Yo-Sea",                        stageName: "WHITE STAGE", startAt: "2026-07-24T14:40:00", endAt: "2026-07-24T15:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6668" },
  { id: "fr-d1-w4", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "TORO Y MOI",                    stageName: "WHITE STAGE", startAt: "2026-07-24T16:40:00", endAt: "2026-07-24T17:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3687" },
  { id: "fr-d1-w5", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "ARLO PARKS",                    stageName: "WHITE STAGE", startAt: "2026-07-24T18:40:00", endAt: "2026-07-24T19:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5794" },
  { id: "fr-d1-w6", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "ASIAN KUNG-FU GENERATION",      stageName: "WHITE STAGE", startAt: "2026-07-24T20:40:00", endAt: "2026-07-24T22:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/209" },
  // Day 1 · RED MARQUEE
  { id: "fr-d1-r1", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "テレビ大陸音頭",                stageName: "RED MARQUEE", startAt: "2026-07-24T11:10:00", endAt: "2026-07-24T11:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6832" },
  { id: "fr-d1-r2", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "w.o.d.",                        stageName: "RED MARQUEE", startAt: "2026-07-24T12:20:00", endAt: "2026-07-24T13:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6004" },
  { id: "fr-d1-r3", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "a flood of circle",             stageName: "RED MARQUEE", startAt: "2026-07-24T14:00:00", endAt: "2026-07-24T15:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/1392" },
  { id: "fr-d1-r4", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "TESTSET",                       stageName: "RED MARQUEE", startAt: "2026-07-24T16:00:00", endAt: "2026-07-24T17:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6050" },
  { id: "fr-d1-r5", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "SNAIL MAIL",                    stageName: "RED MARQUEE", startAt: "2026-07-24T18:00:00", endAt: "2026-07-24T19:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5172" },
  { id: "fr-d1-r6", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "HYUKOH",                        stageName: "RED MARQUEE", startAt: "2026-07-24T20:10:00", endAt: "2026-07-24T21:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6851" },
  { id: "fr-d1-r7", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "maya ongaku",                   stageName: "RED MARQUEE", startAt: "2026-07-24T23:30:00", endAt: "2026-07-25T00:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6132" },
  { id: "fr-d1-r8", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "TORO Y MOI (DJ)",               stageName: "RED MARQUEE", startAt: "2026-07-25T00:30:00", endAt: "2026-07-25T02:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3687" },
  { id: "fr-d1-r9", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "salute",                        stageName: "RED MARQUEE", startAt: "2026-07-25T02:00:00", endAt: "2026-07-25T03:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6908" },
  { id: "fr-d1-r10", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "Wata Igarashi",                stageName: "RED MARQUEE", startAt: "2026-07-25T03:30:00", endAt: "2026-07-25T05:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/4805" },
  // Day 1 · FIELD OF HEAVEN
  { id: "fr-d1-h1", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "CHAPPO",                        stageName: "FIELD OF HEAVEN", startAt: "2026-07-24T12:10:00", endAt: "2026-07-24T13:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6814" },
  { id: "fr-d1-h2", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "奇妙礼太郎 BAND",                stageName: "FIELD OF HEAVEN", startAt: "2026-07-24T13:50:00", endAt: "2026-07-24T14:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3500" },
  { id: "fr-d1-h3", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "ALTIN GÜN",                     stageName: "FIELD OF HEAVEN", startAt: "2026-07-24T15:40:00", endAt: "2026-07-24T16:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5623" },
  { id: "fr-d1-h4", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "OGRE YOU ASSHOLE",              stageName: "FIELD OF HEAVEN", startAt: "2026-07-24T17:40:00", endAt: "2026-07-24T18:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5581" },
  { id: "fr-d1-h5", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "ANTIBALAS",                     stageName: "FIELD OF HEAVEN", startAt: "2026-07-24T19:30:00", endAt: "2026-07-24T20:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6910" },
  { id: "fr-d1-h6", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "LETTUCE",                       stageName: "FIELD OF HEAVEN", startAt: "2026-07-24T21:30:00", endAt: "2026-07-24T23:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/1642" },
  // Day 1 · ORANGE ECHO
  { id: "fr-d1-o1", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "クマイルス",                     stageName: "ORANGE ECHO", startAt: "2026-07-24T13:00:00", endAt: "2026-07-24T13:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6912" },
  { id: "fr-d1-o2", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "MIZ",                           stageName: "ORANGE ECHO", startAt: "2026-07-24T14:50:00", endAt: "2026-07-24T15:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5656" },
  { id: "fr-d1-o3", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "Mateus Asato",                  stageName: "ORANGE ECHO", startAt: "2026-07-24T16:40:00", endAt: "2026-07-24T17:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6911" },
  { id: "fr-d1-o4", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "井上園子",                       stageName: "ORANGE ECHO", startAt: "2026-07-24T18:40:00", endAt: "2026-07-24T19:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6730" },
  { id: "fr-d1-o5", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "Black Boboi",                   stageName: "ORANGE ECHO", startAt: "2026-07-24T20:40:00", endAt: "2026-07-24T21:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5217" },
  // Day 1 · GYPSY AVALON
  { id: "fr-d1-y1", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "Upendra and friends plus Mr. Sunil", stageName: "GYPSY AVALON", startAt: "2026-07-24T12:10:00", endAt: "2026-07-24T13:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5368" },
  { id: "fr-d1-y2", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "TAKUTO AND NEKKOYA BAND",       stageName: "GYPSY AVALON", startAt: "2026-07-24T13:50:00", endAt: "2026-07-24T14:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6921" },
  { id: "fr-d1-y3", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "藤田悠也",                       stageName: "GYPSY AVALON", startAt: "2026-07-24T15:40:00", endAt: "2026-07-24T16:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6920" },
  { id: "fr-d1-y4", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "almenialva",                    stageName: "GYPSY AVALON", startAt: "2026-07-24T17:40:00", endAt: "2026-07-24T18:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6919" },
  { id: "fr-d1-y5", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "BAD TRIP SUMMER (Night Ambient Set)", stageName: "GYPSY AVALON", startAt: "2026-07-24T19:40:00", endAt: "2026-07-24T20:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6918" },
  // Day 1 · CRYSTAL PALACE
  { id: "fr-d1-c1", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "DJ GONCHAN",                    stageName: "CRYSTAL PALACE", startAt: "2026-07-24T22:30:00", endAt: "2026-07-24T23:45:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5102" },
  { id: "fr-d1-c2", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "LA LOM",                        stageName: "CRYSTAL PALACE", startAt: "2026-07-24T23:45:00", endAt: "2026-07-25T00:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6861" },
  { id: "fr-d1-c3", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "TXAKO",                         stageName: "CRYSTAL PALACE", startAt: "2026-07-25T00:30:00", endAt: "2026-07-25T01:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/4033" },
  { id: "fr-d1-c4", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "BOHEMIAN BETYARS",              stageName: "CRYSTAL PALACE", startAt: "2026-07-25T01:30:00", endAt: "2026-07-25T02:15:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6857" },
  { id: "fr-d1-c5", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "CUMBIA KID",                    stageName: "CRYSTAL PALACE", startAt: "2026-07-25T02:15:00", endAt: "2026-07-25T03:15:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/2161" },
  { id: "fr-d1-c6", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "SON ROMPE PERA",                stageName: "CRYSTAL PALACE", startAt: "2026-07-25T03:15:00", endAt: "2026-07-25T04:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6852" },
  { id: "fr-d1-c7", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "JAPAN CUMBIA FESTIVAL DJs",     stageName: "CRYSTAL PALACE", startAt: "2026-07-25T04:00:00", endAt: "2026-07-25T05:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6931" },
  // Day 1 · ROOKIE A GO-GO
  { id: "fr-d1-k1", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "和泉眞生",                       stageName: "ROOKIE A GO-GO", startAt: "2026-07-24T23:00:00", endAt: "2026-07-24T23:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6972" },
  { id: "fr-d1-k2", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "GeGeGe",                        stageName: "ROOKIE A GO-GO", startAt: "2026-07-25T00:00:00", endAt: "2026-07-25T00:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6973" },
  { id: "fr-d1-k3", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "Bone Us",                       stageName: "ROOKIE A GO-GO", startAt: "2026-07-25T01:00:00", endAt: "2026-07-25T01:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6974" },
  { id: "fr-d1-k4", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "砂の壁",                         stageName: "ROOKIE A GO-GO", startAt: "2026-07-25T02:00:00", endAt: "2026-07-25T02:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6975" },
  { id: "fr-d1-k5", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "TIVE",                          stageName: "ROOKIE A GO-GO", startAt: "2026-07-25T03:00:00", endAt: "2026-07-25T03:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6515" },

  // Day 2 (2026-07-25 SAT) · GREEN STAGE
  { id: "fr-d2-g1", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "Bialystocks",                    stageName: "GREEN STAGE", startAt: "2026-07-25T11:00:00", endAt: "2026-07-25T12:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6856" },
  { id: "fr-d2-g2", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "Trueno",                         stageName: "GREEN STAGE", startAt: "2026-07-25T13:00:00", endAt: "2026-07-25T14:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6863" },
  { id: "fr-d2-g3", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "IO",                             stageName: "GREEN STAGE", startAt: "2026-07-25T15:00:00", endAt: "2026-07-25T16:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6859" },
  { id: "fr-d2-g4", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "BASEMENT JAXX",                  stageName: "GREEN STAGE", startAt: "2026-07-25T17:00:00", endAt: "2026-07-25T18:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/158" },
  { id: "fr-d2-g5", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "Fujii Kaze",                     stageName: "GREEN STAGE", startAt: "2026-07-25T19:00:00", endAt: "2026-07-25T20:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6853" },
  { id: "fr-d2-g6", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "KHRUANGBIN",                     stageName: "GREEN STAGE", startAt: "2026-07-25T21:10:00", endAt: "2026-07-25T22:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5212" },
  // Day 2 · WHITE STAGE
  { id: "fr-d2-w1", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "Riddim Saunter",                 stageName: "WHITE STAGE", startAt: "2026-07-25T12:10:00", endAt: "2026-07-25T13:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/1437" },
  { id: "fr-d2-w2", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "BOHEMIAN BETYARS",               stageName: "WHITE STAGE", startAt: "2026-07-25T13:50:00", endAt: "2026-07-25T14:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6857" },
  { id: "fr-d2-w3", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "Kroi",                           stageName: "WHITE STAGE", startAt: "2026-07-25T15:30:00", endAt: "2026-07-25T16:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5799" },
  { id: "fr-d2-w4", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "JOEY VALENCE & BRAE",            stageName: "WHITE STAGE", startAt: "2026-07-25T17:50:00", endAt: "2026-07-25T18:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6887" },
  { id: "fr-d2-w5", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "XG",                             stageName: "WHITE STAGE", startAt: "2026-07-25T19:50:00", endAt: "2026-07-25T20:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6855" },
  { id: "fr-d2-w6", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "TOMORA",                         stageName: "WHITE STAGE", startAt: "2026-07-25T22:00:00", endAt: "2026-07-25T23:15:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6854" },
  // Day 2 · RED MARQUEE
  { id: "fr-d2-r1", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "ブランデー戦記",                  stageName: "RED MARQUEE", startAt: "2026-07-25T10:20:00", endAt: "2026-07-25T11:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6858" },
  { id: "fr-d2-r2", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "SIX LOUNGE",                     stageName: "RED MARQUEE", startAt: "2026-07-25T11:30:00", endAt: "2026-07-25T12:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/4586" },
  { id: "fr-d2-r3", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "QUADECA",                        stageName: "RED MARQUEE", startAt: "2026-07-25T12:40:00", endAt: "2026-07-25T13:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6862" },
  { id: "fr-d2-r4", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "THE BETHS",                      stageName: "RED MARQUEE", startAt: "2026-07-25T14:00:00", endAt: "2026-07-25T15:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6822" },
  { id: "fr-d2-r5", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "cero",                           stageName: "RED MARQUEE", startAt: "2026-07-25T16:00:00", endAt: "2026-07-25T17:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3187" },
  { id: "fr-d2-r6", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "THURSTON MOORE GROUP",           stageName: "RED MARQUEE", startAt: "2026-07-25T18:00:00", endAt: "2026-07-25T19:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3961" },
  { id: "fr-d2-r7", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "サニーデイ・サービス",            stageName: "RED MARQUEE", startAt: "2026-07-25T20:10:00", endAt: "2026-07-25T21:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/2431" },
  { id: "fr-d2-r8", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "唾奇",                           stageName: "RED MARQUEE", startAt: "2026-07-25T23:30:00", endAt: "2026-07-26T00:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6889" },
  { id: "fr-d2-r9", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "KELLY LEE OWENS (DJ)",           stageName: "RED MARQUEE", startAt: "2026-07-26T00:30:00", endAt: "2026-07-26T02:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6888" },
  { id: "fr-d2-r10", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "Weval (DJ Set)",                stageName: "RED MARQUEE", startAt: "2026-07-26T02:00:00", endAt: "2026-07-26T03:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6909" },
  { id: "fr-d2-r11", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "Soichi Terada",                 stageName: "RED MARQUEE", startAt: "2026-07-26T03:30:00", endAt: "2026-07-26T05:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/4434" },
  // Day 2 · FIELD OF HEAVEN
  { id: "fr-d2-h1", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "柴田聡子 (BAND SET)",             stageName: "FIELD OF HEAVEN", startAt: "2026-07-25T11:10:00", endAt: "2026-07-25T12:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6557" },
  { id: "fr-d2-h2", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "YUUF",                           stageName: "FIELD OF HEAVEN", startAt: "2026-07-25T12:50:00", endAt: "2026-07-25T13:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6864" },
  { id: "fr-d2-h3", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "LA LOM",                         stageName: "FIELD OF HEAVEN", startAt: "2026-07-25T14:40:00", endAt: "2026-07-25T15:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6861" },
  { id: "fr-d2-h4", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "OAU",                            stageName: "FIELD OF HEAVEN", startAt: "2026-07-25T16:40:00", endAt: "2026-07-25T17:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/969" },
  { id: "fr-d2-h5", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "KOKOROKO",                       stageName: "FIELD OF HEAVEN", startAt: "2026-07-25T18:30:00", endAt: "2026-07-25T19:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6860" },
  { id: "fr-d2-h6", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "BADBADNOTGOOD",                  stageName: "FIELD OF HEAVEN", startAt: "2026-07-25T20:30:00", endAt: "2026-07-25T22:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6166" },
  // Day 2 · ORANGE ECHO
  { id: "fr-d2-o1", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "来島エル",                       stageName: "ORANGE ECHO", startAt: "2026-07-25T10:50:00", endAt: "2026-07-25T11:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6914" },
  { id: "fr-d2-o2", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "タデクイ",                        stageName: "ORANGE ECHO", startAt: "2026-07-25T12:15:00", endAt: "2026-07-25T12:55:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6913" },
  { id: "fr-d2-o3", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "neco眠る",                       stageName: "ORANGE ECHO", startAt: "2026-07-25T13:50:00", endAt: "2026-07-25T14:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/2926" },
  { id: "fr-d2-o4", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "CADEJO",                         stageName: "ORANGE ECHO", startAt: "2026-07-25T15:40:00", endAt: "2026-07-25T16:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6830" },
  { id: "fr-d2-o5", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "DMBQ",                           stageName: "ORANGE ECHO", startAt: "2026-07-25T17:50:00", endAt: "2026-07-25T18:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/70" },
  { id: "fr-d2-o6", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "Bongjeingan",                    stageName: "ORANGE ECHO", startAt: "2026-07-25T19:50:00", endAt: "2026-07-25T20:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6452" },
  // Day 2 · GYPSY AVALON
  { id: "fr-d2-y1", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "ケロポンズ",                      stageName: "GYPSY AVALON", startAt: "2026-07-25T11:00:00", endAt: "2026-07-25T12:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6925" },
  { id: "fr-d2-y2", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "MASH弦楽団",                      stageName: "GYPSY AVALON", startAt: "2026-07-25T13:00:00", endAt: "2026-07-25T13:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6924" },
  { id: "fr-d2-y3", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "アトミック・カフェ トーク 福島事故から15年", stageName: "GYPSY AVALON", startAt: "2026-07-25T14:40:00", endAt: "2026-07-25T15:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6923" },
  { id: "fr-d2-y4", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "梅井美咲",                        stageName: "GYPSY AVALON", startAt: "2026-07-25T16:30:00", endAt: "2026-07-25T17:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6777" },
  { id: "fr-d2-y5", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "中西レモン＆すずめのティアーズ",   stageName: "GYPSY AVALON", startAt: "2026-07-25T18:50:00", endAt: "2026-07-25T19:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6922" },
  { id: "fr-d2-y6", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "jizue",                          stageName: "GYPSY AVALON", startAt: "2026-07-25T20:50:00", endAt: "2026-07-25T21:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3489" },
  // Day 2 · CRYSTAL PALACE
  { id: "fr-d2-c1", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "BABY SOUL",                      stageName: "CRYSTAL PALACE", startAt: "2026-07-25T22:30:00", endAt: "2026-07-25T23:45:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/1165" },
  { id: "fr-d2-c2", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "STOMPIN' RIFFRAFFS",             stageName: "CRYSTAL PALACE", startAt: "2026-07-25T23:45:00", endAt: "2026-07-26T00:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6932" },
  { id: "fr-d2-c3", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "GAZ MAYALL",                     stageName: "CRYSTAL PALACE", startAt: "2026-07-26T00:30:00", endAt: "2026-07-26T01:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/366" },
  { id: "fr-d2-c4", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "THE KING LION",                  stageName: "CRYSTAL PALACE", startAt: "2026-07-26T01:30:00", endAt: "2026-07-26T02:15:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6933" },
  { id: "fr-d2-c5", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "KING NABE",                      stageName: "CRYSTAL PALACE", startAt: "2026-07-26T02:15:00", endAt: "2026-07-26T03:15:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/1416" },
  { id: "fr-d2-c6", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "ZIONHILL SESSION",               stageName: "CRYSTAL PALACE", startAt: "2026-07-26T03:15:00", endAt: "2026-07-26T04:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6709" },
  { id: "fr-d2-c7", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "RUBY FLASHMAN",                  stageName: "CRYSTAL PALACE", startAt: "2026-07-26T04:00:00", endAt: "2026-07-26T05:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6428" },
  // Day 2 · ROOKIE A GO-GO
  { id: "fr-d2-k1", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "A_Root同根生",                   stageName: "ROOKIE A GO-GO", startAt: "2026-07-25T22:00:00", endAt: "2026-07-25T22:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6976" },
  { id: "fr-d2-k2", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "mayu",                           stageName: "ROOKIE A GO-GO", startAt: "2026-07-25T23:00:00", endAt: "2026-07-25T23:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6977" },
  { id: "fr-d2-k3", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "日髙晴野",                        stageName: "ROOKIE A GO-GO", startAt: "2026-07-26T00:00:00", endAt: "2026-07-26T00:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6978" },
  { id: "fr-d2-k4", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "Tocago",                         stageName: "ROOKIE A GO-GO", startAt: "2026-07-26T01:00:00", endAt: "2026-07-26T01:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6979" },
  { id: "fr-d2-k5", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "猿臂",                            stageName: "ROOKIE A GO-GO", startAt: "2026-07-26T02:00:00", endAt: "2026-07-26T02:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6980" },
  { id: "fr-d2-k6", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "二兆円",                          stageName: "ROOKIE A GO-GO", startAt: "2026-07-26T03:00:00", endAt: "2026-07-26T03:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6981" },

  // Day 3 (2026-07-26 SUN) · GREEN STAGE
  { id: "fr-d3-g1", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "平井 大",                         stageName: "GREEN STAGE", startAt: "2026-07-26T11:00:00", endAt: "2026-07-26T12:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5022" },
  { id: "fr-d3-g2", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "DONAVON FRANKENREITER",          stageName: "GREEN STAGE", startAt: "2026-07-26T13:00:00", endAt: "2026-07-26T14:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6489" },
  { id: "fr-d3-g3", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "KNEECAP",                        stageName: "GREEN STAGE", startAt: "2026-07-26T15:00:00", endAt: "2026-07-26T16:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6898" },
  { id: "fr-d3-g4", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "MOGWAI",                         stageName: "GREEN STAGE", startAt: "2026-07-26T17:00:00", endAt: "2026-07-26T18:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/397" },
  { id: "fr-d3-g5", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "平沢進+会人",                     stageName: "GREEN STAGE", startAt: "2026-07-26T19:00:00", endAt: "2026-07-26T20:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6083" },
  { id: "fr-d3-g6", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "MASSIVE ATTACK",                 stageName: "GREEN STAGE", startAt: "2026-07-26T21:10:00", endAt: "2026-07-26T22:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/2642" },
  { id: "fr-d3-g7", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "1950’s Western Caravan Orchestra", stageName: "GREEN STAGE", startAt: "2026-07-27T00:00:00", endAt: "2026-07-27T00:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6803" },
  // Day 3 · WHITE STAGE
  { id: "fr-d3-w1", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "礼賛",                            stageName: "WHITE STAGE", startAt: "2026-07-26T12:40:00", endAt: "2026-07-26T13:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6587" },
  { id: "fr-d3-w2", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "GRAPEVINE",                      stageName: "WHITE STAGE", startAt: "2026-07-26T14:20:00", endAt: "2026-07-26T15:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/2683" },
  { id: "fr-d3-w3", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "SOFIA ISELLA",                   stageName: "WHITE STAGE", startAt: "2026-07-26T16:10:00", endAt: "2026-07-26T17:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6868" },
  { id: "fr-d3-w4", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "GEORDIE GREEP",                  stageName: "WHITE STAGE", startAt: "2026-07-26T18:10:00", endAt: "2026-07-26T19:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6539" },
  { id: "fr-d3-w5", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "Tempalay",                       stageName: "WHITE STAGE", startAt: "2026-07-26T20:00:00", endAt: "2026-07-26T21:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/4306" },
  { id: "fr-d3-w6", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "MITSKI",                         stageName: "WHITE STAGE", startAt: "2026-07-26T22:10:00", endAt: "2026-07-26T23:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/4834" },
  // Day 3 · RED MARQUEE
  { id: "fr-d3-r1", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "Aooo",                           stageName: "RED MARQUEE", startAt: "2026-07-26T10:20:00", endAt: "2026-07-26T11:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6865" },
  { id: "fr-d3-r2", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "US",                             stageName: "RED MARQUEE", startAt: "2026-07-26T11:30:00", endAt: "2026-07-26T12:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6451" },
  { id: "fr-d3-r3", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "浅井健一",                        stageName: "RED MARQUEE", startAt: "2026-07-26T12:40:00", endAt: "2026-07-26T13:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/1214" },
  { id: "fr-d3-r4", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "THE LEMON TWIGS",                stageName: "RED MARQUEE", startAt: "2026-07-26T14:00:00", endAt: "2026-07-26T15:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/4681" },
  { id: "fr-d3-r5", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "the cabs",                       stageName: "RED MARQUEE", startAt: "2026-07-26T16:00:00", endAt: "2026-07-26T17:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6867" },
  { id: "fr-d3-r6", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "FRIKO",                          stageName: "RED MARQUEE", startAt: "2026-07-26T18:00:00", endAt: "2026-07-26T19:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6377" },
  { id: "fr-d3-r7", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "AMERICAN FOOTBALL",              stageName: "RED MARQUEE", startAt: "2026-07-26T20:10:00", endAt: "2026-07-26T21:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5268" },
  { id: "fr-d3-r8", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "US",                             stageName: "RED MARQUEE", startAt: "2026-07-26T23:00:00", endAt: "2026-07-26T23:45:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6451" },
  { id: "fr-d3-r9", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "LAUSBUB",                        stageName: "RED MARQUEE", startAt: "2026-07-26T23:50:00", endAt: "2026-07-27T00:35:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6314" },
  { id: "fr-d3-r10", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "KIRARA",                        stageName: "RED MARQUEE", startAt: "2026-07-27T00:40:00", endAt: "2026-07-27T01:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6891" },
  { id: "fr-d3-r11", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "ICHIRO YAMAGUCHI (sakanaction)",stageName: "RED MARQUEE", startAt: "2026-07-27T01:45:00", endAt: "2026-07-27T03:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5047" },
  { id: "fr-d3-r12", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "TAKKYU ISHINO",                 stageName: "RED MARQUEE", startAt: "2026-07-27T03:00:00", endAt: "2026-07-27T05:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/691" },
  // Day 3 · FIELD OF HEAVEN
  { id: "fr-d3-h1", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "んoon",                          stageName: "FIELD OF HEAVEN", startAt: "2026-07-26T11:50:00", endAt: "2026-07-26T12:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5473" },
  { id: "fr-d3-h2", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "TĀL FRY",                        stageName: "FIELD OF HEAVEN", startAt: "2026-07-26T13:20:00", endAt: "2026-07-26T14:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6869" },
  { id: "fr-d3-h3", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "PLINI",                          stageName: "FIELD OF HEAVEN", startAt: "2026-07-26T15:10:00", endAt: "2026-07-26T16:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6304" },
  { id: "fr-d3-h4", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "THE BREAKS",                     stageName: "FIELD OF HEAVEN", startAt: "2026-07-26T17:10:00", endAt: "2026-07-26T18:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6866" },
  { id: "fr-d3-h5", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "ANGINE DE POITRINE",             stageName: "FIELD OF HEAVEN", startAt: "2026-07-26T19:00:00", endAt: "2026-07-26T20:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6890" },
  { id: "fr-d3-h6", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "never young beach",              stageName: "FIELD OF HEAVEN", startAt: "2026-07-26T21:00:00", endAt: "2026-07-26T22:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/4273" },
  // Day 3 · ORANGE ECHO
  { id: "fr-d3-o1", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "藤原さくら",                      stageName: "ORANGE ECHO", startAt: "2026-07-26T12:40:00", endAt: "2026-07-26T13:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/4542" },
  { id: "fr-d3-o2", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "岡田拓郎",                        stageName: "ORANGE ECHO", startAt: "2026-07-26T14:20:00", endAt: "2026-07-26T15:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6917" },
  { id: "fr-d3-o3", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "Noridogam",                      stageName: "ORANGE ECHO", startAt: "2026-07-26T16:10:00", endAt: "2026-07-26T16:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6916" },
  { id: "fr-d3-o4", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "KIKI",                           stageName: "ORANGE ECHO", startAt: "2026-07-26T18:20:00", endAt: "2026-07-26T19:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6915" },
  { id: "fr-d3-o5", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "BUFFALO DAUGHTER",               stageName: "ORANGE ECHO", startAt: "2026-07-26T20:10:00", endAt: "2026-07-26T20:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/109" },
  // Day 3 · GYPSY AVALON
  { id: "fr-d3-y1", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "Gingersamm",                                stageName: "GYPSY AVALON", startAt: "2026-07-26T11:40:00", endAt: "2026-07-26T12:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6930" },
  { id: "fr-d3-y2", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "アトミック・カフェ 曽我部恵一",              stageName: "GYPSY AVALON", startAt: "2026-07-26T13:30:00", endAt: "2026-07-26T14:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6929" },
  { id: "fr-d3-y3", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "アトミック・カフェ トーク 戦争と平和",         stageName: "GYPSY AVALON", startAt: "2026-07-26T14:10:00", endAt: "2026-07-26T14:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6928" },
  { id: "fr-d3-y4", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "アトミック・カフェ 忌野清志郎 PEACE SONGS", stageName: "GYPSY AVALON", startAt: "2026-07-26T15:35:00", endAt: "2026-07-26T16:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6927" },
  { id: "fr-d3-y5", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "スーパー登山部",                              stageName: "GYPSY AVALON", startAt: "2026-07-26T17:20:00", endAt: "2026-07-26T18:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6409" },
  { id: "fr-d3-y6", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "こたに",                                     stageName: "GYPSY AVALON", startAt: "2026-07-26T19:10:00", endAt: "2026-07-26T20:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6926" },
  { id: "fr-d3-y7", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "NakamuraEmi",                                stageName: "GYPSY AVALON", startAt: "2026-07-26T21:00:00", endAt: "2026-07-26T22:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/4533" },
  // Day 3 · CRYSTAL PALACE
  { id: "fr-d3-c1", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "GEORGE WILLIAMS",                stageName: "CRYSTAL PALACE", startAt: "2026-07-26T22:30:00", endAt: "2026-07-26T23:45:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6095" },
  { id: "fr-d3-c2", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "SPECIAL GUEST",                  stageName: "CRYSTAL PALACE", startAt: "2026-07-26T23:45:00", endAt: "2026-07-27T00:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6798" },
  { id: "fr-d3-c3", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "YUSUKE OGAWA",                   stageName: "CRYSTAL PALACE", startAt: "2026-07-27T00:30:00", endAt: "2026-07-27T01:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6935" },
  { id: "fr-d3-c4", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "TĀL FRY",                        stageName: "CRYSTAL PALACE", startAt: "2026-07-27T01:30:00", endAt: "2026-07-27T02:15:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6869" },
  { id: "fr-d3-c5", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "DAISUKE KURODA",                 stageName: "CRYSTAL PALACE", startAt: "2026-07-27T02:15:00", endAt: "2026-07-27T03:15:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/1407" },
  { id: "fr-d3-c6", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "EXPANSION",                      stageName: "CRYSTAL PALACE", startAt: "2026-07-27T03:15:00", endAt: "2026-07-27T04:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6936" },
  { id: "fr-d3-c7", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "P.O.W ALL STARS",                stageName: "CRYSTAL PALACE", startAt: "2026-07-27T04:00:00", endAt: "2026-07-27T05:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5382" },
  // Day 3 · ROOKIE A GO-GO
  { id: "fr-d3-k1", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "岩崎桃子",                        stageName: "ROOKIE A GO-GO", startAt: "2026-07-26T23:00:00", endAt: "2026-07-26T23:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6982" },
  { id: "fr-d3-k2", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "OLDMAN",                         stageName: "ROOKIE A GO-GO", startAt: "2026-07-27T00:00:00", endAt: "2026-07-27T00:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6983" },
  { id: "fr-d3-k3", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "SYAYOS",                         stageName: "ROOKIE A GO-GO", startAt: "2026-07-27T01:00:00", endAt: "2026-07-27T01:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6984" },
  { id: "fr-d3-k4", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "Wappen",                         stageName: "ROOKIE A GO-GO", startAt: "2026-07-27T02:00:00", endAt: "2026-07-27T02:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6985" },
  { id: "fr-d3-k5", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "It's US!!!!",                    stageName: "ROOKIE A GO-GO", startAt: "2026-07-27T03:00:00", endAt: "2026-07-27T03:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6986" },

  // ============================================================
  // 以下为"其他"舞台 (官方时间表完整收录)
  // ============================================================

  // Day 1 · NAEBA SHOKUDOU (苗場食堂)
  { id: "fr-d1-n1", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "杉本ラララ",          stageName: "NAEBA SHOKUDOU", startAt: "2026-07-24T11:50:00", endAt: "2026-07-24T12:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6938" },
  { id: "fr-d1-n2", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "快速東京",            stageName: "NAEBA SHOKUDOU", startAt: "2026-07-24T13:15:00", endAt: "2026-07-24T13:55:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/2838" },
  { id: "fr-d1-n3", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "ENTH",               stageName: "NAEBA SHOKUDOU", startAt: "2026-07-24T15:10:00", endAt: "2026-07-24T15:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5829" },
  { id: "fr-d1-n4", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "苗場音楽突撃隊",      stageName: "NAEBA SHOKUDOU", startAt: "2026-07-24T17:10:00", endAt: "2026-07-24T17:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3594" },
  { id: "fr-d1-n5", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "TENDOUJI",           stageName: "NAEBA SHOKUDOU", startAt: "2026-07-24T19:10:00", endAt: "2026-07-24T19:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3196" },
  { id: "fr-d1-n6", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "SHADOWS",            stageName: "NAEBA SHOKUDOU", startAt: "2026-07-24T21:10:00", endAt: "2026-07-24T21:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/2698" },
  { id: "fr-d1-n7", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "GOOD4NOTHING",       stageName: "NAEBA SHOKUDOU", startAt: "2026-07-24T22:45:00", endAt: "2026-07-24T23:25:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6944" },

  // Day 1 · GANBAN (岩盤)
  { id: "fr-d1-gb1", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "SUGIURUMN",                       stageName: "GANBAN", startAt: "2026-07-24T23:30:00", endAt: "2026-07-25T01:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6159" },
  { id: "fr-d1-gb2", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "Natsuki Fujimoto (Tempalay)",     stageName: "GANBAN", startAt: "2026-07-25T01:00:00", endAt: "2026-07-25T02:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6957" },
  { id: "fr-d1-gb3", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "E.O.U",                           stageName: "GANBAN", startAt: "2026-07-25T02:00:00", endAt: "2026-07-25T03:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/277" },
  { id: "fr-d1-gb4", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "youhei (BLACK GANION/UNTTLD)",    stageName: "GANBAN", startAt: "2026-07-25T03:30:00", endAt: "2026-07-25T05:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6742" },

  // Day 1 · BLUE GALAXY
  { id: "fr-d1-bg1",  festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "DJ JIM",            stageName: "BLUE GALAXY", startAt: "2026-07-24T12:30:00", endAt: "2026-07-24T14:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/1414" },
  { id: "fr-d1-bg2",  festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "DJ HANA-G",         stageName: "BLUE GALAXY", startAt: "2026-07-24T14:00:00", endAt: "2026-07-24T14:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5102" },
  { id: "fr-d1-bg3",  festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "Bamboo Boy",        stageName: "BLUE GALAXY", startAt: "2026-07-24T14:50:00", endAt: "2026-07-24T15:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6963" },
  { id: "fr-d1-bg4",  festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "TOYO P",            stageName: "BLUE GALAXY", startAt: "2026-07-24T15:30:00", endAt: "2026-07-24T16:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6931" },
  { id: "fr-d1-bg5",  festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "DJ SCNDLS",         stageName: "BLUE GALAXY", startAt: "2026-07-24T16:10:00", endAt: "2026-07-24T17:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6961" },
  { id: "fr-d1-bg6",  festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "TEKASA",            stageName: "BLUE GALAXY", startAt: "2026-07-24T17:00:00", endAt: "2026-07-24T17:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6960" },
  { id: "fr-d1-bg7",  festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "CUMBIA KID",        stageName: "BLUE GALAXY", startAt: "2026-07-24T17:50:00", endAt: "2026-07-24T18:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6966" },
  { id: "fr-d1-bg8",  festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "RIHO",              stageName: "BLUE GALAXY", startAt: "2026-07-24T18:40:00", endAt: "2026-07-24T19:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6791" },
  { id: "fr-d1-bg9",  festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "RJD",               stageName: "BLUE GALAXY", startAt: "2026-07-24T19:30:00", endAt: "2026-07-24T20:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6959" },
  { id: "fr-d1-bg10", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "BABY SOUL",         stageName: "BLUE GALAXY", startAt: "2026-07-24T20:20:00", endAt: "2026-07-24T21:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/1165" },
  { id: "fr-d1-bg11", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "DOC.KOYAMANTADO",   stageName: "BLUE GALAXY", startAt: "2026-07-24T21:10:00", endAt: "2026-07-24T22:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6477" },
  { id: "fr-d1-bg12", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "DJ COLA",           stageName: "BLUE GALAXY", startAt: "2026-07-24T22:00:00", endAt: "2026-07-24T23:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/2165" },
  { id: "fr-d1-bg13", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "DJ JIM",            stageName: "BLUE GALAXY", startAt: "2026-07-24T23:00:00", endAt: "2026-07-25T00:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/1414" },

  // Day 1 · PALACE AREA (SAKURA CIRCUS)
  { id: "fr-d1-pa1", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "SAKURA CIRCUS",     stageName: "PALACE AREA", startAt: "2026-07-25T00:30:00", endAt: "2026-07-25T00:45:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6937" },
  { id: "fr-d1-pa2", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "SAKURA CIRCUS",     stageName: "PALACE AREA", startAt: "2026-07-25T01:30:00", endAt: "2026-07-25T01:45:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6937" },
  { id: "fr-d1-pa3", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "SAKURA CIRCUS",     stageName: "PALACE AREA", startAt: "2026-07-25T02:30:00", endAt: "2026-07-25T02:45:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6937" },

  // Day 1 · PYRAMID GARDEN
  { id: "fr-d1-pg1", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "ヨガワークショップ / 渋木さやか",     stageName: "PYRAMID GARDEN", startAt: "2026-07-24T08:30:00", endAt: "2026-07-24T09:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5716" },
  { id: "fr-d1-pg2", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "LOVE FOR NIPPON",                stageName: "PYRAMID GARDEN", startAt: "2026-07-24T09:40:00", endAt: "2026-07-24T10:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3295" },
  { id: "fr-d1-pg3", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "el tempo",                       stageName: "PYRAMID GARDEN", startAt: "2026-07-24T11:30:00", endAt: "2026-07-24T12:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6446" },
  { id: "fr-d1-pg4", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "DJ QUIETSTORM",                  stageName: "PYRAMID GARDEN", startAt: "2026-07-24T16:00:00", endAt: "2026-07-24T18:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6954" },
  { id: "fr-d1-pg5", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "Kon & y. (Timothy Really)",      stageName: "PYRAMID GARDEN", startAt: "2026-07-24T18:00:00", endAt: "2026-07-24T20:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6948" },
  { id: "fr-d1-pg6", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "CRAZY-T",                        stageName: "PYRAMID GARDEN", startAt: "2026-07-24T20:00:00", endAt: "2026-07-24T22:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6947" },
  { id: "fr-d1-pg7", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "君島大空 × 水野蒼生 電氣交響楽団", stageName: "PYRAMID GARDEN", startAt: "2026-07-24T22:30:00", endAt: "2026-07-24T23:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6953" },
  { id: "fr-d1-pg8", festivalId: "fuji-rock-2026", displayDate: "2026-07-24", artistName: "Aki",                            stageName: "PYRAMID GARDEN", startAt: "2026-07-25T00:20:00", endAt: "2026-07-25T01:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/4945" },

  // Day 2 · NAEBA SHOKUDOU
  { id: "fr-d2-n1", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "Za SAVAGE",              stageName: "NAEBA SHOKUDOU", startAt: "2026-07-25T12:10:00", endAt: "2026-07-25T12:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3808" },
  { id: "fr-d2-n2", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "寺久保伶矢",             stageName: "NAEBA SHOKUDOU", startAt: "2026-07-25T13:30:00", endAt: "2026-07-25T14:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6090" },
  { id: "fr-d2-n3", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "NONE THE WiSER",         stageName: "NAEBA SHOKUDOU", startAt: "2026-07-25T15:10:00", endAt: "2026-07-25T15:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5829" },
  { id: "fr-d2-n4", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "ANIEKY A GO GO ! BAND",  stageName: "NAEBA SHOKUDOU", startAt: "2026-07-25T17:10:00", endAt: "2026-07-25T17:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3594" },
  { id: "fr-d2-n5", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "苗場音楽突撃隊",         stageName: "NAEBA SHOKUDOU", startAt: "2026-07-25T19:10:00", endAt: "2026-07-25T19:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3196" },
  { id: "fr-d2-n6", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "the Tiger",              stageName: "NAEBA SHOKUDOU", startAt: "2026-07-25T21:10:00", endAt: "2026-07-25T21:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/2698" },
  { id: "fr-d2-n7", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "HOT DOG EXPRESS",        stageName: "NAEBA SHOKUDOU", startAt: "2026-07-25T22:45:00", endAt: "2026-07-25T23:25:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6944" },

  // Day 2 · GANBAN
  { id: "fr-d2-gb1", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "AAAMYYY (Tempalay)",    stageName: "GANBAN", startAt: "2026-07-25T23:30:00", endAt: "2026-07-26T00:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6159" },
  { id: "fr-d2-gb2", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "MONJOE",                stageName: "GANBAN", startAt: "2026-07-26T00:30:00", endAt: "2026-07-26T02:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6352" },
  { id: "fr-d2-gb3", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "O.N.O (THA BLUE HERB)", stageName: "GANBAN", startAt: "2026-07-26T02:00:00", endAt: "2026-07-26T02:45:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/277" },
  { id: "fr-d2-gb4", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "MaL a.k.a. Primal Dub", stageName: "GANBAN", startAt: "2026-07-26T02:45:00", endAt: "2026-07-26T03:45:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6955" },
  { id: "fr-d2-gb5", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "Lomax (NC4K)",          stageName: "GANBAN", startAt: "2026-07-26T03:45:00", endAt: "2026-07-26T05:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6956" },

  // Day 2 · BLUE GALAXY
  { id: "fr-d2-bg1",  festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "DJ JIM",                        stageName: "BLUE GALAXY", startAt: "2026-07-25T12:50:00", endAt: "2026-07-25T14:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/1414" },
  { id: "fr-d2-bg2",  festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "DJ GONCHAN",                    stageName: "BLUE GALAXY", startAt: "2026-07-25T14:00:00", endAt: "2026-07-25T14:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5102" },
  { id: "fr-d2-bg3",  festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "NORTH KANTO REBEL SOUND CLASH", stageName: "BLUE GALAXY", startAt: "2026-07-25T14:50:00", endAt: "2026-07-25T15:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6963" },
  { id: "fr-d2-bg4",  festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "JAPAN CUMBIA FESTIVAL DJs",     stageName: "BLUE GALAXY", startAt: "2026-07-25T15:30:00", endAt: "2026-07-25T16:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6931" },
  { id: "fr-d2-bg5",  festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "FUMINN",                        stageName: "BLUE GALAXY", startAt: "2026-07-25T16:20:00", endAt: "2026-07-25T17:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6962" },
  { id: "fr-d2-bg6",  festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "TXAKO",                         stageName: "BLUE GALAXY", startAt: "2026-07-25T17:10:00", endAt: "2026-07-25T18:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6480" },
  { id: "fr-d2-bg7",  festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "DJ TOMMY",                      stageName: "BLUE GALAXY", startAt: "2026-07-25T18:00:00", endAt: "2026-07-25T18:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6797" },
  { id: "fr-d2-bg8",  festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "CLUB SKA",                      stageName: "BLUE GALAXY", startAt: "2026-07-25T18:50:00", endAt: "2026-07-25T21:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/740" },
  { id: "fr-d2-bg9",  festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "SPECIAL GUEST",                 stageName: "BLUE GALAXY", startAt: "2026-07-25T21:20:00", endAt: "2026-07-25T22:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6799" },
  { id: "fr-d2-bg10", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "RIHO",                          stageName: "BLUE GALAXY", startAt: "2026-07-25T22:00:00", endAt: "2026-07-25T23:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/2165" },
  { id: "fr-d2-bg11", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "DJ JIM",                        stageName: "BLUE GALAXY", startAt: "2026-07-25T23:00:00", endAt: "2026-07-26T00:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/1414" },

  // Day 2 · PALACE AREA
  { id: "fr-d2-pa1", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "SAKURA CIRCUS",     stageName: "PALACE AREA", startAt: "2026-07-26T00:30:00", endAt: "2026-07-26T00:45:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6937" },
  { id: "fr-d2-pa2", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "SAKURA CIRCUS",     stageName: "PALACE AREA", startAt: "2026-07-26T01:30:00", endAt: "2026-07-26T01:45:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6937" },
  { id: "fr-d2-pa3", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "SAKURA CIRCUS",     stageName: "PALACE AREA", startAt: "2026-07-26T02:30:00", endAt: "2026-07-26T02:45:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6937" },

  // Day 2 · PYRAMID GARDEN
  { id: "fr-d2-pg1", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "ヨガワークショップ / 渋木さやか",   stageName: "PYRAMID GARDEN", startAt: "2026-07-25T08:30:00", endAt: "2026-07-25T09:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5716" },
  { id: "fr-d2-pg2", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "GOMA",                            stageName: "PYRAMID GARDEN", startAt: "2026-07-25T09:40:00", endAt: "2026-07-25T10:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3295" },
  { id: "fr-d2-pg3", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "Michael Kaneko",                  stageName: "PYRAMID GARDEN", startAt: "2026-07-25T11:30:00", endAt: "2026-07-25T12:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3266" },
  { id: "fr-d2-pg4", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "YOSHIROTTEN",                     stageName: "PYRAMID GARDEN", startAt: "2026-07-25T16:30:00", endAt: "2026-07-25T19:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6952" },
  { id: "fr-d2-pg5", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "AOIZO",                           stageName: "PYRAMID GARDEN", startAt: "2026-07-25T19:30:00", endAt: "2026-07-25T20:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6951" },
  { id: "fr-d2-pg6", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "BAKU (KAIKOO)",                   stageName: "PYRAMID GARDEN", startAt: "2026-07-25T20:30:00", endAt: "2026-07-25T22:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6950" },
  { id: "fr-d2-pg7", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "ずっと真夜中でいいのに。",         stageName: "PYRAMID GARDEN", startAt: "2026-07-25T23:00:00", endAt: "2026-07-26T00:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6949" },
  { id: "fr-d2-pg8", festivalId: "fuji-rock-2026", displayDate: "2026-07-25", artistName: "SILENT POETS (DUB ENSEMBLE)",     stageName: "PYRAMID GARDEN", startAt: "2026-07-26T00:50:00", endAt: "2026-07-26T01:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/4796" },

  // Day 3 · NAEBA SHOKUDOU
  { id: "fr-d3-n1", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "鬼の右腕",              stageName: "NAEBA SHOKUDOU", startAt: "2026-07-26T12:10:00", endAt: "2026-07-26T12:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3808" },
  { id: "fr-d3-n2", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "揺らぎ",                stageName: "NAEBA SHOKUDOU", startAt: "2026-07-26T13:30:00", endAt: "2026-07-26T14:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6090" },
  { id: "fr-d3-n3", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "saccharin",             stageName: "NAEBA SHOKUDOU", startAt: "2026-07-26T15:10:00", endAt: "2026-07-26T15:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5829" },
  { id: "fr-d3-n4", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "Keishi Tanaka",         stageName: "NAEBA SHOKUDOU", startAt: "2026-07-26T17:10:00", endAt: "2026-07-26T17:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3594" },
  { id: "fr-d3-n5", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "苗場音楽突撃隊",         stageName: "NAEBA SHOKUDOU", startAt: "2026-07-26T19:10:00", endAt: "2026-07-26T19:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3196" },
  { id: "fr-d3-n6", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "REGA",                  stageName: "NAEBA SHOKUDOU", startAt: "2026-07-26T21:10:00", endAt: "2026-07-26T21:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/2698" },
  { id: "fr-d3-n7", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "TBA",                  stageName: "NAEBA SHOKUDOU", startAt: "2026-07-26T22:45:00", endAt: "2026-07-26T23:25:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6944" },

  // Day 3 · GANBAN
  { id: "fr-d3-gb1", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "TAKU INOUE",          stageName: "GANBAN", startAt: "2026-07-26T23:30:00", endAt: "2026-07-27T01:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6159" },
  { id: "fr-d3-gb2", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "ANTS HOUSE (Nariaki & Nomizo & Rintaro Sekizuka)", stageName: "GANBAN", startAt: "2026-07-27T01:00:00", endAt: "2026-07-27T04:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6957" },

  // Day 3 · BLUE GALAXY
  { id: "fr-d3-bg1",  festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "DJ JIM",                            stageName: "BLUE GALAXY", startAt: "2026-07-26T12:00:00", endAt: "2026-07-26T13:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/1414" },
  { id: "fr-d3-bg2",  festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "田原'104'洋",                       stageName: "BLUE GALAXY", startAt: "2026-07-26T13:00:00", endAt: "2026-07-26T13:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6969" },
  { id: "fr-d3-bg3",  festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "NAOKI IENAGA (DUB STORE RECORDS)",  stageName: "BLUE GALAXY", startAt: "2026-07-26T13:40:00", endAt: "2026-07-26T14:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/4035" },
  { id: "fr-d3-bg4",  festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "TIM ROCKINS",                       stageName: "BLUE GALAXY", startAt: "2026-07-26T14:30:00", endAt: "2026-07-26T15:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6968" },
  { id: "fr-d3-bg5",  festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "Nozomu",                            stageName: "BLUE GALAXY", startAt: "2026-07-26T15:50:00", endAt: "2026-07-26T16:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6474" },
  { id: "fr-d3-bg6",  festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "Can Dream®",                        stageName: "BLUE GALAXY", startAt: "2026-07-26T16:30:00", endAt: "2026-07-26T17:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6967" },
  { id: "fr-d3-bg7",  festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "Satria Ramadhan",                   stageName: "BLUE GALAXY", startAt: "2026-07-26T17:10:00", endAt: "2026-07-26T17:50:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6480" },
  { id: "fr-d3-bg8",  festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "JAMAiCAN TiME",                     stageName: "BLUE GALAXY", startAt: "2026-07-26T17:50:00", endAt: "2026-07-26T18:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6966" },
  { id: "fr-d3-bg9",  festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "RJD",                               stageName: "BLUE GALAXY", startAt: "2026-07-26T18:30:00", endAt: "2026-07-26T19:10:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6959" },
  { id: "fr-d3-bg10", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "HANASUBI",                          stageName: "BLUE GALAXY", startAt: "2026-07-26T19:10:00", endAt: "2026-07-26T20:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6965" },
  { id: "fr-d3-bg11", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "DJ JIM",                            stageName: "BLUE GALAXY", startAt: "2026-07-26T20:00:00", endAt: "2026-07-26T20:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/1414" },
  { id: "fr-d3-bg12", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "Yutaro",                            stageName: "BLUE GALAXY", startAt: "2026-07-26T20:40:00", endAt: "2026-07-26T22:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6964" },
  { id: "fr-d3-bg13", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "DR. IHARA",                         stageName: "BLUE GALAXY", startAt: "2026-07-26T22:00:00", endAt: "2026-07-26T23:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/2165" },
  { id: "fr-d3-bg14", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "DJ JIM",                            stageName: "BLUE GALAXY", startAt: "2026-07-26T23:00:00", endAt: "2026-07-27T00:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/1414" },

  // Day 3 · PALACE AREA
  { id: "fr-d3-pa1", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "SAKURA CIRCUS",     stageName: "PALACE AREA", startAt: "2026-07-27T00:30:00", endAt: "2026-07-27T00:45:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6937" },
  { id: "fr-d3-pa2", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "SAKURA CIRCUS",     stageName: "PALACE AREA", startAt: "2026-07-27T01:30:00", endAt: "2026-07-27T01:45:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6937" },
  { id: "fr-d3-pa3", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "SAKURA CIRCUS",     stageName: "PALACE AREA", startAt: "2026-07-27T02:30:00", endAt: "2026-07-27T02:45:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6937" },

  // Day 3 · PYRAMID GARDEN
  { id: "fr-d3-pg1", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "ヨガワークショップ / 渋木さやか",   stageName: "PYRAMID GARDEN", startAt: "2026-07-26T08:30:00", endAt: "2026-07-26T09:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5716" },
  { id: "fr-d3-pg2", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "チャラン・ポ・ランタン",            stageName: "PYRAMID GARDEN", startAt: "2026-07-26T09:40:00", endAt: "2026-07-26T10:40:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3295" },
  { id: "fr-d3-pg3", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "Caravan",                          stageName: "PYRAMID GARDEN", startAt: "2026-07-26T11:30:00", endAt: "2026-07-26T12:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/3266" },
  { id: "fr-d3-pg4", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "Kadal",                            stageName: "PYRAMID GARDEN", startAt: "2026-07-26T16:00:00", endAt: "2026-07-26T19:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6954" },
  { id: "fr-d3-pg5", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "KOTARO",                           stageName: "PYRAMID GARDEN", startAt: "2026-07-26T19:00:00", endAt: "2026-07-26T22:00:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/5460" },
  { id: "fr-d3-pg6", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "蓮沼執太チーム",                    stageName: "PYRAMID GARDEN", startAt: "2026-07-26T22:30:00", endAt: "2026-07-26T23:30:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/6953" },
  { id: "fr-d3-pg7", festivalId: "fuji-rock-2026", displayDate: "2026-07-26", artistName: "TENDRE",                           stageName: "PYRAMID GARDEN", startAt: "2026-07-27T00:20:00", endAt: "2026-07-27T01:20:00", confidence: 1, link: "https://en.fujirockfestival.com/artist/detail/4945" },

  // ============================================================
  // 游山音乐节 2026 · 河北张家口崇礼 · 7/17-7/19 · 官方海报识别
  // ============================================================
  // Day 1 (2026-07-17 FRI) · FOREST STAGE
  { id: "ys-d1-f1", festivalId: "youshan-2026", displayDate: "2026-07-17", artistName: "Meixing",            stageName: "FOREST STAGE", startAt: "2026-07-17T15:00:00", endAt: "2026-07-17T16:15:00", confidence: 1 },
  { id: "ys-d1-f2", festivalId: "youshan-2026", displayDate: "2026-07-17", artistName: "Paradice Sinema",    stageName: "FOREST STAGE", startAt: "2026-07-17T16:15:00", endAt: "2026-07-17T17:30:00", confidence: 1 },
  { id: "ys-d1-f3", festivalId: "youshan-2026", displayDate: "2026-07-17", artistName: "Hanxuhaux (LIVE)",   stageName: "FOREST STAGE", startAt: "2026-07-17T17:30:00", endAt: "2026-07-17T18:30:00", confidence: 1 },
  { id: "ys-d1-f4", festivalId: "youshan-2026", displayDate: "2026-07-17", artistName: "Yepwatt (LIVE)",     stageName: "FOREST STAGE", startAt: "2026-07-17T18:30:00", endAt: "2026-07-17T19:45:00", confidence: 1 },
  { id: "ys-d1-f5", festivalId: "youshan-2026", displayDate: "2026-07-17", artistName: "Finascia",           stageName: "FOREST STAGE", startAt: "2026-07-17T19:45:00", endAt: "2026-07-17T21:00:00", confidence: 1 },
  { id: "ys-d1-f6", festivalId: "youshan-2026", displayDate: "2026-07-17", artistName: "Howell",             stageName: "FOREST STAGE", startAt: "2026-07-17T21:00:00", endAt: "2026-07-17T22:15:00", confidence: 1 },
  { id: "ys-d1-f7", festivalId: "youshan-2026", displayDate: "2026-07-17", artistName: "Liuyang",            stageName: "FOREST STAGE", startAt: "2026-07-17T22:15:00", endAt: "2026-07-17T23:30:00", confidence: 1 },
  { id: "ys-d1-f8", festivalId: "youshan-2026", displayDate: "2026-07-17", artistName: "NYB",                stageName: "FOREST STAGE", startAt: "2026-07-17T23:30:00", endAt: "2026-07-18T00:45:00", confidence: 1 },
  // Day 1 · VALLEY STAGE
  { id: "ys-d1-v1", festivalId: "youshan-2026", displayDate: "2026-07-17", artistName: "Bambi",                            stageName: "VALLEY STAGE", startAt: "2026-07-17T18:00:00", endAt: "2026-07-17T19:30:00", confidence: 1 },
  { id: "ys-d1-v2", festivalId: "youshan-2026", displayDate: "2026-07-17", artistName: "Sunyoung",                         stageName: "VALLEY STAGE", startAt: "2026-07-17T19:30:00", endAt: "2026-07-17T21:00:00", confidence: 1 },
  { id: "ys-d1-v3", festivalId: "youshan-2026", displayDate: "2026-07-17", artistName: "Lizz [RO]",                        stageName: "VALLEY STAGE", startAt: "2026-07-17T21:00:00", endAt: "2026-07-17T23:00:00", confidence: 1 },
  { id: "ys-d1-v4", festivalId: "youshan-2026", displayDate: "2026-07-17", artistName: "Oshana [US] Vinyl Set",            stageName: "VALLEY STAGE", startAt: "2026-07-17T23:00:00", endAt: "2026-07-18T01:00:00", confidence: 1 },
  { id: "ys-d1-v5", festivalId: "youshan-2026", displayDate: "2026-07-17", artistName: "Tobias. (LIVE) [DE]",              stageName: "VALLEY STAGE", startAt: "2026-07-18T01:00:00", endAt: "2026-07-18T03:00:00", confidence: 1 },
  { id: "ys-d1-v6", festivalId: "youshan-2026", displayDate: "2026-07-17", artistName: "Rrose [US]",                       stageName: "VALLEY STAGE", startAt: "2026-07-18T03:00:00", endAt: "2026-07-18T05:00:00", confidence: 1 },

  // Day 2 (2026-07-18 SAT) · FOREST STAGE
  { id: "ys-d2-f1", festivalId: "youshan-2026", displayDate: "2026-07-18", artistName: "Shengchou",            stageName: "FOREST STAGE", startAt: "2026-07-18T15:00:00", endAt: "2026-07-18T16:15:00", confidence: 1 },
  { id: "ys-d2-f2", festivalId: "youshan-2026", displayDate: "2026-07-18", artistName: "77 Mushrooms",         stageName: "FOREST STAGE", startAt: "2026-07-18T16:15:00", endAt: "2026-07-18T17:30:00", confidence: 1 },
  { id: "ys-d2-f3", festivalId: "youshan-2026", displayDate: "2026-07-18", artistName: "Cola Ren (LIVE)",      stageName: "FOREST STAGE", startAt: "2026-07-18T17:30:00", endAt: "2026-07-18T18:15:00", confidence: 1 },
  { id: "ys-d2-f4", festivalId: "youshan-2026", displayDate: "2026-07-18", artistName: "Liuliu",               stageName: "FOREST STAGE", startAt: "2026-07-18T18:15:00", endAt: "2026-07-18T19:30:00", confidence: 1 },
  { id: "ys-d2-f5", festivalId: "youshan-2026", displayDate: "2026-07-18", artistName: "Rhom Omit",            stageName: "FOREST STAGE", startAt: "2026-07-18T19:30:00", endAt: "2026-07-18T20:45:00", confidence: 1 },
  { id: "ys-d2-f6", festivalId: "youshan-2026", displayDate: "2026-07-18", artistName: "Thomas Futoso",        stageName: "FOREST STAGE", startAt: "2026-07-18T20:45:00", endAt: "2026-07-18T22:00:00", confidence: 1 },
  { id: "ys-d2-f7", festivalId: "youshan-2026", displayDate: "2026-07-18", artistName: "Qiuqiu b2b DJ EBP",    stageName: "FOREST STAGE", startAt: "2026-07-18T22:00:00", endAt: "2026-07-19T00:00:00", confidence: 1 },
  { id: "ys-d2-f8", festivalId: "youshan-2026", displayDate: "2026-07-18", artistName: "Lana Den",             stageName: "FOREST STAGE", startAt: "2026-07-19T00:00:00", endAt: "2026-07-19T01:30:00", confidence: 1 },
  // Day 2 · VALLEY STAGE
  { id: "ys-d2-v1", festivalId: "youshan-2026", displayDate: "2026-07-18", artistName: "Mariio",                              stageName: "VALLEY STAGE", startAt: "2026-07-18T17:30:00", endAt: "2026-07-18T19:00:00", confidence: 1 },
  { id: "ys-d2-v2", festivalId: "youshan-2026", displayDate: "2026-07-18", artistName: "Mihai Pol [RO]",                      stageName: "VALLEY STAGE", startAt: "2026-07-18T19:00:00", endAt: "2026-07-18T21:00:00", confidence: 1 },
  { id: "ys-d2-v3", festivalId: "youshan-2026", displayDate: "2026-07-18", artistName: "Jorge Caiado [PT] Vinyl Set",         stageName: "VALLEY STAGE", startAt: "2026-07-18T21:00:00", endAt: "2026-07-18T23:00:00", confidence: 1 },
  { id: "ys-d2-v4", festivalId: "youshan-2026", displayDate: "2026-07-18", artistName: "Giammarco Orsini [IT] Vinyl Set",     stageName: "VALLEY STAGE", startAt: "2026-07-18T23:00:00", endAt: "2026-07-19T01:00:00", confidence: 1 },
  { id: "ys-d2-v5", festivalId: "youshan-2026", displayDate: "2026-07-18", artistName: "Dan Andrei [RO] Vinyl Set",           stageName: "VALLEY STAGE", startAt: "2026-07-19T01:00:00", endAt: "2026-07-19T03:00:00", confidence: 1 },
  { id: "ys-d2-v6", festivalId: "youshan-2026", displayDate: "2026-07-18", artistName: "Raphael Carrau [BR] Vinyl Set",       stageName: "VALLEY STAGE", startAt: "2026-07-19T03:00:00", endAt: "2026-07-19T05:00:00", confidence: 1 },

  // Day 3 (2026-07-19 SUN) · FOREST STAGE
  { id: "ys-d3-f1", festivalId: "youshan-2026", displayDate: "2026-07-19", artistName: "BingBing",            stageName: "FOREST STAGE", startAt: "2026-07-19T16:30:00", endAt: "2026-07-19T18:00:00", confidence: 1 },
  { id: "ys-d3-f2", festivalId: "youshan-2026", displayDate: "2026-07-19", artistName: "Cai",                 stageName: "FOREST STAGE", startAt: "2026-07-19T18:00:00", endAt: "2026-07-19T19:30:00", confidence: 1 },
  { id: "ys-d3-f3", festivalId: "youshan-2026", displayDate: "2026-07-19", artistName: "Darcy",               stageName: "FOREST STAGE", startAt: "2026-07-19T19:30:00", endAt: "2026-07-19T21:00:00", confidence: 1 },
  { id: "ys-d3-f4", festivalId: "youshan-2026", displayDate: "2026-07-19", artistName: "Chouchou",            stageName: "FOREST STAGE", startAt: "2026-07-19T21:00:00", endAt: "2026-07-19T22:30:00", confidence: 1 },
  { id: "ys-d3-f5", festivalId: "youshan-2026", displayDate: "2026-07-19", artistName: "Oolong",              stageName: "FOREST STAGE", startAt: "2026-07-19T22:30:00", endAt: "2026-07-20T00:00:00", confidence: 1 },
  // Day 3 · VALLEY STAGE
  { id: "ys-d3-v1", festivalId: "youshan-2026", displayDate: "2026-07-19", artistName: "Nigls b2b Kai.f",     stageName: "VALLEY STAGE", startAt: "2026-07-19T15:00:00", endAt: "2026-07-19T17:30:00", confidence: 1 },
  { id: "ys-d3-v2", festivalId: "youshan-2026", displayDate: "2026-07-19", artistName: "Javis",               stageName: "VALLEY STAGE", startAt: "2026-07-19T17:30:00", endAt: "2026-07-19T19:00:00", confidence: 1 },
  { id: "ys-d3-v3", festivalId: "youshan-2026", displayDate: "2026-07-19", artistName: "White+ (LIVE)",       stageName: "VALLEY STAGE", startAt: "2026-07-19T19:00:00", endAt: "2026-07-19T20:00:00", confidence: 1 },
  { id: "ys-d3-v4", festivalId: "youshan-2026", displayDate: "2026-07-19", artistName: "Jeremy Cheung",       stageName: "VALLEY STAGE", startAt: "2026-07-19T20:00:00", endAt: "2026-07-19T21:30:00", confidence: 1 },
  { id: "ys-d3-v5", festivalId: "youshan-2026", displayDate: "2026-07-19", artistName: "Mickey Zhang",        stageName: "VALLEY STAGE", startAt: "2026-07-19T21:30:00", endAt: "2026-07-19T23:00:00", confidence: 1 },
  { id: "ys-d3-v6", festivalId: "youshan-2026", displayDate: "2026-07-19", artistName: "Sam tbd",             stageName: "VALLEY STAGE", startAt: "2026-07-19T23:00:00", endAt: "2026-07-20T01:00:00", confidence: 1 },
  { id: "ys-d3-v7", festivalId: "youshan-2026", displayDate: "2026-07-19", artistName: "Yang Bing",           stageName: "VALLEY STAGE", startAt: "2026-07-20T01:00:00", endAt: "2026-07-20T03:00:00", confidence: 1 },
  { id: "ys-d3-v8", festivalId: "youshan-2026", displayDate: "2026-07-19", artistName: "Weng Weng",           stageName: "VALLEY STAGE", startAt: "2026-07-20T03:00:00", endAt: "2026-07-20T05:00:00", confidence: 1 },

  // ============================================================
  // 新壤音乐节 NEW SOIL MUSIC FESTIVAL 2026 · 锡林浩特·那达慕 · 7/24-7/26 · 官方海报识别
  // ============================================================
  // Day 1 (2026-07-24 FRI) · 旷野舞台
  { id: "ns-d1-k1", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "气象限定Quadrant", stageName: "旷野舞台", startAt: "2026-07-24T16:00:00", endAt: "2026-07-24T16:40:00", confidence: 1 },
  { id: "ns-d1-k2", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "疯医",             stageName: "旷野舞台", startAt: "2026-07-24T17:00:00", endAt: "2026-07-24T17:40:00", confidence: 1 },
  { id: "ns-d1-k3", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "声音碎片",         stageName: "旷野舞台", startAt: "2026-07-24T18:00:00", endAt: "2026-07-24T18:40:00", confidence: 1 },
  { id: "ns-d1-k4", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "南青",             stageName: "旷野舞台", startAt: "2026-07-24T19:00:00", endAt: "2026-07-24T19:40:00", confidence: 1 },
  { id: "ns-d1-k5", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "谢天笑&OK KING",    stageName: "旷野舞台", startAt: "2026-07-24T20:00:00", endAt: "2026-07-24T20:50:00", confidence: 1 },
  { id: "ns-d1-k6", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "野孩子",           stageName: "旷野舞台", startAt: "2026-07-24T21:10:00", endAt: "2026-07-24T21:50:00", confidence: 1 },
  // Day 1 · 战国舞台
  { id: "ns-d1-z1", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "再见日落",         stageName: "战国舞台", startAt: "2026-07-24T15:20:00", endAt: "2026-07-24T16:00:00", confidence: 1 },
  { id: "ns-d1-z2", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "遁世浮屠",         stageName: "战国舞台", startAt: "2026-07-24T16:20:00", endAt: "2026-07-24T17:00:00", confidence: 1 },
  { id: "ns-d1-z3", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "瘟疫之骇",         stageName: "战国舞台", startAt: "2026-07-24T17:20:00", endAt: "2026-07-24T18:00:00", confidence: 1 },
  { id: "ns-d1-z4", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "F.U.N",            stageName: "战国舞台", startAt: "2026-07-24T18:20:00", endAt: "2026-07-24T19:00:00", confidence: 1 },
  { id: "ns-d1-z5", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "准噶尔",           stageName: "战国舞台", startAt: "2026-07-24T19:20:00", endAt: "2026-07-24T20:10:00", confidence: 1 },
  { id: "ns-d1-z6", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "九宝",             stageName: "战国舞台", startAt: "2026-07-24T20:30:00", endAt: "2026-07-24T21:10:00", confidence: 1 },
  // Day 1 · 扑光舞台
  { id: "ns-d1-p1", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "针叶暗处",         stageName: "扑光舞台", startAt: "2026-07-24T14:00:00", endAt: "2026-07-24T14:40:00", confidence: 1 },
  { id: "ns-d1-p2", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "沉默橙",           stageName: "扑光舞台", startAt: "2026-07-24T15:10:00", endAt: "2026-07-24T15:50:00", confidence: 1 },
  { id: "ns-d1-p3", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "因否INFO",         stageName: "扑光舞台", startAt: "2026-07-24T16:20:00", endAt: "2026-07-24T17:00:00", confidence: 1 },
  { id: "ns-d1-p4", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "C.S.B.Q",          stageName: "扑光舞台", startAt: "2026-07-24T17:20:00", endAt: "2026-07-24T18:00:00", confidence: 1 },
  { id: "ns-d1-p5", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "赫兹乐队",         stageName: "扑光舞台", startAt: "2026-07-24T18:20:00", endAt: "2026-07-24T19:00:00", confidence: 1 },
  { id: "ns-d1-p6", festivalId: "new-soil-2026", displayDate: "2026-07-24", artistName: "浅水ShallowEnd",   stageName: "扑光舞台", startAt: "2026-07-24T19:20:00", endAt: "2026-07-24T20:00:00", confidence: 1 },

  // Day 2 (2026-07-25 SAT) · 旷野舞台
  { id: "ns-d2-k1", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "破碎",             stageName: "旷野舞台", startAt: "2026-07-25T16:00:00", endAt: "2026-07-25T16:40:00", confidence: 1 },
  { id: "ns-d2-k2", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "王喂马",           stageName: "旷野舞台", startAt: "2026-07-25T17:00:00", endAt: "2026-07-25T17:40:00", confidence: 1 },
  { id: "ns-d2-k3", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "石岩",             stageName: "旷野舞台", startAt: "2026-07-25T18:00:00", endAt: "2026-07-25T18:40:00", confidence: 1 },
  { id: "ns-d2-k4", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "岛屿心情",         stageName: "旷野舞台", startAt: "2026-07-25T19:00:00", endAt: "2026-07-25T19:40:00", confidence: 1 },
  { id: "ns-d2-k5", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "大波浪·Dabo Lang",  stageName: "旷野舞台", startAt: "2026-07-25T20:00:00", endAt: "2026-07-25T20:50:00", confidence: 1 },
  { id: "ns-d2-k6", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "GALA",             stageName: "旷野舞台", startAt: "2026-07-25T21:10:00", endAt: "2026-07-25T21:50:00", confidence: 1 },
  // Day 2 · 战国舞台
  { id: "ns-d2-z1", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "岚之山",           stageName: "战国舞台", startAt: "2026-07-25T15:20:00", endAt: "2026-07-25T16:00:00", confidence: 1 },
  { id: "ns-d2-z2", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "冻结的月亮",       stageName: "战国舞台", startAt: "2026-07-25T16:20:00", endAt: "2026-07-25T17:00:00", confidence: 1 },
  { id: "ns-d2-z3", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "痛地铁DIW",        stageName: "战国舞台", startAt: "2026-07-25T17:20:00", endAt: "2026-07-25T18:00:00", confidence: 1 },
  { id: "ns-d2-z4", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "水树",             stageName: "战国舞台", startAt: "2026-07-25T18:20:00", endAt: "2026-07-25T19:00:00", confidence: 1 },
  { id: "ns-d2-z5", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "利维坦",           stageName: "战国舞台", startAt: "2026-07-25T19:20:00", endAt: "2026-07-25T20:10:00", confidence: 1 },
  { id: "ns-d2-z6", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "萨满",             stageName: "战国舞台", startAt: "2026-07-25T20:30:00", endAt: "2026-07-25T21:10:00", confidence: 1 },
  // Day 2 · 扑光舞台
  { id: "ns-d2-p1", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "介绍信",           stageName: "扑光舞台", startAt: "2026-07-25T14:00:00", endAt: "2026-07-25T14:40:00", confidence: 1 },
  { id: "ns-d2-p2", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "佑转德里",         stageName: "扑光舞台", startAt: "2026-07-25T15:10:00", endAt: "2026-07-25T15:50:00", confidence: 1 },
  { id: "ns-d2-p3", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "Hi Link Channel",  stageName: "扑光舞台", startAt: "2026-07-25T16:20:00", endAt: "2026-07-25T17:00:00", confidence: 1 },
  { id: "ns-d2-p4", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "UNK焕青",          stageName: "扑光舞台", startAt: "2026-07-25T17:20:00", endAt: "2026-07-25T18:00:00", confidence: 1 },
  { id: "ns-d2-p5", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "县城朋克ATM",      stageName: "扑光舞台", startAt: "2026-07-25T18:20:00", endAt: "2026-07-25T19:00:00", confidence: 1 },
  { id: "ns-d2-p6", festivalId: "new-soil-2026", displayDate: "2026-07-25", artistName: "亚细亚报童",       stageName: "扑光舞台", startAt: "2026-07-25T19:20:00", endAt: "2026-07-25T20:00:00", confidence: 1 },

  // Day 3 (2026-07-26 SUN) · 旷野舞台
  { id: "ns-d3-k1", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "愤怒的奶瓶",             stageName: "旷野舞台", startAt: "2026-07-26T16:00:00", endAt: "2026-07-26T16:40:00", confidence: 1 },
  { id: "ns-d3-k2", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "葡萄不愤怒",             stageName: "旷野舞台", startAt: "2026-07-26T17:00:00", endAt: "2026-07-26T17:40:00", confidence: 1 },
  { id: "ns-d3-k3", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "钢心",                   stageName: "旷野舞台", startAt: "2026-07-26T18:00:00", endAt: "2026-07-26T18:40:00", confidence: 1 },
  { id: "ns-d3-k4", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "Kawa（管乐版特别呈现）", stageName: "旷野舞台", startAt: "2026-07-26T19:00:00", endAt: "2026-07-26T19:40:00", confidence: 1 },
  { id: "ns-d3-k5", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "丢火车",                 stageName: "旷野舞台", startAt: "2026-07-26T20:00:00", endAt: "2026-07-26T20:50:00", confidence: 1 },
  { id: "ns-d3-k6", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "五条人",                 stageName: "旷野舞台", startAt: "2026-07-26T21:10:00", endAt: "2026-07-26T21:50:00", confidence: 1 },
  // Day 3 · 战国舞台
  { id: "ns-d3-z1", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "最终谬论",         stageName: "战国舞台", startAt: "2026-07-26T15:20:00", endAt: "2026-07-26T16:00:00", confidence: 1 },
  { id: "ns-d3-z2", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "奉天",             stageName: "战国舞台", startAt: "2026-07-26T16:20:00", endAt: "2026-07-26T17:00:00", confidence: 1 },
  { id: "ns-d3-z3", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "莫问",             stageName: "战国舞台", startAt: "2026-07-26T17:20:00", endAt: "2026-07-26T18:00:00", confidence: 1 },
  { id: "ns-d3-z4", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "霜冻前夜",         stageName: "战国舞台", startAt: "2026-07-26T18:20:00", endAt: "2026-07-26T19:00:00", confidence: 1 },
  { id: "ns-d3-z5", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "黑麒",             stageName: "战国舞台", startAt: "2026-07-26T19:20:00", endAt: "2026-07-26T20:10:00", confidence: 1 },
  { id: "ns-d3-z6", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "醒山",             stageName: "战国舞台", startAt: "2026-07-26T20:30:00", endAt: "2026-07-26T21:10:00", confidence: 1 },
  // Day 3 · 扑光舞台
  { id: "ns-d3-p1", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "小羊快跑",               stageName: "扑光舞台", startAt: "2026-07-26T14:00:00", endAt: "2026-07-26T14:40:00", confidence: 1 },
  { id: "ns-d3-p2", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "玩具头",                 stageName: "扑光舞台", startAt: "2026-07-26T15:10:00", endAt: "2026-07-26T15:50:00", confidence: 1 },
  { id: "ns-d3-p3", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "陈念CASEE",              stageName: "扑光舞台", startAt: "2026-07-26T16:20:00", endAt: "2026-07-26T17:00:00", confidence: 1 },
  { id: "ns-d3-p4", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "迷心",                   stageName: "扑光舞台", startAt: "2026-07-26T17:20:00", endAt: "2026-07-26T18:00:00", confidence: 1 },
  { id: "ns-d3-p5", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "SinceTMRW始于明天",       stageName: "扑光舞台", startAt: "2026-07-26T18:20:00", endAt: "2026-07-26T19:00:00", confidence: 1 },
  { id: "ns-d3-p6", festivalId: "new-soil-2026", displayDate: "2026-07-26", artistName: "毛南",                   stageName: "扑光舞台", startAt: "2026-07-26T19:20:00", endAt: "2026-07-26T20:00:00", confidence: 1 },

  // ============================================================
  // MOSS 野苔音乐季 2026 · 官方时间表 (07.04–07.19)
  // 6 个演出日；"21:00–LATE" 收尾场次结束时间为估计值
  // ============================================================
  // 07/04 洄声日 · MOSS STAGE
  { id: "moss-0704-m1", festivalId: "moss-2026", displayDate: "2026-07-04", artistName: "v是兔子wishtoday",      stageName: "MOSS STAGE", startAt: "2026-07-04T14:00:00", endAt: "2026-07-04T14:40:00", confidence: 1 },
  { id: "moss-0704-m2", festivalId: "moss-2026", displayDate: "2026-07-04", artistName: "琥珀",                  stageName: "MOSS STAGE", startAt: "2026-07-04T15:00:00", endAt: "2026-07-04T15:40:00", confidence: 1 },
  { id: "moss-0704-m3", festivalId: "moss-2026", displayDate: "2026-07-04", artistName: "时过夏末",              stageName: "MOSS STAGE", startAt: "2026-07-04T16:00:00", endAt: "2026-07-04T16:40:00", confidence: 1 },
  { id: "moss-0704-m4", festivalId: "moss-2026", displayDate: "2026-07-04", artistName: "Pompeya (Rus)",        stageName: "MOSS STAGE", startAt: "2026-07-04T17:00:00", endAt: "2026-07-04T17:40:00", confidence: 1 },
  { id: "moss-0704-m5", festivalId: "moss-2026", displayDate: "2026-07-04", artistName: "PeaceHotel和平饭店",    stageName: "MOSS STAGE", startAt: "2026-07-04T18:00:00", endAt: "2026-07-04T18:40:00", confidence: 1 },
  { id: "moss-0704-m6", festivalId: "moss-2026", displayDate: "2026-07-04", artistName: "蛙池",                  stageName: "MOSS STAGE", startAt: "2026-07-04T19:00:00", endAt: "2026-07-04T19:40:00", confidence: 1 },
  { id: "moss-0704-m7", festivalId: "moss-2026", displayDate: "2026-07-04", artistName: "Carsick Cars",         stageName: "MOSS STAGE", startAt: "2026-07-04T20:00:00", endAt: "2026-07-04T20:40:00", confidence: 1 },
  { id: "moss-0704-m8", festivalId: "moss-2026", displayDate: "2026-07-04", artistName: "Chinese Football",     stageName: "MOSS STAGE", startAt: "2026-07-04T21:00:00", endAt: "2026-07-04T22:00:00", confidence: 1 },
  // 07/04 洄声日 · ROLLING STAGE
  { id: "moss-0704-r1", festivalId: "moss-2026", displayDate: "2026-07-04", artistName: "Silly Function",       stageName: "ROLLING STAGE", startAt: "2026-07-04T17:30:00", endAt: "2026-07-04T18:10:00", confidence: 1 },
  { id: "moss-0704-r2", festivalId: "moss-2026", displayDate: "2026-07-04", artistName: "甜又丧",                stageName: "ROLLING STAGE", startAt: "2026-07-04T18:30:00", endAt: "2026-07-04T19:10:00", confidence: 1 },
  { id: "moss-0704-r3", festivalId: "moss-2026", displayDate: "2026-07-04", artistName: "浪味仙贝",              stageName: "ROLLING STAGE", startAt: "2026-07-04T19:30:00", endAt: "2026-07-04T20:10:00", confidence: 1 },
  { id: "moss-0704-r4", festivalId: "moss-2026", displayDate: "2026-07-04", artistName: "白百EndlessWhite",      stageName: "ROLLING STAGE", startAt: "2026-07-04T20:30:00", endAt: "2026-07-04T21:10:00", confidence: 1 },
  // 07/05 狂欢日 · MOSS STAGE
  { id: "moss-0705-m1", festivalId: "moss-2026", displayDate: "2026-07-05", artistName: "沉默橙",                stageName: "MOSS STAGE", startAt: "2026-07-05T17:00:00", endAt: "2026-07-05T17:40:00", confidence: 1 },
  { id: "moss-0705-m2", festivalId: "moss-2026", displayDate: "2026-07-05", artistName: "荒事",                  stageName: "MOSS STAGE", startAt: "2026-07-05T18:00:00", endAt: "2026-07-05T18:40:00", confidence: 1 },
  { id: "moss-0705-m3", festivalId: "moss-2026", displayDate: "2026-07-05", artistName: "Chainhaha",            stageName: "MOSS STAGE", startAt: "2026-07-05T19:00:00", endAt: "2026-07-05T19:40:00", confidence: 1 },
  { id: "moss-0705-m4", festivalId: "moss-2026", displayDate: "2026-07-05", artistName: "荷尔蒙小姐",            stageName: "MOSS STAGE", startAt: "2026-07-05T20:00:00", endAt: "2026-07-05T20:40:00", confidence: 1 },
  { id: "moss-0705-m5", festivalId: "moss-2026", displayDate: "2026-07-05", artistName: "小狗的骨头",            stageName: "MOSS STAGE", startAt: "2026-07-05T21:00:00", endAt: "2026-07-05T22:00:00", confidence: 1 },
  // 07/05 狂欢日 · ROLLING STAGE
  { id: "moss-0705-r1", festivalId: "moss-2026", displayDate: "2026-07-05", artistName: "Manmama",              stageName: "ROLLING STAGE", startAt: "2026-07-05T16:30:00", endAt: "2026-07-05T17:10:00", confidence: 1 },
  { id: "moss-0705-r2", festivalId: "moss-2026", displayDate: "2026-07-05", artistName: "NeverSayGoodbye",      stageName: "ROLLING STAGE", startAt: "2026-07-05T17:30:00", endAt: "2026-07-05T18:10:00", confidence: 1 },
  { id: "moss-0705-r3", festivalId: "moss-2026", displayDate: "2026-07-05", artistName: "宇宙盲盒GalaxyBlind-box", stageName: "ROLLING STAGE", startAt: "2026-07-05T18:30:00", endAt: "2026-07-05T19:10:00", confidence: 1 },
  { id: "moss-0705-r4", festivalId: "moss-2026", displayDate: "2026-07-05", artistName: "Deep Water",           stageName: "ROLLING STAGE", startAt: "2026-07-05T19:30:00", endAt: "2026-07-05T20:10:00", confidence: 1 },
  // 07/10 专场日 · MOSS STAGE
  { id: "moss-0710-m1", festivalId: "moss-2026", displayDate: "2026-07-10", artistName: "岛屿心情（限定专场）",  stageName: "MOSS STAGE", startAt: "2026-07-10T20:00:00", endAt: "2026-07-10T22:00:00", confidence: 1 },
  // 07/11 洄声日 · MOSS STAGE
  { id: "moss-0711-m1", festivalId: "moss-2026", displayDate: "2026-07-11", artistName: "GOINDOWN",             stageName: "MOSS STAGE", startAt: "2026-07-11T14:00:00", endAt: "2026-07-11T14:40:00", confidence: 1 },
  { id: "moss-0711-m2", festivalId: "moss-2026", displayDate: "2026-07-11", artistName: "板砖The Brickska",      stageName: "MOSS STAGE", startAt: "2026-07-11T15:00:00", endAt: "2026-07-11T15:40:00", confidence: 1 },
  { id: "moss-0711-m3", festivalId: "moss-2026", displayDate: "2026-07-11", artistName: "狗毛&乐队",             stageName: "MOSS STAGE", startAt: "2026-07-11T16:00:00", endAt: "2026-07-11T16:40:00", confidence: 1 },
  { id: "moss-0711-m4", festivalId: "moss-2026", displayDate: "2026-07-11", artistName: "本能實業",              stageName: "MOSS STAGE", startAt: "2026-07-11T17:00:00", endAt: "2026-07-11T17:40:00", confidence: 1 },
  { id: "moss-0711-m5", festivalId: "moss-2026", displayDate: "2026-07-11", artistName: "钢心",                  stageName: "MOSS STAGE", startAt: "2026-07-11T18:00:00", endAt: "2026-07-11T18:40:00", confidence: 1 },
  { id: "moss-0711-m6", festivalId: "moss-2026", displayDate: "2026-07-11", artistName: "顶楼的马戏团",          stageName: "MOSS STAGE", startAt: "2026-07-11T19:00:00", endAt: "2026-07-11T19:40:00", confidence: 1 },
  { id: "moss-0711-m7", festivalId: "moss-2026", displayDate: "2026-07-11", artistName: "Joyside",              stageName: "MOSS STAGE", startAt: "2026-07-11T20:00:00", endAt: "2026-07-11T20:40:00", confidence: 1 },
  { id: "moss-0711-m8", festivalId: "moss-2026", displayDate: "2026-07-11", artistName: "Kawa乐队（管乐版）",     stageName: "MOSS STAGE", startAt: "2026-07-11T21:00:00", endAt: "2026-07-11T22:00:00", confidence: 1 },
  // 07/11 洄声日 · ROLLING STAGE
  { id: "moss-0711-r1", festivalId: "moss-2026", displayDate: "2026-07-11", artistName: "Kharstflux",           stageName: "ROLLING STAGE", startAt: "2026-07-11T17:30:00", endAt: "2026-07-11T18:10:00", confidence: 1 },
  { id: "moss-0711-r2", festivalId: "moss-2026", displayDate: "2026-07-11", artistName: "佳非JahPhy",            stageName: "ROLLING STAGE", startAt: "2026-07-11T18:30:00", endAt: "2026-07-11T19:10:00", confidence: 1 },
  { id: "moss-0711-r3", festivalId: "moss-2026", displayDate: "2026-07-11", artistName: "孤独的利里",            stageName: "ROLLING STAGE", startAt: "2026-07-11T19:30:00", endAt: "2026-07-11T20:10:00", confidence: 1 },
  { id: "moss-0711-r4", festivalId: "moss-2026", displayDate: "2026-07-11", artistName: "Sky King Jack",        stageName: "ROLLING STAGE", startAt: "2026-07-11T20:30:00", endAt: "2026-07-11T21:10:00", confidence: 1 },
  // 07/12 狂欢日 · MOSS STAGE
  { id: "moss-0712-m1", festivalId: "moss-2026", displayDate: "2026-07-12", artistName: "春山后潮",              stageName: "MOSS STAGE", startAt: "2026-07-12T15:00:00", endAt: "2026-07-12T15:40:00", confidence: 1 },
  { id: "moss-0712-m2", festivalId: "moss-2026", displayDate: "2026-07-12", artistName: "WHITE+",               stageName: "MOSS STAGE", startAt: "2026-07-12T16:00:00", endAt: "2026-07-12T16:40:00", confidence: 1 },
  { id: "moss-0712-m3", festivalId: "moss-2026", displayDate: "2026-07-12", artistName: "跳山羊",                stageName: "MOSS STAGE", startAt: "2026-07-12T17:00:00", endAt: "2026-07-12T17:40:00", confidence: 1 },
  { id: "moss-0712-m4", festivalId: "moss-2026", displayDate: "2026-07-12", artistName: "丢莱卡",                stageName: "MOSS STAGE", startAt: "2026-07-12T18:00:00", endAt: "2026-07-12T18:40:00", confidence: 1 },
  { id: "moss-0712-m5", festivalId: "moss-2026", displayDate: "2026-07-12", artistName: "海皮威尔",              stageName: "MOSS STAGE", startAt: "2026-07-12T19:00:00", endAt: "2026-07-12T19:40:00", confidence: 1 },
  { id: "moss-0712-m6", festivalId: "moss-2026", displayDate: "2026-07-12", artistName: "HYPER SLASH超级斩",     stageName: "MOSS STAGE", startAt: "2026-07-12T20:00:00", endAt: "2026-07-12T20:40:00", confidence: 1 },
  { id: "moss-0712-m7", festivalId: "moss-2026", displayDate: "2026-07-12", artistName: "白纸扇",                stageName: "MOSS STAGE", startAt: "2026-07-12T21:00:00", endAt: "2026-07-12T22:00:00", confidence: 1 },
  // 07/12 狂欢日 · ROLLING STAGE
  { id: "moss-0712-r1", festivalId: "moss-2026", displayDate: "2026-07-12", artistName: "Kamerata卡梅拉塔",       stageName: "ROLLING STAGE", startAt: "2026-07-12T17:30:00", endAt: "2026-07-12T18:10:00", confidence: 1 },
  { id: "moss-0712-r2", festivalId: "moss-2026", displayDate: "2026-07-12", artistName: "動物莊園AnimalFarm",     stageName: "ROLLING STAGE", startAt: "2026-07-12T18:30:00", endAt: "2026-07-12T19:10:00", confidence: 1 },
  { id: "moss-0712-r3", festivalId: "moss-2026", displayDate: "2026-07-12", artistName: "云云",                  stageName: "ROLLING STAGE", startAt: "2026-07-12T19:30:00", endAt: "2026-07-12T20:10:00", confidence: 1 },
  { id: "moss-0712-r4", festivalId: "moss-2026", displayDate: "2026-07-12", artistName: "阿依木",                stageName: "ROLLING STAGE", startAt: "2026-07-12T20:30:00", endAt: "2026-07-12T21:10:00", confidence: 1 },
  // 07/19 洄声日 · MOSS STAGE
  { id: "moss-0719-m1", festivalId: "moss-2026", displayDate: "2026-07-19", artistName: "SoulFa灵魂沙发",         stageName: "MOSS STAGE", startAt: "2026-07-19T19:00:00", endAt: "2026-07-19T19:40:00", confidence: 1 },
  { id: "moss-0719-m2", festivalId: "moss-2026", displayDate: "2026-07-19", artistName: "陳嫻靜",                stageName: "MOSS STAGE", startAt: "2026-07-19T20:00:00", endAt: "2026-07-19T20:40:00", confidence: 1 },
  { id: "moss-0719-m3", festivalId: "moss-2026", displayDate: "2026-07-19", artistName: "LÜCY",                  stageName: "MOSS STAGE", startAt: "2026-07-19T21:00:00", endAt: "2026-07-19T22:00:00", confidence: 1 },
];
