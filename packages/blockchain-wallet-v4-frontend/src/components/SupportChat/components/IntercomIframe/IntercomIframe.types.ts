import { FC } from 'react'

export type IntercomIframeProps = {
  id: string
  isOpen: boolean
  src: string
}

export type IntercomIframeComponent = FC<IntercomIframeProps>
