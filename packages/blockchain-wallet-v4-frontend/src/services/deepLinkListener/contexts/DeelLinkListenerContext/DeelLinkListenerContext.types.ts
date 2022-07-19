export enum DeepLinkClickState {
  handled = 'handled',
  notHandled = 'notHandled'
}

type DeepLinkClickHandler = (link: string) => DeepLinkClickState

type DeepLinkListenerContext = {
  onClickDeepLink: DeepLinkClickHandler
}

export type { DeepLinkListenerContext }
