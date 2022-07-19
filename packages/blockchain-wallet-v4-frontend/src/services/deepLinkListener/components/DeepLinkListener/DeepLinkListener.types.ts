import { FC } from 'react'

import { DeepLinkClickState } from 'services/deepLinkListener/contexts'

type DeepLinkHandler = (link: string) => DeepLinkClickState

type DeepLinkListenerProps = {
  onClickDeepLink: DeepLinkHandler
}

type DeepLinkListenerComponent = FC<DeepLinkListenerProps>

export type { DeepLinkHandler, DeepLinkListenerComponent, DeepLinkListenerProps }
