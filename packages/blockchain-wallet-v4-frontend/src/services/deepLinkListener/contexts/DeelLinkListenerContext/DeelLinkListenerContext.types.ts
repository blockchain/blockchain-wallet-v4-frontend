type DeepLinkClickResult = {
  handled: boolean
}

type DeepLinkClickHandler = (link: string) => DeepLinkClickResult

type DeepLinkListenerContext = {
  onClickDeepLink: DeepLinkClickHandler
}

export type { DeepLinkListenerContext }
