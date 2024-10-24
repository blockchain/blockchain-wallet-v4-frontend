import React from 'react'

import { AbsoluteWrapper, Iframe, RelativeWrapper } from './IntercomIframe.styles'
import { IntercomIframeComponent } from './IntercomIframe.types'

export const IntercomIframe: IntercomIframeComponent = ({ id, isOpen, src }) => {
  return (
    <RelativeWrapper>
      <AbsoluteWrapper isOpen={isOpen}>
        <Iframe id={id} src={src} isOpen={isOpen} />
      </AbsoluteWrapper>
    </RelativeWrapper>
  )
}
