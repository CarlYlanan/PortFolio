import type { StandardTabContent } from '../../types'
import { generatedLocationGalleries } from './generatedLocationGalleries'

const favourites = generatedLocationGalleries.favourites ?? []
const games = generatedLocationGalleries.games ?? []
const sports = generatedLocationGalleries.sports ?? []
const japan1 = generatedLocationGalleries.japan1 ?? []
const japan2 = generatedLocationGalleries.japan2 ?? []
const sydney = generatedLocationGalleries.sydney ?? []

// Kenma stays pinned to the front of the media shelf; everything else keeps file order.
const kenma = favourites.find((item) => item.src === 'kenma.jpg')
const media = kenma ? [kenma, ...favourites.filter((item) => item.src !== 'kenma.jpg')] : favourites

export const galleryContent: StandardTabContent = {
  id: 'gallery',
  eyebrow: 'Gallery / 01',
  title: 'Scenes worth keeping.',
  summary: 'My all time favourite media, plus the places I have been lucky enough to visit.',
  sections: [
    {
      id: 'favourites',
      title: 'Favourites',
      body: '',
      galleries: [
        {
          id: 'media',
          title: 'Media',
          mediaFolder: '/media/gallery/favourites',
          items: media,
          sortBy: 'custom',
        },
        {
          id: 'sports',
          title: 'Sports',
          mediaFolder: '/media/gallery/locations/sports',
          items: sports,
          sortBy: 'name',
        },
      ],
    },
    {
      id: 'travels',
      title: 'Travels',
      body: '',
      galleries: [
        {
          id: 'japan-2024',
          title: 'Japan - Sep 2024',
          mediaFolder: '/media/gallery/locations/japan1',
          items: japan1,
          sortBy: 'name',
        },
        {
          id: 'japan-2025',
          title: 'Japan - Nov 2025',
          mediaFolder: '/media/gallery/locations/japan2',
          items: japan2,
          sortBy: 'name',
        },
        {
          id: 'sydney-2025',
          title: 'Sydney - Nov 2025',
          mediaFolder: '/media/gallery/locations/sydney',
          items: sydney,
          sortBy: 'name',
        },
      ],
    },
  ],
  markers: [
    { id: 'favourites', label: '01 // favourites' },
    { id: 'travels', label: '02 // travels' },
  ],
}
