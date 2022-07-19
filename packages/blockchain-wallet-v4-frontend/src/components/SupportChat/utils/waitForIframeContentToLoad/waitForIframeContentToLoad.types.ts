export type WaitForIframeContentToLoadUtilityProps = {
  iframeId: string
}

export type WaitForIframeContentToLoadUtility = (
  props: WaitForIframeContentToLoadUtilityProps
) => Promise<boolean>
