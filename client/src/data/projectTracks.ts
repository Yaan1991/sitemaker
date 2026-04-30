/**
 * Плейлисты для страниц проектов с собственной музыкой.
 * Каждая функция возвращает массив треков на нужном языке (RU/EN).
 */

export interface ProjectTrack {
  id: string;
  title: string;
  url: string;
}

export function getIdiotTracks(isEn: boolean): ProjectTrack[] {
  return [
    {
      id: 'nastasya',
      title: isEn ? "Nastasya Filippovna's Theme" : 'Тема Настасьи Филипповны',
      url: '/audio/nastasya.mp3'
    },
    {
      id: 'myshkin',
      title: isEn ? "Myshkin's Theme" : 'Тема Мышкина',
      url: '/audio/myshkin.mp3'
    },
    {
      id: 'nastasya_nightmare',
      title: isEn ? "Nastasya Filippovna's Nightmare" : 'Кошмар Настасьи Филипповны',
      url: '/audio/nastasya_nightmare.mp3'
    },
    {
      id: 'city',
      title: isEn ? 'City Theme' : 'Тема города',
      url: '/audio/city.mp3'
    }
  ];
}

export function getMayakTracks(isEn: boolean): ProjectTrack[] {
  return [
    {
      id: 'letters',
      title: isEn ? 'Letters' : 'Письма',
      url: '/audio/mayak_letters.mp3'
    },
    {
      id: 'lilya_theme',
      title: isEn ? "Mayakovsky & Lilya's Theme" : 'Тема Маяковского и Лили',
      url: '/audio/mayak_lilya_theme.mp3'
    },
    {
      id: 'gori_gori',
      title: isEn ? 'Burn, Burn' : 'Гори-гори',
      url: '/audio/mayak_gori_gori.mp3'
    }
  ];
}

export function getPetrovyTracks(isEn: boolean): ProjectTrack[] {
  return [
    {
      id: 'petrovy_lonely_theme',
      title: isEn ? 'Loneliness Theme' : 'Тема одиночества',
      url: '/audio/Petrovy_lonely_theme.mp3'
    },
    {
      id: 'petrovy_mad_theme',
      title: isEn ? 'Guests Arrived' : 'Приехали в гости',
      url: '/audio/Petrovy_mad_theme.mp3'
    },
    {
      id: 'petrovy_theme_of_sick',
      title: isEn ? "Young Petrov's Illness" : 'Болезнь Петрова младшего',
      url: '/audio/Petrovy_theme_of_sick.mp3'
    }
  ];
}
