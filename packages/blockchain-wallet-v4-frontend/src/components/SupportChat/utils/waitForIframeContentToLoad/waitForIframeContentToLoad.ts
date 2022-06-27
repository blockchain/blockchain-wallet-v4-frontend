import { WaitForIframeContentToLoadUtility } from './waitForIframeContentToLoad.types'

export const waitForIframeContentToLoad: WaitForIframeContentToLoadUtility = async ({
  iframeId
}) => {
  const iframe = document.getElementById(iframeId) as HTMLIFrameElement | null

  if (!iframe) return false

  const hasContent = !!iframe.contentWindow

  if (!hasContent) return false

  return true
}
