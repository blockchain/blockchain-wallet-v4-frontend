import React, { CSSProperties, useCallback, useState } from 'react'

import { ExternalSVGComponent } from './ExternalSVG.types'

const ExternalSVG: ExternalSVGComponent = ({ fallback, height, src, width, ...props }) => {
  const [hasFailure, setHasFailure] = useState<boolean>(false)

  const handleOnFailure = useCallback(() => setHasFailure(true), [setHasFailure])

  const sizeProps: Pick<CSSProperties, 'width' | 'height'> = {
    height: `${height}rem`,
    width: `${width}rem`
  }

  if (hasFailure && fallback) {
    return (
      <div style={{ ...sizeProps, display: 'inline-block' }} {...props}>
        {fallback}
      </div>
    )
  }

  return (
    <svg {...sizeProps} {...props}>
      <image href={src} onError={handleOnFailure} {...sizeProps} />
    </svg>
  )
}

export default ExternalSVG
