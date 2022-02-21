import { CircularImageRadius } from '../types'

export const convertRadiusToPixels = (size: CircularImageRadius): number => {
  const mapImageSizeToPizels: Record<CircularImageRadius, number> = {
    large: 24,
    medium: 20,
    small: 12
  }

  return mapImageSizeToPizels[size] ?? size
}
