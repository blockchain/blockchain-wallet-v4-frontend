import { FC } from 'react'

type DeepLinkHandler = (link: string) => void

type DeepLinkListenerProps = {
  handlers: { [link: string]: DeepLinkHandler }
}

type DeepLinkListenerComponent = FC<DeepLinkListenerProps>

export type { DeepLinkHandler, DeepLinkListenerComponent, DeepLinkListenerProps }
