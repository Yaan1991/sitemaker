export const projectTranslationsEn: Record<string, {
  title?: string;
  description: string;
  fullDescription: string;
  role: string[];
  venue?: string;
  details?: {
    duration?: string;
    genre?: string;
    director?: string;
    producer?: string;
    cast?: string[];
    technical?: string[];
    theatre?: string;
    premiere?: string;
  };
  links?: Array<{ label: string; url: string; external?: boolean; }>;
  tracks?: Array<{ id: string; title: string; url: string; }>;
}> = {
  "idiot-saratov-drama": {
    title: "The Idiot",
    description: "A unique blend of theatre and cinema: noir-jazz + field recordings + AI technologies.",
    fullDescription: "A radically reimagined production based on Dostoevsky, with the action set in Saratov, 1999. The performance combines live theatrical action with film shooting — two camera operators capture the events, while the audience sees both the play and its screen version in the spirit of the 90s simultaneously. A multi-layered sound score was created: 10 original compositions in noir-jazz and post-rock genres, authentic field recordings from Saratov (trams, streets, doors), and the use of AI to clone an actor's voice for German speech. The sound is inspired by the aesthetics of Twin Peaks and The X-Files.",
    role: ["Composer", "Sound Designer", "Sound Engineer"],
    venue: "Saratov Drama Theatre named after Slonov",
    links: [
      {
        label: "Theatre playbill",
        url: "https://www.saratovdrama.com/repertoire/idiot/",
        external: true,
      },
      {
        label: "Cool Connections — review",
        url: "https://www.coolconnections.ru/ru/blog/posts/Idiot-Do-samogo-konca-sveta?ysclid=mewxumf8ff413247497",
        external: true,
      },
      {
        label: "Komsomolskaya Pravda — review",
        url: "https://www.saratov.kp.ru/daily/27601.5/4952575/?ysclid=mewxvh7x9w791506972",
        external: true,
      },
    ],
    details: {
      director: "Ivan Komarov",
      genre: "Drama",
      producer: "Set Designer: Olga Kuznetsova, Lighting: Maxim Biryukov",
      technical: ["Logic Pro", "QLab 4 + M32", "OSC commands", "Omnisphere", "Spitfire Labs", "Kontakt", "Splice", "Soundly", "Udio AI", "Voice neural networks", "Saratov field recordings"],
    },
  },
  "mayakovsky-moscow-estrada": {
    title: "Mayakovsky. Myself",
    description: "6 compositions, three-level sound concept.",
    fullDescription: "A performance-investigation into the poet's inner mechanism of self-destruction through the tragic triangle of Mayakovsky - Lilya and Osip Brik. Based on the autobiography 'Myself', poems, and long poems. A three-layered sound dramaturgy was created: reality, poetic layer, and abstraction. Sound moves between zones, creating a cinematic effect of perspective shift. 6 original compositions were written + rearrangements of compositions suggested by the director, field recordings and AI were used for special effects.",
    role: ["Composer", "Sound Designer"],
    venue: "Moscow Estrada Theatre",
    links: [
      {
        label: "MSK1 — review",
        url: "https://msk1.ru/text/culture/2025/02/08/75082631/",
        external: true,
      },
    ],
    details: {
      director: "Semyon Shomin",
      cast: ["Nikita Kologrivyy"],
      genre: "One-man show",
      technical: ["Original compositions", "Arrangements", "QLab"],
    },
  },
  "petrovy-saratov-drama": {
    title: "The Petrovs In and Around the Flu",
    description: "Theatre as a comic book, where space simultaneously tells the story of the Petrovs and reflects on theatre as a space of delirium. The production balances between everyday realism and absurdity.",
    fullDescription: "A production based on the novel by Alexei Salnikov — one of the most 'unstageable' texts of contemporary literature. The performance is conceived as a comic book and theatre about itself. 12 original compositions of various genres were created — from neoclassical piano pieces to grotesque effects.",
    role: ["Composer", "Sound Designer", "Sound Engineer", "Prompt Engineer"],
    venue: "Saratov Drama Theatre",
    tracks: [
      {
        id: "petrovy_lonely_theme",
        title: "Theme of Loneliness",
        url: "/audio/petrovy_lonely_theme.mp3"
      },
      {
        id: "petrovy_mad_theme",
        title: "Guests Arrived",
        url: "/audio/petrovy_mad_theme.mp3"
      },
      {
        id: "petrovy_theme_of_sick",
        title: "Petrov Jr.'s Illness",
        url: "/audio/petrovy_theme_of_sick.mp3"
      }
    ],
    links: [
      {
        label: "Theatre playbill",
        url: "https://www.saratovdrama.com/repertoire/petrovy-v-grippe-i-vokrug-nego/?ysclid=mfcsmr4sx380848479",
        external: true,
      },
      {
        label: "Cool Connections — press",
        url: "https://www.coolconnections.ru/en/blog/posts/Po-vse-storony-Petrovyh-v-grippe?ysclid=mfcspzyytu896058503",
        external: true,
      },
      {
        label: "Press — SarInform",
        url: "https://sarinform.ru/news/culture/petrovy-v-grippe-i-vokrug-nego-spektakl-o-mnozhestvennyh-mirah-v-boleznennom-bredu?ysclid=mfd3rl4hjv56090761",
        external: true,
      },
    ],
    details: {
      director: "Ivan Komarov",
      genre: "Comic-drama",
      theatre: "Saratov Drama Theatre",
      producer: "Set Designer: Olga Kuznetsova, Lighting Designer: Maxim Biryukov, Director, adaptation author: Ivan Komarov",
      technical: ["12 full compositions of various genres", "Development of leitmotif system for characters and scenes", "Creating atmospheric ambients and drone textures", "Working with AI for creating an opera cover", "Programming and automation in QLab", "Sound engineering and FOH engineering"],
    },
  },
  "homo-homini-short": {
    title: "Homo Homini",
    description: "A short drama with elements of black comedy. 13 original compositions + full post-production in 5.1.",
    fullDescription: "The story of timid Savva, fascinated by Japanese culture. After the death of his dog and the betrayal of his girlfriend who robbed him, the hero transforms into an Asian action movie character — putting on a kimono, a demon-oni mask, and setting out for revenge with a hammer. A film about a person turning his life into a cinematic quote, where the hero finds strength for revenge in a foreign culture, balancing between authenticity and convention. The sound design balances between realism and stylization of Asian action films.",
    role: ["Composer", "Sound Designer", "Post-Production Sound Engineer", "Songwriter", "Prompt Engineer"],
    links: [
      {
        label: "Kinopoisk",
        url: "https://www.kinopoisk.ru/film/9017614/",
        external: true,
      },
    ],
    details: {
      duration: "Short film",
      genre: "Drama with elements of black comedy",
      director: "Ivan Komarov",
      producer: "Eleonora Klementyeva, Ivan Komarov, Elena Erbakova",
      cast: ["Semyon Shteinberg", "Elena Erbakova", "Anton Kuznetsov", "Alyona Babenko", "Alexander Panov", "Batraz Zaseyev", "Efim Belosorochka"],
      technical: ["13 original compositions", "Japanese song from the 70s with AI", "Field recordings", "Stylized sound design", "Final mix in stereo and 5.1"],
      premiere: "Film festival 'Koroche', Kaliningrad"
    },
  },
  "ma-short-film": {
    title: "Ma",
    description: "A short drama about a mother and daughter experiencing loss. A film almost without dialogue, where landscape and everyday life speak instead of words.",
    fullDescription: "A short drama about a mother and daughter experiencing loss. A film almost without dialogue, where landscape and everyday life speak instead of words. The action takes place in North Ossetia, in the village of Dargavs. The film is built around the relationship of a mother and daughter, left alone after the death of their son and brother. In Caucasian culture, it is not customary to speak about feelings aloud, so the heroines experience pain through silence, through rituals and everyday life. Sound material restoration was performed, some scenes without pre-recorded sound were re-dubbed. A living, authentic sound layer was created without overloading. In the absence of music, it is the sound that guides the viewer, helping to read the characters' desires and feel the space of the North Caucasus.",
    role: ["Post-Production Sound Engineer"],
    links: [
      {
        label: "The Blueprint — review",
        url: "https://theblueprint.ru/culture/bluescreen/bluescreen-ma",
        external: true,
      },
      {
        label: "Watch the film",
        url: "https://www.youtube.com/watch?v=nX_CluAW0WI",
        external: true,
      },
    ],
    details: {
      duration: "Short film",
      genre: "Drama",
      director: "Valentina Besolova",
      cast: ["Zita Latsoeva (Zarema)", "Milana Konieva (Sabina)", "Alan Albegov (Alik)"],
      technical: ["Source material restoration in iZotope RX", "Full foley creation (footsteps, clothing, objects)", "Creating atmospheric environmental layers", "Spatial processing matched to camera angles", "Final mixing and mastering in stereo"],
    },
  },
  "life-in-art-short": {
    title: "Life in Art",
    description: "Full re-dubbing of sound effects and ambients.",
    fullDescription: "A narrative short film about the life of an artist. Full re-dubbing of all sound effects and creation of atmospheric ambients was performed. The sound design emphasizes the contrast between the inner world of the creator and the surrounding reality.",
    role: ["Sound Designer"],
    details: {
      genre: "Drama",
      technical: ["Sound effects re-dubbing", "Atmospheric ambients", "Foley"],
    },
  },
  "son-o-hlebe-zotov": {
    title: "Dream of Bread",
    description: "Original music, spatial sound.",
    fullDescription: "VTB presents the audio performance by the Zotov Centre 'Dream of Bread' — a story in the haunted house genre about Bread Factory No. 5. The main character is a security guard who spends day and night next to museum exhibits. One day he has a dream in which he hears mysterious voices. From them he learns the secret of 'eternal bread', and also solves a mystery that helps him better understand the history of his country and family.\n\nDuring the script preparation, extensive work with archives was conducted: texts from books and public lectures by Vasily Petrovich Zotov, workers' newspapers from the 1930s factory, memoirs and diaries of factory workers from the 'Prozhito' service. The play was inspired by artistic works from folklore to operas.\n\nThe premiere took place on May 18, 2024 as part of the 'Night at the Museum' event and was accompanied by a video installation on the first floor of the centre.",
    role: ["Composer", "Sound Designer", "Sound Engineer"],
    venue: "Zotov Centre",
    details: {
      director: "Timur Sharafutdinov",
      genre: "Audio performance in the haunted house genre",
      premiere: "May 18, 2024 ('Night at the Museum' event)",
      producer: "Script: Valery Pecheykin • Production: content bureau 'Shtorm'",
      cast: ["Konstantin Khabensky", "Rita Kron", "Askar Nigamedzjanov"],
      technical: [
        "Writing 12 original compositions",
        "Sound editing",
        "Working with spatial audio",
        "Final post-production"
      ],
    },
    links: [
      {
        label: "Project page on centrezotov.ru",
        url: "https://centrezotov.ru/events/audiospektakl-son-o-hlebe-vtb/?ysclid=mhrk30w24q990177300",
        external: true,
      },
    ],
  },
  "pogruzhenie-promenad-telegram": {
    title: "Immersion. Promenade",
    description: "Site-specific audio performance",
    fullDescription: "A promenade performance takes place on the streets of Nizhny Novgorod. Nizhny Novgorod is not just an array of buildings and streets, but a place where all our memories are stored. Hear the personal stories of ordinary people during a promenade through the city — and feel what they feel.\n\n'IMMERSION PROMENADE' is a walk through the historic city centre, during which viewers can hear the stories of different people and see inconspicuous places that are very significant to them.\n\nThe project was created in the format of an immersive audio walk, where sound becomes a guide into the world of personal stories of the city's residents. Each location comes alive through the voices of characters, music, and the soundscape of Nizhny Novgorod.",
    role: ["Composer", "Sound Designer", "Sound Engineer"],
    venue: "Centre for Theatrical Craft (Nizhny Novgorod)",
    details: {
      director: "Ivan Komarov",
      genre: "Site-specific audio performance",
      premiere: "2021",
      producer: "Playwright: Natalya Zaitseva • Producers: Evgeny Pykhtin, Tatyana Tenkova",
      technical: [
        "Creating original music",
        "Working with field recordings",
        "Voice cleaning of characters",
        "Working with noise",
        "Sound design"
      ],
    },
    links: [
      {
        label: "Project page on ctm-nn.ru",
        url: "https://ctm-nn.ru/pogruzhenie-promenad/",
        external: true,
      },
      {
        label: "Rambler News — article about the project",
        url: "https://news.rambler.ru/moscow_city/47024657-v-nizhnem-novgorode-startovali-audiospektakli-progulki-pogruzhenie-promenad/",
        external: true,
      },
    ],
  },
};
