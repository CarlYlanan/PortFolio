import type { StandardTabContent } from '../../types'
import { generatedLocationGalleries } from './generatedLocationGalleries'

export const homeContent: StandardTabContent = {
  id: 'home',
  eyebrow: 'Portfolio / 2026',
  title: 'A quiet corner of the internet.',
  summary: 'Hi, I’m Carly. This is a small collection of the things I’m learning, making, and paying attention to.',
  sections: [
    {
      id: 'intro',
      title: '01 // intro',
      body: 'This is a small personal collection of the systems, ideas, and study that make up my current digital life. I keep it intentionally simple and quiet, because most of the best work feels better when it leaves room for attention.',
    },
    {
      id: 'media',
      title: '02 // favourite media',
      body: 'A few character, story, and media references that keep showing up in the way I think about design, atmosphere, and stories.',
      mediaFolder: '/media/home/favourites',
      gallery: [
        { src: 'anime/kenma.jpg', alt: 'Favourite anime character', aspectRatio: '4 / 5', folder: 'favourites', capturedAt: '2026-09-10T00:00:00Z' },
        { src: 'haikyuu.jpg', alt: 'Haikyuu', aspectRatio: '4 / 3', folder: 'favourites', capturedAt: '2026-09-11T00:00:00Z' },
        { src: 'Ki ni Natteru Hito ga Otoko Janakatta.jpg', alt: 'Ki ni Natteru Hito ga Otoko Janakatta', aspectRatio: '4 / 3', folder: 'favourites', capturedAt: '2026-09-11T00:00:00Z' },
        { src: 'horimiya.jpg', alt: 'Horimiya', aspectRatio: '4 / 3', folder: 'favourites', capturedAt: '2026-09-11T00:00:00Z' },
      ],
    },
    {
      id: 'sports',
      title: '03 // favourite sports',
      body: 'The kinds of movement and balance that keep me active and grounded outside a screen.',
      mediaFolder: '/media/home/locations/sports',
      gallery: generatedLocationGalleries.sports ?? [],
    },
    {
      id: 'japan1',
      title: '05 // japan one',
      body: 'A short set of photos from the first Japan trip.',
      mediaFolder: '/media/home/locations/japan1',
      gallery: generatedLocationGalleries.japan1 ?? [],
    },
    {
      id: 'japan2',
      title: '06 // japan two',
      body: 'A short set of photos from the second Japan trip.',
      mediaFolder: '/media/home/locations/japan2',
      gallery: generatedLocationGalleries.japan2 ?? [],
    },
    {
      id: 'sydney',
      title: '07 // sydney',
      body: 'A short set of photos from the Sydney trip.',
      mediaFolder: '/media/home/locations/sydney',
      gallery: generatedLocationGalleries.sydney ?? [],
    },
    {
      id: 'focus',
      title: '08 // focus',
      body: 'I am currently learning through the process of building better interfaces, designing more thoughtful web pages, and understanding how Linux, hardware, and software fit together in a single working rhythm.',
    },
    {
      id: 'direction',
      title: '09 // direction',
      body: 'I am interested in clear design, useful systems, and the kind of digital spaces that make a person feel more grounded when they sit down to work. This collection is a record of that process as it continues to unfold.',
    },
  ],
  markers: [
    { id: 'intro', label: '01 // intro' },
    { id: 'media', label: '02 // favourite media' },
    { id: 'sports', label: '03 // favourite sports' },
    { id: 'games', label: '04 // favourite games' },
    { id: 'japan1', label: '05 // japan one' },
    { id: 'japan2', label: '06 // japan two' },
    { id: 'sydney', label: '07 // sydney' },
    { id: 'focus', label: '08 // focus' },
    { id: 'direction', label: '09 // direction' },
  ],
}
