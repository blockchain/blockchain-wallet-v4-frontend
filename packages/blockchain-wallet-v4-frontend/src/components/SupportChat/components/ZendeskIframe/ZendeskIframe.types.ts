import { FC } from 'react'

export type ZendeskIframeProps = {
  id: string
  isOpen: boolean
  src: string
}

export type ZendeskIframeComponent = FC<ZendeskIframeProps>
