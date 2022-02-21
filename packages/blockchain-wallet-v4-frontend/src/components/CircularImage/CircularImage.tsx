import React, { useMemo } from 'react'

import { CircularImageComponent } from './types'
import { convertRadiusToPixels } from './utils/convertRadiusToPixels'

/**
 - Use an CircularImage to display any image is a circular shape.
 - This radius has 4 options: small, medium, large and number,
* */
export const CircularImage: CircularImageComponent = ({ alt = '', radius = 'medium', src }) => {
  const radiusInPixels = useMemo(() => convertRadiusToPixels(radius), [radius])

  const height = radiusInPixels * 2
  const width = radiusInPixels * 2

  return <img alt={alt} src={src} style={{ borderRadius: radiusInPixels, height, width }} />
}
