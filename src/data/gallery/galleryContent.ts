import type { StandardTabContent } from '../../types'
import { buildGallery } from './buildGallery'

const { sections, markers } = buildGallery()

export const galleryContent: StandardTabContent = {
  id: 'gallery',
  eyebrow: 'Gallery / 01',
  title: 'Photo Dump',
  summary: 'My all time favourite media, plus the places I have been lucky enough to visit.',
  sections,
  markers,
}
