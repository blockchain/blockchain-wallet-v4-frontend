import React, { CSSProperties, useCallback, useMemo, useState } from 'react'

import { ExternalSVGComponent } from './ExternalSVG.types'
import { getHostnameFromHref } from './utils'

const ExternalSVG: ExternalSVGComponent = ({ fallback, height, href, width, ...props }) => {
  const [hasFailure, setHasFailure] = useState<boolean>(false)

  const handleOnFailure = useCallback(() => setHasFailure(true), [setHasFailure])
  const hostname = useMemo(() => getHostnameFromHref(href), [href])

  const sizeProps: Pick<CSSProperties, 'width' | 'height'> = useMemo(
    () => ({
      height: `${height}rem`,
      width: `${width}rem`
    }),
    [width, height]
  )

  const style: CSSProperties = useMemo(
    () => ({ ...sizeProps, display: 'inline-block' }),
    [sizeProps]
  )

  if (hostname !== null && hostname !== 'blockchain.com') {
    throw new Error(`SVG src must be relative path or be hosted by "blockchain.com"`)
  }

  if (hasFailure && fallback) {
    return (
      <div style={style} {...props}>
        {fallback}
      </div>
    )
  }

  return (
    <svg {...sizeProps} {...props}>
      <image href={href} onError={handleOnFailure} {...sizeProps} />
    </svg>
  )
}

export default ExternalSVG
