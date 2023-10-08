import React from 'react'

import { AbsoluteWrapper, Iframe, RelativeWrapper } from './ZendeskIframe.styles'
import { ZendeskIframeComponent } from './ZendeskIframe.types'

export const ZendeskIframe: ZendeskIframeComponent = ({ id, isOpen, src }) => {
  return (
    <RelativeWrapper>
      <AbsoluteWrapper isOpen={isOpen}>
        <Iframe id={id} src={src} isOpen={isOpen} />
      </AbsoluteWrapper>
    </RelativeWrapper>
  )
}
