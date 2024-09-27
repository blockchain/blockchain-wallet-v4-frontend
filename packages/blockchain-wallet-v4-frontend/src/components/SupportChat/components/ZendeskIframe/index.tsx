import React from 'react'

import { AbsoluteWrapper, Iframe, RelativeWrapper } from './ZendeskIframe.styles'
import { ZendeskIframeProps } from './ZendeskIframe.types'

export const ZendeskIframe = ({ id, isOpen, src }: ZendeskIframeProps) => {
  return (
    <RelativeWrapper>
      <AbsoluteWrapper isOpen={isOpen}>
        <Iframe id={id} src={src} isOpen={isOpen} />
      </AbsoluteWrapper>
    </RelativeWrapper>
  )
}
