import { STRIP_TEMPLATES } from '../filters'

const TEMPLATE_IDS_BY_SHOT_COUNT: Record<number, string[]> = {
  2: ['classic-strip', 'grid-2x2'],
  3: ['classic-strip', 'grid-2x2'],
  4: ['classic-strip', 'grid-2x2'],
  6: ['classic-strip', 'grid-2x2', 'grid-3x3'],
  8: ['classic-strip', 'grid-4x4'],
}

export function getAvailableTemplates(photoCount: number) {
  const allowedTemplateIds = TEMPLATE_IDS_BY_SHOT_COUNT[photoCount] ?? ['classic-strip']
  return STRIP_TEMPLATES.filter((item) => allowedTemplateIds.includes(item.id))
}
